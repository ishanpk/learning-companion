/* ============================================
   StudyPal — Learning Companion App Logic
   ============================================ */

// ---- State Management ----
const state = {
    flashcards: JSON.parse(localStorage.getItem('sp_flashcards') || '[]'),
    notes: JSON.parse(localStorage.getItem('sp_notes') || '[]'),
    stats: JSON.parse(localStorage.getItem('sp_stats') || '{"cardsStudied":0,"quizzesTaken":0,"studyMinutes":0,"quizScores":[],"streak":0,"lastStudyDate":null,"mastered":0,"activities":[]}'),
    currentCard: 0,
    timer: { interval: null, remaining: 25 * 60, total: 25 * 60, running: false, mode: 'focus', sessions: 0 },
    quiz: { questions: [], current: 0, score: 0, active: false }
};

function save() {
    localStorage.setItem('sp_flashcards', JSON.stringify(state.flashcards));
    localStorage.setItem('sp_notes', JSON.stringify(state.notes));
    localStorage.setItem('sp_stats', JSON.stringify(state.stats));
}

// ---- Toast Notifications ----
function showToast(msg, type = 'info') {
    const c = document.getElementById('toast-container');
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.textContent = msg;
    c.appendChild(t);
    setTimeout(() => { t.classList.add('fadeout'); setTimeout(() => t.remove(), 300); }, 2500);
}

// ---- Navigation ----
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        document.getElementById(`${btn.dataset.section}-section`).classList.add('active');
    });
});

document.getElementById('get-started-btn').addEventListener('click', () => {
    document.getElementById('nav-flashcards').click();
    document.querySelector('.main-content').scrollIntoView({ behavior: 'smooth' });
});

// ---- Flashcards ----
function updateCardDisplay() {
    const filter = document.getElementById('flashcard-filter').value;
    const cards = filter === 'all' ? state.flashcards : state.flashcards.filter(c => c.category === filter);
    const counter = document.getElementById('card-counter');
    const frontText = document.getElementById('flashcard-front-text');
    const backText = document.getElementById('flashcard-back-text');
    const fc = document.getElementById('active-flashcard');
    fc.classList.remove('flipped');

    if (cards.length === 0) {
        counter.textContent = '0 / 0';
        frontText.textContent = 'Add some flashcards to get started!';
        backText.textContent = 'Click "Create New Flashcard" above';
        return;
    }
    if (state.currentCard >= cards.length) state.currentCard = 0;
    if (state.currentCard < 0) state.currentCard = cards.length - 1;
    counter.textContent = `${state.currentCard + 1} / ${cards.length}`;
    frontText.textContent = cards[state.currentCard].front;
    backText.textContent = cards[state.currentCard].back;
}

function updateCategoryFilters() {
    const cats = [...new Set(state.flashcards.map(c => c.category).filter(Boolean))];
    const selects = [document.getElementById('flashcard-filter'), document.getElementById('quiz-category-select')];
    selects.forEach(sel => {
        const val = sel.value;
        sel.innerHTML = '<option value="all">All Categories</option>';
        cats.forEach(cat => {
            const opt = document.createElement('option');
            opt.value = cat; opt.textContent = cat;
            sel.appendChild(opt);
        });
        sel.value = val;
    });
}

document.getElementById('add-flashcard-btn').addEventListener('click', () => {
    const front = document.getElementById('flashcard-front').value.trim();
    const back = document.getElementById('flashcard-back').value.trim();
    const category = document.getElementById('flashcard-category').value.trim() || 'General';
    if (!front || !back) return showToast('Please fill in both sides of the card', 'error');
    state.flashcards.push({ id: Date.now(), front, back, category, rating: null, created: new Date().toISOString() });
    document.getElementById('flashcard-front').value = '';
    document.getElementById('flashcard-back').value = '';
    save(); updateCategoryFilters(); updateCardDisplay(); updateStats();
    showToast('Flashcard added!', 'success');
});

document.getElementById('active-flashcard').addEventListener('click', () => {
    document.getElementById('active-flashcard').classList.toggle('flipped');
});
document.getElementById('flip-card-btn').addEventListener('click', () => {
    document.getElementById('active-flashcard').classList.toggle('flipped');
});
document.getElementById('prev-card-btn').addEventListener('click', () => { state.currentCard--; updateCardDisplay(); });
document.getElementById('next-card-btn').addEventListener('click', () => { state.currentCard++; updateCardDisplay(); });

document.querySelectorAll('.rating-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = document.getElementById('flashcard-filter').value;
        const cards = filter === 'all' ? state.flashcards : state.flashcards.filter(c => c.category === filter);
        if (cards.length === 0) return;
        const card = cards[state.currentCard];
        card.rating = btn.dataset.rating;
        state.stats.cardsStudied++;
        if (btn.dataset.rating === 'easy') state.stats.mastered++;
        addActivity(`Studied flashcard: "${card.front.substring(0, 30)}..."`);
        save(); updateStats();
        state.currentCard++; updateCardDisplay();
        showToast('Card rated!', 'success');
    });
});

document.getElementById('flashcard-filter').addEventListener('change', () => { state.currentCard = 0; updateCardDisplay(); });

// ---- Quiz ----
function generateQuiz() {
    const cat = document.getElementById('quiz-category-select').value;
    const count = parseInt(document.getElementById('quiz-count').value);
    let pool = cat === 'all' ? [...state.flashcards] : state.flashcards.filter(c => c.category === cat);
    if (pool.length < 2) { showToast('Need at least 2 flashcards to start a quiz', 'error'); return; }
    pool = pool.sort(() => Math.random() - 0.5).slice(0, count);
    state.quiz.questions = pool.map(card => {
        const wrongPool = state.flashcards.filter(c => c.id !== card.id);
        const wrongs = wrongPool.sort(() => Math.random() - 0.5).slice(0, 3).map(c => c.back);
        while (wrongs.length < 3) wrongs.push('—');
        const options = [card.back, ...wrongs].sort(() => Math.random() - 0.5);
        return { question: card.front, correctAnswer: card.back, options };
    });
    state.quiz.current = 0; state.quiz.score = 0; state.quiz.active = true;
    showQuizQuestion();
}

function showQuizQuestion() {
    const q = state.quiz.questions[state.quiz.current];
    document.getElementById('quiz-setup').style.display = 'none';
    document.getElementById('quiz-active').style.display = 'block';
    document.getElementById('quiz-results').style.display = 'none';
    document.getElementById('quiz-question-num').textContent = `Question ${state.quiz.current + 1} of ${state.quiz.questions.length}`;
    document.getElementById('quiz-score-display').textContent = `Score: ${state.quiz.score}`;
    document.getElementById('quiz-progress-fill').style.width = `${((state.quiz.current) / state.quiz.questions.length) * 100}%`;
    document.getElementById('quiz-question-text').textContent = q.question;
    document.getElementById('quiz-next-btn').style.display = 'none';
    const optC = document.getElementById('quiz-options');
    optC.innerHTML = '';
    q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option'; btn.textContent = opt;
        btn.addEventListener('click', () => selectQuizAnswer(btn, opt, q.correctAnswer));
        optC.appendChild(btn);
    });
}

function selectQuizAnswer(btn, selected, correct) {
    document.querySelectorAll('.quiz-option').forEach(o => o.classList.add('selected'));
    if (selected === correct) { btn.classList.add('correct'); state.quiz.score++; }
    else {
        btn.classList.add('incorrect');
        document.querySelectorAll('.quiz-option').forEach(o => { if (o.textContent === correct) o.classList.add('correct'); });
    }
    document.getElementById('quiz-score-display').textContent = `Score: ${state.quiz.score}`;
    document.getElementById('quiz-next-btn').style.display = 'block';
}

document.getElementById('quiz-next-btn').addEventListener('click', () => {
    state.quiz.current++;
    if (state.quiz.current >= state.quiz.questions.length) showQuizResults();
    else showQuizQuestion();
});

function showQuizResults() {
    document.getElementById('quiz-active').style.display = 'none';
    document.getElementById('quiz-results').style.display = 'block';
    const pct = Math.round((state.quiz.score / state.quiz.questions.length) * 100);
    document.getElementById('results-score-big').textContent = state.quiz.score;
    document.getElementById('results-score-total').textContent = `/ ${state.quiz.questions.length}`;
    document.getElementById('results-percentage').textContent = `${pct}%`;
    let icon = '🎉', msg = 'Outstanding! You really know your stuff!';
    if (pct < 50) { icon = '📚'; msg = 'Keep studying! Review your flashcards and try again.'; }
    else if (pct < 80) { icon = '💪'; msg = 'Good effort! A little more review and you\'ll ace it.'; }
    document.getElementById('results-icon').textContent = icon;
    document.getElementById('results-message').textContent = msg;
    state.stats.quizzesTaken++;
    state.stats.quizScores.push(pct);
    addActivity(`Completed quiz: ${state.quiz.score}/${state.quiz.questions.length} (${pct}%)`);
    save(); updateStats();
}

document.getElementById('start-quiz-btn').addEventListener('click', generateQuiz);
document.getElementById('retake-quiz-btn').addEventListener('click', () => {
    document.getElementById('quiz-results').style.display = 'none';
    document.getElementById('quiz-setup').style.display = 'block';
});

// ---- Timer ----
const CIRCUMFERENCE = 2 * Math.PI * 90;

function updateTimerDisplay() {
    const mins = Math.floor(state.timer.remaining / 60);
    const secs = state.timer.remaining % 60;
    document.getElementById('timer-time').textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    const progress = 1 - (state.timer.remaining / state.timer.total);
    document.getElementById('timer-ring-progress').style.strokeDasharray = CIRCUMFERENCE;
    document.getElementById('timer-ring-progress').style.strokeDashoffset = CIRCUMFERENCE * (1 - progress);
}

document.querySelectorAll('.timer-mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        if (state.timer.running) return;
        document.querySelectorAll('.timer-mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const mins = parseInt(btn.dataset.minutes);
        state.timer.total = mins * 60;
        state.timer.remaining = mins * 60;
        state.timer.mode = btn.textContent.includes('Focus') ? 'focus' : 'break';
        document.getElementById('timer-label').textContent = btn.textContent.split('(')[0].trim();
        updateTimerDisplay();
    });
});

document.getElementById('timer-start-btn').addEventListener('click', () => {
    if (state.timer.running) {
        clearInterval(state.timer.interval);
        state.timer.running = false;
        document.getElementById('timer-start-btn').textContent = '▶ Start';
    } else {
        state.timer.running = true;
        document.getElementById('timer-start-btn').textContent = '⏸ Pause';
        state.timer.interval = setInterval(() => {
            state.timer.remaining--;
            updateTimerDisplay();
            if (state.timer.remaining <= 0) {
                clearInterval(state.timer.interval);
                state.timer.running = false;
                document.getElementById('timer-start-btn').textContent = '▶ Start';
                if (state.timer.mode === 'focus') {
                    state.timer.sessions++;
                    document.getElementById('pomodoro-count').textContent = state.timer.sessions;
                    state.stats.studyMinutes += Math.round(state.timer.total / 60);
                    addActivity(`Completed a ${Math.round(state.timer.total / 60)} min focus session`);
                    updateStreak();
                    save(); updateStats();
                }
                showToast(state.timer.mode === 'focus' ? '🍅 Focus session complete! Take a break.' : '☕ Break over! Time to focus.', 'success');
            }
        }, 1000);
    }
});

document.getElementById('timer-reset-btn').addEventListener('click', () => {
    clearInterval(state.timer.interval);
    state.timer.running = false;
    state.timer.remaining = state.timer.total;
    document.getElementById('timer-start-btn').textContent = '▶ Start';
    updateTimerDisplay();
});

// ---- Notes ----
function renderNotes(filter = '') {
    const container = document.getElementById('notes-items');
    let notes = [...state.notes].sort((a, b) => new Date(b.updated) - new Date(a.updated));
    if (filter) notes = notes.filter(n => n.title.toLowerCase().includes(filter) || n.content.toLowerCase().includes(filter) || (n.tags || []).some(t => t.toLowerCase().includes(filter)));
    if (notes.length === 0) {
        container.innerHTML = '<div class="empty-state"><span class="empty-icon">📝</span><p>No notes found.</p></div>';
        return;
    }
    container.innerHTML = notes.map(n => `
        <div class="note-item" data-id="${n.id}">
            <div class="note-item-title">${escapeHtml(n.title)}</div>
            <div class="note-item-preview">${escapeHtml(n.content.substring(0, 80))}</div>
            <div class="note-item-meta">
                <span class="note-item-date">${new Date(n.updated).toLocaleDateString()}</span>
                <div class="note-item-tags">${(n.tags || []).map(t => `<span class="note-tag">${escapeHtml(t)}</span>`).join('')}</div>
                <button class="note-delete-btn" data-id="${n.id}" title="Delete note">🗑️</button>
            </div>
        </div>
    `).join('');

    container.querySelectorAll('.note-item').forEach(item => {
        item.addEventListener('click', (e) => {
            if (e.target.classList.contains('note-delete-btn')) return;
            const note = state.notes.find(n => n.id == item.dataset.id);
            if (note) {
                document.getElementById('note-title').value = note.title;
                document.getElementById('note-content').value = note.content;
                document.getElementById('note-tags').value = (note.tags || []).join(', ');
                document.getElementById('save-note-btn').dataset.editId = note.id;
                document.getElementById('save-note-btn').innerHTML = '✏️ Update Note';
            }
        });
    });
    container.querySelectorAll('.note-delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            state.notes = state.notes.filter(n => n.id != btn.dataset.id);
            save(); renderNotes();
            showToast('Note deleted', 'info');
        });
    });
}

document.getElementById('save-note-btn').addEventListener('click', () => {
    const title = document.getElementById('note-title').value.trim();
    const content = document.getElementById('note-content').value.trim();
    const tags = document.getElementById('note-tags').value.split(',').map(t => t.trim()).filter(Boolean);
    if (!title || !content) return showToast('Please add a title and content', 'error');
    const editId = document.getElementById('save-note-btn').dataset.editId;
    if (editId) {
        const note = state.notes.find(n => n.id == editId);
        if (note) { note.title = title; note.content = content; note.tags = tags; note.updated = new Date().toISOString(); }
        delete document.getElementById('save-note-btn').dataset.editId;
        document.getElementById('save-note-btn').innerHTML = '💾 Save Note';
        showToast('Note updated!', 'success');
    } else {
        state.notes.push({ id: Date.now(), title, content, tags, created: new Date().toISOString(), updated: new Date().toISOString() });
        addActivity(`Created note: "${title}"`);
        showToast('Note saved!', 'success');
    }
    document.getElementById('note-title').value = '';
    document.getElementById('note-content').value = '';
    document.getElementById('note-tags').value = '';
    save(); renderNotes(); updateStats();
});

document.getElementById('notes-search').addEventListener('input', (e) => renderNotes(e.target.value.toLowerCase()));

// ---- Progress & Stats ----
function addActivity(text) {
    state.stats.activities.unshift({ text, time: new Date().toISOString() });
    if (state.stats.activities.length > 50) state.stats.activities.pop();
}

function updateStreak() {
    const today = new Date().toDateString();
    if (state.stats.lastStudyDate === today) return;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    state.stats.streak = (state.stats.lastStudyDate === yesterday) ? state.stats.streak + 1 : 1;
    state.stats.lastStudyDate = today;
}

function updateStats() {
    document.getElementById('total-cards').textContent = state.stats.cardsStudied;
    document.getElementById('total-quizzes').textContent = state.stats.quizzesTaken;
    document.getElementById('total-minutes').textContent = state.stats.studyMinutes;
    document.getElementById('streak-count').textContent = state.stats.streak;
    document.getElementById('mastered-count').textContent = state.stats.mastered;
    const avgScore = state.stats.quizScores.length ? Math.round(state.stats.quizScores.reduce((a, b) => a + b, 0) / state.stats.quizScores.length) : 0;
    document.getElementById('accuracy-percent').textContent = `${avgScore}%`;
    const hrs = Math.floor(state.stats.studyMinutes / 60);
    const mins = state.stats.studyMinutes % 60;
    document.getElementById('total-study-time').textContent = `${hrs}h ${mins}m`;

    const actLog = document.getElementById('activity-log');
    if (state.stats.activities.length === 0) {
        actLog.innerHTML = '<div class="empty-state"><span class="empty-icon">📅</span><p>No activity yet. Start learning!</p></div>';
    } else {
        actLog.innerHTML = state.stats.activities.slice(0, 20).map(a => `
            <div class="activity-item">
                <span class="activity-icon">📌</span>
                <span class="activity-text">${escapeHtml(a.text)}</span>
                <span class="activity-time">${timeAgo(a.time)}</span>
            </div>
        `).join('');
    }
}

// ---- Data Management ----
document.getElementById('export-data-btn').addEventListener('click', () => {
    const data = { flashcards: state.flashcards, notes: state.notes, stats: state.stats };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `studypal-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    showToast('Data exported!', 'success');
});

document.getElementById('clear-data-btn').addEventListener('click', () => {
    if (!confirm('Are you sure? This will delete ALL your flashcards, notes, and progress.')) return;
    localStorage.removeItem('sp_flashcards');
    localStorage.removeItem('sp_notes');
    localStorage.removeItem('sp_stats');
    location.reload();
});

// ---- Utilities ----
function escapeHtml(str) {
    const d = document.createElement('div'); d.textContent = str; return d.innerHTML;
}

function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}

// ---- Init ----
updateCategoryFilters();
updateCardDisplay();
renderNotes();
updateTimerDisplay();
updateStats();

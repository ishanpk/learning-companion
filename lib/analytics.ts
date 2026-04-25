/**
 * Custom analytics event tracker.
 * Works alongside Vercel Analytics for custom learning-specific events.
 * In production, can be swapped for PostHog, Mixpanel, or GA4.
 */

type AnalyticsEvent =
  | { name: 'quiz_started'; moduleId: string }
  | { name: 'quiz_completed'; moduleId: string; score: number; total: number }
  | { name: 'quiz_abandoned'; questionsAnswered: number; total: number }
  | { name: 'timer_started'; focusDuration: number }
  | { name: 'timer_paused'; elapsedSeconds: number }
  | { name: 'timer_completed'; focusDuration: number }
  | { name: 'timer_paused_without_resume'; sessionDuration: number }
  | { name: 'learning_path_generated'; topic: string }
  | { name: 'learning_path_started'; courseId: string }
  | { name: 'skill_leveled_up'; skillId: string; newLevel: number }
  | { name: 'achievement_unlocked'; achievementId: string; title: string }
  | { name: 'scenario_completed'; scenarioId: string; success: boolean }
  | { name: 'page_view'; view: string };

/**
 * Track a custom analytics event. Logs to console in development,
 * and can send to an analytics provider in production.
 */
export function trackEvent(event: AnalyticsEvent): void {
  if (typeof window === 'undefined') return;

  // Development: log events to console
  if (process.env.NODE_ENV === 'development') {
    console.info(`[Analytics] ${event.name}`, event);
    return;
  }

  // Production: send to analytics provider
  // Uncomment and configure one of these:
  //
  // PostHog:
  // posthog.capture(event.name, event);
  //
  // Vercel Web Analytics custom events:
  // window.va?.track(event.name, event);
  //
  // Google Analytics 4:
  // gtag('event', event.name, event);

  // Fallback: store in sessionStorage for debugging
  try {
    const events: AnalyticsEvent[] = JSON.parse(
      sessionStorage.getItem('sp_analytics') || '[]'
    );
    events.push(event);
    sessionStorage.setItem('sp_analytics', JSON.stringify(events.slice(-100)));
  } catch {
    // Silently fail if storage is full
  }
}

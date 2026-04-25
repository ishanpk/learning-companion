const { escapeHtml, timeAgo } = require('./utils');

describe('Utility Functions', () => {
    describe('escapeHtml', () => {
        it('should escape HTML tags to prevent XSS', () => {
            const input = '<script>alert("XSS")</script>';
            const expected = '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;';
            expect(escapeHtml(input)).toBe(expected);
        });

        it('should handle empty strings', () => {
            expect(escapeHtml('')).toBe('');
            expect(escapeHtml(null)).toBe('');
        });
    });

    describe('timeAgo', () => {
        beforeAll(() => {
            jest.useFakeTimers('modern');
            jest.setSystemTime(new Date('2026-04-25T12:00:00Z'));
        });

        afterAll(() => {
            jest.useRealTimers();
        });

        it('should return "just now" for dates within a minute', () => {
            const now = new Date('2026-04-25T11:59:30Z');
            expect(timeAgo(now)).toBe('just now');
        });

        it('should return minutes ago for dates within an hour', () => {
            const tenMinsAgo = new Date('2026-04-25T11:50:00Z');
            expect(timeAgo(tenMinsAgo)).toBe('10m ago');
        });

        it('should return hours ago for dates within a day', () => {
            const twoHoursAgo = new Date('2026-04-25T10:00:00Z');
            expect(timeAgo(twoHoursAgo)).toBe('2h ago');
        });
    });
});

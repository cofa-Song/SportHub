/**
 * Formats a date string into a friendly relative date or a standard YYYY-MM-DD format.
 * - Today: "今日"
 * - Yesterday: "昨日"
 * - Older: "YYYY-MM-DD"
 */
export function formatFriendlyDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();

    // Normalize to midnight for day comparison
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (targetDate.getTime() === today.getTime()) {
        return '今日';
    } else if (targetDate.getTime() === yesterday.getTime()) {
        return '昨日';
    } else {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }
}

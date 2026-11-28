export const BOOK_ENTRY_EVENT = 'cliks:book-entry';

export function openBookEntry(type, record) {
    window.dispatchEvent(new CustomEvent(BOOK_ENTRY_EVENT, { detail: { type, record } }));
}

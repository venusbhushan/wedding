import { GREETINGS } from '../lib/greeting.mjs';

function isLanguage(value: string | null): value is string {
 return value === 'auto' || (value !== null && Object.hasOwn(GREETINGS, value));
}

// A shared link takes precedence over this browser's saved preference.
export function languageFromPreferences(search: string, saved: string | null): string {
 const requested = new URLSearchParams(search).get('lang');
 if (isLanguage(requested)) return requested;
 return isLanguage(saved) ? saved : 'auto';
}

export function languageUrl(href: string, language: string): string {
 const url = new URL(href);
 if (!isLanguage(language)) return url.href;
 url.searchParams.set('lang', language);
 return url.href;
}

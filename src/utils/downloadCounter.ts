import { AppLanguage } from '../types/biodata';

const COUNTER_API_BASE = 'https://countapi.mileshilliard.com/api/v1';
const COUNTER_KEY = 'freemarathibiodatamaker_netlify_pdf_downloads_v1';
const STORAGE_KEY_REMOTE_COUNT = 'marathi_biodata_remote_downloads_v1';

export const BASE_DOWNLOAD_COUNT = 1000;

const NUMBER_LOCALE_BY_LANG: Record<AppLanguage, string> = {
  mr: 'mr-IN-u-nu-deva',
  hi: 'hi-IN-u-nu-deva',
  gu: 'gu-IN-u-nu-gujr',
  bn: 'bn-IN-u-nu-beng',
  ta: 'ta-IN',
  te: 'te-IN',
  kn: 'kn-IN',
  ml: 'ml-IN',
  pa: 'pa-IN-u-nu-guru',
  or: 'or-IN-u-nu-orya',
  ur: 'ur-IN-u-nu-arabext',
  en: 'en-IN',
};

function readCachedRemoteCount(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REMOTE_COUNT);
    if (!raw) return 0;
    const parsed = Number(raw);
    return Number.isFinite(parsed) && parsed >= 0 ? Math.floor(parsed) : 0;
  } catch {
    return 0;
  }
}

function writeCachedRemoteCount(value: number): void {
  try {
    if (Number.isFinite(value) && value >= 0) {
      localStorage.setItem(STORAGE_KEY_REMOTE_COUNT, String(Math.floor(value)));
    }
  } catch {
    // Ignore storage quota errors
  }
}

export function getInitialDownloadCount(): number {
  return BASE_DOWNLOAD_COUNT + readCachedRemoteCount();
}

export function formatDownloadCount(count: number, language: AppLanguage): string {
  const safeCount = Math.max(BASE_DOWNLOAD_COUNT, Math.floor(count));
  try {
    return `${new Intl.NumberFormat(NUMBER_LOCALE_BY_LANG[language] || 'en-IN').format(safeCount)}+`;
  } catch {
    return `${safeCount.toLocaleString('en-IN')}+`;
  }
}

async function fetchCounterJson(endpoint: 'get' | 'hit'): Promise<number | null> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(`${COUNTER_API_BASE}/${endpoint}/${COUNTER_KEY}`, {
      method: 'GET',
      cache: 'no-store',
      signal: controller.signal,
    });
    if (!res.ok) {
      return null;
    }
    const data = (await res.json()) as { value?: string | number };
    const parsed = Number(data?.value);
    if (!Number.isFinite(parsed) || parsed < 0) {
      return null;
    }
    return Math.floor(parsed);
  } catch {
    return null;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export async function fetchDownloadCount(): Promise<number> {
  const cached = readCachedRemoteCount();
  const remote = await fetchCounterJson('get');
  if (remote !== null) {
    const best = Math.max(remote, cached);
    writeCachedRemoteCount(best);
    return BASE_DOWNLOAD_COUNT + best;
  }
  return BASE_DOWNLOAD_COUNT + cached;
}

export async function incrementDownloadCount(): Promise<number> {
  const cached = readCachedRemoteCount();
  const remote = await fetchCounterJson('hit');
  if (remote !== null) {
    const best = Math.max(remote, cached + 1);
    writeCachedRemoteCount(best);
    return BASE_DOWNLOAD_COUNT + best;
  }
  const fallbackNext = cached + 1;
  writeCachedRemoteCount(fallbackNext);
  return BASE_DOWNLOAD_COUNT + fallbackNext;
}

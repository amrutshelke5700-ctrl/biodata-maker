import { TemplateId } from '../types/biodata';

export type ProPlanType = 'free' | 'pro_monthly' | 'pro_yearly';

export interface ProState {
  plan: ProPlanType;
  expiresAt: number | null;
  singleCredits: number;
  unlockedAt: number | null;
  paymentRef?: string;
}

const STORAGE_KEY_PRO = 'sadhanbox_pro_state_v1';

export const DEFAULT_PRO_STATE: ProState = {
  plan: 'free',
  expiresAt: null,
  singleCredits: 0,
  unlockedAt: null,
};

export function loadProState(): ProState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PRO);
    if (!raw) return DEFAULT_PRO_STATE;
    const parsed = JSON.parse(raw) as Partial<ProState>;
    const next: ProState = {
      plan:
        parsed.plan === 'pro_monthly' || parsed.plan === 'pro_yearly'
          ? parsed.plan
          : 'free',
      expiresAt: typeof parsed.expiresAt === 'number' ? parsed.expiresAt : null,
      singleCredits:
        typeof parsed.singleCredits === 'number' && parsed.singleCredits > 0
          ? Math.floor(parsed.singleCredits)
          : 0,
      unlockedAt: typeof parsed.unlockedAt === 'number' ? parsed.unlockedAt : null,
      paymentRef: typeof parsed.paymentRef === 'string' ? parsed.paymentRef : undefined,
    };

    if (next.plan !== 'free' && next.expiresAt && next.expiresAt <= Date.now()) {
      return { ...next, plan: 'free', expiresAt: null };
    }
    return next;
  } catch {
    return DEFAULT_PRO_STATE;
  }
}

export function saveProState(state: ProState): void {
  try {
    localStorage.setItem(STORAGE_KEY_PRO, JSON.stringify(state));
  } catch {
    // Ignore storage quota errors
  }
}

export function isProActive(state: ProState): boolean {
  if (state.plan === 'free') return false;
  if (state.expiresAt && state.expiresAt <= Date.now()) return false;
  return true;
}

export function activateProPlan(
  plan: 'pro_monthly' | 'pro_yearly',
  paymentRef?: string
): ProState {
  const now = Date.now();
  const durationMs =
    plan === 'pro_yearly' ? 365 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000;
  const current = loadProState();
  const next: ProState = {
    ...current,
    plan,
    expiresAt: now + durationMs,
    unlockedAt: now,
    paymentRef,
  };
  saveProState(next);
  return next;
}

export function addSingleProCredit(paymentRef?: string): ProState {
  const current = loadProState();
  const next: ProState = {
    ...current,
    singleCredits: current.singleCredits + 1,
    unlockedAt: Date.now(),
    paymentRef,
  };
  saveProState(next);
  return next;
}

export function consumeSingleProCredit(): ProState {
  const current = loadProState();
  const next: ProState = {
    ...current,
    singleCredits: Math.max(0, current.singleCredits - 1),
  };
  saveProState(next);
  return next;
}

// Royal / Golden & Luxury Pro Templates (unlocked with All-Tools Pro Pass or Single ₹19 Download)
const PRO_TEMPLATE_IDS = new Set<string>([
  'royal-gold',
  'paithani',
  'emerald-ivory',
  'kumkum-maroon',
  'saffron-maratha',
  'modern-bronze-top-bar',
  'modern-bronze-split-card',
  'modern-obsidian-left-sidebar',
  'modern-sapphire-geometric-corner',
]);

export function isTemplatePro(id: TemplateId): boolean {
  return PRO_TEMPLATE_IDS.has(id);
}

export const PRO_UNLOCK_CODES = new Set(['SADHANPRO49', 'PROPASS199', 'PRO49']);
export const SINGLE_UNLOCK_CODES = new Set(['FREE100', 'SINGLE19']);

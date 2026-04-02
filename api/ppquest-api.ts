/**
 * PPQuest.com REST API client
 * Replaces Supabase RPC calls for games, packages, and orders.
 * Uses ppquest.com as the single source of truth.
 */

import { type GameV1, type PackageV1, type OrderV1 } from '@shared/generated-db-types';

const API_BASE = 'https://www.ppquest.com/api/miniapp';

let _telegramId: string | undefined;

export function setTelegramId(id: string): void {
  _telegramId = id;
}

async function ppquestFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (_telegramId) {
    headers['X-Telegram-Id'] = _telegramId;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `API Error ${res.status}`);
  }
  return data as T;
}

// ── Games ──
export async function getGames(): Promise<GameV1[]> {
  return ppquestFetch<GameV1[]>('/games');
}

export async function getGameWithPackages(gameId: string): Promise<{ game: GameV1; packages: PackageV1[] }> {
  return ppquestFetch<{ game: GameV1; packages: PackageV1[] }>(`/games/${gameId}`);
}

// ── Orders ──
export async function getOrder(orderId: string): Promise<OrderV1 & { invoiceStatus?: string | null }> {
  return ppquestFetch<OrderV1 & { invoiceStatus?: string | null }>(`/orders/${orderId}`);
}

export async function getOrders(): Promise<OrderV1[]> {
  return ppquestFetch<OrderV1[]>('/orders');
}

export async function createOrder(params: {
  packageId: string;
  gameUid: string;
  paymentMethod?: string;
}): Promise<OrderV1 & { ppwalletInvoice?: { payUrl: string; code: string; expiresAt: string } | null }> {
  return ppquestFetch<OrderV1 & { ppwalletInvoice?: { payUrl: string; code: string; expiresAt: string } | null }>('/orders', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// ── Auth ──
export async function syncUser(telegramId: string, name: string, username?: string): Promise<{
  id: string;
  telegramId: string;
  name: string;
  balance: number;
  points: number;
  referralCode: string;
}> {
  return ppquestFetch('/auth', {
    method: 'POST',
    body: JSON.stringify({ telegramId, name, username }),
  });
}

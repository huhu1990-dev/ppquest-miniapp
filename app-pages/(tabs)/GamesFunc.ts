/**
 * Business logic for the Games route
 */
import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

import { t } from '@/i18n';
import { GamesProps } from '@/app/(tabs)/games';
import { type GameV1, type GameCategory, type uuidstr } from '@shared/generated-db-types';
import { supabaseClient } from '@/api/supabase-client';
import { getGames } from '@/api/ppquest-api';
import { readUserPreference } from '@shared/user-app-db';

export type GamesPageCategoryFilter = 'ALL' | 'POPULAR' | 'NEW' | GameCategory;

export interface GamesCategoryOption {
  value: GamesPageCategoryFilter;
  labelKey: string;
}

const CATEGORY_OPTIONS: readonly GamesCategoryOption[] = [
  { value: 'ALL', labelKey: 'games.allCategories' },
  { value: 'POPULAR', labelKey: 'games.popular' },
  { value: 'NEW', labelKey: 'games.new' },
  { value: 'MOBILE', labelKey: 'games.mobile' },
  { value: 'PC', labelKey: 'games.pc' },
  { value: 'CONSOLE', labelKey: 'games.console' },
  { value: 'GIFT_CARD', labelKey: 'games.giftCard' },
  { value: 'PREMIUM', labelKey: 'games.premium' },
] as const;

export interface GameSection {
  title: string;
  data: GameV1[];
}

function triggerHaptic(style: Haptics.ImpactFeedbackStyle): void {
  if (Platform.OS === 'web') return;
  Haptics.impactAsync(style).catch(logHapticError);
}

function logHapticError(error: unknown): void {
  console.warn('Haptic feedback failed:', error);
}

/**
 * Interface for the return value of the useGames hook
 */
export interface GamesFunc {
  isLoading: boolean;
  isRefreshing: boolean;
  error?: Error;
  searchQuery: string;
  activeCategory: GamesPageCategoryFilter;
  categoryOptions: readonly GamesCategoryOption[];
  favoriteGames: GameV1[];
  filteredGames: GameV1[];
  sections: GameSection[];
  hasFavorites: boolean;
  hasResults: boolean;
  onSearchChange: (text: string) => void;
  onCategoryChange: (category: GamesPageCategoryFilter) => void;
  onRefresh: () => void;
  onSelectGame: (game: GameV1) => void;
}

function formatPrice(priceInUsd: number | null): string {
  if (priceInUsd == null) return '';
  return `From ฿${priceInUsd.toLocaleString()}`;
}

export { formatPrice };

/**
 * Custom hook that provides business logic for the Games component
 */
export function useGames(props: GamesProps): GamesFunc {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [games, setGames] = useState<GameV1[]>([]);
  const [favoriteGameIds, setFavoriteGameIds] = useState<Set<uuidstr>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<GamesPageCategoryFilter>('ALL');

  useEffect(() => {
    loadDataAsync().catch((loadError) => {
      console.error('Failed to load games data:', loadError);
    });
  }, []);

  async function loadDataAsync(): Promise<void> {
    setIsLoading(true);
    setError(undefined);
    try {
      const [fetchedGames, preferences] = await Promise.all([
        getGames(),
        readUserPreference(supabaseClient).catch(() => undefined),
      ]);

      setGames(fetchedGames);

      const favIds = preferences?.favoriteGameIds;
      if (favIds != null && favIds.length > 0) {
        setFavoriteGameIds(new Set(favIds));
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError : new Error('Failed to load games'));
    } finally {
      setIsLoading(false);
    }
  }

  async function refreshDataAsync(): Promise<void> {
    setIsRefreshing(true);
    try {
      const [fetchedGames, preferences] = await Promise.all([
        getGames(),
        readUserPreference(supabaseClient).catch(() => undefined),
      ]);

      setGames(fetchedGames);

      const favIds = preferences?.favoriteGameIds;
      if (favIds != null && favIds.length > 0) {
        setFavoriteGameIds(new Set(favIds));
      }
    } catch {
      // Keep existing data on refresh failure
    } finally {
      setIsRefreshing(false);
    }
  }

  function getFilteredGames(): GameV1[] {
    let result = games;

    if (activeCategory === 'POPULAR') {
      result = result.filter((game) => game.isPopular);
    } else if (activeCategory === 'NEW') {
      result = result.filter((game) => game.isNew);
    } else if (activeCategory !== 'ALL') {
      result = result.filter((game) => game.category === activeCategory);
    }

    if (searchQuery.trim().length > 0) {
      const query = searchQuery.trim().toLowerCase();
      result = result.filter((game) => game.name.toLowerCase().includes(query));
    }

    return result;
  }

  function getFavoriteGames(): GameV1[] {
    return games.filter((game) => favoriteGameIds.has(game.id));
  }

  function buildSections(filtered: GameV1[]): GameSection[] {
    const result: GameSection[] = [];

    // If a specific category or search is active, show flat list
    if (activeCategory !== 'ALL' || searchQuery.trim().length > 0) {
      return result;
    }

    const popular = filtered.filter((game) => game.isPopular);
    if (popular.length > 0) {
      result.push({ title: t('games.popularGames'), data: popular });
    }

    const newArrivals = filtered.filter((game) => game.isNew && !game.isPopular);
    if (newArrivals.length > 0) {
      result.push({ title: t('games.newArrivals'), data: newArrivals });
    }

    const mobile = filtered.filter((game) => game.category === 'MOBILE' && !game.isPopular && !game.isNew);
    if (mobile.length > 0) {
      result.push({ title: t('games.mobileGames'), data: mobile });
    }

    const pc = filtered.filter((game) => game.category === 'PC' && !game.isPopular && !game.isNew);
    if (pc.length > 0) {
      result.push({ title: t('games.pcGames'), data: pc });
    }

    const console_ = filtered.filter((game) => game.category === 'CONSOLE' && !game.isPopular && !game.isNew);
    if (console_.length > 0) {
      result.push({ title: t('games.consoleGames'), data: console_ });
    }

    const giftCards = filtered.filter((game) => game.category === 'GIFT_CARD' && !game.isPopular && !game.isNew);
    if (giftCards.length > 0) {
      result.push({ title: t('games.giftCards'), data: giftCards });
    }

    const premium = filtered.filter((game) => game.category === 'PREMIUM' && !game.isPopular && !game.isNew);
    if (premium.length > 0) {
      result.push({ title: t('games.premiumApps'), data: premium });
    }

    return result;
  }

  function onSearchChange(text: string): void {
    setSearchQuery(text);
  }

  function onCategoryChange(category: GamesPageCategoryFilter): void {
    setActiveCategory(category);
    triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
  }

  function onRefresh(): void {
    refreshDataAsync().catch((refreshError) => {
      console.error('onRefresh error:', refreshError);
    });
  }

  function onSelectGame(game: GameV1): void {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
    props.onNavigateToGameDetail({ gameId: game.id });
  }

  const filteredGames = getFilteredGames();
  const favoriteGames = getFavoriteGames();
  const sections = buildSections(filteredGames);
  const hasFavorites = favoriteGames.length > 0;
  const hasResults = filteredGames.length > 0;

  return {
    isLoading,
    isRefreshing,
    error,
    searchQuery,
    activeCategory,
    categoryOptions: CATEGORY_OPTIONS,
    favoriteGames,
    filteredGames,
    sections,
    hasFavorites,
    hasResults,
    onSearchChange,
    onCategoryChange,
    onRefresh,
    onSelectGame,
  };
}

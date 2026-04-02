/**
 * Business logic for the GamePreferences route
 */
import { useState, useEffect, useContext } from 'react';
import { Platform } from 'react-native';

import { t } from '@/i18n';
import { GamePreferencesProps } from '@/app/onboarding/game-preferences';
import { OnboardingContext } from '@/comp-lib/common/context/OnboardingContextProvider';
import { type GameV1, type GameCategory, type uuidstr } from '@shared/generated-db-types';
import { supabaseClient } from '@/api/supabase-client';
import { readAllGames } from '@shared/game-db';
import { updateUserPreference, updateUserAppProfile } from '@shared/user-app-db';
import * as Haptics from 'expo-haptics';

export type CategoryFilter = 'ALL' | GameCategory;

export interface CategoryOption {
  value: CategoryFilter;
  labelKey: string;
}

const CATEGORY_OPTIONS: readonly CategoryOption[] = [
  { value: 'ALL', labelKey: 'gamePreferences.allCategories' },
  { value: 'MOBILE', labelKey: 'gamePreferences.mobile' },
  { value: 'PC', labelKey: 'gamePreferences.pc' },
  { value: 'CONSOLE', labelKey: 'gamePreferences.console' },
  { value: 'GIFT_CARD', labelKey: 'gamePreferences.giftCard' },
  { value: 'PREMIUM', labelKey: 'gamePreferences.premium' },
] as const;

function triggerHaptic(style: Haptics.ImpactFeedbackStyle): void {
  if (Platform.OS === 'web') return;
  Haptics.impactAsync(style).catch(logHapticError);
}

function logHapticError(error: unknown): void {
  console.warn('Haptic feedback failed:', error);
}

/**
 * Interface for the return value of the useGamePreferences hook
 */
export interface GamePreferencesFunc {
  isLoading: boolean;
  isSaving: boolean;
  filteredGames: GameV1[];
  selectedGameIds: Set<uuidstr>;
  selectedCount: number;
  searchQuery: string;
  activeCategory: CategoryFilter;
  categoryOptions: readonly CategoryOption[];
  continueButtonTitle: string;
  selectionLabel: string;
  onSearchChange: (text: string) => void;
  onCategoryChange: (category: CategoryFilter) => void;
  onToggleGame: (gameId: uuidstr) => void;
  onSkip: () => void;
  onHandleSubmit: () => void;
}

/**
 * Custom hook that provides business logic for the GamePreferences component
 */
export function useGamePreferences(props: GamePreferencesProps): GamePreferencesFunc {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [games, setGames] = useState<GameV1[]>([]);
  const [selectedGameIds, setSelectedGameIds] = useState<Set<uuidstr>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('ALL');

  const { completeOnboarding } = useContext(OnboardingContext);

  useEffect(() => {
    loadGamesAsync().catch((error) => {
      console.error('Failed to load games:', error);
    });
  }, []);

  async function loadGamesAsync(): Promise<void> {
    setIsLoading(true);
    try {
      const fetchedGames = await readAllGames(supabaseClient);
      setGames(fetchedGames);
    } catch (error) {
      console.error('Failed to fetch games:', error);
      setGames([]);
    } finally {
      setIsLoading(false);
    }
  }

  function getFilteredGames(): GameV1[] {
    let result = games;

    if (activeCategory !== 'ALL') {
      result = result.filter((game) => game.category === activeCategory);
    }

    if (searchQuery.trim().length > 0) {
      const query = searchQuery.trim().toLowerCase();
      result = result.filter((game) => game.name.toLowerCase().includes(query));
    }

    return result;
  }

  function onSearchChange(text: string): void {
    setSearchQuery(text);
  }

  function onCategoryChange(category: CategoryFilter): void {
    setActiveCategory(category);
    triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
  }

  function onToggleGame(gameId: uuidstr): void {
    setSelectedGameIds((prev) => {
      const next = new Set(prev);
      if (next.has(gameId)) {
        next.delete(gameId);
      } else {
        next.add(gameId);
      }
      return next;
    });
    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
  }

  function onSkip(): void {
    completeOnboardingAsync([]).catch((error) => {
      console.error('onSkip error:', error);
    });
  }

  function onHandleSubmit(): void {
    const ids = Array.from(selectedGameIds);
    completeOnboardingAsync(ids).catch((error) => {
      console.error('onHandleSubmit error:', error);
    });
  }

  async function completeOnboardingAsync(favoriteIds: uuidstr[]): Promise<void> {
    setIsSaving(true);
    try {
      if (favoriteIds.length > 0) {
        await updateUserPreference(supabaseClient, favoriteIds);
      }
      await updateUserAppProfile(supabaseClient, { isOnboardingComplete: true });
      completeOnboarding();
      props.onNavigateNextPage?.();
    } catch (error) {
      console.error('Failed to save preferences:', error);
      // Still navigate on error to not block the user
      completeOnboarding();
      props.onNavigateNextPage?.();
    } finally {
      setIsSaving(false);
    }
  }

  const filteredGames = getFilteredGames();
  const selectedCount = selectedGameIds.size;

  const continueButtonTitle =
    selectedCount > 0
      ? `${t('gamePreferences.letsGo')} (${selectedCount})`
      : t('gamePreferences.continueWith');

  const selectionLabel =
    selectedCount > 0
      ? t('gamePreferences.gamesSelected', { count: selectedCount })
      : '';

  return {
    isLoading,
    isSaving,
    filteredGames,
    selectedGameIds,
    selectedCount,
    searchQuery,
    activeCategory,
    categoryOptions: CATEGORY_OPTIONS,
    continueButtonTitle,
    selectionLabel,
    onSearchChange,
    onCategoryChange,
    onToggleGame,
    onSkip,
    onHandleSubmit,
  };
}

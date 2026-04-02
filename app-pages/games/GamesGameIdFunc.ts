/**
 * Business logic for the GamesGameId route
 */
import { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

import { GamesGameIdProps } from '@/app/games/[gameId]';
import { type GameV1, type PackageV1, type PackageType, type uuidstr } from '@shared/generated-db-types';
import { supabaseClient } from '@/api/supabase-client';
import { getGameWithPackages } from '@/api/ppquest-api';
import { upsertSavedGameAccount } from '@shared/user-app-db';

export type PackageTypeFilter = 'ALL' | PackageType;

export interface PackageTypeOption {
  value: PackageTypeFilter;
  labelKey: string;
}

const PACKAGE_TYPE_OPTIONS: readonly PackageTypeOption[] = [
  { value: 'ALL', labelKey: 'gameDetail.all' },
  { value: 'CURRENCY', labelKey: 'gameDetail.currency' },
  { value: 'PASS', labelKey: 'gameDetail.passes' },
  { value: 'BUNDLE', labelKey: 'gameDetail.bundles' },
] as const;

function triggerHaptic(style: Haptics.ImpactFeedbackStyle): void {
  if (Platform.OS === 'web') return;
  Haptics.impactAsync(style).catch(logHapticError);
}

function logHapticError(error: unknown): void {
  console.warn('Haptic feedback failed:', error);
}

function computeDiscountPercent(originalPriceInUsd: number, priceInUsd: number): number {
  if (originalPriceInUsd <= 0) return 0;
  return Math.round(((originalPriceInUsd - priceInUsd) / originalPriceInUsd) * 100);
}

export { computeDiscountPercent };

/**
 * Interface for the return value of the useGamesGameId hook
 */
export interface GamesGameIdFunc {
  isLoading: boolean;
  error?: Error;
  game?: GameV1;
  packages: PackageV1[];
  filteredPackages: PackageV1[];
  activePackageType: PackageTypeFilter;
  packageTypeOptions: readonly PackageTypeOption[];
  selectedPackageId?: uuidstr;
  playerId: string;
  playerIdError?: string;
  selectedServer: string;
  canCheckout: boolean;
  selectedPackagePrice: number;
  onPackageTypeChange: (type: PackageTypeFilter) => void;
  onSelectPackage: (packageId: uuidstr) => void;
  onPlayerIdChange: (text: string) => void;
  onServerChange: (server: string) => void;
  onProceedToCheckout: () => void;
  onRetry: () => void;
}

/**
 * Custom hook that provides business logic for the GamesGameId component
 */
export function useGamesGameId(props: GamesGameIdProps): GamesGameIdFunc {
  const gameId = props.urlParams.gameId as uuidstr;
  const prefillPlayerId = (props.urlParams.playerId as string | undefined) ?? '';
  const prefillServer = (props.urlParams.server as string | undefined) ?? '';

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [game, setGame] = useState<GameV1 | undefined>(undefined);
  const [packages, setPackages] = useState<PackageV1[]>([]);
  const [activePackageType, setActivePackageType] = useState<PackageTypeFilter>('ALL');
  const [selectedPackageId, setSelectedPackageId] = useState<uuidstr | undefined>(undefined);
  const [playerId, setPlayerId] = useState(prefillPlayerId);
  const [playerIdError, setPlayerIdError] = useState<string | undefined>(undefined);
  const [selectedServer, setSelectedServer] = useState(prefillServer);

  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    async function loadInitialDataAsync(): Promise<void> {
      await loadGameDataAsync();
    }

    loadInitialDataAsync().catch((loadError) => {
      console.error('Failed to load game detail:', loadError);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadGameDataAsync(): Promise<void> {
    setIsLoading(true);
    setError(undefined);
    try {
      const { game: fetchedGame, packages: fetchedPackages } = await getGameWithPackages(gameId);

      setGame(fetchedGame);
      setPackages(fetchedPackages);

      if (fetchedGame != null && fetchedGame.requiresServer && fetchedGame.servers != null && fetchedGame.servers.length > 0) {
        setSelectedServer((prev) => prev.length > 0 ? prev : fetchedGame.servers?.[0] ?? '');
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError : new Error('Failed to load game details'));
    } finally {
      setIsLoading(false);
    }
  }

  function getFilteredPackages(): PackageV1[] {
    if (activePackageType === 'ALL') return packages;
    return packages.filter((pkg) => pkg.type === activePackageType);
  }

  function getSelectedPackagePrice(): number {
    if (selectedPackageId == null) return 0;
    const pkg = packages.find((p) => p.id === selectedPackageId);
    return pkg?.priceInUsd ?? 0;
  }

  function getCanCheckout(): boolean {
    if (selectedPackageId == null) return false;
    if (game?.requiresPlayerId && playerId.trim().length === 0) return false;
    if (game?.requiresServer && selectedServer.length === 0) return false;
    return true;
  }

  function onPackageTypeChange(type: PackageTypeFilter): void {
    setActivePackageType(type);
    triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
  }

  function onSelectPackage(packageId: uuidstr): void {
    setSelectedPackageId(packageId);
    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
  }

  function onPlayerIdChange(text: string): void {
    setPlayerId(text);
    if (playerIdError != null && text.trim().length > 0) {
      setPlayerIdError(undefined);
    }
  }

  function onServerChange(server: string): void {
    setSelectedServer(server);
  }

  function onProceedToCheckout(): void {
    if (game?.requiresPlayerId && playerId.trim().length === 0) {
      setPlayerIdError('gameDetail.playerIdRequired');
      return;
    }

    const selectedPkg = packages.find((p) => p.id === selectedPackageId);
    if (selectedPkg == null || game == null) return;

    triggerHaptic(Haptics.ImpactFeedbackStyle.Heavy);

    if (game.requiresPlayerId && playerId.trim().length > 0) {
      upsertSavedGameAccount(supabaseClient, {
        gameId: game.id,
        playerId: playerId.trim(),
        server: selectedServer.length > 0 ? selectedServer : undefined,
      }).catch((err) => {
        console.warn('Failed to save game account:', err);
      });
    }

    props.onNavigateToCheckout({
      gameId: game.id,
      gameName: game.name,
      gameIconUrl: game.iconUrl,
      packageId: selectedPkg.id,
      packageName: selectedPkg.name,
      priceInUsd: String(selectedPkg.priceInUsd),
      playerId: playerId.trim(),
      server: selectedServer,
    });
  }

  function onRetry(): void {
    loadGameDataAsync().catch((retryError) => {
      console.error('onRetry error:', retryError);
    });
  }

  const filteredPackages = getFilteredPackages();
  const selectedPackagePrice = getSelectedPackagePrice();
  const canCheckout = getCanCheckout();

  return {
    isLoading,
    error,
    game,
    packages,
    filteredPackages,
    activePackageType,
    packageTypeOptions: PACKAGE_TYPE_OPTIONS,
    selectedPackageId,
    playerId,
    playerIdError,
    selectedServer,
    canCheckout,
    selectedPackagePrice,
    onPackageTypeChange,
    onSelectPackage,
    onPlayerIdChange,
    onServerChange,
    onProceedToCheckout,
    onRetry,
  };
}

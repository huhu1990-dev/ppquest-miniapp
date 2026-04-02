/**
 * Business logic for the Profile route
 */
import { useState, useEffect, useContext } from 'react';

import * as Auth from '@/api/auth-api';
import { supabaseClient } from '@/api/supabase-client';
import { deleteCurrentUser } from '@/api/user-api';
import { OnboardingContext } from '@/comp-lib/common/context/OnboardingContextProvider';
import { alert } from '@/utils/alert';
import { t } from '@/i18n';
import { ProfileProps } from '@/app/(tabs)/profile';
import { type ProfileWithEmailV1, type SavedGameAccountV1, type UserAppProfileV1, type uuidstr } from '@shared/generated-db-types';
import { readProfileWithUser } from '@shared/profile-db';
import { readAllSavedGameAccounts, readUserAppProfile, deleteSavedGameAccount } from '@shared/user-app-db';

export interface ProfileData {
  fullName: string;
  email: string;
  avatarUrl?: string;
  totalOrdersCount: number;
  totalSpentInUsd: number;
}

/**
 * Interface for the return value of the useProfile hook
 */
export interface ProfileFunc {
  isLoading: boolean;
  error?: Error;
  profileData?: ProfileData;
  savedAccounts: SavedGameAccountV1[];
  onLogout: (navigateAfterLogout: () => void) => void;
  onDeleteAccount: (navigateAfterLogout: () => void) => void;
  onTopUpAccount: (account: SavedGameAccountV1) => void;
  onDeleteSavedAccount: (accountId: uuidstr) => void;
}

function buildProfileData(
  profileWithEmail?: ProfileWithEmailV1,
  appProfile?: UserAppProfileV1,
): ProfileData | undefined {
  if (profileWithEmail == null) return undefined;

  const profile = profileWithEmail.profile;
  const fullName = profile?.fullName ?? profile?.givenName ?? profile?.username ?? '';
  const email = profileWithEmail.email ?? '';

  return {
    fullName,
    email,
    avatarUrl: profile?.avatarUrl ?? undefined,
    totalOrdersCount: appProfile?.totalOrdersCount ?? 0,
    totalSpentInUsd: appProfile?.totalSpentInUsd ?? 0,
  };
}

/**
 * Custom hook that provides business logic for the Profile component
 */
export function useProfile(props: ProfileProps): ProfileFunc {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [profileData, setProfileData] = useState<ProfileData | undefined>(undefined);
  const [savedAccounts, setSavedAccounts] = useState<SavedGameAccountV1[]>([]);

  const { resetOnboardingContext } = useContext(OnboardingContext);

  useEffect(() => {
    loadProfileAsync().catch((loadError) => {
      console.error('Failed to load profile:', loadError);
    });
  }, []);

  async function loadProfileAsync(): Promise<void> {
    setIsLoading(true);
    setError(undefined);
    try {
      const [profileWithEmail, appProfile, accounts] = await Promise.all([
        readProfileWithUser(supabaseClient),
        readUserAppProfile(supabaseClient).catch(() => undefined),
        readAllSavedGameAccounts(supabaseClient).catch(() => []),
      ]);

      setProfileData(buildProfileData(profileWithEmail, appProfile));
      setSavedAccounts(accounts);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError : new Error('Failed to load profile'));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLogout(navigateAfterLogout: () => void): Promise<void> {
    setIsLoading(true);
    const { error: signOutError } = await Auth.signOut(supabaseClient);
    setIsLoading(false);
    if (signOutError) {
      console.error('Failed to logout', signOutError);
      setError(signOutError instanceof Error ? signOutError : new Error('Failed to logout'));
      return;
    }
    resetOnboardingContext();
    navigateAfterLogout();
  }

  function onLogout(navigateAfterLogout: () => void): void {
    alert(
      t('auth.signOut'),
      t('auth.signOutConfirmation'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('auth.signOut'),
          onPress: () => onConfirmLogout(navigateAfterLogout),
        },
      ],
      { cancelable: true },
    );
  }

  function onConfirmLogout(navigateAfterLogout: () => void): void {
    handleLogout(navigateAfterLogout).catch((err) => {
      console.error('handleLogout error', err);
    });
  }

  function onDeleteAccount(navigateAfterLogout: () => void): void {
    alert(
      t('auth.deleteAccount'),
      t('auth.deleteAccountConfirmation'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => onConfirmDeleteAccount(navigateAfterLogout),
        },
      ],
      { cancelable: true },
    );
  }

  function onConfirmDeleteAccount(navigateAfterLogout: () => void): void {
    handleDeleteAccount(navigateAfterLogout).catch((deleteError) => {
      console.error('onDeleteAccount error:', deleteError);
    });
  }

  function onTopUpAccount(account: SavedGameAccountV1): void {
    props.onNavigateToGame({
      gameId: account.gameId,
      playerId: account.playerId,
      server: account.server ?? '',
    });
  }

  function onDeleteSavedAccount(accountId: uuidstr): void {
    handleDeleteSavedAccountAsync(accountId).catch((err) => {
      console.error('onDeleteSavedAccount error:', err);
    });
  }

  async function handleDeleteSavedAccountAsync(accountId: uuidstr): Promise<void> {
    try {
      await deleteSavedGameAccount(supabaseClient, accountId);
      setSavedAccounts((prev) => prev.filter((a) => a.id !== accountId));
    } catch (err) {
      console.error('Failed to delete saved account:', err);
    }
  }

  async function handleDeleteAccount(navigateAfterLogout: () => void): Promise<void> {
    setIsLoading(true);
    try {
      await deleteCurrentUser(supabaseClient);
      const { error: signOutError } = await Auth.signOut(supabaseClient);
      setIsLoading(false);
      if (signOutError) {
        console.error('Failed to logout after account deletion', signOutError);
        setError(signOutError instanceof Error ? signOutError : new Error('Failed to logout'));
        return;
      }
    } catch (err) {
      setIsLoading(false);
      console.error('Failed to delete account:', err);
      setError(err instanceof Error ? err : new Error('Failed to delete account'));
    }
    resetOnboardingContext();
    navigateAfterLogout();
  }

  return {
    isLoading,
    error,
    profileData,
    savedAccounts,
    onLogout,
    onDeleteAccount,
    onTopUpAccount,
    onDeleteSavedAccount,
  };
}

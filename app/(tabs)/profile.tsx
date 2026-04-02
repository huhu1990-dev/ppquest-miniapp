/**
 * AUTO-GENERATED - DO NOT MODIFY!
 * Any changes will be lost when the file is regenerated.
 */

import { type PropsWithChildren, type ReactNode } from 'react';
import { type UnknownOutputParams } from 'expo-router';

import { useNav } from '@/comp-lib/navigation/useNav';
import { type AuthLoginUrlParams } from '@/app/auth/login';
import { type GamesGameIdUrlParams } from '@/app/games/[gameId]';
import ProfileContainer from '@/app-pages/(tabs)/ProfileContainer';

export type TabsProfileUrlParams = UnknownOutputParams;

export interface ProfileProps extends PropsWithChildren {
  /**
   * The page's URL params. Includes path and query params.
   */
  urlParams: TabsProfileUrlParams;
  /**
   * Sets the navigation options using navigation.setOptions()
   * @param options The options to set
   * @returns void
   */
  setNavigationOptions: (options?: Record<string, any>) => void;

  /**
   * Executes when user logs out from their profile
   */
  onNavigateToAuth: (urlParams?: AuthLoginUrlParams) => void;
  /**
   * Navigates to game detail page, optionally pre-filling player ID
   */
  onNavigateToGame: (urlParams: GamesGameIdUrlParams) => void;
}

/**
 * User profile and account settings
 */
export default function ProfilePage(props: ProfileProps): ReactNode {
  const { urlParams, setOptions, navigate, push } = useNav<TabsProfileUrlParams>({ auth: true });
  /**
   * Executes when user logs out from their profile
   */
  const onNavigateToAuth = (urlParams?: AuthLoginUrlParams) => {
    navigate({
      pathname: '/auth/login',
      params: urlParams,
    });
  };
  /**
   * Navigates to game detail page, optionally pre-filling player ID
   */
  const onNavigateToGame = (urlParams: GamesGameIdUrlParams) => {
    push({
      pathname: '/games/[gameId]',
      params: urlParams,
    });
  };

  return (
    <ProfileContainer
      children={props.children}
      urlParams={urlParams}
      setNavigationOptions={setOptions}
      onNavigateToAuth={onNavigateToAuth}
      onNavigateToGame={onNavigateToGame}
    />
  );
}

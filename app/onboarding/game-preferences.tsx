/**
 * AUTO-GENERATED - DO NOT MODIFY!
 * Any changes will be lost when the file is regenerated.
 */

import { type PropsWithChildren, type ReactNode } from 'react';
import { type UnknownOutputParams } from 'expo-router';

import { useNav } from '@/comp-lib/navigation/useNav';
import { type TabsGamesUrlParams } from '@/app/(tabs)/games';
import GamePreferencesContainer from '@/app-pages/onboarding/GamePreferencesContainer';

export type OnboardingGamePreferencesUrlParams = UnknownOutputParams;

export interface GamePreferencesProps extends PropsWithChildren {
  /**
   * The page's URL params. Includes path and query params.
   */
  urlParams: OnboardingGamePreferencesUrlParams;
  /**
   * Sets the navigation options using navigation.setOptions()
   * @param options The options to set
   * @returns void
   */
  setNavigationOptions: (options?: Record<string, any>) => void;

  /**
   * Executes after user selects favorite games, proceeding to main app
   */
  onNavigateNextPage: (urlParams?: TabsGamesUrlParams) => void;
}

/**
 * Select favorite games to personalize the app experience
 */
export default function GamePreferencesPage(props: GamePreferencesProps): ReactNode {
  const { urlParams, setOptions, navigate } = useNav<OnboardingGamePreferencesUrlParams>({ auth: true });
  /**
   * Executes after user selects favorite games, proceeding to main app
   */
  const onNavigateNextPage = (urlParams?: TabsGamesUrlParams) => {
    navigate({
      pathname: '/(tabs)/games',
      params: urlParams,
    });
  };

  return (
    <GamePreferencesContainer
      children={props.children}
      urlParams={urlParams}
      setNavigationOptions={setOptions}
      onNavigateNextPage={onNavigateNextPage}
    />
  );
}

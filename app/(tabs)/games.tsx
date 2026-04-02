/**
 * AUTO-GENERATED - DO NOT MODIFY!
 * Any changes will be lost when the file is regenerated.
 */

import { type PropsWithChildren, type ReactNode } from 'react';
import { type UnknownOutputParams } from 'expo-router';

import { useNav } from '@/comp-lib/navigation/useNav';
import { type GamesGameIdUrlParams } from '@/app/games/[gameId]';
import GamesContainer from '@/app-pages/(tabs)/GamesContainer';

export type TabsGamesUrlParams = UnknownOutputParams;

export interface GamesProps extends PropsWithChildren {
  /**
   * The page's URL params. Includes path and query params.
   */
  urlParams: TabsGamesUrlParams;
  /**
   * Sets the navigation options using navigation.setOptions()
   * @param options The options to set
   * @returns void
   */
  setNavigationOptions: (options?: Record<string, any>) => void;

  /**
   * Executes when user selects a game to view top-up options
   */
  onNavigateToGameDetail: (urlParams: GamesGameIdUrlParams) => void;
}

/**
 * Browse available games for top-up
 */
export default function GamesPage(props: GamesProps): ReactNode {
  const { urlParams, setOptions, push } = useNav<TabsGamesUrlParams>({ auth: true });
  /**
   * Executes when user selects a game to view top-up options
   */
  const onNavigateToGameDetail = (urlParams: GamesGameIdUrlParams) => {
    push({
      pathname: '/games/[gameId]',
      params: urlParams,
    });
  };

  return (
    <GamesContainer
      children={props.children}
      urlParams={urlParams}
      setNavigationOptions={setOptions}
      onNavigateToGameDetail={onNavigateToGameDetail}
    />
  );
}

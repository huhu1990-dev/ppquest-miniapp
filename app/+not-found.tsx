/**
 * AUTO-GENERATED - DO NOT MODIFY!
 * Any changes will be lost when the file is regenerated.
 */

import { type PropsWithChildren, type ReactNode } from 'react';
import { type UnknownOutputParams } from 'expo-router';

import { useNav } from '@/comp-lib/navigation/useNav';
import { type TabsGamesUrlParams } from '@/app/(tabs)/games';
import NotFoundContainer from '@/app-pages/NotFoundContainer';

export type NotFoundUrlParams = UnknownOutputParams;

export interface NotFoundProps extends PropsWithChildren {
  /**
   * The page's URL params. Includes path and query params.
   */
  urlParams: NotFoundUrlParams;
  /**
   * Sets the navigation options using navigation.setOptions()
   * @param options The options to set
   * @returns void
   */
  setNavigationOptions: (options?: Record<string, any>) => void;

  /**
   * Returns user to the main games page
   */
  onNavigateToHome: (urlParams?: TabsGamesUrlParams) => void;
}

/**
 * 404 Not Found page
 */
export default function NotFoundPage(props: NotFoundProps): ReactNode {
  const { urlParams, setOptions, navigate } = useNav<NotFoundUrlParams>({ auth: false });
  /**
   * Returns user to the main games page
   */
  const onNavigateToHome = (urlParams?: TabsGamesUrlParams) => {
    navigate({
      pathname: '/(tabs)/games',
      params: urlParams,
    });
  };

  return (
    <NotFoundContainer
      children={props.children}
      urlParams={urlParams}
      setNavigationOptions={setOptions}
      onNavigateToHome={onNavigateToHome}
    />
  );
}

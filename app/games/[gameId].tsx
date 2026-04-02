/**
 * AUTO-GENERATED - DO NOT MODIFY!
 * Any changes will be lost when the file is regenerated.
 */

import { type PropsWithChildren, type ReactNode } from 'react';
import { type UnknownOutputParams } from 'expo-router';

import { useNav } from '@/comp-lib/navigation/useNav';
import { type CheckoutUrlParams } from '@/app/checkout';
import GamesGameIdContainer from '@/app-pages/games/GamesGameIdContainer';

export type GamesGameIdUrlParams = UnknownOutputParams & {
  gameId: string;
};

export interface GamesGameIdProps extends PropsWithChildren {
  /**
   * The page's URL params. Includes path and query params.
   */
  urlParams: GamesGameIdUrlParams;
  /**
   * Sets the navigation options using navigation.setOptions()
   * @param options The options to set
   * @returns void
   */
  setNavigationOptions: (options?: Record<string, any>) => void;

  /**
   * Returns to games list
   */
  onGoBack: () => void;
  /**
   * Executes when user selects a top-up package to purchase
   */
  onNavigateToCheckout: (urlParams?: CheckoutUrlParams) => void;
}

/**
 * Game detail page with available top-up packages
 */
export default function GamesGameIdPage(props: GamesGameIdProps): ReactNode {
  const { urlParams, setOptions, back, push } = useNav<GamesGameIdUrlParams>({ auth: true });
  /**
   * Returns to games list
   */
  const onGoBack = () => {
    back();
  };
  /**
   * Executes when user selects a top-up package to purchase
   */
  const onNavigateToCheckout = (urlParams?: CheckoutUrlParams) => {
    push({
      pathname: '/checkout',
      params: urlParams,
    });
  };

  return (
    <GamesGameIdContainer
      children={props.children}
      urlParams={urlParams}
      setNavigationOptions={setOptions}
      onGoBack={onGoBack}
      onNavigateToCheckout={onNavigateToCheckout}
    />
  );
}

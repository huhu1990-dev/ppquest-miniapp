/**
 * AUTO-GENERATED - DO NOT MODIFY!
 * Any changes will be lost when the file is regenerated.
 */

import { type PropsWithChildren, type ReactNode } from 'react';
import { type UnknownOutputParams } from 'expo-router';

import { useNav } from '@/comp-lib/navigation/useNav';
import { type TabsGamesUrlParams } from '@/app/(tabs)/games';
import UpdatePasswordContainer from '@/app-pages/auth/UpdatePasswordContainer';

export type AuthUpdatePasswordUrlParams = UnknownOutputParams;

export interface UpdatePasswordProps extends PropsWithChildren {
  /**
   * The page's URL params. Includes path and query params.
   */
  urlParams: AuthUpdatePasswordUrlParams;
  /**
   * Sets the navigation options using navigation.setOptions()
   * @param options The options to set
   * @returns void
   */
  setNavigationOptions: (options?: Record<string, any>) => void;

  /**
   * Executes after password is successfully updated
   */
  onNavigateToHome: (urlParams?: TabsGamesUrlParams) => void;
}

/**
 * Password update page after reset
 */
export default function UpdatePasswordPage(props: UpdatePasswordProps): ReactNode {
  const { urlParams, setOptions, navigate } = useNav<AuthUpdatePasswordUrlParams>({ auth: false });
  /**
   * Executes after password is successfully updated
   */
  const onNavigateToHome = (urlParams?: TabsGamesUrlParams) => {
    navigate({
      pathname: '/(tabs)/games',
      params: urlParams,
    });
  };

  return (
    <UpdatePasswordContainer
      children={props.children}
      urlParams={urlParams}
      setNavigationOptions={setOptions}
      onNavigateToHome={onNavigateToHome}
    />
  );
}

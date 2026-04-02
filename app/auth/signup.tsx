/**
 * AUTO-GENERATED - DO NOT MODIFY!
 * Any changes will be lost when the file is regenerated.
 */

import { type PropsWithChildren, type ReactNode } from 'react';
import { type UnknownOutputParams } from 'expo-router';

import { useNav } from '@/comp-lib/navigation/useNav';
import { type OnboardingGamePreferencesUrlParams } from '@/app/onboarding/game-preferences';
import { type AuthLoginUrlParams } from '@/app/auth/login';
import SignupContainer from '@/app-pages/auth/SignupContainer';

export type AuthSignupUrlParams = UnknownOutputParams;

export interface SignupProps extends PropsWithChildren {
  /**
   * The page's URL params. Includes path and query params.
   */
  urlParams: AuthSignupUrlParams;
  /**
   * Sets the navigation options using navigation.setOptions()
   * @param options The options to set
   * @returns void
   */
  setNavigationOptions: (options?: Record<string, any>) => void;

  /**
   * Executes after successful signup to start onboarding
   */
  onNavigateToOnboarding: (urlParams?: OnboardingGamePreferencesUrlParams) => void;
  /**
   * Executes when user already has an account
   */
  onNavigateToLogin: (urlParams?: AuthLoginUrlParams) => void;
}

/**
 * User registration page
 */
export default function SignupPage(props: SignupProps): ReactNode {
  const { urlParams, setOptions, navigate } = useNav<AuthSignupUrlParams>({ auth: false });
  /**
   * Executes after successful signup to start onboarding
   */
  const onNavigateToOnboarding = (urlParams?: OnboardingGamePreferencesUrlParams) => {
    navigate({
      pathname: '/onboarding/game-preferences',
      params: urlParams,
    });
  };
  /**
   * Executes when user already has an account
   */
  const onNavigateToLogin = (urlParams?: AuthLoginUrlParams) => {
    navigate({
      pathname: '/auth/login',
      params: urlParams,
    });
  };

  return (
    <SignupContainer
      children={props.children}
      urlParams={urlParams}
      setNavigationOptions={setOptions}
      onNavigateToOnboarding={onNavigateToOnboarding}
      onNavigateToLogin={onNavigateToLogin}
    />
  );
}

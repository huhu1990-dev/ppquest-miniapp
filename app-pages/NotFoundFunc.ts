/**
 * Business logic for the NotFound route
 */
import { useState } from 'react';

import { NotFoundProps } from '@/app/+not-found';
import { t } from '@/i18n';

/**
 * Interface for the return value of the useNotFound hook
 */
export interface NotFoundFunc {
  /**
   * Loading state for async operations
   */
  isLoading: boolean;

  /**
   * Error state for async operations
   */
  error?: Error;

  /**
   * The 404 error code display string
   */
  errorCode: string;

  /**
   * The page title text
   */
  title: string;

  /**
   * The descriptive message text
   */
  description: string;

  /**
   * The brand name for display
   */
  brandName: string;

  /**
   * The button label for navigating back to games
   */
  backToGamesLabel: string;

  /**
   * Handler to navigate back to the games page
   */
  onGoToGames: () => void;
}

/**
 * Custom hook that provides business logic for the NotFound component
 */
export function useNotFound(props: NotFoundProps): NotFoundFunc {
  const [isLoading] = useState(false);
  const [error] = useState<Error | undefined>(undefined);

  const errorCode = t('notFound.errorCode');
  const title = t('notFound.title');
  const description = t('notFound.description');
  const brandName = t('app.name');
  const backToGamesLabel = t('notFound.backToGames');

  function onGoToGames(): void {
    props.onNavigateToHome();
  }

  return {
    isLoading,
    error,
    errorCode,
    title,
    description,
    brandName,
    backToGamesLabel,
    onGoToGames,
  };
}

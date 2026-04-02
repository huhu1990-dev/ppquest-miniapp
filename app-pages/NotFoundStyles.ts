import { ViewStyle, TextStyle } from 'react-native';

import { useStyleContext } from '@/comp-lib/styles/StyleContext';
import { CustomButtonStyles } from '@/comp-lib/core/custom-button/CustomButtonStyles';

/**
 * Interface for base styles of the useNotFoundStyles hook
 */
export interface NotFoundBaseStyles {
  safeArea: ViewStyle;
  container: ViewStyle;
  iconContainer: ViewStyle;
  iconCircle: ViewStyle;
  brandText: TextStyle;
  errorCode: TextStyle;
  title: TextStyle;
  description: TextStyle;
  buttonContainer: ViewStyle;
}

/**
 * Interface for the return value of the useNotFoundStyles hook
 */
export interface NotFoundStyles {
  styles: NotFoundBaseStyles;
  primaryButtonStyles: CustomButtonStyles;
  iconSize: number;
  iconColor: string;
}

/**
 * Custom hook that provides styles for the NotFound component
 */
export function useNotFoundStyles(): NotFoundStyles {
  const {
    createAppPageStyles,
    colors,
    typographyPresets,
    buttonPresets,
    spacingPresets,
    overrideStyles,
    borderRadiusPresets,
  } = useStyleContext();

  const ICON_CIRCLE_SIZE = 96;
  const ICON_SIZE = 44;

  const styles: NotFoundBaseStyles = {
    safeArea: {
      flex: 1,
      backgroundColor: colors.primaryBackground,
    },
    container: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacingPresets.lg1,
    },
    iconContainer: {
      width: ICON_CIRCLE_SIZE,
      height: ICON_CIRCLE_SIZE,
      marginBottom: spacingPresets.lg1,
    },
    iconCircle: {
      width: ICON_CIRCLE_SIZE,
      height: ICON_CIRCLE_SIZE,
      borderRadius: ICON_CIRCLE_SIZE / 2,
      backgroundColor: colors.primaryAccentLight,
      justifyContent: 'center',
      alignItems: 'center',
      opacity: 0.15,
      position: 'absolute',
    },
    brandText: {
      ...typographyPresets.Label,
      color: colors.primaryAccentDark,
      letterSpacing: 2,
      textTransform: 'uppercase',
      marginBottom: spacingPresets.sm,
    },
    errorCode: {
      ...typographyPresets.Slogan,
      fontSize: 72,
      lineHeight: 80,
      color: colors.primaryAccentDark,
      marginBottom: spacingPresets.sm,
    },
    title: {
      ...typographyPresets.PageTitle,
      color: colors.primaryForeground,
      textAlign: 'center',
      marginBottom: spacingPresets.sm,
    },
    description: {
      ...typographyPresets.Body,
      color: colors.secondaryForeground,
      textAlign: 'center',
      marginBottom: spacingPresets.lg2,
      paddingHorizontal: spacingPresets.md2,
    },
    buttonContainer: {
      width: '100%',
      paddingHorizontal: spacingPresets.lg2,
    },
  };

  const primaryButtonStyles = overrideStyles(buttonPresets.Primary, {
    container: {
      borderRadius: borderRadiusPresets.inputElements,
      width: '100%',
    },
  });

  const iconColor = colors.primaryAccentDark;

  return createAppPageStyles<NotFoundStyles>({
    styles,
    primaryButtonStyles,
    iconSize: ICON_SIZE,
    iconColor,
  });
}

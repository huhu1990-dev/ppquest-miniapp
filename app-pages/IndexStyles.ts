import { type ColorValue, type ViewStyle, type TextStyle } from 'react-native';

import { useStyleContext } from '@/comp-lib/styles/StyleContext';
import { type CustomButtonStyles } from '@/comp-lib/core/custom-button/CustomButtonStyles';

export interface FeatureRowStyles {
  container: ViewStyle;
  iconContainer: ViewStyle;
  iconSize: number;
  iconColor: string;
  textContainer: ViewStyle;
  title: TextStyle;
  description: TextStyle;
}

export interface IndexBaseStyles {
  safeArea: ViewStyle;
  scrollContent: ViewStyle;
  heroSection: ViewStyle;
  heroGradientColors: readonly [ColorValue, ColorValue, ...ColorValue[]];
  heroGradientLocations: readonly [number, number, ...number[]];
  logoContainer: ViewStyle;
  logoIconColor: string;
  logoIconSize: number;
  appName: TextStyle;
  tagline: TextStyle;
  subtitle: TextStyle;
  featuresSection: ViewStyle;
  featuresSectionTitle: TextStyle;
  ctaSection: ViewStyle;
  ctaDividerText: TextStyle;
}

export interface IndexStyles {
  styles: IndexBaseStyles;
  featureRowStyles: FeatureRowStyles;
  loginButtonStyles: CustomButtonStyles;
  signupButtonStyles: CustomButtonStyles;
}

export function useIndexStyles(): IndexStyles {
  const {
    createAppPageStyles,
    colors,
    typographyPresets,
    buttonPresets,
    spacingPresets,
    overrideStyles,
    borderRadiusPresets,
  } = useStyleContext();

  const styles: IndexBaseStyles = {
    safeArea: {
      flex: 1,
      backgroundColor: colors.primaryBackground,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'space-between',
    },
    heroSection: {
      alignItems: 'center',
      paddingTop: spacingPresets.xl,
      paddingBottom: spacingPresets.lg2,
      paddingHorizontal: spacingPresets.lg1,
      borderBottomLeftRadius: borderRadiusPresets.components * 2,
      borderBottomRightRadius: borderRadiusPresets.components * 2,
    },
    heroGradientColors: [colors.primaryAccent, colors.primaryAccentDark] as const,
    heroGradientLocations: [0, 1] as const,
    logoContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacingPresets.md2,
    },
    logoIconColor: colors.primaryAccentForeground,
    logoIconSize: 40,
    appName: {
      ...typographyPresets.Slogan,
      color: colors.primaryAccentForeground,
      textAlign: 'center',
      marginBottom: spacingPresets.sm,
    },
    tagline: {
      ...typographyPresets.Body,
      color: 'rgba(255, 255, 255, 0.85)',
      textAlign: 'center',
    },
    subtitle: {
      ...typographyPresets.Caption,
      color: 'rgba(255, 255, 255, 0.65)',
      textAlign: 'center',
      marginTop: spacingPresets.sm,
    },
    featuresSection: {
      paddingHorizontal: spacingPresets.lg1,
      paddingTop: spacingPresets.lg1,
      paddingBottom: spacingPresets.md2,
      gap: spacingPresets.md2,
    },
    featuresSectionTitle: {
      ...typographyPresets.Title,
      color: colors.primaryForeground,
      marginBottom: spacingPresets.xs,
    },
    ctaSection: {
      paddingHorizontal: spacingPresets.lg1,
      paddingBottom: spacingPresets.lg1,
      gap: spacingPresets.md1,
      alignItems: 'center',
    },
    ctaDividerText: {
      ...typographyPresets.Caption,
      color: colors.tertiaryForeground,
    },
  };

  const FEATURE_ICON_CONTAINER_SIZE = 44;
  const FEATURE_ICON_SIZE = 22;

  const featureRowStyles: FeatureRowStyles = {
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.secondaryBackground,
      borderRadius: borderRadiusPresets.components,
      padding: spacingPresets.md2,
      gap: spacingPresets.md1,
      borderWidth: 1,
      borderColor: colors.tertiaryBackground,
    },
    iconContainer: {
      width: FEATURE_ICON_CONTAINER_SIZE,
      height: FEATURE_ICON_CONTAINER_SIZE,
      borderRadius: FEATURE_ICON_CONTAINER_SIZE / 2,
      backgroundColor: colors.primaryAccentLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconSize: FEATURE_ICON_SIZE,
    iconColor: colors.primaryAccentDark,
    textContainer: {
      flex: 1,
    },
    title: {
      ...typographyPresets.Label,
      color: colors.primaryForeground,
      marginBottom: spacingPresets.xxs,
    },
    description: {
      ...typographyPresets.Caption,
      color: colors.tertiaryForeground,
    },
  };

  const loginButtonStyles = overrideStyles(buttonPresets.Primary, {
    container: {
      width: '100%',
    },
  });

  const signupButtonStyles = overrideStyles(buttonPresets.Secondary, {
    container: {
      width: '100%',
    },
  });

  return createAppPageStyles<IndexStyles>({
    styles,
    featureRowStyles,
    loginButtonStyles,
    signupButtonStyles,
  });
}

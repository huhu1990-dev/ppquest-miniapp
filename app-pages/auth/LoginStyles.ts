/**
 * Login styles that handle user login styles
 */
import { type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthBaseStyles, LoginCoreStyles } from '@/comp-lib/auth/LoginCoreStyles';
import { CustomButtonStyles } from '@/comp-lib/core/custom-button/CustomButtonStyles';
import { CustomTextInputStyles } from '@/comp-lib/core/custom-text-input/CustomTextInputStyles';
import { useStyleContext } from '@/comp-lib/styles/StyleContext';

export interface LoginStyles {
  /**
   * Shared auth styles used across Login, Signup, and Reset Password screens
   */
  sharedAuthStyles: AuthBaseStyles;
  sharedTextInputStyles: CustomTextInputStyles;
  sharedPrimaryButtonStyles: CustomButtonStyles;
  sharedTertiaryButtonStyles: CustomButtonStyles;
  loginCoreStyles: LoginCoreStyles;
  styles: {
    container: ViewStyle;
    telegramButtonWrapper: ViewStyle;
  };
}

const ICON_WRAPPER_SIZE = 72;
const ICON_SIZE = 34;

export function useLoginStyles(): LoginStyles {
  const insets = useSafeAreaInsets();
  const {
    createAppPageStyles,
    colors,
    typographyPresets,
    textInputPresets,
    spacingPresets,
    buttonPresets,
    borderRadiusPresets,
    overrideStyles,
  } = useStyleContext();

  const authBaseStyles: AuthBaseStyles = {
    safeArea: {
      flex: 1,
      backgroundColor: colors.primaryBackground,
    },
    container: {
      flex: 1,
      paddingHorizontal: spacingPresets.lg1,
      backgroundColor: colors.primaryBackground,
    },
    subContainer: {
      flexGrow: 1,
      gap: spacingPresets.sm,
    },
    topSection: {
      flex: 1,
      // NOTE: adjust "topSection" top padding if needed to make space for the content
      paddingTop: spacingPresets.lg2,
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacingPresets.xs,
    },
    iconWrapper: {
      width: ICON_WRAPPER_SIZE,
      height: ICON_WRAPPER_SIZE,
      borderRadius: ICON_WRAPPER_SIZE / 2,
      backgroundColor: colors.primaryAccentLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacingPresets.md2,
    },
    icon: {
      size: ICON_SIZE,
      color: colors.primaryAccentDark,
    },
    appName: {
      ...typographyPresets.Slogan,
      color: colors.primaryAccent,
      marginBottom: spacingPresets.xs,
    },
    title: {
      ...typographyPresets.PageTitle,
      color: colors.primaryForeground,
      textAlign: 'center',
    },
    subTitle: {
      ...typographyPresets.Body,
      color: colors.secondaryForeground,
      textAlign: 'center',
      marginTop: spacingPresets.xs,
    },
    middleSection: {
      flex: 1.5,
      alignSelf: 'stretch',
      justifyContent: 'center',
      gap: spacingPresets.md1,
    },
    bottomSection: {
      justifyContent: 'flex-start',
      gap: spacingPresets.sm,
      paddingBottom: spacingPresets.lg1,
    },
    bottomSectionKeyboard: {
      flexGrow: 0,
      flexShrink: 0,
      marginBottom: spacingPresets.md2,
    },
  };

  const textInputStyles: CustomTextInputStyles = overrideStyles(textInputPresets.DefaultInput, {
    container: {
      backgroundColor: colors.secondaryBackground,
      borderRadius: borderRadiusPresets.inputElements,
    },
    label: {
      ...typographyPresets.Label,
      marginBottom: spacingPresets.xs,
    },
  });

  const primaryButtonStyles: CustomButtonStyles = overrideStyles(buttonPresets.Primary, {
    container: {
      alignSelf: 'stretch',
      height: 50,
      borderRadius: borderRadiusPresets.inputElements,
    },
  });

  const tertiaryButtonStyles: CustomButtonStyles = overrideStyles(buttonPresets.Tertiary, {
    container: {
      alignSelf: 'stretch',
    },
    text: {
      ...typographyPresets.Body,
      color: colors.primaryAccentDark,
      fontWeight: '600',
    },
  });

  const resetPasswordButtonStyles: CustomButtonStyles = overrideStyles(buttonPresets.Tertiary, {
    container: {
      alignSelf: 'stretch',
      marginTop: spacingPresets.xs,
    },
    text: {
      ...typographyPresets.Caption,
      color: colors.tertiaryForeground,
      textAlign: 'center',
    },
  });

  // Extra bottom padding in LoginCore's bottomSection to leave room for the Telegram button overlay
  const TELEGRAM_SECTION_HEIGHT = 96;
  const loginCoreAuthBaseStyles: AuthBaseStyles = {
    ...authBaseStyles,
    bottomSection: {
      ...authBaseStyles.bottomSection,
      paddingBottom: spacingPresets.lg1 + TELEGRAM_SECTION_HEIGHT,
    },
  };

  return {
    sharedAuthStyles: authBaseStyles,
    sharedTextInputStyles: textInputStyles,
    sharedPrimaryButtonStyles: primaryButtonStyles,
    sharedTertiaryButtonStyles: tertiaryButtonStyles,
    /**
     * NOTE: repeating styles in the loginCoreStyles because we need "createAppPageStyles" for the page styles for app responsive size/style changes
     */
    ...createAppPageStyles<
      Omit<
        LoginStyles,
        'sharedAuthStyles' | 'sharedTextInputStyles' | 'sharedPrimaryButtonStyles' | 'sharedTertiaryButtonStyles'
      >
    >({
      loginCoreStyles: {
        authBaseStyles: loginCoreAuthBaseStyles,
        textInputStyles,
        primaryButtonStyles,
        tertiaryButtonStyles,
        resetPasswordButtonStyles,
      },
      styles: {
        container: { flex: 1 },
        telegramButtonWrapper: {
          position: 'absolute',
          bottom: insets.bottom + spacingPresets.sm,
          left: spacingPresets.lg1,
          right: spacingPresets.lg1,
        },
      },
    }),
  };
}

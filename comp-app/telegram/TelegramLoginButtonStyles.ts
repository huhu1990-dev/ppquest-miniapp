import { type ViewStyle, type TextStyle } from 'react-native';
import { type CustomButtonStyles } from '@/comp-lib/core/custom-button/CustomButtonStyles';
import { useStyleContext } from '@/comp-lib/styles/StyleContext';

export interface TelegramLoginButtonStyles {
  container: ViewStyle;
  dividerRow: ViewStyle;
  dividerLine: ViewStyle;
  dividerText: TextStyle;
  nativeButton: CustomButtonStyles;
  widgetContainer: ViewStyle;
}

const TELEGRAM_BLUE = '#2AABEE';
const TELEGRAM_BLUE_DARK = '#1D96D9';

export function useTelegramLoginButtonStyles(): TelegramLoginButtonStyles {
  const { spacingPresets, typographyPresets, colors, borderRadiusPresets, overrideStyles, buttonPresets } =
    useStyleContext();

  return {
    container: {
      alignSelf: 'stretch',
      alignItems: 'center',
      gap: spacingPresets.sm,
    },
    dividerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'stretch',
      gap: spacingPresets.sm,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: (colors as any).secondaryBorder,
    },
    dividerText: {
      ...typographyPresets.Caption,
      color: colors.tertiaryForeground,
    },
    nativeButton: overrideStyles(buttonPresets.Secondary, {
      container: {
        alignSelf: 'stretch',
        height: 50,
        borderRadius: borderRadiusPresets.inputElements,
        backgroundColor: TELEGRAM_BLUE,
        borderColor: TELEGRAM_BLUE_DARK,
      },
      text: {
        ...typographyPresets.Button,
        color: '#ffffff',
      },
      icon: {
        color: '#ffffff',
      },
    }),
    widgetContainer: {
      alignSelf: 'stretch',
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
    },
  };
}

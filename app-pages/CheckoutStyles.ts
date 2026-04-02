/**
 * Styling for the Checkout page
 */
import { ImageStyle, ViewStyle, TextStyle } from 'react-native';

import { useStyleContext } from '@/comp-lib/styles/StyleContext';
import { CustomButtonStyles } from '@/comp-lib/core/custom-button/CustomButtonStyles';
import { CustomTextInputStyles } from '@/comp-lib/core/custom-text-input/CustomTextInputStyles';
import { CustomHeaderStyles, useCustomHeaderStyles } from '@/comp-lib/custom-header/CustomHeaderStyles';

/** Styles for the order summary card */
export interface CheckoutOrderSummaryStyles {
  card: ViewStyle;
  gameRow: ViewStyle;
  gameIconContainer: ViewStyle;
  gameIcon: ImageStyle;
  iconPlaceholder: ViewStyle;
  iconPlaceholderText: TextStyle;
  gameInfoColumn: ViewStyle;
  gameName: TextStyle;
  packageName: TextStyle;
  divider: ViewStyle;
  detailRow: ViewStyle;
  detailLabel: TextStyle;
  detailValue: TextStyle;
}

/** Styles for a single payment method card */
export interface CheckoutPaymentMethodCardStyles {
  container: ViewStyle;
  containerSelected: ViewStyle;
  iconContainer: ViewStyle;
  textColumn: ViewStyle;
  label: TextStyle;
  description: TextStyle;
  radioOuter: ViewStyle;
  radioOuterSelected: ViewStyle;
  radioInner: ViewStyle;
}

/** Styles for the promo code section */
export interface CheckoutPromoCodeStyles {
  container: ViewStyle;
  inputRow: ViewStyle;
  validationText: TextStyle;
  validationTextError: TextStyle;
}

/** Styles for the terms summary */
export interface CheckoutTermsStyles {
  container: ViewStyle;
  title: TextStyle;
  body: TextStyle;
}

/** Styles for the bottom pay bar */
export interface CheckoutBottomBarStyles {
  container: ViewStyle;
  priceBreakdown: ViewStyle;
  priceRow: ViewStyle;
  priceLabel: TextStyle;
  priceValue: TextStyle;
  totalRow: ViewStyle;
  totalLabel: TextStyle;
  totalValue: TextStyle;
  discountValue: TextStyle;
}

/** Styles for the error banner */
export interface CheckoutErrorStyles {
  container: ViewStyle;
  text: TextStyle;
}

/** Styles for the processing overlay */
export interface CheckoutProcessingStyles {
  overlay: ViewStyle;
  content: ViewStyle;
  text: TextStyle;
}

/**
 * Interface for base styles of the useCheckoutStyles hook
 */
export interface CheckoutBaseStyles {
  safeArea: ViewStyle;
  container: ViewStyle;
  scrollView: ViewStyle;
  scrollContent: ViewStyle;
  sectionTitle: TextStyle;
  sectionContainer: ViewStyle;
}

/**
 * Interface for the return value of the useCheckoutStyles hook
 */
export interface CheckoutStyles {
  styles: CheckoutBaseStyles;
  headerStyles: CustomHeaderStyles;
  orderSummaryStyles: CheckoutOrderSummaryStyles;
  paymentMethodCardStyles: CheckoutPaymentMethodCardStyles;
  paymentInputStyles: CustomTextInputStyles;
  promoCodeStyles: CheckoutPromoCodeStyles;
  promoInputStyles: CustomTextInputStyles;
  applyButtonStyles: CustomButtonStyles;
  termsStyles: CheckoutTermsStyles;
  bottomBarStyles: CheckoutBottomBarStyles;
  payButtonStyles: CustomButtonStyles;
  errorStyles: CheckoutErrorStyles;
  retryButtonStyles: CustomButtonStyles;
  processingStyles: CheckoutProcessingStyles;
}

const GAME_ICON_SIZE = 52;
const GAME_ICON_RADIUS = 14;
const RADIO_OUTER_SIZE = 22;
const RADIO_INNER_SIZE = 12;

/**
 * Custom hook that provides styles for the Checkout component
 */
export function useCheckoutStyles(): CheckoutStyles {
  const {
    createAppPageStyles,
    colors,
    typographyPresets,
    spacingPresets,
    buttonPresets,
    textInputPresets,
    borderRadiusPresets,
    overrideStyles,
  } = useStyleContext();
  const defaultHeaderStyles = useCustomHeaderStyles();

  const HORIZONTAL_PADDING = spacingPresets.md2;

  const styles: CheckoutBaseStyles = {
    safeArea: {
      flex: 1,
      backgroundColor: colors.primaryBackground,
    },
    container: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: spacingPresets.xl,
    },
    sectionTitle: {
      ...typographyPresets.Label,
      color: colors.primaryForeground,
      fontSize: 15,
      lineHeight: 20,
      fontWeight: '700',
      marginBottom: spacingPresets.md1,
    },
    sectionContainer: {
      paddingHorizontal: HORIZONTAL_PADDING,
      marginTop: spacingPresets.lg1,
    },
  };

  const headerStyles: CustomHeaderStyles = overrideStyles(defaultHeaderStyles, {
    container: {
      paddingHorizontal: HORIZONTAL_PADDING,
      backgroundColor: colors.primaryBackground,
    },
    title: {
      ...typographyPresets.Title,
      color: colors.primaryForeground,
      fontWeight: '700',
      fontSize: 17,
      lineHeight: 22,
    },
  });

  const orderSummaryStyles: CheckoutOrderSummaryStyles = {
    card: {
      backgroundColor: colors.secondaryBackground,
      borderRadius: borderRadiusPresets.components,
      padding: spacingPresets.md2,
      borderWidth: 1,
      borderColor: colors.tertiaryBackground,
    },
    gameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacingPresets.md1,
    },
    gameIconContainer: {
      width: GAME_ICON_SIZE,
      height: GAME_ICON_SIZE,
      borderRadius: GAME_ICON_RADIUS,
      overflow: 'hidden',
      backgroundColor: colors.tertiaryBackground,
    },
    gameIcon: {
      width: GAME_ICON_SIZE,
      height: GAME_ICON_SIZE,
    },
    iconPlaceholder: {
      width: GAME_ICON_SIZE,
      height: GAME_ICON_SIZE,
      borderRadius: GAME_ICON_RADIUS,
      backgroundColor: colors.primaryAccentDark,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconPlaceholderText: {
      ...typographyPresets.Title,
      color: colors.primaryAccentForeground,
      fontSize: 20,
      lineHeight: 24,
      fontWeight: '700',
    },
    gameInfoColumn: {
      flex: 1,
      gap: spacingPresets.xxs,
    },
    gameName: {
      ...typographyPresets.Title,
      color: colors.primaryForeground,
      fontSize: 16,
      lineHeight: 22,
      fontWeight: '700',
    },
    packageName: {
      ...typographyPresets.Body,
      color: colors.secondaryForeground,
      fontSize: 14,
      lineHeight: 18,
    },
    divider: {
      height: 1,
      backgroundColor: colors.tertiaryBackground,
      marginVertical: spacingPresets.md1,
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: spacingPresets.xs,
    },
    detailLabel: {
      ...typographyPresets.Caption,
      color: colors.tertiaryForeground,
      fontSize: 13,
      lineHeight: 17,
    },
    detailValue: {
      ...typographyPresets.Body,
      color: colors.primaryForeground,
      fontSize: 13,
      lineHeight: 17,
      fontWeight: '500',
    },
  };

  const paymentMethodCardStyles: CheckoutPaymentMethodCardStyles = {
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.secondaryBackground,
      borderRadius: borderRadiusPresets.components,
      padding: spacingPresets.md2,
      borderWidth: 1.5,
      borderColor: colors.tertiaryBackground,
      gap: spacingPresets.md1,
      marginBottom: spacingPresets.sm,
    },
    containerSelected: {
      borderColor: colors.primaryAccentDark,
      borderWidth: 2,
    },
    iconContainer: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: colors.tertiaryBackground,
      alignItems: 'center',
      justifyContent: 'center',
    },
    textColumn: {
      flex: 1,
      gap: spacingPresets.xxs,
    },
    label: {
      ...typographyPresets.Label,
      color: colors.primaryForeground,
      fontSize: 14,
      lineHeight: 18,
      fontWeight: '600',
    },
    description: {
      ...typographyPresets.Caption,
      color: colors.tertiaryForeground,
      fontSize: 12,
      lineHeight: 16,
    },
    radioOuter: {
      width: RADIO_OUTER_SIZE,
      height: RADIO_OUTER_SIZE,
      borderRadius: RADIO_OUTER_SIZE / 2,
      borderWidth: 2,
      borderColor: colors.tertiaryForeground,
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioOuterSelected: {
      borderColor: colors.primaryAccentDark,
    },
    radioInner: {
      width: RADIO_INNER_SIZE,
      height: RADIO_INNER_SIZE,
      borderRadius: RADIO_INNER_SIZE / 2,
      backgroundColor: colors.primaryAccentDark,
    },
  };

  const paymentInputStyles: CustomTextInputStyles = overrideStyles(textInputPresets.DefaultInput, {});

  const promoCodeStyles: CheckoutPromoCodeStyles = {
    container: {
      gap: spacingPresets.sm,
    },
    inputRow: {
      flexDirection: 'row',
      gap: spacingPresets.sm,
      alignItems: 'flex-start',
    },
    validationText: {
      ...typographyPresets.Caption,
      color: colors.customColors.success,
      fontSize: 12,
      lineHeight: 16,
    },
    validationTextError: {
      color: colors.customColors.error,
    },
  };

  const promoInputStyles: CustomTextInputStyles = overrideStyles(textInputPresets.DefaultInput, {
    container: {
      borderRadius: borderRadiusPresets.inputElements,
      backgroundColor: colors.secondaryBackground,
      borderWidth: 1,
      borderColor: colors.tertiaryBackground,
      height: 44,
    },
    input: {
      ...typographyPresets.Body,
      color: colors.primaryForeground,
      fontSize: 14,
      lineHeight: 18,
    },
    placeholderTextColor: colors.tertiaryForeground,
  });

  const applyButtonStyles: CustomButtonStyles = overrideStyles(buttonPresets.Secondary, {
    container: {
      paddingHorizontal: spacingPresets.md2,
      paddingVertical: spacingPresets.sm,
      borderRadius: borderRadiusPresets.inputElements,
      height: 44,
    },
  });

  const termsStyles: CheckoutTermsStyles = {
    container: {
      backgroundColor: colors.tertiaryBackground,
      borderRadius: borderRadiusPresets.components,
      padding: spacingPresets.md2,
    },
    title: {
      ...typographyPresets.Label,
      color: colors.primaryForeground,
      fontSize: 13,
      lineHeight: 17,
      fontWeight: '600',
      marginBottom: spacingPresets.xs,
    },
    body: {
      ...typographyPresets.Caption,
      color: colors.tertiaryForeground,
      fontSize: 12,
      lineHeight: 18,
    },
  };

  const bottomBarStyles: CheckoutBottomBarStyles = {
    container: {
      paddingHorizontal: HORIZONTAL_PADDING,
      paddingTop: spacingPresets.md1,
      paddingBottom: spacingPresets.md2,
      backgroundColor: colors.secondaryBackground,
      borderTopWidth: 1,
      borderTopColor: colors.tertiaryBackground,
    },
    priceBreakdown: {
      gap: spacingPresets.xs,
      marginBottom: spacingPresets.md1,
    },
    priceRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    priceLabel: {
      ...typographyPresets.Caption,
      color: colors.tertiaryForeground,
      fontSize: 13,
      lineHeight: 17,
    },
    priceValue: {
      ...typographyPresets.Body,
      color: colors.primaryForeground,
      fontSize: 13,
      lineHeight: 17,
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: spacingPresets.sm,
      borderTopWidth: 1,
      borderTopColor: colors.tertiaryBackground,
    },
    totalLabel: {
      ...typographyPresets.Title,
      color: colors.primaryForeground,
      fontSize: 16,
      lineHeight: 22,
      fontWeight: '700',
    },
    totalValue: {
      ...typographyPresets.Title,
      color: colors.primaryAccentDark,
      fontSize: 20,
      lineHeight: 26,
      fontWeight: '800',
    },
    discountValue: {
      ...typographyPresets.Body,
      color: colors.customColors.success,
      fontSize: 13,
      lineHeight: 17,
      fontWeight: '600',
    },
  };

  const payButtonStyles: CustomButtonStyles = overrideStyles(buttonPresets.Primary, {
    container: {
      borderRadius: borderRadiusPresets.components,
      paddingVertical: spacingPresets.md1,
    },
  });

  const errorStyles: CheckoutErrorStyles = {
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.customColors.error,
      borderRadius: borderRadiusPresets.inputElements,
      paddingHorizontal: spacingPresets.md2,
      paddingVertical: spacingPresets.md1,
      gap: spacingPresets.sm,
    },
    text: {
      ...typographyPresets.Caption,
      color: '#FFFFFF',
      fontSize: 13,
      lineHeight: 17,
      flex: 1,
    },
  };

  const retryButtonStyles: CustomButtonStyles = overrideStyles(buttonPresets.Secondary, {
    container: {
      paddingHorizontal: spacingPresets.md1,
      paddingVertical: spacingPresets.xs,
      borderRadius: spacingPresets.sm,
      borderColor: '#FFFFFF',
    },
    text: {
      color: '#FFFFFF',
      fontSize: 12,
      lineHeight: 16,
    },
  });

  const processingStyles: CheckoutProcessingStyles = {
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10,
    },
    content: {
      backgroundColor: colors.secondaryBackground,
      borderRadius: borderRadiusPresets.components,
      padding: spacingPresets.lg1,
      alignItems: 'center',
      gap: spacingPresets.md1,
    },
    text: {
      ...typographyPresets.Body,
      color: colors.primaryForeground,
      fontSize: 14,
      lineHeight: 18,
    },
  };

  return createAppPageStyles<CheckoutStyles>({
    styles,
    headerStyles,
    orderSummaryStyles,
    paymentMethodCardStyles,
    paymentInputStyles,
    promoCodeStyles,
    promoInputStyles,
    applyButtonStyles,
    termsStyles,
    bottomBarStyles,
    payButtonStyles,
    errorStyles,
    retryButtonStyles,
    processingStyles,
  });
}

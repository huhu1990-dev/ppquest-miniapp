/**
 * Styling for the OrdersOrderId page
 */
import { ImageStyle, ViewStyle, TextStyle } from 'react-native';

import { useStyleContext } from '@/comp-lib/styles/StyleContext';
import { CustomButtonStyles } from '@/comp-lib/core/custom-button/CustomButtonStyles';
import { CustomHeaderStyles, useCustomHeaderStyles } from '@/comp-lib/custom-header/CustomHeaderStyles';

const GAME_ICON_SIZE = 48;
const GAME_ICON_RADIUS = 12;
const TIMELINE_DOT_SIZE = 14;
const TIMELINE_DOT_RADIUS = 7;
const DELIVERY_ICON_SIZE = 36;
const DELIVERY_ICON_RADIUS = 18;
const CHECK_ICON_SIZE = 20;
const ACTION_ICON_SIZE = 18;

/**
 * Interface for base styles of the useOrdersOrderIdStyles hook
 */
export interface OrdersOrderIdBaseStyles {
  safeArea: ViewStyle;
  container: ViewStyle;
  scrollContent: ViewStyle;
  loadingContainer: ViewStyle;
  errorContainer: ViewStyle;
  errorText: TextStyle;
  orderIdSection: ViewStyle;
  orderIdBadge: ViewStyle;
  orderIdText: TextStyle;
  placedOnText: TextStyle;
  sectionContainer: ViewStyle;
  sectionTitle: TextStyle;
  card: ViewStyle;
  cardDivider: ViewStyle;
  actionsContainer: ViewStyle;
}

/** Styles for the status timeline sub-component */
export interface TimelineStyles {
  container: ViewStyle;
  stepRow: ViewStyle;
  dotColumn: ViewStyle;
  dotCompleted: ViewStyle;
  dotActive: ViewStyle;
  dotFailed: ViewStyle;
  dotPending: ViewStyle;
  lineCompleted: ViewStyle;
  linePending: ViewStyle;
  lineFailed: ViewStyle;
  textColumn: ViewStyle;
  stepLabel: TextStyle;
  stepLabelActive: TextStyle;
  stepLabelFailed: TextStyle;
  stepTimestamp: TextStyle;
}

/** Styles for the game info card sub-component */
export interface GameInfoStyles {
  gameRow: ViewStyle;
  gameIconContainer: ViewStyle;
  gameIcon: ImageStyle;
  iconPlaceholder: ViewStyle;
  iconPlaceholderText: TextStyle;
  gameInfoColumn: ViewStyle;
  gameName: TextStyle;
  packageName: TextStyle;
  detailRow: ViewStyle;
  detailLabel: TextStyle;
  detailValue: TextStyle;
}

/** Styles for the payment details sub-component */
export interface PaymentDetailsStyles {
  detailRow: ViewStyle;
  detailLabel: TextStyle;
  detailValue: TextStyle;
  totalRow: ViewStyle;
  totalLabel: TextStyle;
  totalValue: TextStyle;
  discountValue: TextStyle;
}

/** Styles for the delivery confirmation sub-component */
export interface DeliveryConfirmationStyles {
  container: ViewStyle;
  iconContainer: ViewStyle;
  checkIconWrapper: ViewStyle;
  textColumn: ViewStyle;
  label: TextStyle;
  value: TextStyle;
}

/** Styles for action button icon wrappers */
export interface ActionIconStyles {
  iconWrapper: ViewStyle;
}

/**
 * Interface for the return value of the useOrdersOrderIdStyles hook
 */
export interface OrdersOrderIdStyles {
  styles: OrdersOrderIdBaseStyles;
  headerStyles: CustomHeaderStyles;
  timelineStyles: TimelineStyles;
  gameInfoStyles: GameInfoStyles;
  paymentDetailsStyles: PaymentDetailsStyles;
  deliveryConfirmationStyles: DeliveryConfirmationStyles;
  actionIconStyles: ActionIconStyles;
  primaryButtonStyles: CustomButtonStyles;
  secondaryButtonStyles: CustomButtonStyles;
  tertiaryButtonStyles: CustomButtonStyles;
  retryButtonStyles: CustomButtonStyles;
}

/**
 * Custom hook that provides styles for the OrdersOrderId component
 */
export function useOrdersOrderIdStyles(): OrdersOrderIdStyles {
  const {
    createAppPageStyles,
    colors,
    typographyPresets,
    spacingPresets,
    buttonPresets,
    borderRadiusPresets,
    overrideStyles,
  } = useStyleContext();
  const defaultHeaderStyles = useCustomHeaderStyles();

  const HORIZONTAL_PADDING = spacingPresets.md2;

  const styles: OrdersOrderIdBaseStyles = {
    safeArea: {
      flex: 1,
      backgroundColor: colors.primaryBackground,
    },
    container: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: HORIZONTAL_PADDING,
      paddingBottom: spacingPresets.lg2,
    },
    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    errorContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: HORIZONTAL_PADDING,
      gap: spacingPresets.md2,
    },
    errorText: {
      ...typographyPresets.Body,
      color: colors.secondaryForeground,
      fontSize: 14,
      lineHeight: 20,
      textAlign: 'center',
    },
    orderIdSection: {
      alignItems: 'center',
      paddingTop: spacingPresets.md2,
      paddingBottom: spacingPresets.lg1,
      gap: spacingPresets.sm,
    },
    orderIdBadge: {
      backgroundColor: colors.tertiaryBackground,
      borderRadius: borderRadiusPresets.inputElements,
      paddingHorizontal: spacingPresets.md1,
      paddingVertical: spacingPresets.xs,
    },
    orderIdText: {
      ...typographyPresets.Label,
      color: colors.primaryAccentDark,
      fontSize: 13,
      lineHeight: 17,
      fontWeight: '700',
      letterSpacing: 1,
    },
    placedOnText: {
      ...typographyPresets.Caption,
      color: colors.tertiaryForeground,
      fontSize: 13,
      lineHeight: 17,
    },
    sectionContainer: {
      marginBottom: spacingPresets.md2,
    },
    sectionTitle: {
      ...typographyPresets.Label,
      color: colors.primaryForeground,
      fontSize: 15,
      lineHeight: 20,
      fontWeight: '700',
      marginBottom: spacingPresets.md1,
    },
    card: {
      backgroundColor: colors.secondaryBackground,
      borderRadius: borderRadiusPresets.components,
      padding: spacingPresets.md2,
      borderWidth: 1,
      borderColor: colors.tertiaryBackground,
    },
    cardDivider: {
      height: 1,
      backgroundColor: colors.tertiaryBackground,
      marginVertical: spacingPresets.md1,
    },
    actionsContainer: {
      gap: spacingPresets.md1,
      paddingHorizontal: HORIZONTAL_PADDING,
      paddingBottom: spacingPresets.md2,
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

  const timelineStyles: TimelineStyles = {
    container: {
      paddingVertical: spacingPresets.sm,
      paddingHorizontal: spacingPresets.xs,
    },
    stepRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      minHeight: 44,
    },
    dotColumn: {
      width: 28,
      alignItems: 'center',
    },
    dotCompleted: {
      width: TIMELINE_DOT_SIZE,
      height: TIMELINE_DOT_SIZE,
      borderRadius: TIMELINE_DOT_RADIUS,
      backgroundColor: colors.primaryAccentDark,
    },
    dotActive: {
      width: TIMELINE_DOT_SIZE,
      height: TIMELINE_DOT_SIZE,
      borderRadius: TIMELINE_DOT_RADIUS,
      backgroundColor: colors.customColors.warning,
    },
    dotFailed: {
      width: TIMELINE_DOT_SIZE,
      height: TIMELINE_DOT_SIZE,
      borderRadius: TIMELINE_DOT_RADIUS,
      backgroundColor: colors.customColors.error,
    },
    dotPending: {
      width: TIMELINE_DOT_SIZE,
      height: TIMELINE_DOT_SIZE,
      borderRadius: TIMELINE_DOT_RADIUS,
      borderWidth: 2,
      borderColor: colors.tertiaryBackground,
      backgroundColor: 'transparent',
    },
    lineCompleted: {
      width: 2,
      flex: 1,
      backgroundColor: colors.primaryAccentDark,
      marginVertical: spacingPresets.xxs,
    },
    linePending: {
      width: 2,
      flex: 1,
      backgroundColor: colors.tertiaryBackground,
      marginVertical: spacingPresets.xxs,
    },
    lineFailed: {
      width: 2,
      flex: 1,
      backgroundColor: colors.customColors.error,
      marginVertical: spacingPresets.xxs,
    },
    textColumn: {
      flex: 1,
      paddingLeft: spacingPresets.md1,
      paddingBottom: spacingPresets.md2,
    },
    stepLabel: {
      ...typographyPresets.Body,
      color: colors.primaryForeground,
      fontSize: 14,
      lineHeight: 18,
      fontWeight: '600',
    },
    stepLabelActive: {
      color: colors.customColors.warning,
    },
    stepLabelFailed: {
      color: colors.customColors.error,
    },
    stepTimestamp: {
      ...typographyPresets.Caption,
      color: colors.tertiaryForeground,
      fontSize: 12,
      lineHeight: 16,
      marginTop: spacingPresets.xxs,
    },
  };

  const gameInfoStyles: GameInfoStyles = {
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
      fontSize: 18,
      lineHeight: 22,
      fontWeight: '700',
    },
    gameInfoColumn: {
      flex: 1,
      gap: spacingPresets.xxs,
    },
    gameName: {
      ...typographyPresets.Title,
      color: colors.primaryForeground,
      fontSize: 15,
      lineHeight: 20,
      fontWeight: '700',
    },
    packageName: {
      ...typographyPresets.Body,
      color: colors.secondaryForeground,
      fontSize: 13,
      lineHeight: 17,
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
      flexShrink: 1,
      textAlign: 'right',
    },
  };

  const paymentDetailsStyles: PaymentDetailsStyles = {
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
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: spacingPresets.sm,
      borderTopWidth: 1,
      borderTopColor: colors.tertiaryBackground,
      marginTop: spacingPresets.xs,
    },
    totalLabel: {
      ...typographyPresets.Title,
      color: colors.primaryForeground,
      fontSize: 15,
      lineHeight: 20,
      fontWeight: '700',
    },
    totalValue: {
      ...typographyPresets.Title,
      color: colors.primaryAccentDark,
      fontSize: 18,
      lineHeight: 24,
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

  const deliveryConfirmationStyles: DeliveryConfirmationStyles = {
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacingPresets.md1,
      paddingVertical: spacingPresets.md1,
      paddingHorizontal: spacingPresets.md2,
      backgroundColor: colors.tertiaryBackground,
      borderRadius: borderRadiusPresets.components,
    },
    iconContainer: {
      width: DELIVERY_ICON_SIZE,
      height: DELIVERY_ICON_SIZE,
      borderRadius: DELIVERY_ICON_RADIUS,
      backgroundColor: colors.primaryAccentDark,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkIconWrapper: {
      width: CHECK_ICON_SIZE,
      height: CHECK_ICON_SIZE,
    },
    textColumn: {
      flex: 1,
      gap: spacingPresets.xxs,
    },
    label: {
      ...typographyPresets.Label,
      color: colors.primaryForeground,
      fontSize: 13,
      lineHeight: 17,
      fontWeight: '600',
    },
    value: {
      ...typographyPresets.Caption,
      color: colors.secondaryForeground,
      fontSize: 12,
      lineHeight: 16,
    },
  };

  const primaryButtonStyles: CustomButtonStyles = overrideStyles(buttonPresets.Primary, {
    container: {
      borderRadius: borderRadiusPresets.components,
      paddingVertical: spacingPresets.md1,
    },
  });

  const secondaryButtonStyles: CustomButtonStyles = overrideStyles(buttonPresets.Secondary, {
    container: {
      borderRadius: borderRadiusPresets.components,
      paddingVertical: spacingPresets.md1,
    },
  });

  const tertiaryButtonStyles: CustomButtonStyles = overrideStyles(buttonPresets.Tertiary, {
    container: {
      paddingVertical: spacingPresets.sm,
    },
  });

  const actionIconStyles: ActionIconStyles = {
    iconWrapper: {
      width: ACTION_ICON_SIZE,
      height: ACTION_ICON_SIZE,
    },
  };

  const retryButtonStyles: CustomButtonStyles = overrideStyles(buttonPresets.Primary, {
    container: {
      borderRadius: borderRadiusPresets.components,
      paddingVertical: spacingPresets.md1,
    },
  });

  return createAppPageStyles<OrdersOrderIdStyles>({
    styles,
    headerStyles,
    timelineStyles,
    gameInfoStyles,
    paymentDetailsStyles,
    deliveryConfirmationStyles,
    actionIconStyles,
    primaryButtonStyles,
    secondaryButtonStyles,
    tertiaryButtonStyles,
    retryButtonStyles,
  });
}

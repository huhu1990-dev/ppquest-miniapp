/**
 * Styling for the Orders page
 */
import { ImageStyle, ViewStyle, TextStyle } from 'react-native';

import { useStyleContext } from '@/comp-lib/styles/StyleContext';

/** Styles for the status filter pill chips */
export interface OrdersFilterPillStyles {
  scrollContainer: ViewStyle;
  contentContainer: ViewStyle;
  pill: ViewStyle;
  pillActive: ViewStyle;
  pillText: TextStyle;
  pillTextActive: TextStyle;
}

/** Styles for an order card */
export interface OrdersCardStyles {
  container: ViewStyle;
  topRow: ViewStyle;
  iconContainer: ViewStyle;
  gameIcon: ImageStyle;
  iconPlaceholder: ViewStyle;
  iconPlaceholderText: TextStyle;
  infoContainer: ViewStyle;
  gameName: TextStyle;
  packageName: TextStyle;
  dateText: TextStyle;
  bottomRow: ViewStyle;
  statusBadge: ViewStyle;
  statusBadgeProcessing: ViewStyle;
  statusBadgeCompleted: ViewStyle;
  statusBadgeFailed: ViewStyle;
  statusBadgeRefunded: ViewStyle;
  statusText: TextStyle;
  statusTextProcessing: TextStyle;
  statusTextCompleted: TextStyle;
  statusTextFailed: TextStyle;
  statusTextRefunded: TextStyle;
  amountText: TextStyle;
}

/** Styles for the empty state */
export interface OrdersEmptyStateStyles {
  container: ViewStyle;
  iconWrapper: ViewStyle;
  text: TextStyle;
  hintText: TextStyle;
}

/**
 * Interface for base styles of the useOrdersStyles hook
 */
export interface OrdersBaseStyles {
  safeArea: ViewStyle;
  container: ViewStyle;
  headerSection: ViewStyle;
  pageTitle: TextStyle;
  scrollView: ViewStyle;
  scrollContent: ViewStyle;
  loadingContainer: ViewStyle;
}

/**
 * Interface for the return value of the useOrdersStyles hook
 */
export interface OrdersStyles {
  styles: OrdersBaseStyles;
  filterPillStyles: OrdersFilterPillStyles;
  cardStyles: OrdersCardStyles;
  emptyStateStyles: OrdersEmptyStateStyles;
}

/**
 * Custom hook that provides styles for the Orders component
 */
export function useOrdersStyles(): OrdersStyles {
  const { createAppPageStyles, colors, typographyPresets, spacingPresets, borderRadiusPresets } =
    useStyleContext();

  const HORIZONTAL_PADDING = spacingPresets.md2;
  const ICON_SIZE = 44;
  const ICON_RADIUS = 12;

  const styles: OrdersBaseStyles = {
    safeArea: {
      flex: 1,
      backgroundColor: colors.primaryBackground,
    },
    container: {
      flex: 1,
    },
    headerSection: {
      paddingHorizontal: HORIZONTAL_PADDING,
      paddingTop: spacingPresets.md1,
      paddingBottom: spacingPresets.sm,
    },
    pageTitle: {
      ...typographyPresets.PageTitle,
      color: colors.primaryForeground,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: HORIZONTAL_PADDING,
      paddingBottom: spacingPresets.lg2,
      gap: spacingPresets.md1,
    },
    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacingPresets.xl,
    },
  };

  const filterPillStyles: OrdersFilterPillStyles = {
    scrollContainer: {
      flexGrow: 0,
      marginTop: spacingPresets.md1,
      marginBottom: spacingPresets.md1,
    },
    contentContainer: {
      paddingHorizontal: HORIZONTAL_PADDING,
      gap: spacingPresets.sm,
    },
    pill: {
      paddingHorizontal: spacingPresets.md2,
      paddingVertical: spacingPresets.sm,
      borderRadius: 20,
      backgroundColor: colors.tertiaryBackground,
      borderWidth: 1.5,
      borderColor: colors.tertiaryBackground,
    },
    pillActive: {
      backgroundColor: colors.primaryAccentDark,
      borderColor: colors.primaryAccentDark,
    },
    pillText: {
      ...typographyPresets.Label,
      color: colors.secondaryForeground,
      fontSize: 13,
      lineHeight: 17,
      fontWeight: '500',
    },
    pillTextActive: {
      color: colors.primaryAccentForeground,
      fontWeight: '600',
    },
  };

  const cardStyles: OrdersCardStyles = {
    container: {
      padding: spacingPresets.md2,
      borderRadius: borderRadiusPresets.components,
      backgroundColor: colors.secondaryBackground,
      borderWidth: 1,
      borderColor: colors.tertiaryBackground,
      gap: spacingPresets.md1,
    },
    topRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacingPresets.md1,
    },
    iconContainer: {
      width: ICON_SIZE,
      height: ICON_SIZE,
      borderRadius: ICON_RADIUS,
      overflow: 'hidden',
    },
    gameIcon: {
      width: ICON_SIZE,
      height: ICON_SIZE,
    },
    iconPlaceholder: {
      width: ICON_SIZE,
      height: ICON_SIZE,
      borderRadius: ICON_RADIUS,
      backgroundColor: colors.tertiaryBackground,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconPlaceholderText: {
      ...typographyPresets.Title,
      color: colors.primaryAccentDark,
      fontSize: 18,
      lineHeight: 22,
    },
    infoContainer: {
      flex: 1,
      gap: spacingPresets.xxs,
    },
    gameName: {
      ...typographyPresets.Label,
      color: colors.primaryForeground,
      fontSize: 14,
      lineHeight: 18,
      fontWeight: '600',
    },
    packageName: {
      ...typographyPresets.Caption,
      color: colors.secondaryForeground,
      fontSize: 12,
      lineHeight: 16,
    },
    dateText: {
      ...typographyPresets.Caption,
      color: colors.tertiaryForeground,
      fontSize: 11,
      lineHeight: 15,
    },
    bottomRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    statusBadge: {
      paddingHorizontal: spacingPresets.sm,
      paddingVertical: 3,
      borderRadius: 6,
    },
    statusBadgeProcessing: {
      backgroundColor: '#FFF3E0',
    },
    statusBadgeCompleted: {
      backgroundColor: '#E8F5E9',
    },
    statusBadgeFailed: {
      backgroundColor: '#FFEBEE',
    },
    statusBadgeRefunded: {
      backgroundColor: '#E3F2FD',
    },
    statusText: {
      fontSize: 11,
      lineHeight: 15,
      fontWeight: '600',
    },
    statusTextProcessing: {
      color: '#E65100',
    },
    statusTextCompleted: {
      color: '#1B5E20',
    },
    statusTextFailed: {
      color: '#B71C1C',
    },
    statusTextRefunded: {
      color: '#0D47A1',
    },
    amountText: {
      ...typographyPresets.Label,
      color: colors.primaryForeground,
      fontSize: 15,
      lineHeight: 19,
      fontWeight: '700',
    },
  };

  const emptyStateStyles: OrdersEmptyStateStyles = {
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacingPresets.xl,
      gap: spacingPresets.sm,
    },
    iconWrapper: {
      width: 44,
      height: 44,
    },
    text: {
      ...typographyPresets.Subtitle,
      color: colors.secondaryForeground,
      textAlign: 'center',
      fontWeight: '600',
    },
    hintText: {
      ...typographyPresets.Caption,
      color: colors.tertiaryForeground,
      textAlign: 'center',
    },
  };

  return createAppPageStyles<OrdersStyles>({ styles, filterPillStyles, cardStyles, emptyStateStyles });
}

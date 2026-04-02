/**
 * Styling for the Games page
 */
import { ImageStyle, ViewStyle, TextStyle } from 'react-native';

import { useStyleContext } from '@/comp-lib/styles/StyleContext';
import { CustomButtonStyles } from '@/comp-lib/core/custom-button/CustomButtonStyles';
import { CustomTextInputStyles } from '@/comp-lib/core/custom-text-input/CustomTextInputStyles';
import { useResponsiveDesign } from '@/comp-lib/styles/useResponsiveDesign';

const GRID_COLUMNS = 3;

/** Styles for the category filter pill chips */
export interface GamesCategoryPillStyles {
  scrollContainer: ViewStyle;
  contentContainer: ViewStyle;
  pill: ViewStyle;
  pillActive: ViewStyle;
  pillText: TextStyle;
  pillTextActive: TextStyle;
}

/** Styles for a game card in the grid */
export interface GamesGridCardStyles {
  container: ViewStyle;
  iconContainer: ViewStyle;
  gameIcon: ImageStyle;
  iconPlaceholder: ViewStyle;
  iconPlaceholderText: TextStyle;
  infoContainer: ViewStyle;
  gameName: TextStyle;
  priceText: TextStyle;
  badgeRow: ViewStyle;
  badge: ViewStyle;
  badgeText: TextStyle;
}

/** Styles for a favorite game card in the horizontal carousel */
export interface GamesFavoriteCardStyles {
  container: ViewStyle;
  iconContainer: ViewStyle;
  gameIcon: ImageStyle;
  iconPlaceholder: ViewStyle;
  iconPlaceholderText: TextStyle;
  gameName: TextStyle;
  priceText: TextStyle;
}

/** Styles for section headers */
export interface GamesSectionHeaderStyles {
  container: ViewStyle;
  title: TextStyle;
}

/** Styles for the empty state */
export interface GamesEmptyStateStyles {
  container: ViewStyle;
  iconWrapper: ViewStyle;
  text: TextStyle;
  hintText: TextStyle;
}

/** Styles for the favorites carousel section */
export interface GamesFavoriteSectionStyles {
  container: ViewStyle;
  headerContainer: ViewStyle;
  headerTitle: TextStyle;
  scrollContainer: ViewStyle;
  scrollContent: ViewStyle;
}

/**
 * Interface for base styles of the useGamesStyles hook
 */
export interface GamesBaseStyles {
  safeArea: ViewStyle;
  container: ViewStyle;
  headerSection: ViewStyle;
  pageTitle: TextStyle;
  scrollView: ViewStyle;
  scrollContent: ViewStyle;
  sectionContainer: ViewStyle;
  gridContainer: ViewStyle;
  loadingContainer: ViewStyle;
}

/**
 * Interface for the return value of the useGamesStyles hook
 */
export interface GamesStyles {
  styles: GamesBaseStyles;
  searchInputStyles: CustomTextInputStyles;
  categoryPillStyles: GamesCategoryPillStyles;
  gridCardStyles: GamesGridCardStyles;
  favoriteCardStyles: GamesFavoriteCardStyles;
  favoriteSectionStyles: GamesFavoriteSectionStyles;
  sectionHeaderStyles: GamesSectionHeaderStyles;
  emptyStateStyles: GamesEmptyStateStyles;
}

/**
 * Custom hook that provides styles for the Games component
 */
export function useGamesStyles(): GamesStyles {
  const {
    createAppPageStyles,
    colors,
    typographyPresets,
    spacingPresets,
    textInputPresets,
    borderRadiusPresets,
    overrideStyles,
  } = useStyleContext();
  const { dimensions } = useResponsiveDesign();

  const HORIZONTAL_PADDING = spacingPresets.md2;
  const GRID_GAP = spacingPresets.md1;
  const CARD_WIDTH = (dimensions.width - HORIZONTAL_PADDING * 2 - GRID_GAP * (GRID_COLUMNS - 1)) / GRID_COLUMNS;
  const GRID_ICON_SIZE = 80;
  const GRID_ICON_RADIUS = 14;
  const FAVORITE_CARD_WIDTH = 100;
  const FAVORITE_ICON_SIZE = 60;
  const FAVORITE_ICON_RADIUS = 16;

  const styles: GamesBaseStyles = {
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
      marginBottom: spacingPresets.md1,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: spacingPresets.lg2,
    },
    sectionContainer: {
      marginTop: spacingPresets.md2,
    },
    gridContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: HORIZONTAL_PADDING,
      gap: GRID_GAP,
    },
    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacingPresets.xl,
    },
  };

  const searchInputStyles: CustomTextInputStyles = overrideStyles(textInputPresets.DefaultInput, {
    container: {
      borderRadius: borderRadiusPresets.components,
      backgroundColor: colors.tertiaryBackground,
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
    iconLeftColor: colors.tertiaryForeground,
    iconLeftSize: 18,
    placeholderTextColor: colors.tertiaryForeground,
  });

  const categoryPillStyles: GamesCategoryPillStyles = {
    scrollContainer: {
      flexGrow: 0,
      marginTop: spacingPresets.md1,
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

  const gridCardStyles: GamesGridCardStyles = {
    container: {
      width: CARD_WIDTH,
      flexDirection: 'column',
      alignItems: 'center',
      padding: spacingPresets.md1,
      borderRadius: borderRadiusPresets.components,
      backgroundColor: colors.secondaryBackground,
      borderWidth: 1,
      borderColor: colors.tertiaryBackground,
      gap: spacingPresets.md1,
    },
    iconContainer: {
      width: '100%',
      aspectRatio: 1,
      borderRadius: GRID_ICON_RADIUS,
      overflow: 'hidden',
    },
    gameIcon: {
      width: '100%',
      height: '100%',
    },
    iconPlaceholder: {
      width: '100%',
      aspectRatio: 1,
      borderRadius: GRID_ICON_RADIUS,
      backgroundColor: colors.tertiaryBackground,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconPlaceholderText: {
      ...typographyPresets.Title,
      color: colors.primaryAccentDark,
      fontSize: 20,
      lineHeight: 24,
    },
    infoContainer: {
      alignItems: 'center',
      paddingTop: 6,
      paddingBottom: 4,
      width: '100%',
    },
    gameName: {
      ...typographyPresets.Label,
      color: colors.primaryForeground,
      fontSize: 13,
      lineHeight: 17,
      fontWeight: '600',
      textAlign: 'center',
    },
    priceText: {
      ...typographyPresets.Caption,
      color: colors.primaryAccentDark,
      fontSize: 11,
      lineHeight: 15,
      fontWeight: '600',
    },
    badgeRow: {
      flexDirection: 'row',
      gap: spacingPresets.xxs,
      marginTop: spacingPresets.xxs,
    },
    badge: {
      paddingHorizontal: spacingPresets.xs,
      paddingVertical: 1,
      borderRadius: 4,
      backgroundColor: colors.tertiaryBackground,
    },
    badgeText: {
      fontSize: 9,
      lineHeight: 12,
      fontWeight: '600',
      color: colors.primaryAccentDark,
    },
  };

  const favoriteCardStyles: GamesFavoriteCardStyles = {
    container: {
      width: FAVORITE_CARD_WIDTH,
      alignItems: 'center',
      paddingVertical: spacingPresets.md1,
      paddingHorizontal: spacingPresets.xs,
      borderRadius: borderRadiusPresets.components,
      backgroundColor: colors.secondaryBackground,
      borderWidth: 1,
      borderColor: colors.tertiaryBackground,
      gap: spacingPresets.sm,
    },
    iconContainer: {
      width: FAVORITE_ICON_SIZE,
      height: FAVORITE_ICON_SIZE,
      borderRadius: FAVORITE_ICON_RADIUS,
      overflow: 'hidden',
    },
    gameIcon: {
      width: FAVORITE_ICON_SIZE,
      height: FAVORITE_ICON_SIZE,
    },
    iconPlaceholder: {
      width: FAVORITE_ICON_SIZE,
      height: FAVORITE_ICON_SIZE,
      borderRadius: FAVORITE_ICON_RADIUS,
      backgroundColor: colors.tertiaryBackground,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconPlaceholderText: {
      ...typographyPresets.Title,
      color: colors.primaryAccentDark,
      fontSize: 22,
      lineHeight: 26,
    },
    gameName: {
      ...typographyPresets.Caption,
      color: colors.primaryForeground,
      fontSize: 11,
      lineHeight: 15,
      textAlign: 'center',
      fontWeight: '600',
    },
    priceText: {
      ...typographyPresets.Caption,
      color: colors.primaryAccentDark,
      fontSize: 10,
      lineHeight: 14,
      fontWeight: '600',
    },
  };

  const favoriteSectionStyles: GamesFavoriteSectionStyles = {
    container: {
      marginTop: spacingPresets.md1,
    },
    headerContainer: {
      paddingHorizontal: HORIZONTAL_PADDING,
      marginBottom: spacingPresets.sm,
    },
    headerTitle: {
      ...typographyPresets.Subtitle,
      color: colors.primaryForeground,
      fontSize: 16,
      lineHeight: 22,
      fontWeight: '700',
    },
    scrollContainer: {
      flexGrow: 0,
    },
    scrollContent: {
      paddingHorizontal: HORIZONTAL_PADDING,
      gap: spacingPresets.sm,
    },
  };

  const sectionHeaderStyles: GamesSectionHeaderStyles = {
    container: {
      paddingHorizontal: HORIZONTAL_PADDING,
      marginBottom: spacingPresets.sm,
    },
    title: {
      ...typographyPresets.Subtitle,
      color: colors.primaryForeground,
      fontSize: 16,
      lineHeight: 22,
      fontWeight: '700',
    },
  };

  const emptyStateStyles: GamesEmptyStateStyles = {
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

  return createAppPageStyles<GamesStyles>({
    styles,
    searchInputStyles,
    categoryPillStyles,
    gridCardStyles,
    favoriteCardStyles,
    favoriteSectionStyles,
    sectionHeaderStyles,
    emptyStateStyles,
  });
}

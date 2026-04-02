/**
 * Main container for the Games route
 */

import { type ReactNode } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Search, SearchX } from 'lucide-react-native';

import { t } from '@/i18n';
import { CustomTextField } from '@/comp-lib/core/custom-text-field/CustomTextField';
import { CustomTextInput } from '@/comp-lib/core/custom-text-input/CustomTextInput';
import { useStyleContext } from '@/comp-lib/styles/StyleContext';
import {
  useGamesStyles,
  type GamesGridCardStyles,
  type GamesFavoriteCardStyles,
  type GamesCategoryPillStyles,
  type GamesSectionHeaderStyles,
  type GamesEmptyStateStyles,
  type GamesFavoriteSectionStyles,
} from './GamesStyles';
import { useGames, formatPrice, type GamesPageCategoryFilter, type GamesCategoryOption, type GameSection } from './GamesFunc';
import { GamesProps } from '@/app/(tabs)/games';
import { type GameV1 } from '@shared/generated-db-types';

interface GridGameCardProps {
  game: GameV1;
  onPress: (game: GameV1) => void;
  styles: GamesGridCardStyles;
}

function GridGameCard(props: GridGameCardProps): ReactNode {
  const { game, onPress, styles } = props;
  const initial = game.name.charAt(0).toUpperCase();
  const priceLabel = formatPrice(game.startingPriceInUsd);

  return (
    <Pressable onPress={() => onPress(game)}>
      <Animated.View entering={FadeIn.duration(250)} style={styles.container}>
        <View style={styles.iconContainer}>
          {game.iconUrl ? (
            <Image source={{ uri: game.iconUrl }} style={styles.gameIcon} contentFit="cover" />
          ) : (
            <View style={styles.iconPlaceholder}>
              <CustomTextField styles={styles.iconPlaceholderText} title={initial} />
            </View>
          )}
        </View>
        <View style={styles.infoContainer}>
          <CustomTextField styles={styles.gameName} title={game.name} numberOfLines={1} />
          {priceLabel.length > 0 && (
            <CustomTextField styles={styles.priceText} title={priceLabel} />
          )}
          {(game.isPopular || game.isNew) && (
            <View style={styles.badgeRow}>
              {game.isPopular && (
                <View style={styles.badge}>
                  <CustomTextField styles={styles.badgeText} title={t('games.popular')} />
                </View>
              )}
              {game.isNew && (
                <View style={styles.badge}>
                  <CustomTextField styles={styles.badgeText} title={t('games.new')} />
                </View>
              )}
            </View>
          )}
        </View>
      </Animated.View>
    </Pressable>
  );
}

interface FavoriteGameCardProps {
  game: GameV1;
  onPress: (game: GameV1) => void;
  styles: GamesFavoriteCardStyles;
}

function FavoriteGameCard(props: FavoriteGameCardProps): ReactNode {
  const { game, onPress, styles } = props;
  const initial = game.name.charAt(0).toUpperCase();
  const priceLabel = formatPrice(game.startingPriceInUsd);

  return (
    <Pressable onPress={() => onPress(game)}>
      <Animated.View entering={FadeIn.duration(250)} style={styles.container}>
        <View style={styles.iconContainer}>
          {game.iconUrl ? (
            <Image source={{ uri: game.iconUrl }} style={styles.gameIcon} contentFit="cover" />
          ) : (
            <View style={styles.iconPlaceholder}>
              <CustomTextField styles={styles.iconPlaceholderText} title={initial} />
            </View>
          )}
        </View>
        <CustomTextField styles={styles.gameName} title={game.name} numberOfLines={2} />
        {priceLabel.length > 0 && (
          <CustomTextField styles={styles.priceText} title={priceLabel} />
        )}
      </Animated.View>
    </Pressable>
  );
}

interface CategoryPillBarProps {
  categoryOptions: readonly GamesCategoryOption[];
  activeCategory: GamesPageCategoryFilter;
  onCategoryChange: (category: GamesPageCategoryFilter) => void;
  styles: GamesCategoryPillStyles;
}

function CategoryPillBar(props: CategoryPillBarProps): ReactNode {
  const { categoryOptions, activeCategory, onCategoryChange, styles } = props;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scrollContainer}
      contentContainerStyle={styles.contentContainer}
    >
      {categoryOptions.map((option) => {
        const isActive = option.value === activeCategory;
        return (
          <Pressable key={option.value} onPress={() => onCategoryChange(option.value)}>
            <View style={[styles.pill, isActive ? styles.pillActive : undefined]}>
              <CustomTextField
                styles={[styles.pillText, isActive ? styles.pillTextActive : undefined]}
                title={t(option.labelKey as Parameters<typeof t>[0])}
              />
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

interface SectionHeaderProps {
  title: string;
  styles: GamesSectionHeaderStyles;
}

function SectionHeader(props: SectionHeaderProps): ReactNode {
  return (
    <View style={props.styles.container}>
      <CustomTextField styles={props.styles.title} title={props.title} />
    </View>
  );
}

interface FavoritesSectionProps {
  games: GameV1[];
  onPress: (game: GameV1) => void;
  cardStyles: GamesFavoriteCardStyles;
  sectionStyles: GamesFavoriteSectionStyles;
}

function FavoritesSection(props: FavoritesSectionProps): ReactNode {
  const { games, onPress, cardStyles, sectionStyles } = props;

  return (
    <View style={sectionStyles.container}>
      <View style={sectionStyles.headerContainer}>
        <CustomTextField styles={sectionStyles.headerTitle} title={t('games.favorites')} />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={sectionStyles.scrollContainer}
        contentContainerStyle={sectionStyles.scrollContent}
      >
        {games.map((game) => (
          <FavoriteGameCard key={game.id} game={game} onPress={onPress} styles={cardStyles} />
        ))}
      </ScrollView>
    </View>
  );
}

interface EmptyGameStateProps {
  styles: GamesEmptyStateStyles;
  iconColor: string;
}

function EmptyGameState(props: EmptyGameStateProps): ReactNode {
  return (
    <View style={props.styles.container}>
      <View style={props.styles.iconWrapper}>
        <SearchX size={44} color={props.iconColor} />
      </View>
      <CustomTextField styles={props.styles.text} title={t('games.noResults')} />
      <CustomTextField styles={props.styles.hintText} title={t('games.noResultsHint')} />
    </View>
  );
}

interface GameSectionListProps {
  sections: GameSection[];
  filteredGames: GameV1[];
  hasResults: boolean;
  activeCategory: GamesPageCategoryFilter;
  searchQuery: string;
  onSelectGame: (game: GameV1) => void;
  gridCardStyles: GamesGridCardStyles;
  sectionHeaderStyles: GamesSectionHeaderStyles;
  sectionContainerStyle: object;
  gridContainerStyle: object;
  emptyStateStyles: GamesEmptyStateStyles;
  emptyIconColor: string;
}

function GameSectionList(props: GameSectionListProps): ReactNode {
  const {
    sections,
    filteredGames,
    hasResults,
    activeCategory,
    searchQuery,
    onSelectGame,
    gridCardStyles,
    sectionHeaderStyles,
    sectionContainerStyle,
    gridContainerStyle,
    emptyStateStyles,
    emptyIconColor,
  } = props;

  if (!hasResults) {
    return <EmptyGameState styles={emptyStateStyles} iconColor={emptyIconColor} />;
  }

  const showSections = activeCategory === 'ALL' && searchQuery.trim().length === 0 && sections.length > 0;

  if (showSections) {
    return (
      <>
        {sections.map((section) => (
          <View key={section.title} style={sectionContainerStyle}>
            <SectionHeader title={section.title} styles={sectionHeaderStyles} />
            <View style={gridContainerStyle}>
              {section.data.map((game) => (
                <GridGameCard key={game.id} game={game} onPress={onSelectGame} styles={gridCardStyles} />
              ))}
            </View>
          </View>
        ))}
      </>
    );
  }

  return (
    <View style={sectionContainerStyle}>
      <SectionHeader title={t('games.allGames')} styles={sectionHeaderStyles} />
      <View style={gridContainerStyle}>
        {filteredGames.map((game) => (
          <GridGameCard key={game.id} game={game} onPress={onSelectGame} styles={gridCardStyles} />
        ))}
      </View>
    </View>
  );
}

export default function GamesContainer(props: GamesProps): ReactNode {
  const { colors } = useStyleContext();
  const {
    styles,
    searchInputStyles,
    categoryPillStyles,
    gridCardStyles,
    favoriteCardStyles,
    favoriteSectionStyles,
    sectionHeaderStyles,
    emptyStateStyles,
  } = useGamesStyles();
  const {
    isLoading,
    isRefreshing,
    searchQuery,
    activeCategory,
    categoryOptions,
    favoriteGames,
    filteredGames,
    sections,
    hasFavorites,
    hasResults,
    onSearchChange,
    onCategoryChange,
    onRefresh,
    onSelectGame,
  } = useGames(props);

  const safeAreaProps = { edges: ['top', 'left', 'right'] as const };

  return (
    <SafeAreaView style={styles.safeArea} {...safeAreaProps}>
      <View style={styles.container}>
        {/* Header with title and search */}
        <View style={styles.headerSection}>
          <CustomTextField styles={styles.pageTitle} title={t('tabs.games')} />
          <CustomTextInput
            styles={searchInputStyles}
            placeholder={t('games.searchPlaceholder')}
            value={searchQuery}
            onChangeText={onSearchChange}
            leftIcon={({ size, color }) => <Search size={size} color={color} />}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Category filter pills */}
        <CategoryPillBar
          categoryOptions={categoryOptions}
          activeCategory={activeCategory}
          onCategoryChange={onCategoryChange}
          styles={categoryPillStyles}
        />

        {/* Main scrollable content */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primaryAccentDark} />
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                tintColor={colors.primaryAccentDark}
                colors={[colors.primaryAccentDark]}
              />
            }
          >
            {/* Favorites carousel */}
            {hasFavorites && searchQuery.trim().length === 0 && (
              <FavoritesSection
                games={favoriteGames}
                onPress={onSelectGame}
                cardStyles={favoriteCardStyles}
                sectionStyles={favoriteSectionStyles}
              />
            )}

            {/* Game sections / filtered list */}
            <GameSectionList
              sections={sections}
              filteredGames={filteredGames}
              hasResults={hasResults}
              activeCategory={activeCategory}
              searchQuery={searchQuery}
              onSelectGame={onSelectGame}
              gridCardStyles={gridCardStyles}
              sectionHeaderStyles={sectionHeaderStyles}
              sectionContainerStyle={styles.sectionContainer}
              gridContainerStyle={styles.gridContainer}
              emptyStateStyles={emptyStateStyles}
              emptyIconColor={colors.tertiaryForeground}
            />
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

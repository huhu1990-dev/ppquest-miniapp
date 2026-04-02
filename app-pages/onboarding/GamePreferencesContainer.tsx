/**
 * Main container for the GamePreferences route
 */

import { type ReactNode } from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Check, Search, SearchX } from 'lucide-react-native';

import { t } from '@/i18n';
import { CustomButton } from '@/comp-lib/core/custom-button/CustomButton';
import { CustomTextField } from '@/comp-lib/core/custom-text-field/CustomTextField';
import { CustomTextInput } from '@/comp-lib/core/custom-text-input/CustomTextInput';
import {
  useGamePreferencesStyles,
  type GameCardStyles,
  type CategoryPillStyles,
  type EmptyStateStyles,
  type StepIndicatorStyles,
} from './GamePreferencesStyles';
import { useGamePreferences, type CategoryFilter, type CategoryOption } from './GamePreferencesFunc';
import { GamePreferencesProps } from '@/app/onboarding/game-preferences';
import { type GameV1, type uuidstr } from '@shared/generated-db-types';
import { useStyleContext } from '@/comp-lib/styles/StyleContext';

interface GameCardProps {
  game: GameV1;
  isSelected: boolean;
  onToggle: (gameId: uuidstr) => void;
  styles: GameCardStyles;
}

function GameCard(props: GameCardProps): ReactNode {
  const { game, isSelected, onToggle, styles } = props;
  const initial = game.name.charAt(0).toUpperCase();

  return (
    <Pressable onPress={() => onToggle(game.id)}>
      <Animated.View
        entering={FadeIn.duration(250)}
        style={[styles.container, isSelected ? styles.selectedContainer : undefined]}
      >
        {isSelected && (
          <View style={styles.checkContainer}>
            <Check size={13} color="#ffffff" />
          </View>
        )}
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
          <CustomTextField
            styles={[styles.gameName, isSelected ? styles.gameNameSelected : undefined]}
            title={game.name}
            numberOfLines={2}
          />
          {(game.isPopular || game.isNew) && (
            <View style={styles.tagRow}>
              {game.isPopular && (
                <View style={styles.tagBadge}>
                  <CustomTextField styles={styles.tagBadgeText} title={t('gamePreferences.popular')} />
                </View>
              )}
              {game.isNew && (
                <View style={styles.tagBadge}>
                  <CustomTextField styles={styles.tagBadgeText} title={t('gamePreferences.new')} />
                </View>
              )}
            </View>
          )}
        </View>
      </Animated.View>
    </Pressable>
  );
}

interface CategoryPillBarProps {
  categoryOptions: readonly CategoryOption[];
  activeCategory: CategoryFilter;
  onCategoryChange: (category: CategoryFilter) => void;
  styles: CategoryPillStyles;
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

interface EmptyGameStateProps {
  styles: EmptyStateStyles;
  iconColor: string;
}

function EmptyGameState(props: EmptyGameStateProps): ReactNode {
  return (
    <View style={props.styles.container}>
      <View style={props.styles.iconWrapper}>
        <SearchX size={44} color={props.iconColor} />
      </View>
      <CustomTextField styles={props.styles.text} title={t('gamePreferences.noGamesFound')} />
      <CustomTextField styles={props.styles.hintText} title={t('gamePreferences.noGamesFoundHint')} />
    </View>
  );
}

export default function GamePreferencesContainer(props: GamePreferencesProps): ReactNode {
  const { colors } = useStyleContext();
  const {
    styles,
    stepIndicatorStyles,
    searchInputStyles,
    categoryPillStyles,
    gameCardStyles,
    emptyStateStyles,
    selectionCountStyles,
    skipButtonStyles,
    continueButtonStyles,
  } = useGamePreferencesStyles();
  const {
    isLoading,
    isSaving,
    filteredGames,
    selectedGameIds,
    selectedCount,
    searchQuery,
    activeCategory,
    categoryOptions,
    continueButtonTitle,
    selectionLabel,
    onSearchChange,
    onCategoryChange,
    onToggleGame,
    onSkip,
    onHandleSubmit,
  } = useGamePreferences(props);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header row with step indicator and skip */}
        <View style={styles.headerRow}>
          <View style={styles.headerSpacer} />
          <View style={styles.headerCenter}>
            <CustomTextField
              styles={stepIndicatorStyles.text}
              title={`${t('onboarding.step')} 1 / 1`}
            />
          </View>
          <CustomButton onPress={onSkip} styles={skipButtonStyles} title={t('common.skip')} />
        </View>

        {/* Title section */}
        <View style={styles.pageTitleSection}>
          <CustomTextField styles={styles.title} title={t('gamePreferences.title')} />
          <CustomTextField styles={styles.subtitle} title={t('gamePreferences.personalizeHint')} />
        </View>

        {/* Search bar */}
        <CustomTextInput
          styles={searchInputStyles}
          placeholder={t('gamePreferences.searchPlaceholder')}
          value={searchQuery}
          onChangeText={onSearchChange}
          leftIcon={({ size, color }) => <Search size={size} color={color} />}
          autoCapitalize="none"
          autoCorrect={false}
        />

        {/* Category pills */}
        <CategoryPillBar
          categoryOptions={categoryOptions}
          activeCategory={activeCategory}
          onCategoryChange={onCategoryChange}
          styles={categoryPillStyles}
        />

        {/* Game grid */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primaryAccentDark} />
          </View>
        ) : filteredGames.length === 0 ? (
          <EmptyGameState styles={emptyStateStyles} iconColor={colors.tertiaryForeground} />
        ) : (
          <FlatList
            data={filteredGames}
            keyExtractor={(item) => item.id}
            numColumns={3}
            style={styles.gridContainer}
            contentContainerStyle={styles.gridContent}
            columnWrapperStyle={styles.gridColumnWrapper}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <GameCard
                game={item}
                isSelected={selectedGameIds.has(item.id)}
                onToggle={onToggleGame}
                styles={gameCardStyles}
              />
            )}
          />
        )}

        {/* Bottom bar */}
        <View style={styles.bottomBarBorder} />
        <View style={styles.bottomBar}>
          {selectedCount > 0 && (
            <Animated.View entering={FadeIn.duration(200)} style={selectionCountStyles.container}>
              <CustomTextField
                styles={selectionCountStyles.text}
                title={selectionLabel}
              />
            </Animated.View>
          )}
          <CustomButton
            styles={continueButtonStyles}
            title={continueButtonTitle}
            onPress={onHandleSubmit}
            isLoading={isSaving}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

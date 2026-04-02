/**
 * Main container for the Orders route
 */

import { type ReactNode } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Receipt } from 'lucide-react-native';

import { t } from '@/i18n';
import { CustomTextField } from '@/comp-lib/core/custom-text-field/CustomTextField';
import { useStyleContext } from '@/comp-lib/styles/StyleContext';
import {
  useOrdersStyles,
  type OrdersFilterPillStyles,
  type OrdersCardStyles,
  type OrdersEmptyStateStyles,
} from './OrdersStyles';
import {
  useOrders,
  formatOrderDate,
  formatOrderAmount,
  getStatusBadgeStyle,
  getStatusTextStyle,
  getStatusLabel,
  type OrdersFilterStatus,
  type OrdersFilterOption,
} from './OrdersFunc';
import { OrdersProps } from '@/app/(tabs)/orders';
import { type OrderV1 } from '@shared/generated-db-types';

interface FilterPillBarProps {
  filterOptions: readonly OrdersFilterOption[];
  activeFilter: OrdersFilterStatus;
  onFilterChange: (filter: OrdersFilterStatus) => void;
  styles: OrdersFilterPillStyles;
}

function FilterPillBar(props: FilterPillBarProps): ReactNode {
  const { filterOptions, activeFilter, onFilterChange, styles } = props;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scrollContainer}
      contentContainerStyle={styles.contentContainer}
    >
      {filterOptions.map((option) => {
        const isActive = option.value === activeFilter;
        return (
          <Pressable key={option.value} onPress={() => onFilterChange(option.value)}>
            <View style={[styles.pill, isActive ? styles.pillActive : undefined]}>
              <CustomTextField
                styles={[styles.pillText, isActive ? styles.pillTextActive : undefined]}
                title={option.label}
              />
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

interface OrderCardProps {
  order: OrderV1;
  onPress: (order: OrderV1) => void;
  styles: OrdersCardStyles;
}

function OrderCard(props: OrderCardProps): ReactNode {
  const { order, onPress, styles } = props;
  const initial = order.gameName.charAt(0).toUpperCase();
  const dateLabel = formatOrderDate(order.createdAt);
  const amountLabel = formatOrderAmount(order.amountInUsd, order.discountInUsd);

  return (
    <Pressable onPress={() => onPress(order)}>
      <Animated.View entering={FadeIn.duration(250)} style={styles.container}>
        <View style={styles.topRow}>
          <View style={styles.iconContainer}>
            {order.gameIconUrl ? (
              <Image source={{ uri: order.gameIconUrl }} style={styles.gameIcon} contentFit="cover" />
            ) : (
              <View style={styles.iconPlaceholder}>
                <CustomTextField styles={styles.iconPlaceholderText} title={initial} />
              </View>
            )}
          </View>
          <View style={styles.infoContainer}>
            <CustomTextField styles={styles.gameName} title={order.gameName} numberOfLines={1} />
            <CustomTextField styles={styles.packageName} title={order.packageName} numberOfLines={1} />
            <CustomTextField styles={styles.dateText} title={dateLabel} />
          </View>
        </View>
        <View style={styles.bottomRow}>
          <View style={[styles.statusBadge, getStatusBadgeStyle(order.status, styles)]}>
            <CustomTextField
              styles={[styles.statusText, getStatusTextStyle(order.status, styles)]}
              title={getStatusLabel(order.status)}
            />
          </View>
          <CustomTextField styles={styles.amountText} title={amountLabel} />
        </View>
      </Animated.View>
    </Pressable>
  );
}

interface EmptyOrderStateProps {
  styles: OrdersEmptyStateStyles;
  iconColor: string;
  hasOrders: boolean;
}

function EmptyOrderState(props: EmptyOrderStateProps): ReactNode {
  const noResultsText = props.hasOrders
    ? t('games.noResults')
    : t('tabs.orders');
  const hintText = props.hasOrders
    ? t('games.noResultsHint')
    : t('orderConfirmation.browseGames');

  return (
    <View style={props.styles.container}>
      <View style={props.styles.iconWrapper}>
        <Receipt size={44} color={props.iconColor} />
      </View>
      <CustomTextField styles={props.styles.text} title={noResultsText} />
      <CustomTextField styles={props.styles.hintText} title={hintText} />
    </View>
  );
}

export default function OrdersContainer(props: OrdersProps): ReactNode {
  const { colors } = useStyleContext();
  const { styles, filterPillStyles, cardStyles, emptyStateStyles } = useOrdersStyles();
  const {
    isLoading,
    isRefreshing,
    filteredOrders,
    activeFilter,
    filterOptions,
    hasOrders,
    hasResults,
    onFilterChange,
    onRefresh,
    onSelectOrder,
  } = useOrders(props);

  const safeAreaProps = { edges: ['top', 'left', 'right'] as const };

  return (
    <SafeAreaView style={styles.safeArea} {...safeAreaProps}>
      <View style={styles.container}>
        <View style={styles.headerSection}>
          <CustomTextField styles={styles.pageTitle} title={t('tabs.orders')} />
        </View>

        <FilterPillBar
          filterOptions={filterOptions}
          activeFilter={activeFilter}
          onFilterChange={onFilterChange}
          styles={filterPillStyles}
        />

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
            {hasResults ? (
              filteredOrders.map((order) => (
                <OrderCard key={order.id} order={order} onPress={onSelectOrder} styles={cardStyles} />
              ))
            ) : (
              <EmptyOrderState
                styles={emptyStateStyles}
                iconColor={colors.tertiaryForeground}
                hasOrders={hasOrders}
              />
            )}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

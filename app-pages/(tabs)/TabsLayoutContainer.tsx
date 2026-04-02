import { type ReactNode } from 'react';
import 'react-native-reanimated';

import { Tabs } from 'expo-router';
import { Gamepad2, Receipt, User } from 'lucide-react-native';

import { t } from '@/i18n';
import { TabBarIcon } from '@/comp-lib/navigation/TabBarIcon';
import { TabsLayoutProps } from '@/app/(tabs)/_layout';
import { useTabsLayoutStyles } from './TabsLayoutStyles';

const TAB_ICON_SIZE = 24;

export default function TabsLayoutContainer(props: TabsLayoutProps): ReactNode {
  const { tabsLayoutOptions } = useTabsLayoutStyles();

  return (
    <Tabs initialRouteName="games" screenOptions={tabsLayoutOptions}>
      <Tabs.Screen
        name="games"
        options={{
          title: t('tabs.games'),
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon Icon={Gamepad2} color={color} size={TAB_ICON_SIZE} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: t('tabs.orders'),
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon Icon={Receipt} color={color} size={TAB_ICON_SIZE} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile'),
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon Icon={User} color={color} size={TAB_ICON_SIZE} />,
        }}
      />
    </Tabs>
  );
}

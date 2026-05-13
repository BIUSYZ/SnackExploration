import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, RefreshControl, useWindowDimensions } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useSnackStore } from '../lib/store';
import SnackCard from '../components/SnackCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { COLORS, LAYOUT, SHADOWS } from '../constants/Theme';
import { Settings, Plus, Home, Map as MapIcon } from 'lucide-react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { snacks, loading, fetchSnacks } = useSnackStore();
  const [filter, setFilter] = useState<'red' | 'black'>('red');

  const CARD_WIDTH = 180;
  const numColumns = Math.max(2, Math.floor(width / CARD_WIDTH));

  useEffect(() => {
    fetchSnacks(filter);
  }, [filter]);

  const onRefresh = () => {
    fetchSnacks(filter);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.filterBarContainer}>
          <View style={styles.filterBar}>
            <Pressable 
              style={[styles.filterBtn, filter === 'red' && { backgroundColor: COLORS.redList }]}
              onPress={() => setFilter('red')}
            >
              <Text style={[styles.filterText, filter === 'red' && styles.filterTextActive]}>红榜</Text>
            </Pressable>
            <Pressable 
              style={[styles.filterBtn, filter === 'black' && { backgroundColor: COLORS.blackList }]}
              onPress={() => setFilter('black')}
            >
              <Text style={[styles.filterText, filter === 'black' && styles.filterTextActive]}>黑榜</Text>
            </Pressable>
          </View>
        </View>
        <Pressable style={styles.settingsBtn} onPress={() => router.push('/settings')}>
          <Settings size={18} color={COLORS.textSecondary} />
        </Pressable>
      </View>

      <View style={styles.listContainer}>
        <FlashList
          key={numColumns}
          data={snacks}
          renderItem={({ item }) => <SnackCard {...item} />}
          estimatedItemSize={250}
          numColumns={numColumns}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={onRefresh} tintColor={COLORS.primary} />
          }
        />
      </View>

      <View style={styles.tabBar}>
        <Pressable style={styles.tabItem} onPress={() => {}}>
          <Home size={22} color={COLORS.primary} />
          <Text style={[styles.tabLabel, { color: COLORS.primary }]}>首页</Text>
        </Pressable>

        <Pressable style={styles.addBtnContainer} onPress={() => router.push('/add')}>
          <View style={styles.addBtn}>
            <Plus size={24} color="#FFF" />
          </View>
        </Pressable>

        <Pressable style={styles.tabItem} onPress={() => router.push('/map')}>
          <MapIcon size={22} color={COLORS.textMuted} />
          <Text style={styles.tabLabel}>地图</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  filterBarContainer: {
    flex: 1,
    alignItems: 'center',
  },
  filterBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
    width: 140,
    ...SHADOWS.light,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: 'center',
  },
  filterText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  filterTextActive: {
    color: '#FFF',
  },
  settingsBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.light,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 12,
  },
  tabBar: {
    flexDirection: 'row',
    height: 70,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    alignItems: 'center',
    paddingBottom: 10,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabLabel: {
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
    marginTop: 4,
    color: COLORS.textMuted,
  },
  addBtnContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.soft,
  }
});

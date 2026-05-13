import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SHADOWS, LAYOUT } from '../constants/Theme';
import { ChevronLeft, Construction } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function MapScreen() {
  const router = useRouter();
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={22} color={COLORS.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>零食地图</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Construction size={56} color={COLORS.primary} strokeWidth={1.5} />
          <Text style={styles.title}>地图正在施工中</Text>
          <Text style={styles.subtitle}>正在接入高德地图 SDK，敬请期待！</Text>
        </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.light,
  },
  headerTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: COLORS.textPrimary,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 40,
    alignItems: 'center',
    ...SHADOWS.soft,
  },
  title: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 20,
    color: COLORS.textPrimary,
    marginTop: 24,
  },
  subtitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 12,
  }
});

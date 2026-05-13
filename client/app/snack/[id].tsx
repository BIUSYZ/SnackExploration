import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { api } from '../../lib/api';
import { useSnackStore, Snack } from '../../lib/store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, LAYOUT, SHADOWS } from '../../constants/Theme';
import { ChevronLeft, Trash2, Calendar, Tag as TagIcon, MapPin } from 'lucide-react-native';
import { CustomStar, CustomSkull } from '../../components/CustomIcons';

export default function SnackDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { deleteSnack } = useSnackStore();
  const [snack, setSnack] = useState<Snack | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSnack();
  }, [id]);

  const fetchSnack = async () => {
    try {
      const response = await api.get(`/snacks/${id}`);
      if (response.data.success) {
        setSnack(response.data.data);
      }
    } catch (error) {
      console.error('Fetch snack detail failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      '确定删除吗？',
      '删除后无法恢复哦',
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '确定删除', 
          style: 'destructive',
          onPress: async () => {
            await deleteSnack(id as string);
            router.back();
          }
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!snack) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.emptyText}>记录已失踪</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={22} color={COLORS.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>零食档案</Text>
        <Pressable onPress={handleDelete} style={styles.deleteBtn}>
          <Trash2 size={20} color={COLORS.textMuted} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.imageCard}>
          <Image source={{ uri: snack.imageUrl }} style={styles.image} resizeMode="cover" />
          <View style={[styles.badge, { backgroundColor: snack.listType === 'red' ? COLORS.redList : COLORS.blackList }]}>
            <Text style={styles.badgeText}>{snack.listType === 'red' ? '红榜' : '黑榜'}</Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{snack.title}</Text>
            {snack.price && (
              <View style={styles.priceTag}>
                <Text style={styles.priceText}>¥{snack.price}</Text>
              </View>
            )}
          </View>
          
          <View style={styles.ratingBox}>
            {Array.from({ length: 5 }).map((_, i) => (
              snack.listType === 'red' ? (
                <CustomStar 
                  key={i} 
                  size={20} 
                  color={i < snack.rating ? COLORS.star : COLORS.border} 
                  active={i < snack.rating}
                  rotate={0}
                />
              ) : (
                <CustomSkull 
                  key={i} 
                  size={20} 
                  color={i < snack.rating ? COLORS.skull : COLORS.border} 
                  active={i < snack.rating}
                  rotate={0}
                />
              )
            ))}
          </View>

          <View style={styles.metaBox}>
            <View style={styles.metaItem}>
              <Calendar size={14} color={COLORS.textMuted} />
              <Text style={styles.metaText}>
                {snack.createdAt ? new Date(snack.createdAt).toLocaleDateString() : '未知日期'}
              </Text>
            </View>
            {snack.category && (
              <View style={styles.metaItem}>
                <TagIcon size={14} color={COLORS.textMuted} />
                <Text style={styles.metaText}>{snack.category}</Text>
              </View>
            )}
            {snack.location && (
              <View style={styles.metaItem}>
                <MapPin size={14} color={COLORS.textMuted} />
                <Text style={styles.metaText}>{snack.location}</Text>
              </View>
            )}
          </View>

          <View style={styles.descriptionCard}>
            <Text style={styles.descriptionLabel}>短评</Text>
            <Text style={styles.descriptionText}>
              {snack.description || '这一刻，保持沉默也是一种享受。'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  emptyText: {
    fontFamily: 'Inter_500Medium',
    color: COLORS.textMuted,
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
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.light,
  },
  deleteBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.light,
  },
  headerTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: COLORS.textPrimary,
  },
  scrollContent: {
    padding: 20,
  },
  imageCard: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
    marginBottom: 24,
    ...SHADOWS.soft,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: 16,
    left: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    textTransform: 'uppercase',
  },
  infoSection: {
    gap: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: 12,
  },
  ratingBox: {
    flexDirection: 'row',
    gap: 4,
    marginTop: -4,
  },
  priceTag: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  priceText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: COLORS.primary,
  },
  metaBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: COLORS.textMuted,
  },
  descriptionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.soft,
  },
  descriptionLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 10,
  },
  descriptionText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: COLORS.textPrimary,
    lineHeight: 24,
  }
});

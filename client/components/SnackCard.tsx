import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { COLORS, LAYOUT, SHADOWS } from '../constants/Theme';
import { CustomStar, CustomSkull } from './CustomIcons';
import { useRouter } from 'expo-router';

interface SnackCardProps {
  id: string;
  title: string;
  imageUrl: string;
  rating: number;
  listType: 'red' | 'black';
}

export default function SnackCard({ id, title, imageUrl, rating, listType }: SnackCardProps) {
  const router = useRouter();

  return (
    <Pressable 
      style={({ pressed }) => [
        styles.card,
        pressed && { opacity: 0.8 }
      ]}
      onPress={() => router.push(`/snack/${id}`)}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <View style={styles.ratingRow}>
          {Array.from({ length: 5 }).map((_, i) => (
            listType === 'red' ? (
              <CustomStar 
                key={i} 
                size={12} 
                color={i < rating ? COLORS.star : COLORS.border} 
                active={i < rating}
                rotate={0} // Reducing tilt for minimalism
              />
            ) : (
              <CustomSkull 
                key={i} 
                size={12} 
                color={i < rating ? COLORS.skull : COLORS.border} 
                active={i < rating}
                rotate={0} // Reducing tilt for minimalism
              />
            )
          ))}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: LAYOUT.borderRadius,
    borderWidth: LAYOUT.borderWidth,
    borderColor: COLORS.border,
    margin: 8,
    overflow: 'hidden',
    flex: 1,
    ...SHADOWS.soft,
  },
  imageContainer: {
    height: 140,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  info: {
    padding: 12,
  },
  title: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    gap: 3,
  },
});

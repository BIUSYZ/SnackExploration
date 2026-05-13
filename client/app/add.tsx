import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable, TextInput, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSnackStore } from '../lib/store';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { api } from '../lib/api';
import { COLORS, LAYOUT, SHADOWS } from '../constants/Theme';
import { Camera, X, ChevronLeft, Check } from 'lucide-react-native';
import Rating from '../components/Rating';

export default function AddSnackScreen() {
  const router = useRouter();
  const { addSnack } = useSnackStore();
  const [title, setTitle] = useState('');
  const [listType, setListType] = useState<'red' | 'black'>('red');
  const [rating, setRating] = useState(3);
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [uploading, setUploading] = useState(false);
  const [ocrTokens, setOcrTokens] = useState<string[]>([]);
  const [isOcrLoading, setIsOcrLoading] = useState(false);
  const [remoteImageUrl, setRemoteImageUrl] = useState('');

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      const localUri = result.assets[0].uri;
      setImage(localUri);
      setOcrTokens([]);
      setRemoteImageUrl('');
      handleOcr(localUri);
    }
  };

  const handleOcr = async (localUri: string) => {
    setIsOcrLoading(true);
    try {
      const url = await uploadImage(localUri);
      setRemoteImageUrl(url);
      const { data } = await api.post('/ocr', { imageUrl: url });
      if (data.success) {
        setOcrTokens(data.data.tokens);
      }
    } catch (err) {
      console.error('OCR Process failed:', err);
    } finally {
      setIsOcrLoading(false);
    }
  };

  const uploadImage = async (localUri: string): Promise<string> => {
    const formData = new FormData();
    if (Platform.OS === 'web') {
      const response = await fetch(localUri);
      const blob = await response.blob();
      formData.append('image', new File([blob], `photo_${Date.now()}.jpg`, { type: blob.type }));
    } else {
      const filename = localUri.split('/').pop() || 'photo.jpg';
      formData.append('image', { uri: localUri, name: filename, type: 'image/jpeg' } as any);
    }

    const { data } = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (data.success) {
      return data.data.url;
    }
    throw new Error('Upload failed');
  };

  const handleSubmit = async () => {
    if (!title || !image) return;

    setUploading(true);
    try {
      const finalImageUrl = remoteImageUrl || await uploadImage(image);
      await addSnack({ 
        title, 
        listType, 
        rating, 
        imageUrl: finalImageUrl,
        description: description || undefined,
        price: price ? Number(price) : undefined,
      });
      router.back();
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const appendToken = (token: string) => {
    setTitle(prev => prev ? `${prev} ${token}` : token);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={22} color={COLORS.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>记录零食</Text>
        <Pressable 
          onPress={handleSubmit} 
          disabled={uploading || !title || !image}
          style={[styles.saveBtn, (uploading || !title || !image) && { opacity: 0.5 }]}
        >
          {uploading ? <ActivityIndicator size="small" color={COLORS.primary} /> : <Check size={22} color={COLORS.primary} />}
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Pressable style={styles.imageBox} onPress={pickImage}>
          {image ? (
            <>
              <Image source={{ uri: image }} style={styles.previewImage} />
              <Pressable style={styles.removeImage} onPress={() => setImage(null)}>
                <X size={18} color="#FFF" />
              </Pressable>
            </>
          ) : (
            <View style={styles.placeholder}>
              <Camera size={28} color={COLORS.textMuted} />
              <Text style={styles.placeholderText}>添加零食照片</Text>
            </View>
          )}
        </Pressable>

        {ocrTokens.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>智能建议</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tokenList}>
              {ocrTokens.map((token, i) => (
                <Pressable key={i} style={styles.token} onPress={() => appendToken(token)}>
                  <Text style={styles.tokenText}>{token}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.formCard}>
          <Text style={styles.label}>名称</Text>
          <TextInput 
            style={styles.input} 
            value={title} 
            onChangeText={setTitle} 
            placeholder="这一刻吃的是什么？"
            placeholderTextColor={COLORS.textMuted}
          />

          <View style={styles.row}>
            <View style={{ flex: 1.2 }}>
              <Text style={styles.label}>所属榜单</Text>
              <View style={styles.filterBar}>
                <Pressable 
                  style={[styles.filterBtn, listType === 'red' && { backgroundColor: COLORS.redList }]}
                  onPress={() => setListType('red')}
                >
                  <Text style={[styles.filterText, listType === 'red' && { color: '#FFF' }]}>红榜</Text>
                </Pressable>
                <Pressable 
                  style={[styles.filterBtn, listType === 'black' && { backgroundColor: COLORS.blackList }]}
                  onPress={() => setListType('black')}
                >
                  <Text style={[styles.filterText, listType === 'black' && { color: '#FFF' }]}>黑榜</Text>
                </Pressable>
              </View>
            </View>
            <View style={{ width: 16 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>价格 (¥)</Text>
              <TextInput 
                style={styles.input} 
                value={price} 
                onChangeText={setPrice} 
                placeholder="0.00"
                keyboardType="numeric"
                placeholderTextColor={COLORS.textMuted}
              />
            </View>
          </View>

          <Text style={styles.label}>打分</Text>
          <View style={styles.ratingBox}>
            <Rating value={rating} onChange={setRating} type={listType} size={36} />
          </View>

          <Text style={styles.label}>短评</Text>
          <TextInput 
            style={[styles.input, { height: 120, textAlignVertical: 'top' }]} 
            value={description} 
            onChangeText={setDescription} 
            placeholder="分享你的味蕾体验..."
            multiline
            placeholderTextColor={COLORS.textMuted}
          />
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
  saveBtn: {
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
  imageBox: {
    width: '100%',
    height: 180,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 24,
    ...SHADOWS.soft,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    alignItems: 'center',
  },
  placeholderText: {
    fontFamily: 'Inter_500Medium',
    color: COLORS.textMuted,
    marginTop: 10,
    fontSize: 13,
  },
  removeImage: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 15,
    padding: 6,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  tokenList: {
    gap: 8,
  },
  token: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.light,
  },
  tokenText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  formCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.soft,
    marginBottom: 40,
  },
  label: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.surfaceWarm,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
    color: COLORS.textPrimary,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  row: {
    flexDirection: 'row',
  },
  filterBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceWarm,
    borderRadius: 12,
    padding: 3,
    marginBottom: 20,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  filterText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  ratingBox: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 4,
  },
});

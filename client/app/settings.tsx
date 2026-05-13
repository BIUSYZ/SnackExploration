import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SHADOWS, LAYOUT } from '../constants/Theme';
import { ChevronLeft, Check, Shield, Settings as SettingsIcon, Info } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { api } from '../lib/api';

export default function SettingsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'config' | 'profile'>('config');
  const [ocrKey, setOcrKey] = useState('');
  const [ocrSecret, setOcrSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/config');
      if (data.success) {
        setOcrKey(data.data.ocrKey || '');
        setOcrSecret(data.data.ocrSecret || '');
      }
    } catch (err) {
      console.error('Fetch config failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post('/config', { ocrKey, ocrSecret });
      router.back();
    } catch (err) {
      console.error('Save config failed:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={22} color={COLORS.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>设置中心</Text>
        <Pressable 
          onPress={handleSave} 
          disabled={saving}
          style={[styles.saveBtnTop, saving && { opacity: 0.5 }]}
        >
          {saving ? <ActivityIndicator size="small" color={COLORS.primary} /> : <Check size={22} color={COLORS.primary} />}
        </Pressable>
      </View>

      <View style={styles.tabContainer}>
        <View style={styles.tabBar}>
          <Pressable 
            style={[styles.tab, activeTab === 'config' && styles.tabActive]} 
            onPress={() => setActiveTab('config')}
          >
            <Text style={[styles.tabText, activeTab === 'config' && styles.tabTextActive]}>系统配置</Text>
          </Pressable>
          <Pressable 
            style={[styles.tab, activeTab === 'profile' && styles.tabActive]} 
            onPress={() => setActiveTab('profile')}
          >
            <Text style={[styles.tabText, activeTab === 'profile' && styles.tabTextActive]}>个人资料</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'config' ? (
          <View style={styles.section}>
            <View style={styles.formCard}>
              <View style={styles.cardHeader}>
                <Shield size={18} color={COLORS.primary} />
                <Text style={styles.cardTitle}>阿里云 OCR 服务</Text>
              </View>
              
              {loading ? (
                <ActivityIndicator color={COLORS.primary} style={{ margin: 30 }} />
              ) : (
                <View style={styles.cardBody}>
                  <Text style={styles.label}>AccessKey ID</Text>
                  <TextInput 
                    style={styles.input} 
                    value={ocrKey} 
                    onChangeText={setOcrKey} 
                    placeholder="请输入 LTAI 开头的 ID"
                    placeholderTextColor={COLORS.textMuted}
                    secureTextEntry
                  />

                  <Text style={styles.label}>AccessKey Secret</Text>
                  <TextInput 
                    style={styles.input} 
                    value={ocrSecret} 
                    onChangeText={setOcrSecret} 
                    placeholder="请输入 Secret"
                    placeholderTextColor={COLORS.textMuted}
                    secureTextEntry
                  />

                  <View style={styles.infoBox}>
                    <Info size={14} color={COLORS.textMuted} />
                    <Text style={styles.infoText}>密钥仅保存在私有服务器，用于零食包装文字识别。</Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <SettingsIcon size={48} color={COLORS.border} strokeWidth={1} />
            <Text style={styles.emptyText}>更多个人功能正在赶来...</Text>
          </View>
        )}
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
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.light,
  },
  saveBtnTop: {
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
  tabContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
    width: 200,
    ...SHADOWS.light,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: COLORS.textMuted,
  },
  tabTextActive: {
    color: '#FFF',
  },
  content: {
    padding: 20,
  },
  section: {
    gap: 20,
  },
  formCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.soft,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surfaceWarm,
    gap: 10,
  },
  cardTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  cardBody: {
    padding: 20,
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
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 20,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  infoText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: COLORS.textMuted,
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 100,
    gap: 20,
  },
  emptyText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
    color: COLORS.textMuted,
  }
});

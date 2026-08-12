import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Switch,
  Clipboard,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileView() {
  const [apiKey, setApiKey] = useState('hoosha_sk_live_9924ac06c3e416b9f81e8535c713b6e');
  const [showKey, setShowKey] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [betaAccess, setBetaAccess] = useState(true);
  const [autoCache, setAutoCache] = useState(false);

  const copyApiKey = () => {
    Clipboard.setString(apiKey);
    Alert.alert("API Key", "Hoosha API key copied to clipboard.");
  };

  const regenerateKey = () => {
    const newKey = `hoosha_sk_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    setApiKey(newKey);
    Alert.alert("API Key Regenerated", "New Hoosha API key generated successfully.");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brandTitle}>PROFILE & SETTINGS</Text>
          <Text style={styles.headerSubtitle}>Hoosha Research Fellow Dashboard</Text>
        </View>
        <Ionicons name="settings-outline" size={22} color="#94A3B8" />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Fellow Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>HA</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>Hoosha Researcher</Text>
            <Text style={styles.userRole}>Core AI Fellow</Text>
            <View style={styles.tierBadge}>
              <Ionicons name="sparkles" size={12} color="#38BDF8" />
              <Text style={styles.tierText}>Pro Research Tier</Text>
            </View>
          </View>
        </View>

        {/* Compute Usage Stats */}
        <Text style={styles.sectionHeader}>Compute Usage</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Ionicons name="time-outline" size={20} color="#38BDF8" />
            <Text style={styles.statNumber}>248.5 h</Text>
            <Text style={styles.statLabel}>GPU Compute</Text>
          </View>

          <View style={styles.statBox}>
            <Ionicons name="analytics-outline" size={20} color="#10B981" />
            <Text style={styles.statNumber}>14,290</Text>
            <Text style={styles.statLabel}>Inferences</Text>
          </View>

          <View style={styles.statBox}>
            <Ionicons name="bookmark-outline" size={20} color="#A855F7" />
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Saved Papers</Text>
          </View>
        </View>

        {/* API Key Management */}
        <Text style={styles.sectionHeader}>Developer API Credentials</Text>
        <View style={styles.keyCard}>
          <View style={styles.keyHeader}>
            <Ionicons name="key-outline" size={18} color="#38BDF8" />
            <Text style={styles.keyTitle}>Live Secret API Key</Text>
          </View>

          <View style={styles.keyDisplayRow}>
            <Text style={styles.keyText}>
              {showKey ? apiKey : `${apiKey.substring(0, 16)}••••••••••••`}
            </Text>
            <TouchableOpacity onPress={() => setShowKey(!showKey)}>
              <Ionicons name={showKey ? "eye-off-outline" : "eye-outline"} size={18} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <View style={styles.keyActionRow}>
            <TouchableOpacity style={styles.keyBtn} onPress={copyApiKey}>
              <Ionicons name="copy-outline" size={14} color="#F8FAFC" />
              <Text style={styles.keyBtnText}>Copy Key</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.keyBtn, styles.keyBtnDanger]} onPress={regenerateKey}>
              <Ionicons name="refresh-outline" size={14} color="#F43F5E" />
              <Text style={[styles.keyBtnText, { color: '#F43F5E' }]}>Regenerate</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Preferences Toggles */}
        <Text style={styles.sectionHeader}>App Preferences</Text>
        <View style={styles.preferenceCard}>
          <View style={styles.prefRow}>
            <View style={styles.prefLeft}>
              <Ionicons name="notifications-outline" size={18} color="#94A3B8" />
              <Text style={styles.prefLabel}>New Paper Notifications</Text>
            </View>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: '#1E293B', true: '#38BDF8' }}
              thumbColor={pushNotifications ? '#0B0F19' : '#94A3B8'}
            />
          </View>

          <View style={styles.prefRow}>
            <View style={styles.prefLeft}>
              <Ionicons name="flask-outline" size={18} color="#94A3B8" />
              <Text style={styles.prefLabel}>Early Beta Sandbox Access</Text>
            </View>
            <Switch
              value={betaAccess}
              onValueChange={setBetaAccess}
              trackColor={{ false: '#1E293B', true: '#38BDF8' }}
              thumbColor={betaAccess ? '#0B0F19' : '#94A3B8'}
            />
          </View>

          <View style={[styles.prefRow, { borderBottomWidth: 0 }]}>
            <View style={styles.prefLeft}>
              <Ionicons name="cloud-download-outline" size={18} color="#94A3B8" />
              <Text style={styles.prefLabel}>Auto-Cache Model Weights</Text>
            </View>
            <Switch
              value={autoCache}
              onValueChange={setAutoCache}
              trackColor={{ false: '#1E293B', true: '#38BDF8' }}
              thumbColor={autoCache ? '#0B0F19' : '#94A3B8'}
            />
          </View>
        </View>

        {/* Android Build Metadata */}
        <Text style={styles.sectionHeader}>Android Application Build Metadata</Text>
        <View style={styles.buildCard}>
          <View style={styles.buildRow}>
            <Text style={styles.buildLabel}>Package Identifier</Text>
            <Text style={styles.buildValue}>ai.hoosha.app</Text>
          </View>

          <View style={styles.buildRow}>
            <Text style={styles.buildLabel}>Version</Text>
            <Text style={styles.buildValue}>1.0.0 (Build 1)</Text>
          </View>

          <View style={styles.buildRow}>
            <Text style={styles.buildLabel}>Expo SDK Target</Text>
            <Text style={styles.buildValue}>Expo ~51.0.0</Text>
          </View>

          <View style={[styles.buildRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.buildLabel}>Release APK Build State</Text>
            <View style={styles.readyBadge}>
              <Text style={styles.readyText}>Ready (eas build / expo run)</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F19',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#38BDF8',
    letterSpacing: 1.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#151C2C',
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#212C42',
    gap: 16,
    marginBottom: 20,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#38BDF8',
  },
  avatarText: {
    color: '#38BDF8',
    fontSize: 20,
    fontWeight: '800',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
  },
  userRole: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 2,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 6,
  },
  tierText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '700',
  },
  sectionHeader: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#151C2C',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#212C42',
    alignItems: 'center',
  },
  statNumber: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '800',
    marginTop: 6,
  },
  statLabel: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 2,
  },
  keyCard: {
    backgroundColor: '#151C2C',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#212C42',
    marginBottom: 20,
  },
  keyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  keyTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '600',
  },
  keyDisplayRow: {
    backgroundColor: '#0B0F19',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  keyText: {
    color: '#38BDF8',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  keyActionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  keyBtn: {
    flex: 1,
    backgroundColor: '#212C42',
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  keyBtnDanger: {
    backgroundColor: 'rgba(244, 63, 94, 0.1)',
  },
  keyBtnText: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '600',
  },
  preferenceCard: {
    backgroundColor: '#151C2C',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#212C42',
    marginBottom: 20,
  },
  prefRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  prefLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  prefLabel: {
    color: '#CBD5E1',
    fontSize: 13,
  },
  buildCard: {
    backgroundColor: '#151C2C',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#212C42',
    marginBottom: 20,
  },
  buildRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  buildLabel: {
    color: '#94A3B8',
    fontSize: 13,
  },
  buildValue: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  readyBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  readyText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '700',
  },
});

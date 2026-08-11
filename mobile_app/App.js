import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import ResearchFeed, { INITIAL_ARTICLES, ARTICLES_CACHE_KEY, LAST_SYNC_KEY } from './src/components/ResearchFeed';
import SandboxView from './src/components/SandboxView';
import ModelZooView from './src/components/ModelZooView';
import ProfileView from './src/components/ProfileView';
import ArticleDetailModal from './src/components/ArticleDetailModal';
import InteractiveSimulatorModal from './src/components/InteractiveSimulatorModal';

// Dynamic import with robust in-memory fallback for AsyncStorage
let AsyncStorage;
try {
  AsyncStorage = require('@react-native-async-storage/async-storage').default || require('@react-native-async-storage/async-storage');
} catch (e) {
  const memoryCache = new Map();
  AsyncStorage = {
    getItem: async (key) => memoryCache.get(key) || null,
    setItem: async (key, val) => { memoryCache.set(key, String(val)); return null; },
    removeItem: async (key) => { memoryCache.delete(key); return null; },
    clear: async () => { memoryCache.clear(); return null; },
  };
}

// Global hook to ensure Substack articles are pre-cached in AsyncStorage for 100% offline access
function useOfflineCacheWarmup() {
  useEffect(() => {
    async function initCache() {
      try {
        const cached = await AsyncStorage.getItem(ARTICLES_CACHE_KEY);
        if (!cached) {
          await AsyncStorage.setItem(ARTICLES_CACHE_KEY, JSON.stringify(INITIAL_ARTICLES));
          const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          await AsyncStorage.setItem(LAST_SYNC_KEY, timestamp);
        }
      } catch (err) {
        console.error('[App] Failed to warm up AsyncStorage cache:', err);
      }
    }
    initCache();
  }, []);
}

// Try loading React Navigation if available, with smooth custom tab fallback
let NavigationContainer, createBottomTabNavigator;
try {
  NavigationContainer = require('@react-navigation/native').NavigationContainer;
  createBottomTabNavigator = require('@react-navigation/bottom-tabs').createBottomTabNavigator;
} catch (e) {
  // Navigation module fallback handler
}

function CustomTabApp() {
  useOfflineCacheWarmup();
  const [activeTab, setActiveTab] = useState('research');

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'research':
        return <ResearchFeed />;
      case 'sandbox':
        return <SandboxView />;
      case 'modelzoo':
        return <ModelZooView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <ResearchFeed />;
    }
  };

  return (
    <SafeAreaView style={styles.appContainer}>
      <View style={styles.screenContainer}>
        {renderActiveScreen()}
      </View>

      {/* Modern Dark Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('research')}
          activeOpacity={0.7}
        >
          <Ionicons
            name={activeTab === 'research' ? "newspaper" : "newspaper-outline"}
            size={22}
            color={activeTab === 'research' ? "#38BDF8" : "#64748B"}
          />
          <Text style={[styles.navLabel, activeTab === 'research' && styles.navLabelActive]}>
            Research Feed
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('sandbox')}
          activeOpacity={0.7}
        >
          <Ionicons
            name={activeTab === 'sandbox' ? "hardware-chip" : "hardware-chip-outline"}
            size={22}
            color={activeTab === 'sandbox' ? "#38BDF8" : "#64748B"}
          />
          <Text style={[styles.navLabel, activeTab === 'sandbox' && styles.navLabelActive]}>
            AI Sandboxes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('modelzoo')}
          activeOpacity={0.7}
        >
          <Ionicons
            name={activeTab === 'modelzoo' ? "cube" : "cube-outline"}
            size={22}
            color={activeTab === 'modelzoo' ? "#38BDF8" : "#64748B"}
          />
          <Text style={[styles.navLabel, activeTab === 'modelzoo' && styles.navLabelActive]}>
            Model Zoo
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('profile')}
          activeOpacity={0.7}
        >
          <Ionicons
            name={activeTab === 'profile' ? "person" : "person-outline"}
            size={22}
            color={activeTab === 'profile' ? "#38BDF8" : "#64748B"}
          />
          <Text style={[styles.navLabel, activeTab === 'profile' && styles.navLabelActive]}>
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// React Navigation Tab setup when installed
if (createBottomTabNavigator && NavigationContainer) {
  const Tab = createBottomTabNavigator();

  function ReactNavigationApp() {
    useOfflineCacheWarmup();
    return (
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: '#0B0F19',
              borderTopColor: '#1E293B',
              height: 64,
              paddingBottom: 10,
              paddingTop: 8,
            },
            tabBarActiveTintColor: '#38BDF8',
            tabBarInactiveTintColor: '#64748B',
            tabBarLabelStyle: {
              fontSize: 11,
              fontWeight: '600',
            },
          }}
        >
          <Tab.Screen
            name="Research Feed"
            component={ResearchFeed}
            options={{
              tabBarIcon: ({ color, size, focused }) => (
                <Ionicons name={focused ? "newspaper" : "newspaper-outline"} size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="AI Sandboxes"
            component={SandboxView}
            options={{
              tabBarIcon: ({ color, size, focused }) => (
                <Ionicons name={focused ? "hardware-chip" : "hardware-chip-outline"} size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Model Zoo"
            component={ModelZooView}
            options={{
              tabBarIcon: ({ color, size, focused }) => (
                <Ionicons name={focused ? "cube" : "cube-outline"} size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Profile"
            component={ProfileView}
            options={{
              tabBarIcon: ({ color, size, focused }) => (
                <Ionicons name={focused ? "person" : "person-outline"} size={size} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }

  export default function App() {
    return (
      <SafeAreaProvider>
        <StatusBar style="light" backgroundColor="#0B0F19" />
        <ReactNavigationApp />
      </SafeAreaProvider>
    );
  }
} else {
  export default function App() {
    return (
      <SafeAreaProvider>
        <StatusBar style="light" backgroundColor="#0B0F19" />
        <CustomTabApp />
      </SafeAreaProvider>
    );
  }
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#0B0F19',
  },
  screenContainer: {
    flex: 1,
  },
  navBar: {
    flexDirection: 'row',
    backgroundColor: '#0B0F19',
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    paddingVertical: 10,
    paddingHorizontal: 12,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  navLabel: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '600',
  },
  navLabelActive: {
    color: '#38BDF8',
    fontWeight: '700',
  },
});

import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import ResearchFeed from './src/components/ResearchFeed';
import SandboxView from './src/components/SandboxView';
import ModelZooView from './src/components/ModelZooView';
import ProfileView from './src/components/ProfileView';

// Try loading React Navigation if available, with smooth custom tab fallback
let NavigationContainer, createBottomTabNavigator;
try {
  NavigationContainer = require('@react-navigation/native').NavigationContainer;
  createBottomTabNavigator = require('@react-navigation/bottom-tabs').createBottomTabNavigator;
} catch (e) {
  // Navigation module fallback handler
}

function CustomTabApp() {
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

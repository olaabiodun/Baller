import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ScrollView, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [cacheEnabled, setCacheEnabled] = useState(true);

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    value, 
    onValueChange, 
    type = 'switch' 
  }: {
    icon: string;
    title: string;
    subtitle: string;
    value?: boolean;
    onValueChange?: (value: boolean) => void;
    type?: 'switch' | 'button';
  }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon as any} size={24} color="#FF3B30" />
        <View style={styles.settingText}>
          <ThemedText style={styles.settingTitle}>{title}</ThemedText>
          <ThemedText style={styles.settingSubtitle}>{subtitle}</ThemedText>
        </View>
      </View>
      
      {type === 'switch' && (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: '#3A3A3A', true: '#FF3B30' }}
          thumbColor={value ? '#FFFFFF' : '#8E8E93'}
        />
      )}
      
      {type === 'button' && (
        <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <ThemedText type="title">Settings</ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Preferences</ThemedText>
          
          <SettingItem
            icon="notifications"
            title="Push Notifications"
            subtitle="Receive notifications for news updates"
            value={notifications}
            onValueChange={setNotifications}
          />
          
          <SettingItem
            icon="moon"
            title="Dark Mode"
            subtitle="Use dark theme across the app"
            value={darkMode}
            onValueChange={setDarkMode}
          />
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Data & Storage</ThemedText>
          
          <SettingItem
            icon="refresh"
            title="Auto-refresh"
            subtitle="Automatically refresh news content"
            value={autoRefresh}
            onValueChange={setAutoRefresh}
          />
          
          <SettingItem
            icon="save"
            title="Enable Cache"
            subtitle="Store news locally for offline viewing"
            value={cacheEnabled}
            onValueChange={setCacheEnabled}
          />
          
          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.settingLeft}>
              <Ionicons name="trash" size={24} color="#FF3B30" />
              <View style={styles.settingText}>
                <ThemedText style={styles.settingTitle}>Clear Cache</ThemedText>
                <ThemedText style={styles.settingSubtitle}>Remove all cached data</ThemedText>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Content</ThemedText>
          
          <SettingItem
            icon="language"
            title="News Language"
            subtitle="Select preferred news language"
            type="button"
          />
          
          <SettingItem
            icon="timer"
            title="Refresh Interval"
            subtitle="How often to refresh content"
            type="button"
          />
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>About</ThemedText>
          
          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.settingLeft}>
              <Ionicons name="information-circle" size={24} color="#FF3B30" />
              <View style={styles.settingText}>
                <ThemedText style={styles.settingTitle}>About Baller</ThemedText>
                <ThemedText style={styles.settingSubtitle}>App version and information</ThemedText>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.settingLeft}>
              <Ionicons name="shield-checkmark" size={24} color="#FF3B30" />
              <View style={styles.settingText}>
                <ThemedText style={styles.settingTitle}>Privacy Policy</ThemedText>
                <ThemedText style={styles.settingSubtitle}>How we handle your data</ThemedText>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.settingLeft}>
              <Ionicons name="document-text" size={24} color="#FF3B30" />
              <View style={styles.settingText}>
                <ThemedText style={styles.settingTitle}>Terms of Service</ThemedText>
                <ThemedText style={styles.settingSubtitle}>Terms and conditions</ThemedText>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>Baller v1.0.0</ThemedText>
          <ThemedText style={styles.footerText}>© 2025 Baller Inc.</ThemedText>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1B',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#FFFFFF',
    paddingHorizontal: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#2A2A2B',
    borderRadius: 12,
    marginBottom: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#2A2A2B',
    borderRadius: 12,
    marginBottom: 8,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 16,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#3A3A3A',
  },
  footerText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 4,
  },
});

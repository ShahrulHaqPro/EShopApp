import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  StatusBar,
  Alert,
  Linking,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const [settings, setSettings] = useState({
    notifications: {
      orderUpdates: true,
      promotions: false,
      priceDrops: true,
      newArrivals: true,
    },
    privacy: {
      showOnlineStatus: true,
      allowTagging: false,
      privateAccount: false,
    },
    preferences: {
      language: 'English',
      currency: 'USD',
      measurement: 'Imperial',
      darkMode: false,
      autoPlayVideos: true,
    },
  });

  const toggleSwitch = (category, setting) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting]
      }
    }));
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            // Clear cache logic here
            Alert.alert('Success', 'Cache cleared successfully!');
          }
        }
      ]
    );
  };

  const handleContactSupport = () => {
    Linking.openURL('mailto:support@fakestore.com?subject=App Support');
  };

  const handleRateApp = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('itms-apps://itunes.apple.com/app/idYOUR_APP_ID');
    } else {
      Linking.openURL('market://details?id=com.fakestore.app');
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-left" size={24} color="#374151" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Settings</Text>
      <View style={{ width: 40 }} />
    </View>
  );

  const renderNotificationSettings = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Notifications</Text>
      
      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>Order Updates</Text>
          <Text style={styles.settingDescription}>Shipping, delivery updates</Text>
        </View>
        <Switch
          value={settings.notifications.orderUpdates}
          onValueChange={() => toggleSwitch('notifications', 'orderUpdates')}
          trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
          thumbColor="#FFFFFF"
        />
      </View>
      
      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>Promotions & Offers</Text>
          <Text style={styles.settingDescription}>Discounts, special offers</Text>
        </View>
        <Switch
          value={settings.notifications.promotions}
          onValueChange={() => toggleSwitch('notifications', 'promotions')}
          trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
          thumbColor="#FFFFFF"
        />
      </View>
      
      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>Price Drops</Text>
          <Text style={styles.settingDescription}>When items you like go on sale</Text>
        </View>
        <Switch
          value={settings.notifications.priceDrops}
          onValueChange={() => toggleSwitch('notifications', 'priceDrops')}
          trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
          thumbColor="#FFFFFF"
        />
      </View>
      
      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>New Arrivals</Text>
          <Text style={styles.settingDescription}>New products in your favorite categories</Text>
        </View>
        <Switch
          value={settings.notifications.newArrivals}
          onValueChange={() => toggleSwitch('notifications', 'newArrivals')}
          trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
          thumbColor="#FFFFFF"
        />
      </View>
    </View>
  );

  const renderPrivacySettings = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Privacy</Text>
      
      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>Show Online Status</Text>
          <Text style={styles.settingDescription}>Let others see when you're online</Text>
        </View>
        <Switch
          value={settings.privacy.showOnlineStatus}
          onValueChange={() => toggleSwitch('privacy', 'showOnlineStatus')}
          trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
          thumbColor="#FFFFFF"
        />
      </View>
      
      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>Allow Tagging</Text>
          <Text style={styles.settingDescription}>Let others tag you in posts</Text>
        </View>
        <Switch
          value={settings.privacy.allowTagging}
          onValueChange={() => toggleSwitch('privacy', 'allowTagging')}
          trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
          thumbColor="#FFFFFF"
        />
      </View>
      
      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>Private Account</Text>
          <Text style={styles.settingDescription}>Only approved followers can see your activity</Text>
        </View>
        <Switch
          value={settings.privacy.privateAccount}
          onValueChange={() => toggleSwitch('privacy', 'privateAccount')}
          trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
          thumbColor="#FFFFFF"
        />
      </View>
    </View>
  );

  const renderPreferenceSettings = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Preferences</Text>
      
      <TouchableOpacity 
        style={styles.preferenceItem}
        onPress={() => navigation.navigate('Language')}
      >
        <View style={styles.preferenceInfo}>
          <Icon name="translate" size={20} color="#6B7280" />
          <Text style={styles.preferenceTitle}>Language</Text>
        </View>
        <View style={styles.preferenceValue}>
          <Text style={styles.preferenceValueText}>{settings.preferences.language}</Text>
          <Icon name="chevron-right" size={20} color="#9CA3AF" />
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.preferenceItem}
        onPress={() => navigation.navigate('Currency')}
      >
        <View style={styles.preferenceInfo}>
          <Icon name="currency-usd" size={20} color="#6B7280" />
          <Text style={styles.preferenceTitle}>Currency</Text>
        </View>
        <View style={styles.preferenceValue}>
          <Text style={styles.preferenceValueText}>{settings.preferences.currency}</Text>
          <Icon name="chevron-right" size={20} color="#9CA3AF" />
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.preferenceItem}
        onPress={() => navigation.navigate('Measurement')}
      >
        <View style={styles.preferenceInfo}>
          <Icon name="ruler" size={20} color="#6B7280" />
          <Text style={styles.preferenceTitle}>Measurement Units</Text>
        </View>
        <View style={styles.preferenceValue}>
          <Text style={styles.preferenceValueText}>{settings.preferences.measurement}</Text>
          <Icon name="chevron-right" size={20} color="#9CA3AF" />
        </View>
      </TouchableOpacity>
      
      <View style={styles.preferenceItem}>
        <View style={styles.preferenceInfo}>
          <Icon name="theme-light-dark" size={20} color="#6B7280" />
          <Text style={styles.preferenceTitle}>Dark Mode</Text>
        </View>
        <Switch
          value={settings.preferences.darkMode}
          onValueChange={() => toggleSwitch('preferences', 'darkMode')}
          trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
          thumbColor="#FFFFFF"
        />
      </View>
      
      <View style={styles.preferenceItem}>
        <View style={styles.preferenceInfo}>
          <Icon name="play-circle" size={20} color="#6B7280" />
          <Text style={styles.preferenceTitle}>Auto-play Videos</Text>
        </View>
        <Switch
          value={settings.preferences.autoPlayVideos}
          onValueChange={() => toggleSwitch('preferences', 'autoPlayVideos')}
          trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
          thumbColor="#FFFFFF"
        />
      </View>
    </View>
  );

  const renderAppSettings = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>App</Text>
      
      <TouchableOpacity 
        style={styles.appItem}
        onPress={handleClearCache}
      >
        <View style={styles.appItemLeft}>
          <Icon name="trash-can-outline" size={20} color="#6B7280" />
          <Text style={styles.appItemText}>Clear Cache</Text>
        </View>
        <Text style={styles.cacheSize}>125 MB</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.appItem}
        onPress={() => navigation.navigate('Storage')}
      >
        <View style={styles.appItemLeft}>
          <Icon name="database" size={20} color="#6B7280" />
          <Text style={styles.appItemText}>Storage</Text>
        </View>
        <Icon name="chevron-right" size={20} color="#9CA3AF" />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.appItem}
        onPress={() => navigation.navigate('DataUsage')}
      >
        <View style={styles.appItemLeft}>
          <Icon name="wifi" size={20} color="#6B7280" />
          <Text style={styles.appItemText}>Data Usage</Text>
        </View>
        <Icon name="chevron-right" size={20} color="#9CA3AF" />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.appItem}
        onPress={() => navigation.navigate('Permissions')}
      >
        <View style={styles.appItemLeft}>
          <Icon name="shield-check" size={20} color="#6B7280" />
          <Text style={styles.appItemText}>App Permissions</Text>
        </View>
        <Icon name="chevron-right" size={20} color="#9CA3AF" />
      </TouchableOpacity>
    </View>
  );

  const renderSupportSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Support</Text>
      
      <TouchableOpacity 
        style={styles.supportItem}
        onPress={() => navigation.navigate('HelpCenter')}
      >
        <View style={styles.supportItemLeft}>
          <Icon name="help-circle" size={20} color="#6B7280" />
          <Text style={styles.supportItemText}>Help Center</Text>
        </View>
        <Icon name="chevron-right" size={20} color="#9CA3AF" />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.supportItem}
        onPress={handleContactSupport}
      >
        <View style={styles.supportItemLeft}>
          <Icon name="email" size={20} color="#6B7280" />
          <Text style={styles.supportItemText}>Contact Support</Text>
        </View>
        <Icon name="chevron-right" size={20} color="#9CA3AF" />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.supportItem}
        onPress={() => navigation.navigate('ReportProblem')}
      >
        <View style={styles.supportItemLeft}>
          <Icon name="alert-circle" size={20} color="#6B7280" />
          <Text style={styles.supportItemText}>Report a Problem</Text>
        </View>
        <Icon name="chevron-right" size={20} color="#9CA3AF" />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.supportItem}
        onPress={handleRateApp}
      >
        <View style={styles.supportItemLeft}>
          <Icon name="star" size={20} color="#6B7280" />
          <Text style={styles.supportItemText}>Rate Our App</Text>
        </View>
        <Icon name="chevron-right" size={20} color="#9CA3AF" />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.supportItem}
        onPress={() => navigation.navigate('About')}
      >
        <View style={styles.supportItemLeft}>
          <Icon name="information" size={20} color="#6B7280" />
          <Text style={styles.supportItemText}>About</Text>
        </View>
        <Text style={styles.versionText}>v1.0.0</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {renderHeader()}
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderNotificationSettings()}
        {renderPrivacySettings()}
        {renderPreferenceSettings()}
        {renderAppSettings()}
        {renderSupportSection()}
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>FakeStore Shopping App</Text>
          <Text style={styles.footerSubtext}>© 2024 All rights reserved</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#111827',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  preferenceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  preferenceTitle: {
    fontSize: 16,
    color: '#111827',
  },
  preferenceValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  preferenceValueText: {
    fontSize: 14,
    color: '#6B7280',
  },
  appItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  appItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  appItemText: {
    fontSize: 16,
    color: '#111827',
  },
  cacheSize: {
    fontSize: 14,
    color: '#6B7280',
  },
  supportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  supportItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  supportItemText: {
    fontSize: 16,
    color: '#111827',
  },
  versionText: {
    fontSize: 14,
    color: '#6B7280',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  footerText: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});

export default SettingsScreen;

// import { StyleSheet, Text, View } from 'react-native';

// export default function SettingsScreen() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>SettingsScreen</Text>
//     </View>
//   );
// };


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   text: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 16,
//   },
// });
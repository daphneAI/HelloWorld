import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [dailyReminder, setDailyReminder] = useState(true);
  const [theme, setTheme] = useState('light');

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', onPress: () => {} },
        { 
          text: 'Logout', 
          onPress: async () => {
            await AsyncStorage.removeItem('userToken');
            // Navigate to login screen
          },
          style: 'destructive'
        },
      ]
    );
  };

  const handleDeleteData = () => {
    Alert.alert(
      'Delete All Data',
      'This action cannot be undone. Are you sure?',
      [
        { text: 'Cancel', onPress: () => {} },
        { 
          text: 'Delete', 
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert('Success', 'All data has been deleted');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete data');
            }
          },
          style: 'destructive'
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.card}>
          <SettingItem 
            icon="account"
            label="Profile"
            value="View and edit your profile"
            onPress={() => {}}
          />
          <Divider />
          <SettingItem 
            icon="email"
            label="Email"
            value="user@example.com"
            onPress={() => {}}
          />
        </View>
      </View>

      {/* Preferences Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.card}>
          <SettingToggle 
            icon="bell"
            label="Notifications"
            value={notifications}
            onChange={setNotifications}
          />
          <Divider />
          <SettingToggle 
            icon="clock-outline"
            label="Daily Reminder"
            value={dailyReminder}
            onChange={setDailyReminder}
          />
          <Divider />
          <SettingItem 
            icon="palette"
            label="Appearance"
            value={theme === 'light' ? 'Light' : 'Dark'}
            onPress={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          />
        </View>
      </View>

      {/* Health Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Health Settings</Text>
        <View style={styles.card}>
          <SettingItem 
            icon="stethoscope"
            label="Health Goals"
            value="Target BP: 120/80"
            onPress={() => {}}
          />
          <Divider />
          <SettingItem 
            icon="medication"
            label="Medications"
            value="Manage your medications"
            onPress={() => {}}
          />
          <Divider />
          <SettingItem 
            icon="doctor"
            label="Doctor Information"
            value="Add your doctor's details"
            onPress={() => {}}
          />
        </View>
      </View>

      {/* Data Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data & Privacy</Text>
        <View style={styles.card}>
          <SettingItem 
            icon="backup-restore"
            label="Backup Data"
            value="Last backup: Today"
            onPress={() => Alert.alert('Info', 'Backup feature coming soon')}
          />
          <Divider />
          <SettingItem 
            icon="shield-check"
            label="Privacy Policy"
            value="Read our privacy policy"
            onPress={() => {}}
          />
          <Divider />
          <SettingItem 
            icon="file-document"
            label="Terms of Service"
            value="Read terms and conditions"
            onPress={() => {}}
          />
        </View>
      </View>

      {/* Support Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <View style={styles.card}>
          <SettingItem 
            icon="help-circle"
            label="Help & FAQ"
            value="Get answers to common questions"
            onPress={() => {}}
          />
          <Divider />
          <SettingItem 
            icon="email-outline"
            label="Contact Support"
            value="support@bloodpressureapp.com"
            onPress={() => {}}
          />
          <Divider />
          <SettingItem 
            icon="star"
            label="Rate App"
            value="Leave a review"
            onPress={() => {}}
          />
        </View>
      </View>

      {/* App Info */}
      <View style={styles.section}>
        <View style={styles.card}>
          <SettingItem 
            icon="information"
            label="About"
            value="Blood Pressure Tracker v1.0.0"
            onPress={() => {}}
          />
        </View>
      </View>

      {/* Danger Zone */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Danger Zone</Text>
        <View style={styles.card}>
          <TouchableOpacity 
            style={styles.dangerItem}
            onPress={handleDeleteData}
          >
            <MaterialCommunityIcons name="delete-alert" size={24} color="#E74C3C" />
            <View style={styles.itemText}>
              <Text style={[styles.itemLabel, { color: '#E74C3C' }]}>Delete All Data</Text>
              <Text style={styles.itemValue}>This cannot be undone</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#E74C3C" />
          </TouchableOpacity>
          <Divider />
          <TouchableOpacity 
            style={styles.dangerItem}
            onPress={handleLogout}
          >
            <MaterialCommunityIcons name="logout" size={24} color="#E74C3C" />
            <View style={styles.itemText}>
              <Text style={[styles.itemLabel, { color: '#E74C3C' }]}>Logout</Text>
              <Text style={styles.itemValue}>Sign out of your account</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#E74C3C" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.spacer} />
    </ScrollView>
  );
}

function SettingItem({ icon, label, value, onPress }) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <MaterialCommunityIcons name={icon} size={24} color="#3498DB" />
      <View style={styles.itemText}>
        <Text style={styles.itemLabel}>{label}</Text>
        <Text style={styles.itemValue}>{value}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={24} color="#BDC3C7" />
    </TouchableOpacity>
  );
}

function SettingToggle({ icon, label, value, onChange }) {
  return (
    <View style={styles.item}>
      <MaterialCommunityIcons name={icon} size={24} color="#3498DB" />
      <View style={styles.itemText}>
        <Text style={styles.itemLabel}>{label}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: '#D5DBDB', true: '#AED6F1' }}
        thumbColor={value ? '#3498DB' : '#BDC3C7'}
      />
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECF0F1',
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#7F8C8D',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dangerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FADBD8',
  },
  itemText: {
    flex: 1,
    marginHorizontal: 12,
  },
  itemLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
  },
  itemValue: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#ECF0F1',
  },
  spacer: {
    height: 20,
  },
});

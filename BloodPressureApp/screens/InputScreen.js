import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { firebaseService } from '../services/firebaseService';

export default function InputScreen() {
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [pulse, setPulse] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddReading = async () => {
    if (!systolic || !diastolic) {
      Alert.alert('Error', 'Please enter both systolic and diastolic readings');
      return;
    }

    if (isNaN(systolic) || isNaN(diastolic)) {
      Alert.alert('Error', 'Please enter valid numbers');
      return;
    }

    try {
      setLoading(true);
      await firebaseService.addBloodPressureReading({
        systolic: parseInt(systolic),
        diastolic: parseInt(diastolic),
        pulse: pulse ? parseInt(pulse) : null,
        notes: notes,
        timestamp: new Date(),
      });

      Alert.alert('Success', 'Reading added successfully!');
      setSystolic('');
      setDiastolic('');
      setPulse('');
      setNotes('');
    } catch (error) {
      Alert.alert('Error', 'Failed to save reading: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getCategory = (sys, dia) => {
    if (!sys || !dia) return '';
    const s = parseInt(sys);
    const d = parseInt(dia);
    if (s < 120 && d < 80) return 'Normal';
    if (s < 130 && d < 80) return 'Elevated';
    if (s < 140 || d < 90) return 'Stage 1 Hypertension';
    return 'Stage 2 Hypertension';
  };

  const getStatusColor = (sys, dia) => {
    const category = getCategory(sys, dia);
    if (category === 'Normal') return '#27AE60';
    if (category === 'Elevated') return '#F39C12';
    if (category === 'Stage 1 Hypertension') return '#E67E22';
    return '#E74C3C';
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="heart-pulse" size={40} color="#E74C3C" />
        <Text style={styles.headerText}>Add Blood Pressure Reading</Text>
      </View>

      {/* Input Fields */}
      <View style={styles.inputSection}>
        <Text style={styles.sectionTitle}>Blood Pressure Readings</Text>
        
        <View style={styles.twoColumnRow}>
          <View style={styles.inputColumn}>
            <Text style={styles.label}>Systolic (SYS)</Text>
            <TextInput
              style={styles.input}
              placeholder="120"
              placeholderTextColor="#BDC3C7"
              keyboardType="number-pad"
              value={systolic}
              onChangeText={setSystolic}
              maxLength={3}
            />
            <Text style={styles.unit}>mmHg</Text>
          </View>

          <View style={styles.inputColumn}>
            <Text style={styles.label}>Diastolic (DIA)</Text>
            <TextInput
              style={styles.input}
              placeholder="80"
              placeholderTextColor="#BDC3C7"
              keyboardType="number-pad"
              value={diastolic}
              onChangeText={setDiastolic}
              maxLength={3}
            />
            <Text style={styles.unit}>mmHg</Text>
          </View>
        </View>

        {/* Status Display */}
        {systolic && diastolic && (
          <View 
            style={[
              styles.statusBox, 
              { backgroundColor: getStatusColor(systolic, diastolic) }
            ]}
          >
            <Text style={styles.statusText}>
              {getCategory(systolic, diastolic)}
            </Text>
          </View>
        )}
      </View>

      {/* Optional Fields */}
      <View style={styles.inputSection}>
        <Text style={styles.sectionTitle}>Optional Information</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Pulse (BPM)</Text>
          <TextInput
            style={styles.input}
            placeholder="72"
            placeholderTextColor="#BDC3C7"
            keyboardType="number-pad"
            value={pulse}
            onChangeText={setPulse}
            maxLength={3}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Add any notes (e.g., after exercise, medication taken, etc.)"
            placeholderTextColor="#BDC3C7"
            multiline={true}
            numberOfLines={4}
            value={notes}
            onChangeText={setNotes}
          />
        </View>
      </View>

      {/* Info Cards */}
      <View style={styles.infoCard}>
        <MaterialCommunityIcons name="information" size={20} color="#3498DB" />
        <Text style={styles.infoText}>
          Normal: Less than 120/80
          {'\n'}Elevated: 120-129 and &lt;80
          {'\n'}Stage 1: 130-139 or 80-89
          {'\n'}Stage 2: 140 or higher or 90 or higher
        </Text>
      </View>

      {/* Submit Button */}
      <TouchableOpacity 
        style={[styles.submitButton, loading && { opacity: 0.6 }]}
        onPress={handleAddReading}
        disabled={loading}
      >
        <MaterialCommunityIcons name="check-circle" size={24} color="#FFF" />
        <Text style={styles.submitButtonText}>
          {loading ? 'Saving...' : 'Save Reading'}
        </Text>
      </TouchableOpacity>

      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECF0F1',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3E50',
    marginTop: 8,
  },
  inputSection: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 12,
  },
  twoColumnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputColumn: {
    flex: 1,
    marginRight: 12,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#34495E',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#BDC3C7',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#2C3E50',
  },
  textarea: {
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  unit: {
    fontSize: 10,
    color: '#7F8C8D',
    marginTop: 4,
  },
  statusBox: {
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  statusText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  infoCard: {
    backgroundColor: '#E8F4F8',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
  },
  infoText: {
    fontSize: 12,
    color: '#2C3E50',
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
  submitButton: {
    backgroundColor: '#E74C3C',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 24,
  },
  submitButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  spacer: {
    height: 20,
  },
});

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { firebaseService } from '../services/firebaseService';
import { getHealthInsights } from '../services/healthService';

export default function HomeScreen() {
  const [latestReading, setLatestReading] = useState(null);
  const [weeklyAverage, setWeeklyAverage] = useState(null);
  const [insights, setInsights] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const latest = await firebaseService.getLatestReading();
      const weeklyAvg = await firebaseService.getWeeklyAverage();
      const healthInsights = getHealthInsights(weeklyAvg);
      
      setLatestReading(latest);
      setWeeklyAverage(weeklyAvg);
      setInsights(healthInsights);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const getStatusColor = (systolic, diastolic) => {
    if (systolic < 120 && diastolic < 80) return '#27AE60'; // Normal
    if (systolic < 130 && diastolic < 80) return '#F39C12'; // Elevated
    if (systolic < 140 || diastolic < 90) return '#E67E22'; // Stage 1
    return '#E74C3C'; // Stage 2
  };

  const getStatusLabel = (systolic, diastolic) => {
    if (systolic < 120 && diastolic < 80) return 'Normal';
    if (systolic < 130 && diastolic < 80) return 'Elevated';
    if (systolic < 140 || diastolic < 90) return 'Stage 1 Hypertension';
    return 'Stage 2 Hypertension';
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Latest Reading Card */}
      {latestReading && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Latest Reading</Text>
          <View style={styles.readingContainer}>
            <View 
              style={[
                styles.statusIndicator, 
                { backgroundColor: getStatusColor(latestReading.systolic, latestReading.diastolic) }
              ]}
            >
              <Text style={styles.statusLabel}>
                {getStatusLabel(latestReading.systolic, latestReading.diastolic)}
              </Text>
            </View>
            <View style={styles.bpNumbers}>
              <Text style={styles.bpValue}>
                {latestReading.systolic}/{latestReading.diastolic}
              </Text>
              <Text style={styles.bpUnit}>mmHg</Text>
              <Text style={styles.timestamp}>
                {new Date(latestReading.timestamp).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Weekly Average Card */}
      {weeklyAverage && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Weekly Average</Text>
          <View style={styles.averageContainer}>
            <View style={styles.averageBox}>
              <MaterialCommunityIcons name="chart-line" size={24} color="#E74C3C" />
              <Text style={styles.averageValue}>
                {weeklyAverage.systolic}/{weeklyAverage.diastolic}
              </Text>
              <Text style={styles.averageLabel}>Avg Systolic/Diastolic</Text>
            </View>
            <View style={styles.averageBox}>
              <MaterialCommunityIcons name="heart-pulse" size={24} color="#3498DB" />
              <Text style={styles.averageValue}>{weeklyAverage.readings}</Text>
              <Text style={styles.averageLabel}>Readings This Week</Text>
            </View>
          </View>
        </View>
      )}

      {/* Health Insights Card */}
      {insights && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Health Insights</Text>
          <View style={styles.insightBox}>
            <MaterialCommunityIcons 
              name={insights.icon} 
              size={40} 
              color={insights.color} 
              style={styles.insightIcon}
            />
            <Text style={styles.insightTitle}>{insights.title}</Text>
            <Text style={styles.insightMessage}>{insights.message}</Text>
            {insights.recommendation && (
              <Text style={styles.insightRecommendation}>
                💡 {insights.recommendation}
              </Text>
            )}
          </View>
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Quick Actions</Text>
        <TouchableOpacity style={styles.actionButton}>
          <MaterialCommunityIcons name="plus-circle" size={24} color="#FFF" />
          <Text style={styles.actionButtonText}>Add Manual Reading</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#3498DB' }]}>
          <MaterialCommunityIcons name="camera" size={24} color="#FFF" />
          <Text style={styles.actionButtonText}>Upload Screenshot</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECF0F1',
    padding: 12,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 12,
  },
  readingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusIndicator: {
    padding: 12,
    borderRadius: 8,
    flex: 1,
  },
  statusLabel: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 12,
  },
  bpNumbers: {
    flex: 1,
    alignItems: 'center',
    marginLeft: 16,
  },
  bpValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  bpUnit: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  timestamp: {
    fontSize: 10,
    color: '#95A5A6',
    marginTop: 4,
  },
  averageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  averageBox: {
    alignItems: 'center',
    flex: 1,
  },
  averageValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 8,
  },
  averageLabel: {
    fontSize: 11,
    color: '#7F8C8D',
    marginTop: 4,
  },
  insightBox: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  insightIcon: {
    marginBottom: 12,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  insightMessage: {
    fontSize: 13,
    color: '#555',
    marginTop: 8,
    textAlign: 'center',
  },
  insightRecommendation: {
    fontSize: 12,
    color: '#27AE60',
    marginTop: 12,
    fontStyle: 'italic',
  },
  actionButton: {
    backgroundColor: '#E74C3C',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  actionButtonText: {
    color: '#FFF',
    fontWeight: '600',
    marginLeft: 8,
  },
});

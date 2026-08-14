import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { firebaseService } from '../services/firebaseService';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width - 40;

export default function GraphsScreen() {
  const [activeTab, setActiveTab] = useState('weekly');
  const [weeklyData, setWeeklyData] = useState(null);
  const [monthlyData, setMonthlyData] = useState(null);
  const [stats, setStats] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      if (activeTab === 'weekly') {
        const data = await firebaseService.getWeeklyData();
        setWeeklyData(data);
      } else {
        const data = await firebaseService.getMonthlyData();
        setMonthlyData(data);
      }
      const statsData = await firebaseService.getStats(activeTab);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const renderChart = () => {
    const data = activeTab === 'weekly' ? weeklyData : monthlyData;
    
    if (!data) return null;

    return (
      <LineChart
        data={{
          labels: data.labels,
          datasets: [
            {
              data: data.systolic,
              color: () => '#E74C3C',
              strokeWidth: 2,
              label: 'Systolic',
            },
            {
              data: data.diastolic,
              color: () => '#3498DB',
              strokeWidth: 2,
              label: 'Diastolic',
            },
          ],
        }}
        width={screenWidth}
        height={250}
        yAxisLabel=""
        yAxisSuffix=""
        yAxisInterval={10}
        chartConfig={{
          backgroundColor: '#FFF',
          backgroundGradientFrom: '#FFF',
          backgroundGradientTo: '#FFF',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity * 0.7})`,
          style: {
            borderRadius: 12,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#E74C3C',
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 12,
        }}
      />
    );
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Tab Selection */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'weekly' && styles.activeTab]}
          onPress={() => setActiveTab('weekly')}
        >
          <Text style={[styles.tabText, activeTab === 'weekly' && styles.activeTabText]}>
            Weekly
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'monthly' && styles.activeTab]}
          onPress={() => setActiveTab('monthly')}
        >
          <Text style={[styles.tabText, activeTab === 'monthly' && styles.activeTabText]}>
            Monthly
          </Text>
        </TouchableOpacity>
      </View>

      {/* Chart */}
      {(weeklyData || monthlyData) && (
        <View style={styles.chartCard}>
          <Text style={styles.cardTitle}>
            {activeTab === 'weekly' ? 'Weekly Trend' : 'Monthly Trend'}
          </Text>
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#E74C3C' }]} />
              <Text style={styles.legendText}>Systolic</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#3498DB' }]} />
              <Text style={styles.legendText}>Diastolic</Text>
            </View>
          </View>
          {renderChart()}
        </View>
      )}

      {/* Statistics */}
      {stats && (
        <View style={styles.statsContainer}>
          <Text style={styles.cardTitle}>
            {activeTab === 'weekly' ? 'Weekly' : 'Monthly'} Statistics
          </Text>
          
          <View style={styles.statsGrid}>
            <StatBox 
              icon="arrow-up-bold"
              label="Highest"
              value={`${stats.highest.systolic}/${stats.highest.diastolic}`}
              color="#E74C3C"
            />
            <StatBox 
              icon="arrow-down-bold"
              label="Lowest"
              value={`${stats.lowest.systolic}/${stats.lowest.diastolic}`}
              color="#27AE60"
            />
            <StatBox 
              icon="chart-line"
              label="Average"
              value={`${stats.average.systolic}/${stats.average.diastolic}`}
              color="#3498DB"
            />
            <StatBox 
              icon="heart"
              label="Readings"
              value={stats.count}
              color="#9B59B6"
            />
          </View>

          {/* Trend Analysis */}
          {stats.trend && (
            <View style={styles.trendCard}>
              <MaterialCommunityIcons 
                name={stats.trend.direction === 'up' ? 'trending-up' : 'trending-down'} 
                size={24} 
                color={stats.trend.direction === 'up' ? '#E74C3C' : '#27AE60'}
              />
              <Text style={styles.trendText}>
                {stats.trend.message}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Health Recommendations */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recommendations</Text>
        <RecommendationItem 
          icon="lightbulb-on"
          title="Keep Reading Regularly"
          description="Try to record your blood pressure at the same time each day"
        />
        <RecommendationItem 
          icon="dumbbell"
          title="Stay Active"
          description="Regular exercise can help maintain healthy blood pressure"
        />
        <RecommendationItem 
          icon="salt"
          title="Reduce Sodium"
          description="Limiting salt intake helps lower blood pressure"
        />
      </View>

      <View style={styles.spacer} />
    </ScrollView>
  );
}

function StatBox({ icon, label, value, color }) {
  return (
    <View style={styles.statBox}>
      <MaterialCommunityIcons name={icon} size={24} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function RecommendationItem({ icon, title, description }) {
  return (
    <View style={styles.recommendationItem}>
      <MaterialCommunityIcons name={icon} size={20} color="#F39C12" />
      <View style={styles.recommendationText}>
        <Text style={styles.recommendationTitle}>{title}</Text>
        <Text style={styles.recommendationDescription}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECF0F1',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginBottom: 16,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#E74C3C',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7F8C8D',
  },
  activeTabText: {
    color: '#FFF',
  },
  chartCard: {
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
  card: {
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
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 12,
  },
  legendContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#555',
  },
  statsContainer: {
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statBox: {
    width: '48%',
    backgroundColor: '#ECF0F1',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 11,
    color: '#7F8C8D',
    marginTop: 4,
  },
  trendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  trendText: {
    fontSize: 12,
    color: '#2C3E50',
    marginLeft: 8,
    flex: 1,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  recommendationText: {
    flex: 1,
    marginLeft: 12,
  },
  recommendationTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2C3E50',
  },
  recommendationDescription: {
    fontSize: 11,
    color: '#7F8C8D',
    marginTop: 4,
  },
  spacer: {
    height: 20,
  },
});

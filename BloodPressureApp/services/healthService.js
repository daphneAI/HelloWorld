// Health insights and recommendations based on blood pressure data

export function getHealthInsights(weeklyAverage) {
  if (!weeklyAverage) {
    return {
      title: 'No data yet',
      message: 'Start tracking your blood pressure to get insights',
      icon: 'information-outline',
      color: '#95A5A6',
    };
  }

  const { systolic, diastolic } = weeklyAverage;

  if (systolic < 120 && diastolic < 80) {
    return {
      title: '✅ Excellent Blood Pressure',
      message: 'Your blood pressure is within normal range. Keep maintaining your healthy lifestyle!',
      icon: 'heart-check',
      color: '#27AE60',
      recommendation: 'Continue regular exercise and maintain a balanced diet.',
    };
  }

  if (systolic < 130 && diastolic < 80) {
    return {
      title: '⚠️ Elevated Blood Pressure',
      message: 'Your BP is slightly elevated. Monitor closely and make lifestyle changes.',
      icon: 'alert-circle',
      color: '#F39C12',
      recommendation: 'Reduce sodium intake, exercise regularly, and manage stress.',
    };
  }

  if (systolic < 140 || diastolic < 90) {
    return {
      title: '⚠️ Stage 1 Hypertension',
      message: 'Your blood pressure is in the Stage 1 hypertension range. Consider consulting your doctor.',
      icon: 'alert',
      color: '#E67E22',
      recommendation: 'Schedule an appointment with your healthcare provider.',
    };
  }

  return {
    title: '🚨 Stage 2 Hypertension',
    message: 'Your blood pressure is elevated. Please consult your doctor immediately.',
    icon: 'hospital-box',
    color: '#E74C3C',
    recommendation: 'Seek medical attention to rule out serious conditions.',
  };
}

// Get health recommendations based on readings
export function getHealthRecommendations(weeklyAverage, monthlyAverage) {
  const recommendations = [];

  if (!weeklyAverage) return recommendations;

  const { systolic, diastolic } = weeklyAverage;

  // Activity recommendations
  if (systolic > 130 || diastolic > 85) {
    recommendations.push({
      category: 'Exercise',
      title: '30 minutes of aerobic activity',
      description: 'Daily moderate exercise can help lower BP by 5-8 mmHg',
      icon: 'run',
      priority: 'high',
    });
  } else {
    recommendations.push({
      category: 'Exercise',
      title: 'Maintain regular activity',
      description: 'Keep up your current exercise routine',
      icon: 'dumbbell',
      priority: 'medium',
    });
  }

  // Dietary recommendations
  if (systolic > 120 || diastolic > 80) {
    recommendations.push({
      category: 'Diet',
      title: 'DASH Diet',
      description: 'Rich in fruits, vegetables, whole grains, and lean proteins',
      icon: 'leaf',
      priority: 'high',
    });

    recommendations.push({
      category: 'Diet',
      title: 'Limit sodium to <2.3g daily',
      description: 'Reducing salt can lower BP by 5-6 mmHg',
      icon: 'salt',
      priority: 'high',
    });
  }

  // Stress management
  recommendations.push({
    category: 'Stress Management',
    title: 'Practice relaxation techniques',
    description: 'Meditation, deep breathing, or yoga can help reduce BP',
    icon: 'meditation',
    priority: 'medium',
  });

  // Weight management
  recommendations.push({
    category: 'Weight',
    title: 'Maintain healthy weight',
    description: 'Each kg of weight loss can lower BP by ~1 mmHg',
    icon: 'weight',
    priority: 'medium',
  });

  // Medical check-up
  if (systolic > 140 || diastolic > 90) {
    recommendations.push({
      category: 'Medical',
      title: 'Schedule doctor appointment',
      description: 'Regular monitoring and medication may be necessary',
      icon: 'hospital-box',
      priority: 'high',
    });
  }

  return recommendations;
}

// Analyze trends
export function analyzeTrends(readings) {
  if (readings.length < 2) {
    return {
      trend: 'insufficient_data',
      message: 'Need more readings for trend analysis',
    };
  }

  const firstReading = readings[readings.length - 1];
  const lastReading = readings[0];

  const systolicChange = lastReading.systolic - firstReading.systolic;
  const diastolicChange = lastReading.diastolic - firstReading.diastolic;

  let trend = 'stable';
  let message = 'Your BP is stable.';

  if (systolicChange > 10 || diastolicChange > 5) {
    trend = 'increasing';
    message = `Your BP is increasing. Current: ${lastReading.systolic}/${lastReading.diastolic}. Consider lifestyle changes.`;
  } else if (systolicChange < -10 || diastolicChange < -5) {
    trend = 'decreasing';
    message = `Your BP is improving! Current: ${lastReading.systolic}/${lastReading.diastolic}. Keep it up!`;
  }

  return {
    trend,
    message,
    systolicChange,
    diastolicChange,
    direction: systolicChange > 0 ? 'up' : 'down',
  };
}

// Risk assessment
export function assessRisk(weeklyAverage, age) {
  if (!weeklyAverage) return { risk: 'unknown', score: 0 };

  let riskScore = 0;
  const { systolic, diastolic } = weeklyAverage;

  // BP component
  if (systolic < 120 && diastolic < 80) {
    riskScore += 0;
  } else if (systolic < 130 && diastolic < 80) {
    riskScore += 1;
  } else if (systolic < 140 || diastolic < 90) {
    riskScore += 2;
  } else {
    riskScore += 3;
  }

  // Age component
  if (age && age > 60) {
    riskScore += 1;
  }

  let riskLevel = 'low';
  let riskMessage = 'Your cardiovascular risk is low';

  if (riskScore >= 4) {
    riskLevel = 'high';
    riskMessage = 'Your cardiovascular risk is elevated. Consult with a healthcare provider.';
  } else if (riskScore >= 2) {
    riskLevel = 'moderate';
    riskMessage = 'Your cardiovascular risk is moderate. Monitor closely.';
  }

  return {
    risk: riskLevel,
    score: riskScore,
    message: riskMessage,
  };
}

// Get BP category description
export function getCategoryDescription(systolic, diastolic) {
  if (systolic < 120 && diastolic < 80) {
    return {
      category: 'Normal',
      description: 'Your blood pressure is healthy. Maintain your lifestyle.',
      color: '#27AE60',
    };
  }

  if (systolic < 130 && diastolic < 80) {
    return {
      category: 'Elevated',
      description: 'Your blood pressure is elevated but not yet hypertension.',
      color: '#F39C12',
    };
  }

  if (systolic < 140 || diastolic < 90) {
    return {
      category: 'Stage 1 Hypertension',
      description: 'Your blood pressure is in Stage 1 hypertension range.',
      color: '#E67E22',
    };
  }

  return {
    category: 'Stage 2 Hypertension',
    description: 'Your blood pressure is critically elevated. Seek medical attention.',
    color: '#E74C3C',
  };
}

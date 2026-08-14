import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ocrService } from '../services/ocrService';
import { firebaseService } from '../services/firebaseService';

export default function ScreenshotScreen() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        setSelectedImage(result.uri);
        await analyzeImage(result.uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image: ' + error.message);
    }
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.cancelled) {
        setSelectedImage(result.uri);
        await analyzeImage(result.uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo: ' + error.message);
    }
  };

  const analyzeImage = async (imageUri) => {
    try {
      setLoading(true);
      const data = await ocrService.extractBloodPressure(imageUri);
      setExtractedData(data);
    } catch (error) {
      Alert.alert('Error', 'Could not extract data: ' + error.message);
      setExtractedData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveExtractedData = async () => {
    if (!extractedData || (!extractedData.systolic || !extractedData.diastolic)) {
      Alert.alert('Error', 'No valid blood pressure data extracted');
      return;
    }

    try {
      setUploading(true);
      
      // Save to Firebase
      await firebaseService.addBloodPressureReading({
        systolic: extractedData.systolic,
        diastolic: extractedData.diastolic,
        pulse: extractedData.pulse || null,
        notes: `Extracted from screenshot - ${new Date().toLocaleString()}`,
        imageUrl: selectedImage,
        timestamp: new Date(),
      });

      Alert.alert('Success', 'Blood pressure reading saved!');
      setSelectedImage(null);
      setExtractedData(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to save: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleManualCorrection = (field, value) => {
    setExtractedData({
      ...extractedData,
      [field]: value,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="camera-plus" size={40} color="#E74C3C" />
        <Text style={styles.headerText}>Upload Blood Pressure Screenshot</Text>
        <Text style={styles.headerSubtext}>
          Take or upload a photo of your blood pressure device
        </Text>
      </View>

      {!selectedImage ? (
        <View style={styles.uploadSection}>
          <View style={styles.uploadBox}>
            <MaterialCommunityIcons name="cloud-upload-outline" size={50} color="#3498DB" />
            <Text style={styles.uploadText}>Select an Image</Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={takePhoto}>
            <MaterialCommunityIcons name="camera" size={24} color="#FFF" />
            <Text style={styles.buttonText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, { backgroundColor: '#3498DB' }]} onPress={pickImage}>
            <MaterialCommunityIcons name="image-plus" size={24} color="#FFF" />
            <Text style={styles.buttonText}>Choose from Gallery</Text>
          </TouchableOpacity>

          <View style={styles.infoBox}>
            <MaterialCommunityIcons name="lightbulb-outline" size={20} color="#F39C12" />
            <Text style={styles.infoText}>
              Make sure the screenshot clearly shows the blood pressure reading for accurate extraction.
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.previewSection}>
          {/* Image Preview */}
          <View style={styles.imagePreview}>
            <Image 
              source={{ uri: selectedImage }} 
              style={styles.image}
              resizeMode="contain"
            />
          </View>

          {/* Extracted Data */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#E74C3C" />
              <Text style={styles.loadingText}>Analyzing image...</Text>
            </View>
          ) : extractedData ? (
            <View style={styles.dataCard}>
              <Text style={styles.cardTitle}>Extracted Data</Text>
              
              {/* Display extracted values with edit capability */}
              <View style={styles.extractedRow}>
                <View style={styles.extractedColumn}>
                  <Text style={styles.extractedLabel}>Systolic</Text>
                  <View style={styles.extractedValueBox}>
                    <Text style={styles.extractedValue}>
                      {extractedData.systolic || '--'}
                    </Text>
                    <Text style={styles.unit}>mmHg</Text>
                  </View>
                </View>

                <View style={styles.extractedColumn}>
                  <Text style={styles.extractedLabel}>Diastolic</Text>
                  <View style={styles.extractedValueBox}>
                    <Text style={styles.extractedValue}>
                      {extractedData.diastolic || '--'}
                    </Text>
                    <Text style={styles.unit}>mmHg</Text>
                  </View>
                </View>

                {extractedData.pulse && (
                  <View style={styles.extractedColumn}>
                    <Text style={styles.extractedLabel}>Pulse</Text>
                    <View style={styles.extractedValueBox}>
                      <Text style={styles.extractedValue}>
                        {extractedData.pulse}
                      </Text>
                      <Text style={styles.unit}>BPM</Text>
                    </View>
                  </View>
                )}
              </View>

              {/* Confidence Score */}
              {extractedData.confidence && (
                <View style={styles.confidenceBox}>
                  <MaterialCommunityIcons 
                    name={extractedData.confidence > 0.7 ? 'check-circle' : 'alert-circle'} 
                    size={20} 
                    color={extractedData.confidence > 0.7 ? '#27AE60' : '#F39C12'}
                  />
                  <Text style={styles.confidenceText}>
                    Confidence: {Math.round(extractedData.confidence * 100)}%
                  </Text>
                </View>
              )}

              {/* Warning if low confidence */}
              {extractedData.confidence && extractedData.confidence < 0.7 && (
                <View style={styles.warningBox}>
                  <Text style={styles.warningText}>
                    ⚠️ Low confidence. Please verify the extracted values are correct.
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.errorBox}>
              <MaterialCommunityIcons name="alert-circle" size={30} color="#E74C3C" />
              <Text style={styles.errorText}>
                Could not extract blood pressure data from the image.
              </Text>
              <Text style={styles.errorSubtext}>
                Please ensure the image clearly shows the BP reading and try again.
              </Text>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            {extractedData && (
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: '#27AE60' }]}
                onPress={handleSaveExtractedData}
                disabled={uploading}
              >
                <MaterialCommunityIcons name="check" size={24} color="#FFF" />
                <Text style={styles.actionButtonText}>
                  {uploading ? 'Saving...' : 'Save Reading'}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: '#95A5A6' }]}
              onPress={() => {
                setSelectedImage(null);
                setExtractedData(null);
              }}
            >
              <MaterialCommunityIcons name="close" size={24} color="#FFF" />
              <Text style={styles.actionButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECF0F1',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginTop: 8,
  },
  headerSubtext: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 4,
    textAlign: 'center',
  },
  uploadSection: {
    padding: 16,
  },
  uploadBox: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#3498DB',
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginTop: 12,
  },
  button: {
    backgroundColor: '#E74C3C',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 14,
  },
  infoBox: {
    backgroundColor: '#FFF4E6',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 16,
  },
  infoText: {
    fontSize: 12,
    color: '#2C3E50',
    marginLeft: 12,
    flex: 1,
  },
  previewSection: {
    padding: 16,
  },
  imagePreview: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 14,
    color: '#2C3E50',
    marginTop: 12,
  },
  dataCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 12,
  },
  extractedRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  extractedColumn: {
    alignItems: 'center',
  },
  extractedLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginBottom: 6,
  },
  extractedValueBox: {
    alignItems: 'center',
    backgroundColor: '#ECF0F1',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  extractedValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E74C3C',
  },
  unit: {
    fontSize: 10,
    color: '#7F8C8D',
    marginTop: 4,
  },
  confidenceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F8F5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  confidenceText: {
    fontSize: 12,
    color: '#27AE60',
    marginLeft: 8,
    fontWeight: '600',
  },
  warningBox: {
    backgroundColor: '#FEF5E7',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F39C12',
  },
  warningText: {
    fontSize: 12,
    color: '#D68910',
  },
  errorBox: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E74C3C',
    marginTop: 12,
  },
  errorSubtext: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 6,
    textAlign: 'center',
  },
  actionButtons: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  actionButtonText: {
    color: '#FFF',
    fontWeight: '600',
    marginLeft: 8,
  },
});

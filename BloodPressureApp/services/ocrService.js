import * as FileSystem from 'expo-file-system';

export const ocrService = {
  // Extract blood pressure data from image using OCR
  extractBloodPressure: async (imageUri) => {
    try {
      // Convert image to base64
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Call Google Cloud Vision API or similar OCR service
      const response = await fetch(
        `https://vision.googleapis.com/v1/images:annotate?key=${process.env.REACT_APP_GOOGLE_VISION_API_KEY}`,
        {
          method: 'POST',
          body: JSON.stringify({
            requests: [
              {
                image: {
                  content: base64,
                },
                features: [
                  {
                    type: 'TEXT_DETECTION',
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      const extractedText = data.responses[0].fullTextAnnotation?.text || '';

      // Parse extracted text to find blood pressure readings
      return parseBloodPressure(extractedText);
    } catch (error) {
      console.error('OCR Error:', error);
      throw new Error('Failed to extract data from image');
    }
  },

  // Alternative: Local image processing (fallback)
  extractBloodPressureLocal: async (imageUri) => {
    try {
      // This would use a local ML model via React Native ML Kit
      // For now, return null to indicate manual entry needed
      return null;
    } catch (error) {
      console.error('Local OCR Error:', error);
      throw error;
    }
  },
};

// Parse OCR text to extract blood pressure values
function parseBloodPressure(text) {
  const result = {
    systolic: null,
    diastolic: null,
    pulse: null,
    confidence: 0,
  };

  // Common patterns for blood pressure readings
  // Pattern: XXX/XX (e.g., 120/80)
  const bpPattern = /(\d{2,3})\s*\/\s*(\d{2,3})/g;
  const matches = [...text.matchAll(bpPattern)];

  if (matches.length > 0) {
    // Get the most likely reading (usually first or largest)
    const match = matches[0];
    result.systolic = parseInt(match[1]);
    result.diastolic = parseInt(match[2]);

    // Validate readings
    if (result.systolic < 60 || result.systolic > 200 ||
        result.diastolic < 40 || result.diastolic > 150) {
      // Invalid range
      result.systolic = null;
      result.diastolic = null;
      result.confidence = 0.3;
    } else {
      result.confidence = 0.85;
    }
  }

  // Look for pulse/heart rate
  const pulsePattern = /(?:pulse|bpm|heart rate)[:\s]*(\d{2,3})/i;
  const pulseMatch = text.match(pulsePattern);
  if (pulseMatch) {
    result.pulse = parseInt(pulseMatch[1]);
    if (result.pulse < 40 || result.pulse > 200) {
      result.pulse = null;
    }
  }

  // Check confidence level
  if (result.systolic && result.diastolic) {
    // Increase confidence if we found multiple readings or supporting text
    if (text.toLowerCase().includes('blood pressure') ||
        text.toLowerCase().includes('systolic') ||
        text.toLowerCase().includes('diastolic')) {
      result.confidence = Math.min(result.confidence + 0.1, 0.95);
    }
  }

  return result;
}

// Validate extracted blood pressure data
export function validateBloodPressure(systolic, diastolic) {
  if (!systolic || !diastolic) return false;
  
  const sys = parseInt(systolic);
  const dia = parseInt(diastolic);
  
  // Check reasonable ranges
  if (sys < 60 || sys > 200) return false;
  if (dia < 40 || dia > 150) return false;
  if (sys <= dia) return false; // Systolic should be higher than diastolic
  
  return true;
}

// Get blood pressure category
export function getBloodPressureCategory(systolic, diastolic) {
  if (systolic < 120 && diastolic < 80) return 'Normal';
  if (systolic < 130 && diastolic < 80) return 'Elevated';
  if (systolic < 140 || diastolic < 90) return 'Stage 1 Hypertension';
  return 'Stage 2 Hypertension';
}

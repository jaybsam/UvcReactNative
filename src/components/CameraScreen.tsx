import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import UvcCameraView from './UvcCameraView';
import UvcCameraManager, { UsbDevice } from '../modules/UvcCameraManager';

const CameraScreen: React.FC = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [isPreviewActive, setIsPreviewActive] = useState(false);
  const [connectedDevices, setConnectedDevices] = useState<UsbDevice[]>([]);
  const [status, setStatus] = useState('Ready');
  const cameraViewRef = useRef(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setStatus('Initializing app...');
        await requestPermissions();
        setStatus('Ready - Tap "Start Monitoring" to begin');
      } catch (error) {
        console.error('App initialization error:', error);
        setStatus(`Initialization error: ${error}`);
      }
    };

    initializeApp();

    return () => {
      // Cleanup on unmount
      const cleanup = async () => {
        try {
          if (isMonitoring) {
            await handleStopMonitoring();
          }
        } catch (error) {
          console.error('Cleanup error:', error);
        }
      };
      cleanup();
    };
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        // Check Android version for proper permission handling
        const androidVersion = Platform.Version;
        console.log('Android version:', androidVersion);
        
        let permissionsToRequest = [
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ];

        // Add storage permissions based on Android version
        if (androidVersion >= 33) {
          // Android 13+ (API 33+)
          permissionsToRequest.push(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO
          );
        } else if (androidVersion >= 30) {
          // Android 11-12 (API 30-32)
          permissionsToRequest.push(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
          );
        } else {
          // Android 10 and below
          permissionsToRequest.push(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
          );
        }

        const granted = await PermissionsAndroid.requestMultiple(permissionsToRequest);

        const allPermissionsGranted = Object.values(granted).every(
          permission => permission === PermissionsAndroid.RESULTS.GRANTED
        );

        if (!allPermissionsGranted) {
          Alert.alert(
            'Permissions Required', 
            'Camera and storage permissions are required for this app to work properly. Please grant them in Settings if you denied them.',
            [
              { text: 'OK' },
              { text: 'Open Settings', onPress: () => {
                // You can add code to open app settings here if needed
              }}
            ]
          );
        } else {
          setStatus('Permissions granted successfully');
        }
      } catch (err) {
        console.warn('Permission request error:', err);
        Alert.alert('Permission Error', 'Failed to request permissions. Please try again.');
      }
    }
  };

  const handleStartMonitoring = async () => {
    try {
      setStatus('Starting monitoring...');
      const result = await UvcCameraManager.startMonitoring();
      setIsMonitoring(true);
      setStatus(result);
      
      // Refresh device list
      await refreshDeviceList();
    } catch (error) {
      setStatus(`Error: ${error}`);
      Alert.alert('Error', `Failed to start monitoring: ${error}`);
    }
  };

  const handleStopMonitoring = async () => {
    try {
      setStatus('Stopping monitoring...');
      
      // Stop preview first if active
      if (isPreviewActive) {
        await handleStopPreview();
      }
      
      const result = await UvcCameraManager.stopMonitoring();
      setIsMonitoring(false);
      setConnectedDevices([]);
      setStatus(result);
    } catch (error) {
      setStatus(`Error: ${error}`);
      Alert.alert('Error', `Failed to stop monitoring: ${error}`);
    }
  };

  const refreshDeviceList = async () => {
    try {
      const devices = await UvcCameraManager.getConnectedDevices();
      setConnectedDevices(devices);
      setStatus(`Found ${devices.length} device(s)`);
    } catch (error) {
      setStatus(`Error getting devices: ${error}`);
    }
  };

  const handleStartPreview = async () => {
    try {
      setStatus('Starting preview...');
      const result = await UvcCameraManager.startPreview();
      setIsPreviewActive(true);
      setStatus(result);
    } catch (error) {
      setStatus(`Error: ${error}`);
      Alert.alert('Error', `Failed to start preview: ${error}`);
    }
  };

  const handleStopPreview = async () => {
    try {
      setStatus('Stopping preview...');
      const result = await UvcCameraManager.stopPreview();
      setIsPreviewActive(false);
      setStatus(result);
    } catch (error) {
      setStatus(`Error: ${error}`);
      Alert.alert('Error', `Failed to stop preview: ${error}`);
    }
  };

  const renderDevice = (device: UsbDevice, index: number) => (
    <View key={index} style={styles.deviceItem}>
      <Text style={styles.deviceName}>{device.deviceName}</Text>
      <Text style={styles.deviceInfo}>
        Vendor ID: 0x{device.vendorId.toString(16).toUpperCase()}
      </Text>
      <Text style={styles.deviceInfo}>
        Product ID: 0x{device.productId.toString(16).toUpperCase()}
      </Text>
      {device.manufacturerName && (
        <Text style={styles.deviceInfo}>Manufacturer: {device.manufacturerName}</Text>
      )}
      {device.productName && (
        <Text style={styles.deviceInfo}>Product: {device.productName}</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>UVC React Native</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Status: </Text>
        <Text style={styles.statusText}>{status}</Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, isMonitoring && styles.buttonActive]}
          onPress={isMonitoring ? handleStopMonitoring : handleStartMonitoring}
          disabled={false}
        >
          <Text style={styles.buttonText}>
            {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonSecondary]}
          onPress={refreshDeviceList}
          disabled={!isMonitoring}
        >
          <Text style={styles.buttonText}>Refresh Devices</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, isPreviewActive && styles.buttonActive]}
          onPress={isPreviewActive ? handleStopPreview : handleStartPreview}
          disabled={!isMonitoring || connectedDevices.length === 0}
        >
          <Text style={styles.buttonText}>
            {isPreviewActive ? 'Stop Preview' : 'Start Preview'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cameraContainer}>
        <View style={styles.cameraPlaceholder}>
          <Text style={styles.cameraPlaceholderText}>📹</Text>
          <Text style={styles.cameraPlaceholderTitle}>Camera Preview</Text>
          <Text style={styles.cameraPlaceholderSubtitle}>
            Will be available after UVC library{'\n'}
            compatibility is resolved
          </Text>
        </View>
      </View>

      <ScrollView style={styles.deviceList}>
        <Text style={styles.deviceListTitle}>Connected USB Devices:</Text>
        {connectedDevices.length === 0 ? (
          <Text style={styles.noDevices}>No devices found</Text>
        ) : (
          connectedDevices.map(renderDevice)
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  infoBox: {
    backgroundColor: '#e8f5e8',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#388E3C',
    lineHeight: 20,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#e9e9e9',
    borderRadius: 8,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statusText: {
    fontSize: 16,
    color: '#666',
    flex: 1,
    flexWrap: 'wrap',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  buttonActive: {
    backgroundColor: '#FF3B30',
  },
  buttonSecondary: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cameraContainer: {
    height: 200,
    backgroundColor: '#000',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  cameraView: {
    flex: 1,
  },
  cameraPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cameraPlaceholderText: {
    fontSize: 48,
    marginBottom: 16,
  },
  cameraPlaceholderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  cameraPlaceholderSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  deviceList: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
  },
  deviceListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  deviceItem: {
    padding: 12,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  deviceInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  noDevices: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default CameraScreen;
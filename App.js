import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';

const App = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state for camera devices
  const [activeDevice, setActiveDevice] = useState(null);
  const devices = useCameraDevices();

  useEffect(() => {
    const getPermissions = async () => {
      const cameraStatus = await request(
        Platform.OS === 'android'
          ? PERMISSIONS.ANDROID.CAMERA
          : PERMISSIONS.IOS.CAMERA,
      );
      const microphoneStatus = await request(
        Platform.OS === 'android'
          ? PERMISSIONS.ANDROID.RECORD_AUDIO
          : PERMISSIONS.IOS.MICROPHONE,
      );

      if (
        cameraStatus === RESULTS.GRANTED &&
        microphoneStatus === RESULTS.GRANTED
      ) {
        setHasPermission(true);
      } else {
        Alert.alert(
          'Autorizzazioni Negate',
          'La tua app ha bisogno di accedere alla fotocamera e al microfono per funzionare correttamente.',
        );
      }
    };

    getPermissions();
  }, []);

  useEffect(() => {
    if (devices && Object.values(devices).length > 0) {
      // Select the first available camera
      const firstAvailableCamera = Object.values(devices)[0];
      setActiveDevice(firstAvailableCamera);
      setLoading(false);
    }
  }, [devices]);

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text>Autorizzazione alla fotocamera negata.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        {loading || !activeDevice ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <Camera
            style={StyleSheet.absoluteFill}
            device={activeDevice}
            isActive={true}
            photo={true}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  text: {
    color: 'black',
    fontSize: 18,
  },
});

export default App;

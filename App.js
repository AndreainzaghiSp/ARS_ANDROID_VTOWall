import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Alert, Platform } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const App = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const devices = useCameraDevices();
  const device = devices.back;

  useEffect(() => {
    const getPermissions = async () => {
      const cameraStatus = await request(
        Platform.OS === 'android'
          ? PERMISSIONS.ANDROID.CAMERA
          : PERMISSIONS.IOS.CAMERA
      );
      const microphoneStatus = await request(
        Platform.OS === 'android'
          ? PERMISSIONS.ANDROID.RECORD_AUDIO
          : PERMISSIONS.IOS.MICROPHONE
      );

      if (cameraStatus === RESULTS.GRANTED && microphoneStatus === RESULTS.GRANTED) {
        setHasPermission(true);
      } else {
        Alert.alert(
          'Autorizzazioni Negate',
          'La tua app ha bisogno di accedere alla fotocamera e al microfono per funzionare correttamente.'
        );
      }
    };

    getPermissions();
  }, []);

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text>Autorizzazione alla fotocamera negata.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {device != null ? (
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          photo={true}
        />
      ) : (
        <Text>Caricamento della fotocamera...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;

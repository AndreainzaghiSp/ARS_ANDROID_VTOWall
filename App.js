// App.js
import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Platform } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';

const App = () => {
  const camera = useRef(null);
  const devices = useCameraDevices();
  const device = devices.back;

  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    const getPermissions = async () => {
      const cameraPermission = await Camera.requestCameraPermission();
      console.log('Camera Permission:', cameraPermission);
      const microphonePermission = await Camera.requestMicrophonePermission();
      console.log('Microphone Permission:', microphonePermission);
      if (
        cameraPermission === 'authorized' &&
        microphonePermission === 'authorized'
      ) {
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

  const takePhoto = async () => {
    if (camera.current == null) return;

    try {
      const photo = await camera.current.takePhoto({
        flash: 'auto',
      });
      Alert.alert('Foto Scattata!', `URI: file://${photo.path}`);
      console.log(photo);
    } catch (error) {
      console.error(error);
      Alert.alert('Errore', 'Non è stato possibile scattare la foto.');
    }
  };

  if (device == null) {
    return (
      <View style={styles.container}>
        <Text>Caricamento della fotocamera...</Text>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text>Autorizzazione alla fotocamera negata.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
        ref={camera}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={takePhoto} style={styles.button}>
          <Text style={styles.text}>Scatta Foto</Text>
        </TouchableOpacity>
      </View>
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
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
    width: 100,
  },
  text: {
    fontSize: 14,
    color: '#000',
  },
});

export default App;

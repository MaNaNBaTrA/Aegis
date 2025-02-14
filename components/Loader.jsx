import { View, Text } from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';

const Loader = ({ message }) => {
  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999
    }}>
      <LottieView
        source={require('../assets/Loader/Loader.json')}
        autoPlay
        loop
        style={{ width: 200, height: 200 }}
        renderMode="AUTOMATIC"
        resizeMode="contain"
      />
      {message && (
        <Text style={{
          marginTop: 10,
          fontSize: 16,
          color: '#666',
          textAlign: 'center'
        }}>
          {message}
        </Text>
      )}
    </View>
  );
};

export default Loader;
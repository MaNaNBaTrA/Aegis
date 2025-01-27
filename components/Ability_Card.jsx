import React, { useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Colors } from '../constants/Colors';

const { height } = Dimensions.get('window');

const AbilityCard = ({ title, icon, abilityName, onPress }) => {
  const [isVisible, setIsVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(height)).current;

  const showAbilityBox = () => {
    setIsVisible(true);
    Animated.timing(slideAnim, {
      toValue: height / 2,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const hideAbilityBox = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 500,
      useNativeDriver: true,
    }).start(() => setIsVisible(false));
  };

  return (
    <View style={{
      width: '90%',
      backgroundColor: Colors.ABILITIESBG,
      marginBottom: 10,
    }}>
      <Text
        style={{
          backgroundColor: Colors.ABILITIESTYPE,
          fontFamily: "Montserrat-SemiBold",
          paddingLeft: 8,
          fontSize: 14,
          paddingVertical: 4,
        }}
      >
        {title}
      </Text>
      <TouchableOpacity onPress={showAbilityBox}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 8,
        }}>
          <View style={{ width: '15%', alignItems: 'center' }}>
            <Image source={icon} />
          </View>

          <View style={{
            width: 1,
            height: '80%',
            backgroundColor: Colors.ABILITIES,
            marginHorizontal: 10,
          }} />
          
          <View style={{ width: '40%', alignItems: 'center' }}>
            <Image source={icon} />
          </View>

          <View style={{
            width: 1,
            height: '80%',
            backgroundColor: Colors.ABILITIES,
            marginHorizontal: 10,
          }} />

          <View style={{ width: '35%', alignItems: 'center' }}>
            <Text style={{ fontFamily: "Montserrat-SemiBold" }}>
              {abilityName}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {isVisible && (
        <Animated.View
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            height: height / 2,
            backgroundColor: '#333',
            transform: [{ translateY: slideAnim }],
            padding: 20,
          }}
        >
          <Text style={{ color: '#fff', fontFamily: "Montserrat-SemiBold", fontSize: 16 }}>
            Ability Details Here
          </Text>
          <TouchableOpacity onPress={hideAbilityBox}>
            <Text style={{ color: '#fff', marginTop: 20 }}>Close</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

export default AbilityCard;

import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Linking } from 'react-native';
import Colors from '../constants/Colors'; 

const AbilitiesSection = ({ sectionTitle, data }) => {
  const isImageUrl = (url) => {
    return /\.(jpeg|jpg|gif|png)$/.test(url);
  };

  return (
    <View style={{ width: '90%', zIndex: 2, backgroundColor: Colors.ABILITIESBG }}>
      <Text
        style={{
          backgroundColor: Colors.ABILITIESTYPE,
          fontFamily: 'Montserrat-SemiBold',
          paddingLeft: 8,
          fontSize: 14,
          paddingVertical: 4,
        }}
      >
        {sectionTitle}
      </Text>

      {data.map((item, index) => (
        <TouchableOpacity key={index} onPress={() => item.url && Linking.openURL(item.url)}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 8,
              borderBottomWidth: item.borderBottom ? 1 : 0,
              borderBottomColor: Colors.ABILITIES,
            }}
          >
            <View style={{ width: '15%', alignItems: 'center' }}>
              {isImageUrl(item.shortcut) ? (
                <Image
                  source={{ uri: item.shortcut }} 
                  style={{ width: 24, height: 24 }}
                />
              ) : (
                <Text
                  style={{
                    fontFamily: 'Montserrat-SemiBold',
                    fontSize: 16,
                  }}
                >
                  {item.shortcut}
                </Text>
              )}
            </View>

            <View
              style={{
                width: 1,
                height: '80%',
                backgroundColor: Colors.ABILITIES,
                marginHorizontal: 10,
              }}
            />

            <View style={{ width: '40%', alignItems: 'center' }}>
              <Image source={item.icon} />
            </View>

            <View
              style={{
                width: 1,
                height: '80%',
                backgroundColor: Colors.ABILITIES,
                marginHorizontal: 10,
              }}
            />

            <View style={{ width: '35%', alignItems: 'center' }}>
              <Text
                style={{
                  fontFamily: 'Montserrat-SemiBold',
                  textAlign: 'center',
                }}
              >
                {item.name}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default AbilitiesSection;

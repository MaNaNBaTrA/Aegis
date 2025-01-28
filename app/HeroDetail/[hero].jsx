import { View, Text, Image, ImageBackground, ScrollView, TouchableOpacity, } from 'react-native';
import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Colors } from '../../constants/Colors';

const renderShortcut = (shortcut) => {
  if (shortcut === 'PASSIVE') {
    return (
        <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 13 }}>PASSIVE</Text>
    );
  } else if (typeof shortcut === 'string' && shortcut.includes('.')) {
    return <Image source={{ uri: shortcut }} style={{ width: 24, height: 24 }} />;
  } else if (typeof shortcut === 'number') {
    return <Image source={shortcut} style={{ width: 24, height: 24 }} />;
  } else {
    return <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 16 }}>{shortcut}</Text>;
  }
};

const AbilitiesSection = ({ sectionTitle, data }) => {
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
        <TouchableOpacity key={index} >
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 8,
              borderBottomWidth: index < data.length - 1 ? 1 : 0,
              borderBottomColor: Colors.ABILITIES
            }}
          >
            <View style={{ width: '15%', alignItems: 'center' }}>
              {renderShortcut(item.shortcut)}
            </View>

            <View style={{ width: 1, height: '80%', backgroundColor: Colors.ABILITIES, marginHorizontal: 10 }} />

            <View style={{ width: '40%', alignItems: 'center' }}>
              <Image source={item.icon} />
            </View>

            <View style={{ width: 1, height: '80%', backgroundColor: Colors.ABILITIES, marginHorizontal: 10 }} />

            <View style={{ width: '35%', alignItems: 'center' }}>
              <Text style={{ fontFamily: 'Montserrat-SemiBold', textAlign: 'center' }}>{item.name}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};


const HeroDetail = () => {
  const { hero } = useLocalSearchParams();

  const normalData = [
    {
      shortcut: require('../Demoassets/Left_Mouse.png'),
      icon: require('../Demoassets/NATTACK.png'),
      name: 'QUANTUM MAGIC',
      url: 'https://example.com/normal1',
    },
  ];

  const abilitiesData = [
    {
      shortcut: 'Q', 
      icon: require('../Demoassets/QATTACK.png'),
      name: 'KARMIC REVIVAL',
      url: 'https://example.com/ability1',
    },
    {
      shortcut: 'SHIFT', 
      icon: require('../Demoassets/SHIFTATTACK.png'),
      name: 'SOUL BOND',
      url: 'https://example.com/ability2',
    },
    {
      shortcut: 'E',
      icon: require('../Demoassets/EATTACK.png'),
      name: 'AVATAR LIFE STREAM',
      url: 'https://example.com/ability3',
    },
    {
      shortcut: require('../Demoassets/Right_Mouse.png'), 
      icon: require('../Demoassets/RIGHTMATTACK.png'),
      name: 'COSMIC CLUSTER',
      url: 'https://example.com/ability4',
    },
    {
      shortcut: 'PASSIVE', 
      icon: require('../Demoassets/PASSIVE.png'),
      name: 'REGENERATIVE COCOON',
      url: 'https://example.com/ability5',
    },
  ];

  const teamUpData = [
    {
      shortcut: 'PASSIVE', 
      icon: require('../Demoassets/TEAMUP.png'),
      name: 'SOUL PERSEVERANCE',
      url: 'https://example.com/team1',
    },
  ];

  return (
    <View style={{ width: '100%', height: '100%', display: 'flex' }}>
      <View style={{ display: 'flex', width: '100%', height: '50%', position: 'relative' }}>
        <ImageBackground
          source={require('../../assets/images/Home.png')}
          style={{ width: '100%', height: '100%', zIndex: 0 }}
        >
          <View style={{ marginTop: '20%', display: 'flex', gap: 4, width: '50%', position: 'absolute' }}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: 12, marginBottom: 24, paddingLeft: 20 }}>
              <Image source={require('../../assets/images/Strategist.png')} />
              <Text style={{ fontSize: 24, fontFamily: 'Montserrat-ExtraBoldItalic', textAlign: 'center' }}>STRATEGIST</Text>
            </View>
            <Text style={{ fontSize: 30, fontFamily: 'Montserrat-ExtraBoldItalic', lineHeight: 32, zIndex: 2, paddingLeft: 20 }}>
              ADAM
            </Text>
            <Text style={{ fontSize: 30, fontFamily: 'Montserrat-ExtraBoldItalic', textAlign: 'right', lineHeight: 32, zIndex: 2, paddingLeft: 20 }}>
              WARLOCK
            </Text>
          </View>
          <ImageBackground
            source={require('../Demoassets/Adam_Warlock_Bg.png')}
            style={{ width: '100%', height: '100%', zIndex: 1, display: 'flex', alignItems: 'flex-end' }}
          >
            <Image
              source={require('../Demoassets/Adam_Warlock.png')}
              resizeMode="cover"
              style={{ width: 230, height: '95%', marginRight: 30, zIndex: 1 }}
            />
          </ImageBackground>
        </ImageBackground>
        <Image
          source={require('../Demoassets/Bg_Component1.png')}
          style={{ width: '100%', height: 60, position: 'absolute', bottom: -10 }}
          resizeMode="contain"
        />
      </View>
      <ImageBackground
        source={require('../Demoassets/Abilities_Bg.jpg')}
        style={{ width: '100%', zIndex: 0, height: '100%', flex: 1 }}
        resizeMode="stretch"
      >
        <View style={{ display: 'flex', gap: 8, marginTop: 6, flex: 1 }}>
          <Text
            style={{
              fontSize: 30,
              fontFamily: 'Montserrat-ExtraBoldItalic',
              zIndex: 2,
              alignSelf: 'flex-start',
              color: Colors.ABILITIESBG,
              marginLeft: 8,
            }}
          >
            ABILITIES
          </Text>

          <ScrollView>
            <View style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8 }}>
              <AbilitiesSection sectionTitle="NORMAL ATTACK" data={normalData} />
              <AbilitiesSection sectionTitle="ABILITIES" data={abilitiesData} />
              <AbilitiesSection sectionTitle="TEAM-UP ABILITIES" data={teamUpData} />
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    </View>
  );
};

export default HeroDetail;
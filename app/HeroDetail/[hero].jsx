import { View, Text, Image, ImageBackground, ScrollView, TouchableOpacity, ActivityIndicator, Animated, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { Colors } from '../../constants/Colors';


const SCREEN_HEIGHT = Dimensions.get('window').height;

const renderShortcut = (shortcut) => {
  if (shortcut === 'PASSIVE') {
    return (
      <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 13 }}>PASSIVE</Text>
    );
  } else if (typeof shortcut === 'string' && shortcut.includes('.')) {
    return <Image source={{ uri: shortcut }} style={{ width: 24, height: 24 }} />;
  } else if (typeof shortcut === 'number') {
    return <Image source={shortcut} />;
  } else {
    return <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 16 }}>{shortcut}</Text>;
  }
};

const renderAniShortcut = (shortcut) => {
  if (shortcut === 'PASSIVE') {
    return (
      <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 13 }}>PASSIVE</Text>
    );
  } else if (typeof shortcut === 'string' && shortcut.includes('.')) {
    return <Image source={{ uri: shortcut }} style={{ width: 24, height: 24 }} />;
  } else if (typeof shortcut === 'number') {
    return <Image source={shortcut} />;
  } else {
    return (
      <ImageBackground source={require('../../assets/images/AbilityKeyBg.png')} resizeMode='contain'
        style={{
          width: '60',
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center'
        }}>
        <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 16, }}>{shortcut}</Text>
      </ImageBackground>
    );
  }
};

const AbilitiesSection = ({ sectionTitle, data, onPressAbility }) => {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <View style={{ width: '90%', zIndex: 2, backgroundColor: Colors.ABILITIESBG, marginBottom: 12 }}>
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
        <TouchableOpacity key={index} onPress={() => onPressAbility(item)}>
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
              {renderShortcut(item.key)}
            </View>

            <View style={{ width: 1, height: '80%', backgroundColor: Colors.ABILITIES, marginHorizontal: 10 }} />

            <View style={{ width: '40%', alignItems: 'center' }}>
              <Image source={{ uri: item.image }} style={{
                width: 200,
                height: 50
              }}
                resizeMode='contain'
              />
            </View>

            <View style={{ width: 1, height: '80%', backgroundColor: Colors.ABILITIES, marginHorizontal: 10 }} />

            <View style={{ width: '35%', alignItems: 'center' }}>
              <Text style={{ fontFamily: 'Montserrat-SemiBold', textAlign: 'center' }}>{item.attack}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const HeroDetail = () => {
  const { hero } = useLocalSearchParams();
  const [heroDetails, setHeroDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noData, setNoData] = useState(false);
  const [selectedAbility, setSelectedAbility] = useState(null);
  const slideUpAnim = useState(new Animated.Value(SCREEN_HEIGHT))[0];

  useEffect(() => {
    const fetchHeroDetails = async () => {
      const db = getFirestore();
      const abilitiesRef = collection(db, 'Abilities');
      const q = query(abilitiesRef, where('name', '==', hero));

      try {
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const docData = querySnapshot.docs[0].data();
          setHeroDetails(docData);
          console.log(heroDetails)
          setNoData(false);
        } else {
          setNoData(true);
        }
      } catch (error) {
        console.error("Error getting documents: ", error);
        setNoData(true);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroDetails();
  }, [hero]);

  const openAbilityDetails = (ability) => {
    setSelectedAbility(ability);
    Animated.timing(slideUpAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true
    }).start();
  };

  const closeAbilityDetails = () => {
    Animated.timing(slideUpAnim, {
      toValue: SCREEN_HEIGHT / 2,
      duration: 500,
      useNativeDriver: true
    }).start(() => {
      setSelectedAbility(null);
    });
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.ABILITIESBG} />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (noData) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No Data Found</Text>
      </View>
    );
  }


  const renderHeroName = (name) => {
    const nameParts = name.split(' ');
    if (nameParts.length === 1) {
      return (
        <Text
          style={{
            fontSize: 30,
            fontFamily: 'Montserrat-ExtraBoldItalic',
            lineHeight: 32,
            zIndex: 2,
            paddingLeft: 20,
          }}
        >
          {nameParts[0]}
        </Text>
      );
    } else if (nameParts.length === 2) {
      return (
        <>
          <Text
            style={{
              fontSize: 30,
              fontFamily: 'Montserrat-ExtraBoldItalic',
              lineHeight: 32,
              zIndex: 2,
              paddingLeft: 20,
            }}
          >
            {nameParts[0]}
          </Text>
          <Text
            style={{
              fontSize: 30,
              fontFamily: 'Montserrat-ExtraBoldItalic',
              textAlign: 'right',
              lineHeight: 32,
              zIndex: 2,
              paddingLeft: 20,
            }}
          >
            {nameParts[1]}
          </Text>

        </>
      );
    }
  };

  const renderType = (type) => {
    if (heroDetails.type == 'STRATEGIST') {
      return (
        <>
          <Image
            source={require('../../assets/images/Strategist.png')} />
        </>
      )
    }
    else if (heroDetails.type == 'VANGUARD') {
      return (
        <Image
          source={require('../../assets/images/Vanguard.png')}
        />
      )
    }
    else {
      return (
        <Image
          source={require('../../assets/images/Duelist.png')}
        />
      )
    }
  }


  const { 'NORMAL ATTACK': Normal_Attack, ABILITIES, 'TEAM-UP ABILITIES': TEAM_UP_ABILITIES } = heroDetails;

  return (
    <View style={{
      width: '100%',
      height: '100%',
      display: 'flex'
    }}>
      <View style={{
        display: 'flex',
        width: '100%',
        height: '50%',
        position: 'relative'
      }}>
        <ImageBackground
          source={require('../../assets/images/Home.png')} style={{
            width: '100%',
            height: '100%',
            zIndex: 0
          }}>
          <View style={{
            marginTop: '20%',
            display: 'flex',
            gap: 4,
            width: '50%',
            position: 'absolute'
          }}>
            <View style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-end',
              gap: 12,
              marginBottom: 24,
              paddingLeft: 20,
            }}>
              {renderType(heroDetails.type)}
              <Text
                style={{
                  fontSize: 24,
                  fontFamily: 'Montserrat-ExtraBoldItalic',
                  textAlign: 'center'
                }}
              >{heroDetails.type}</Text>
            </View>
            {renderHeroName(heroDetails.name)}
          </View>
          <ImageBackground
            source={{ uri: heroDetails.character_bg }}
            style={{
              width: '100%',
              height: '100%',
              zIndex: 1,
              display: 'flex',
              alignItems: 'flex-end'
            }}>

            <Image
              source={{ uri: heroDetails.character }}
              resizeMode='cover'
              style={{
                width: 230,
                height: '95%',
                marginRight: 30,
                zIndex: 1,
              }}
            />
          </ImageBackground>
        </ImageBackground>
        <Image
          source={require('../Demoassets/Bg_Component1.png')}
          style={{
            width: '100%',
            height: 60,
            position: 'absolute',
            bottom: -10,
          }}
          resizeMode='contain'
        />
      </View>
      <ImageBackground
        source={require('../Demoassets/Abilities_Bg.jpg')}
        style={{ width: '100%', zIndex: 0, height: '100%', flex: 1 }}
        resizeMode="stretch"
      >
        <View style={{ display: 'flex', gap: 8, marginTop: 6, flex: 1, marginBottom: 12 }}>
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

          <ScrollView showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}>
            <View style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8 }}>
              <AbilitiesSection sectionTitle="NORMAL ATTACK" data={Normal_Attack} onPressAbility={openAbilityDetails} />
              <AbilitiesSection sectionTitle="ABILITIES" data={ABILITIES} onPressAbility={openAbilityDetails} />
              <AbilitiesSection sectionTitle="TEAM-UP ABILITIES" data={TEAM_UP_ABILITIES} onPressAbility={openAbilityDetails} />
            </View>
          </ScrollView>
        </View>
      </ImageBackground>

      {selectedAbility && (
        <ImageBackground
          source={require('../Demoassets/Abilities_Bg.jpg')}
          style={{
            width: '100%',
            height: SCREEN_HEIGHT / 2
          }}
          resizeMode="stretch"
        >
          <Animated.View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: SCREEN_HEIGHT / 2,
              padding: 16,
              zIndex: 3,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              transform: [{ translateY: slideUpAnim }],
            }}
          >
            <TouchableOpacity onPress={closeAbilityDetails}>
              <Text style={{ alignSelf: 'flex-end', fontSize: 18, fontWeight: 'bold', color: 'white' }}>
                Close
              </Text>
            </TouchableOpacity>

            <ScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                flexGrow: 1,
                
              }}
            >
              <View
                style={{
                  width: '97%',
                  marginTop: 10,
                  display: 'flex',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: 'white',
                  paddingBottom:10,
                  marginBottom:40
                }}
              >
                <View
                  style={{
                    backgroundColor: 'white',
                    padding: 10,
                    width: '100%',
                  }}
                >
                  <Text
                    style={{
                      fontFamily: 'Montserrat-SemiBold',
                      fontSize: 22,
                    }}
                  >
                    {selectedAbility.attack}
                  </Text>

                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      gap: 12,
                      width: '100%',
                    }}
                  >
                    {renderAniShortcut(selectedAbility.key)}
                    <View
                      style={{
                        width: '85%',
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: 'Montserrat-Medium',
                          fontSize: 13,
                        }}
                      >
                        {selectedAbility.desc}
                      </Text>
                    </View>
                  </View>
                </View>

                <View
                  style={{
                    padding: 10,
                    width: '100%',
                    marginTop: 10,
                  }}
                >
                  {selectedAbility.details && typeof selectedAbility.details === 'object' ? (
                    Object.entries(selectedAbility.details).map(([key, value], index) => (
                      <View
                        key={index}
                        style={{
                          marginBottom: 8,
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          gap: 4,
                          width: '100%',
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: 'Montserrat-SemiBold',
                            fontSize: 14,
                            color: 'gray',
                            width: '30%',
                          }}
                        >
                          {key}:
                        </Text>
                        <Text
                          style={{
                            fontFamily: 'Montserrat-Regular',
                            fontSize: 14,
                            color: 'gray',
                            width: '65%',
                            flexWrap: 'wrap',
                          }}
                          numberOfLines={0}
                        >
                          {value}
                        </Text>
                      </View>
                    ))
                  ) : (
                    <Text
                      style={{
                        fontFamily: 'Montserrat-Regular',
                        fontSize: 14,
                        color: 'gray',
                      }}
                    >
                      No details available
                    </Text>
                  )}
                </View>
              </View>
            </ScrollView>
          </Animated.View>



        </ImageBackground>
      )}
    </View>
  );
};

export default HeroDetail;

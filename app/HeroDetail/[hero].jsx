import { View, Text, Image, ImageBackground, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Colors } from '../../constants/Colors';

const HeroDetail = () => {


  const { hero } = useLocalSearchParams();



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
              <Image
                source={require('../../assets/images/Strategist.png')} />
              <Text
                style={{
                  fontSize: 24,
                  fontFamily: 'Montserrat-ExtraBoldItalic',
                  textAlign: 'center'
                }}
              >STRATEGIST</Text>
            </View>
            <Text
              style={{
                fontSize: 30,
                fontFamily: 'Montserrat-ExtraBoldItalic',
                lineHeight: 32,
                zIndex: 2,
                paddingLeft: 20,
              }}
            >
              ADAM
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
              WARLOCK
            </Text>
          </View>
          <ImageBackground
            source={require('../Demoassets/Adam_Warlock_Bg.png')}
            style={{
              width: '100%',
              height: '100%',
              zIndex: 1,
              display: 'flex',
              alignItems: 'flex-end'
            }}>

            <Image
              source={require('../Demoassets/Adam_Warlock.png')}
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
        source={require('../Demoassets/Abilities_Bg.jpg')} style={{
          width: '100%',
          zIndex: 0,
          height: '100%',
          flex: 1
        }}
        resizeMode='stretch'>
        <View
          style={{
            display: 'flex',
            gap: 8,
            marginTop: 6,
            flex: 1
          }}
        >
          <Text style={{
            fontSize: 30,
            fontFamily: 'Montserrat-ExtraBoldItalic',
            zIndex: 2,
            alignSelf: 'flex-start',
            color: Colors.ABILITIESBG,
            marginLeft: 8
          }}>ABILITIES</Text>
          <ScrollView>
            <View style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <View
                style={{
                  width: '90%',
                  zIndex: 2,
                  backgroundColor: Colors.ABILITIESBG
                }}
              >
                <Text
                  style={{
                    backgroundColor: Colors.ABILITIESTYPE,
                    fontFamily: "Montserrat-SemiBold",
                    paddingLeft: 8,
                    fontSize: 14,
                    paddingVertical: 4
                  }}
                >NORMAL ATTACK</Text>
                <TouchableOpacity>
                  <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 8
                  }}>
                    <View style={{
                      width: '15%',
                      alignItems: 'center'
                    }}>
                      <Image
                        source={require('../Demoassets/Left_Mouse.png')}
                      />
                    </View>

                    <View style={{
                      width: 1,
                      height: '80%',
                      backgroundColor: Colors.ABILITIES,
                      marginHorizontal: 10,
                    }} />
                    <View style={{
                      width: '40%',
                      alignItems: 'center'
                    }}>
                      <Image
                        source={require('../Demoassets/NATTACK.png')}
                      />
                    </View>

                    <View style={{
                      width: 1,
                      height: '80%',
                      backgroundColor: Colors.ABILITIES,
                      marginHorizontal: 10,
                    }} />
                    <View style={{
                      width: '35%',
                      alignItems: 'center'
                    }}>
                      <Text style={{
                        fontFamily: "Montserrat-SemiBold",
                      }}>QUANTUM MAGIC</Text>
                    </View>
                  </View>
                </TouchableOpacity>

              </View>
              <View
                style={{
                  width: '90%',
                  zIndex: 2,
                  backgroundColor: Colors.ABILITIESBG
                }}
              >
                <Text
                  style={{
                    backgroundColor: Colors.ABILITIESTYPE,
                    fontFamily: "Montserrat-SemiBold",
                    paddingLeft: 8,
                    fontSize: 14,
                    paddingVertical: 4
                  }}
                >ABILITIES</Text>
                <TouchableOpacity>
                  <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 8,
                    borderBottomWidth: 1,
                    borderBottomColor: Colors.ABILITIES
                  }}>
                    <View style={{
                      width: '15%',
                      alignItems: 'center'
                    }}>
                      <Text style={{
                        fontFamily: 'Montserrat-SemiBold',
                        fontSize: 16,
                      }}>Q</Text>
                    </View>

                    <View style={{
                      width: 1,
                      height: '80%',
                      backgroundColor: Colors.ABILITIES,
                      marginHorizontal: 10,
                    }} />
                    <View style={{
                      width: '40%',
                      alignItems: 'center'
                    }}>
                      <Image
                        source={require('../Demoassets/QATTACK.png')}
                      />
                    </View>

                    <View style={{
                      width: 1,
                      height: '80%',
                      backgroundColor: Colors.ABILITIES,
                      marginHorizontal: 10,
                    }} />
                    <View style={{
                      width: '35%',
                      alignItems: 'center',
                    }}>
                      <Text style={{
                        fontFamily: "Montserrat-SemiBold",
                      }}>KARMIC REVIVAL</Text>
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity>
                  <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 8,
                    borderBottomWidth: 1,
                    borderBottomColor: Colors.ABILITIES
                  }}>
                    <View style={{
                      width: '15%',
                      alignItems: 'center'
                    }}>
                      <Text style={{
                        fontFamily: 'Montserrat-SemiBold',
                        fontSize: 16,
                      }}>SHIFT</Text>
                    </View>

                    <View style={{
                      width: 1,
                      height: '80%',
                      backgroundColor: Colors.ABILITIES,
                      marginHorizontal: 10,
                    }} />
                    <View style={{
                      width: '40%',
                      alignItems: 'center'
                    }}>
                      <Image
                        source={require('../Demoassets/SHIFTATTACK.png')}
                      />
                    </View>

                    <View style={{
                      width: 1,
                      height: '80%',
                      backgroundColor: Colors.ABILITIES,
                      marginHorizontal: 10,
                    }} />
                    <View style={{
                      width: '35%',
                      alignItems: 'center'
                    }}>
                      <Text style={{
                        fontFamily: "Montserrat-SemiBold",
                      }}>SOUL BOND</Text>
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity>
                  <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 8,
                    borderBottomWidth: 1,
                    borderBottomColor: Colors.ABILITIES
                  }}>
                    <View style={{
                      width: '15%',
                      alignItems: 'center'
                    }}>
                      <Text style={{
                        fontFamily: 'Montserrat-SemiBold',
                        fontSize: 16,
                      }}>E</Text>
                    </View>

                    <View style={{
                      width: 1,
                      height: '80%',
                      backgroundColor: Colors.ABILITIES,
                      marginHorizontal: 10,
                    }} />
                    <View style={{
                      width: '40%',
                      alignItems: 'center'
                    }}>
                      <Image
                        source={require('../Demoassets/EATTACK.png')}
                      />
                    </View>

                    <View style={{
                      width: 1,
                      height: '80%',
                      backgroundColor: Colors.ABILITIES,
                      marginHorizontal: 10,
                    }} />
                    <View style={{
                      width: '35%',
                      alignItems: 'center'
                    }}>
                      <Text style={{
                        fontFamily: "Montserrat-SemiBold",
                        textAlign: 'center'
                      }}>AVATAR LIFE STREAM</Text>
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity>
                  <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 8,
                    borderBottomWidth: 1,
                    borderBottomColor: Colors.ABILITIES
                  }}>
                    <View style={{
                      width: '15%',
                      alignItems: 'center'
                    }}>
                      <Image
                        source={require('../Demoassets/Right_Mouse.png')}
                      />
                    </View>

                    <View style={{
                      width: 1,
                      height: '80%',
                      backgroundColor: Colors.ABILITIES,
                      marginHorizontal: 10,
                    }} />
                    <View style={{
                      width: '40%',
                      alignItems: 'center'
                    }}>
                      <Image
                        source={require('../Demoassets/RIGHTMATTACK.png')}
                      />
                    </View>

                    <View style={{
                      width: 1,
                      height: '80%',
                      backgroundColor: Colors.ABILITIES,
                      marginHorizontal: 10,
                    }} />
                    <View style={{
                      width: '35%',
                      alignItems: 'center'
                    }}>
                      <Text style={{
                        fontFamily: "Montserrat-SemiBold",
                      }}>COSMIC CLUSTER</Text>
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity>

                  <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 8,
                    borderBottomWidth: 1,
                    borderBottomColor: Colors.ABILITIES
                  }}>
                    <View style={{
                      width: '15%',
                      alignItems: 'center',
                    }}>
                      <Text style={{
                        fontFamily: 'Montserrat-SemiBold',
                        fontSize: 13,
                      }}>PASSIVE</Text>
                    </View>

                    <View style={{
                      width: 1,
                      height: '80%',
                      backgroundColor: Colors.ABILITIES,
                      marginHorizontal: 10,
                    }} />
                    <View style={{
                      width: '40%',
                      alignItems: 'center'
                    }}>
                      <Image
                        source={require('../Demoassets/PASSIVE.png')}
                      />
                    </View>

                    <View style={{
                      width: 1,
                      height: '80%',
                      backgroundColor: Colors.ABILITIES,
                      marginHorizontal: 10,
                    }} />
                    <View style={{
                      width: '35%',
                      alignItems: 'center',
                    }}>
                      <Text style={{
                        fontFamily: "Montserrat-SemiBold",
                        textAlign: 'center'
                      }}>REGENERATIVE COCOON</Text>
                    </View>
                  </View>
                </TouchableOpacity>

              </View>

              <View
                style={{
                  width: '90%',
                  zIndex: 2,
                  backgroundColor: Colors.ABILITIESBG,
                  marginBottom: 20
                }}
              >
                <Text
                  style={{
                    backgroundColor: Colors.ABILITIESTYPE,
                    fontFamily: "Montserrat-SemiBold",
                    paddingLeft: 8,
                    fontSize: 14,
                    paddingVertical: 4
                  }}
                >TEAM-UP ABILITIES</Text>
                <TouchableOpacity>
                <View style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 8
                }}>
                  <View style={{
                    width: '15%',
                    alignItems: 'center',
                  }}>
                    <Text style={{
                      fontFamily: 'Montserrat-SemiBold',
                      fontSize: 13,
                    }}>PASSIVE</Text>
                  </View>

                  <View style={{
                    width: 1,
                    height: '80%',
                    backgroundColor: Colors.ABILITIES,
                    marginHorizontal: 10,
                  }} />
                  <View style={{
                    width: '40%',
                    alignItems: 'center'
                  }}>
                    <Image
                      source={require('../Demoassets/TEAMUP.png')}
                    />
                  </View>

                  <View style={{
                    width: 1,
                    height: '80%',
                    backgroundColor: Colors.ABILITIES,
                    marginHorizontal: 10,
                  }} />
                  <View style={{
                    width: '35%',
                    alignItems: 'center'
                  }}>
                    <Text style={{
                      fontFamily: "Montserrat-SemiBold",
                      textAlign: 'center'
                    }}>SOUL PERSEVERANCE</Text>
                  </View>
                </View>
                </TouchableOpacity>

              </View>

            </View>
          </ScrollView>
        </View>
      </ImageBackground >
    </View >
  )
}

export default HeroDetail;
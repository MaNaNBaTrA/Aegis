import { View, Text } from 'react-native';
import React from 'react';
import { Colors } from '../constants/Colors';

const Footer = () => {
    return (
        <View style={{
            marginTop: 30,
            paddingHorizontal: 16,
            width:'100%',
            backgroundColor:'#f6d62c'
        }}>
            <View style={{
                display:'flex',
                width:'100%',
                marginTop:20
            }}>
                <Text style={{
                    fontFamily: 'Montserrat-Medium',
                    fontSize: 35,
                    color: 'transparent', 
                    textShadowColor: '#FFF', 
                    textShadowOffset: { width: -1, height: -1 }, 
                    textShadowRadius: 1,
                }}>
                    Assemble your squad and rise to the challenge!
                </Text>
                <Text style={{
                    fontFamily: 'Montserrat-Medium',
                    fontSize: 35,
                    color: '#000', 
                    position: 'absolute', 
                    top: 0,
                    left: 0,
                }}>
                    Assemble your squad and rise to the challenge!
                </Text>
            </View>
            <View style={{
                display:'flex',
                width:'100%',
                alignItems:'center',
                justifyContent:'center',
                marginVertical:10
            }}>
                <Text style={{
                    fontFamily:'Montserrat-Medium'
                }}>© Crafter By Arthur</Text>
            </View>
        </View>
    );
}

export default Footer;

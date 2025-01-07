import React from 'react';
import { Tabs } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import TabIcon from '../../constants/TabIcon'; 
import { Colors } from '../../constants/Colors';

const TabLayout = () => {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: Colors.PRIMARY,
      tabBarStyle:{
        backgroundColor:Colors.BLACK,
      }
    }}>
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <AntDesign name="home" color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="heroes"
        options={{
          tabBarLabel: 'Heroes',
          tabBarIcon: ({ color }) => (
            <TabIcon fill={color} width={40} height={40} />  
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <AntDesign name="user" color={color} size={24} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;

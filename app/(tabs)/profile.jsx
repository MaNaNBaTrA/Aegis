import { View, Text, Button, Image, ActivityIndicator } from 'react-native';
import React from 'react';
import { useAuth, useUser } from '@clerk/clerk-expo'; 
import { useRouter } from 'expo-router'; 

const Profile = () => {
  const { signOut } = useAuth(); 
  const { user, isLoaded } = useUser(); 
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/sign-in'); 
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Profile</Text>

      {user?.imageUrl ? (
        <Image
          source={{ uri: user.imageUrl }}
          style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 20 }}
        />
      ) : (
        <Text>No profile image</Text>
      )}

      <Text style={{ fontSize: 18 }}>Name: {user.firstName} {user.lastName}</Text>
      <Text style={{ fontSize: 18, marginTop: 10 }}>Email: {user.primaryEmailAddress?.emailAddress}</Text>

      <View style={{ marginTop: 20 }}>
        <Button title="Sign Out" onPress={handleSignOut} />
      </View>
    </View>
  );
};

export default Profile;

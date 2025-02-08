import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';  
import { useSignUp } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [profilePic, setProfilePic] = useState(null);  
  const [profilePicUrl, setProfilePicUrl] = useState('');  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [otpCode, setOtpCode] = useState(''); 
  const [loading, setLoading] = useState(false);
  const [awaitingVerification, setAwaitingVerification] = useState(false); 

  const pickImage = async () => {
    console.log("Pick Image button clicked!"); 
  
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    console.log("Initial Permission Status:", status); 
  
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Permission to access the media library is required.');
      return;
    }
  
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, 
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    console.log("Image Picker result:", result); 
  
    if (!result.canceled) {
      console.log("Image selected:", result.assets[0].uri); 
      setProfilePic(result.assets[0].uri); 
    } else {
      console.log("Image picker was canceled");
    }
  };

  const uploadImageToCloudinary = async () => {
    if (!profilePic) {
      Alert.alert('No Image', 'Please select a profile image before uploading.');
      return;
    }

    const data = new FormData();
    data.append('file', {
      uri: profilePic,
      type: 'image/jpeg',
      name: 'profile.jpg',
    });
    data.append('upload_preset', 'dsuoe9xn');
    data.append('cloud_name', 'dcse0wag3');

    setLoading(true);
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/dcse0wag3/image/upload`, {
        method: 'POST',
        body: data,
      });

      const result = await res.json();
      if (result.secure_url) {
        setProfilePicUrl(result.secure_url);  
      } else {
        throw new Error('Upload failed');
      }

      setLoading(false);
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Upload Error', 'There was a problem uploading the image.');
      setLoading(false);
    }
  };

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    if (!profilePicUrl) {
      Alert.alert('Upload Required', 'Please upload your profile picture.');
      return;
    }

    if (!emailAddress || !password || !firstName || !lastName) {
      Alert.alert('Missing Fields', 'Please fill out all fields.');
      return;
    }

    try {
      await signUp.create({
        emailAddress,
        password,
        profileImageUrl: profilePicUrl, 
        firstName,
        lastName,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setAwaitingVerification(true);  
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
      Alert.alert('Sign Up Failed', 'Please check your details and try again.');
    }
  };

  const onVerifyOtpPress = async () => {
    if (!otpCode) {
      Alert.alert('Enter OTP', 'Please enter the OTP sent to your email.');
      return;
    }

    try {
      const verificationResult = await signUp.attemptEmailAddressVerification({
        code: otpCode,
      });

      if (verificationResult.verification?.status === 'verified') {
        await setActive({ session: signUp.createdSessionId });
        router.replace('/home');
      }
    } catch (err) {
      console.error('Error verifying OTP:', err);
      Alert.alert('Verification Failed', 'Invalid OTP. Please try again.');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      {!awaitingVerification ? (
        <>
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Sign Up</Text>

          <TextInput
            value={firstName}
            placeholder="Enter first name"
            onChangeText={(firstName) => setFirstName(firstName)}
            style={{ marginBottom: 12, borderColor: 'gray', borderWidth: 1, padding: 10, width: '100%' }}
          />
          <TextInput
            value={lastName}
            placeholder="Enter last name"
            onChangeText={(lastName) => setLastName(lastName)}
            style={{ marginBottom: 12, borderColor: 'gray', borderWidth: 1, padding: 10, width: '100%' }}
          />

          <Button title="Pick Profile Image" onPress={pickImage} /> 
          {profilePic && (
            <Image
              source={{ uri: profilePic }}
              style={{ width: 100, height: 100, borderRadius: 50, marginTop: 20 }}
            />
          )}
          <Button title="Upload Image to Cloudinary" onPress={uploadImageToCloudinary} />
          {loading && <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />}

          <TextInput
            value={emailAddress}
            placeholder="Enter email"
            autoCapitalize="none"
            onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
            style={{ marginBottom: 12, borderColor: 'gray', borderWidth: 1, padding: 10, width: '100%' }}
          />
          <TextInput
            value={password}
            placeholder="Enter password"
            secureTextEntry
            onChangeText={(password) => setPassword(password)}
            style={{ marginBottom: 12, borderColor: 'gray', borderWidth: 1, padding: 10, width: '100%' }}
          />

          <Button title="Sign Up" onPress={onSignUpPress} />
        </>
      ) : (
        <>
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Verify Your Email</Text>
          <TextInput
            value={otpCode}
            placeholder="Enter OTP"
            onChangeText={(otpCode) => setOtpCode(otpCode)}
            style={{ marginBottom: 12, borderColor: 'gray', borderWidth: 1, padding: 10, width: '100%' }}
          />
          <Button title="Verify OTP" onPress={onVerifyOtpPress} />
        </>
      )}
    </View>
  );
}

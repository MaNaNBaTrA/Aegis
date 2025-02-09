import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useSignUp } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [formData, setFormData] = useState({
    emailAddress: '',
    password: '',
    firstName: '',
    lastName: '',
    profilePic: null,
    profilePicUrl: '',
    otpCode: ''
  });

  const [state, setState] = useState({
    loading: false,
    awaitingVerification: false,
    verifyingOtp: false,
    errorMessage: ''
  });

  const validateForm = () => {
    const { emailAddress, password, firstName, lastName } = formData;
    
    if (!emailAddress || !password || !firstName || !lastName) {
      Alert.alert('Missing Fields', 'Please fill out all required fields.');
      return false;
    }

    if (password.length < 8) {
      Alert.alert('Invalid Password', 'Password must be at least 8 characters long.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailAddress)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return false;
    }

    return true;
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access the media library is required.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setFormData(prev => ({
          ...prev,
          profilePic: result.assets[0].uri
        }));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const uploadImageToCloudinary = async () => {
    if (!formData.profilePic) {
      Alert.alert('No Image', 'Please select a profile image before uploading.');
      return null;
    }

    setState(prev => ({ ...prev, loading: true }));

    try {
      const data = new FormData();
      data.append('file', {
        uri: formData.profilePic,
        type: 'image/jpeg',
        name: 'profile.jpg',
      });
      data.append('upload_preset', 'dsuoe9xn');
      data.append('cloud_name', 'dcse0wag3');

      const response = await fetch('https://api.cloudinary.com/v1_1/dcse0wag3/image/upload', {
        method: 'POST',
        body: data,
      });

      if (!response.ok) throw new Error('Upload failed');

      const result = await response.json();
      const imageUrl = result.secure_url;
      
      setFormData(prev => ({
        ...prev,
        profilePicUrl: imageUrl
      }));
      
      return imageUrl;
    } catch (error) {
      Alert.alert('Upload Error', 'Failed to upload image. Please try again.');
      return null;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    if (!formData.profilePic) {
      Alert.alert('Upload Required', 'Please select your profile picture.');
      return;
    }

    setState(prev => ({ ...prev, loading: true }));

    try {
      const imageUrl = await uploadImageToCloudinary();
      if (!imageUrl) {
        setState(prev => ({ ...prev, loading: false }));
        return;
      }

      await signUp.create({
        emailAddress: formData.emailAddress,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });

      await signUp.update({
        unsafeMetadata: {
          profileImageUrl: imageUrl
        }
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setState(prev => ({ 
        ...prev, 
        awaitingVerification: true,
        loading: false 
      }));
    } catch (err) {
      console.error('Signup error:', err);
      const errorMessages = err.errors?.map(error => error.longMessage).join('\n') || 'Sign Up Failed';
      setState(prev => ({ 
        ...prev, 
        errorMessage: errorMessages,
        loading: false 
      }));
      Alert.alert('Sign Up Error', errorMessages);
    }
  };

  const onVerifyOtpPress = async () => {
    if (!formData.otpCode) {
      Alert.alert('Enter OTP', 'Please enter the verification code sent to your email.');
      return;
    }

    setState(prev => ({ ...prev, verifyingOtp: true }));

    try {
      const verification = await signUp.attemptEmailAddressVerification({
        code: formData.otpCode,
      });

      if (verification.status !== "complete") {
        throw new Error('Verification failed');
      }

      if (!signUp.createdSessionId) {
        throw new Error('Session ID is missing');
      }

      await setActive({ session: signUp.createdSessionId });
      router.replace('/home');
    } catch (error) {
      console.error('Verification error:', error);
      Alert.alert('Verification Failed', 'Invalid code or verification failed. Please try again.');
    } finally {
      setState(prev => ({ ...prev, verifyingOtp: false }));
    }
  };

  const renderSignUpForm = () => (
    <>
      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        value={formData.firstName}
        placeholder="First Name"
        onChangeText={(text) => setFormData(prev => ({ ...prev, firstName: text }))}
        style={styles.input}
      />
      <TextInput
        value={formData.lastName}
        placeholder="Last Name"
        onChangeText={(text) => setFormData(prev => ({ ...prev, lastName: text }))}
        style={styles.input}
      />

      <View style={styles.imageSection}>
        <Button title="Pick Profile Image" onPress={pickImage} />
        {formData.profilePic && (
          <Image
            source={{ uri: formData.profilePic }}
            style={styles.profileImage}
          />
        )}
        <Button title="Upload Image" onPress={uploadImageToCloudinary} />
        {state.loading && <ActivityIndicator size="large" color="#0000ff" />}
      </View>

      <TextInput
        value={formData.emailAddress}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={(text) => setFormData(prev => ({ ...prev, emailAddress: text }))}
        style={styles.input}
      />
      <TextInput
        value={formData.password}
        placeholder="Password (min 8 characters)"
        secureTextEntry
        onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
        style={styles.input}
      />

      {state.errorMessage ? (
        <Text style={styles.errorText}>{state.errorMessage}</Text>
      ) : null}

      <Button title="Sign Up" onPress={onSignUpPress} />
    </>
  );

  const renderOtpVerification = () => (
    <>
      <Text style={styles.title}>Verify Your Email</Text>
      <TextInput
        value={formData.otpCode}
        placeholder="Enter verification code"
        onChangeText={(text) => setFormData(prev => ({ ...prev, otpCode: text }))}
        style={styles.input}
        keyboardType="number-pad"
      />
      <Button title="Verify Code" onPress={onVerifyOtpPress} />
      {state.verifyingOtp && <ActivityIndicator size="large" color="#0000ff" />}
    </>
  );

  return (
    <View style={styles.container}>
      {state.awaitingVerification ? renderOtpVerification() : renderSignUpForm()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    marginBottom: 12,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    width: '100%',
    borderRadius: 5,
  },
  imageSection: {
    alignItems: 'center',
    marginVertical: 15,
    width: '100%',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginVertical: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});
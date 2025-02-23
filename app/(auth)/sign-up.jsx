import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useSignUp } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import Svg, { Circle, Path } from 'react-native-svg';

const DefaultAvatar = () => (
  <Svg width="120" height="120" viewBox="0 0 120 120" fill="none">
    <Circle cx="60" cy="60" r="60" fill="#E7E9EB"/>
    <Circle cx="60" cy="50" r="25" fill="#9fa1a1"/>
    <Path
      d="M60 82C82 82 98 92 104 110C94.5 116.5 77.8039 120 60 120C42.1961 120 25.5 116.5 16 110C22 92 38 82 60 82Z"
      fill="#9fa1a1"
    />
    <Circle
      cx="60"
      cy="50"
      r="26"
      fill="#8a9293"
      opacity="0.1"
    />
  </Svg>
);

const ErrorMessage = ({ message }) => message ? (
  <Text style={{
    color: '#dc2626',
    fontSize: 12,
    fontFamily: 'Montserrat-Medium',
    marginTop: 4
  }}>
    {message}
  </Text>
) : null;

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

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    emailAddress: '',
    password: '',
    profilePic: '',
    general: ''
  });

  const [state, setState] = useState({
    loading: false,
    awaitingVerification: false,
    verifyingOtp: false
  });

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
      isValid = false;
    }

    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
      isValid = false;
    }

    if (!formData.emailAddress) {
      newErrors.emailAddress = 'Email is required';
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.emailAddress)) {
        newErrors.emailAddress = 'Please enter a valid email address';
        isValid = false;
      }
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
      isValid = false;
    }

    if (!formData.profilePic) {
      newErrors.profilePic = 'Profile picture is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        setErrors(prev => ({
          ...prev,
          profilePic: 'Permission to access the media library is required'
        }));
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
        setErrors(prev => ({ ...prev, profilePic: '' }));
      }
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        profilePic: 'Failed to pick image. Please try again'
      }));
    }
  };

  const uploadImageToCloudinary = async () => {
    if (!formData.profilePic) {
      setErrors(prev => ({
        ...prev,
        profilePic: 'Please select a profile image before uploading'
      }));
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
      setErrors(prev => ({
        ...prev,
        profilePic: 'Failed to upload image. Please try again'
      }));
      return null;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    setErrors({});
    if (!validateForm()) return;

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
      const errorMessage = err.errors?.map(error => error.longMessage).join('\n') || 'Sign Up Failed';
      setErrors(prev => ({ 
        ...prev, 
        general: errorMessage
      }));
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const onVerifyOtpPress = async () => {
    if (!formData.otpCode) {
      setErrors(prev => ({ ...prev, general: 'Please enter the verification code' }));
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
      setErrors(prev => ({
        ...prev,
        general: 'Invalid code or verification failed. Please try again'
      }));
    } finally {
      setState(prev => ({ ...prev, verifyingOtp: false }));
    }
  };

  const renderSignUpForm = () => (
    <>
      <View style={{
        display: 'flex',
        gap: 10,
        alignItems: 'center'
      }}>
        <Text style={{
          fontFamily: 'Montserrat-Medium',
          fontSize: 26,
          textAlign: 'center',
        }}>
          Sign Up
        </Text>
        <Text style={{
          fontFamily: 'Montserrat-Medium',
          fontSize: 12,
          color: '#9fa1a1',
          marginBottom: 10
        }}>
          Create an account to get started
        </Text>
        <View style={{
          alignItems: 'center',
          marginBottom: 10,
          gap: 10
        }}>
          <TouchableOpacity
            onPress={pickImage}
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              overflow: 'hidden',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#e7e9eb'
            }}
          >
            {formData.profilePic ? (
              <Image
                source={{ uri: formData.profilePic }}
                style={{
                  width: '100%',
                  height: '100%'
                }}
              />
            ) : (
              <DefaultAvatar />
            )}
          </TouchableOpacity>

          <Text style={{
            fontFamily: 'Montserrat-Medium',
            fontSize: 12,
            color: '#6d53f4',
          }}>
            Tap to choose profile picture
          </Text>
          <ErrorMessage message={errors.profilePic} />
        </View>
      </View>

      <View style={{ width: '90%', gap: 12 }}>
        <View>
          <Text style={{
            fontFamily: 'Montserrat-Medium',
            fontSize: 12,
            marginBottom: 2
          }}>
            First Name
          </Text>
          <TextInput
            value={formData.firstName}
            onChangeText={(text) => {
              setFormData(prev => ({ ...prev, firstName: text }));
              setErrors(prev => ({ ...prev, firstName: '' }));
            }}
            placeholder="John"
            style={{
              width: '100%',
              backgroundColor: '#e7e9eb',
              paddingLeft: 10,
              fontFamily: 'Montserrat-Light',
              fontSize: 12,
              borderRadius: 10,
              padding: 10,
              borderWidth: errors.firstName ? 1 : 0,
              borderColor: '#dc2626'
            }}
          />
          <ErrorMessage message={errors.firstName} />
        </View>

        <View>
          <Text style={{
            fontFamily: 'Montserrat-Medium',
            fontSize: 12,
            marginBottom: 2
          }}>
            Last Name
          </Text>
          <TextInput
            value={formData.lastName}
            onChangeText={(text) => {
              setFormData(prev => ({ ...prev, lastName: text }));
              setErrors(prev => ({ ...prev, lastName: '' }));
            }}
            placeholder="Doe"
            style={{
              width: '100%',
              backgroundColor: '#e7e9eb',
              paddingLeft: 10,
              fontFamily: 'Montserrat-Light',
              fontSize: 12,
              borderRadius: 10,
              padding: 10,
              borderWidth: errors.lastName ? 1 : 0,
              borderColor: '#dc2626'
            }}
          />
          <ErrorMessage message={errors.lastName} />
        </View>

        <View>
          <Text style={{
            fontFamily: 'Montserrat-Medium',
            fontSize: 12,
            marginBottom: 2
          }}>
            Email
          </Text>
          <TextInput
            value={formData.emailAddress}
            onChangeText={(text) => {
              setFormData(prev => ({ ...prev, emailAddress: text }));
              setErrors(prev => ({ ...prev, emailAddress: '' }));
            }}
            placeholder="example@gmail.com"
            keyboardType="email-address"
            autoCapitalize="none"
            style={{
              width: '100%',
              backgroundColor: '#e7e9eb',
              paddingLeft: 10,
              fontFamily: 'Montserrat-Light',
              fontSize: 12,
              borderRadius: 10,
              padding: 10,
              borderWidth: errors.emailAddress ? 1 : 0,
              borderColor: '#dc2626'
            }}
          />
          <ErrorMessage message={errors.emailAddress} />
        </View>

        <View>
          <Text style={{
            fontFamily: 'Montserrat-Medium',
            fontSize: 12,
            marginBottom: 2
          }}>
            Password
          </Text>
          <TextInput
            value={formData.password}
            onChangeText={(text) => {
              setFormData(prev => ({ ...prev, password: text }));
              setErrors(prev => ({ ...prev, password: '' }));
            }}
            placeholder="Min 8 characters"
            secureTextEntry
            style={{
              width: '100%',
              backgroundColor: '#e7e9eb',
              paddingLeft: 10,
              fontFamily: 'Montserrat-Light',
              fontSize: 12,
              borderRadius: 10,
              padding: 10,
              borderWidth: errors.password ? 1 : 0,
              borderColor: '#dc2626'
            }}
          />
          <ErrorMessage message={errors.password} />
        </View>

        {errors.general ? (
          <Text style={{
            color: '#dc2626',
            fontFamily: 'Montserrat-Medium',
            fontSize: 12,
            textAlign: 'center',
            marginTop: 10
          }}>
            {errors.general}
          </Text>
        ) : null}

        <TouchableOpacity
          disabled={state.loading}
          onPress={onSignUpPress}
          style={{
            backgroundColor: '#6d53f4',
            borderRadius: 20,
            width: '100%',
            opacity: state.loading ? 0.7 : 1,
            marginTop: 10
          }}
        >
          <Text style={{
            fontFamily: 'Montserrat-Medium',
            fontSize: 14,
            color: 'white',
            padding: 10,
            textAlign: 'center',
          }}>
            {state.loading ? 'Creating Account...' : 'Sign Up'}
          </Text>
        </TouchableOpacity>

        <View style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 4,
          justifyContent: 'center',
          marginTop: 10
        }}>
          <Text style={{ fontFamily: 'Montserrat-Medium' }}>
            Already have an account?
          </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/sign-in')}>
            <Text style={{
              fontFamily: 'Montserrat-Medium',
              color: '#6d53f4',
              textDecorationLine: 'underline'
            }}>
              Sign in
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );

  const renderOtpVerification = () => (
    <>
      <View style={{
        display: 'flex',
        gap: 12,
        alignItems: 'center',
      }}>
        <Text style={{
          fontFamily: 'Montserrat-Medium',
          fontSize: 26,
          textAlign: 'center',
          marginTop: 170
        }}>
          Verify Your Email
        </Text>
        <Text style={{
          fontFamily: 'Montserrat-Medium',
          fontSize: 12,
          color: '#9fa1a1'
        }}>
          Enter the verification code sent to your email
        </Text>
      </View>

      <View style={{ width: '90%', gap: 12 }}>
        <TextInput
          value={formData.otpCode}
          onChangeText={(text) => setFormData(prev => ({ ...prev, otpCode: text }))}
          placeholder="Enter verification code"
          keyboardType="number-pad"
          style={{
            width: '100%',
            backgroundColor: '#e7e9eb',
            paddingLeft: 10,
            fontFamily: 'Montserrat-Light',
            fontSize: 12,
            borderRadius: 10,
            padding: 10,
            marginBottom:10
          }}
        />

        <TouchableOpacity
          disabled={state.verifyingOtp}
          onPress={onVerifyOtpPress}
          style={{
            backgroundColor: '#6d53f4',
            borderRadius: 20,
            width: '100%',
            opacity: state.verifyingOtp ? 0.7 : 1
          }}
        >
          <Text style={{
            fontFamily: 'Montserrat-Medium',
            fontSize: 14,
            color: 'white',
            padding: 10,
            textAlign: 'center'
          }}>
            {state.verifyingOtp ? 'Verifying...' : 'Verify Code'}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <View style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      flex: 1,
      backgroundColor: 'white',
      paddingTop: 50,
      gap: 20
    }}>
      {state.loading && (
        <ActivityIndicator 
          size="large" 
          color="#6d53f4" 
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            zIndex: 999
          }}
        />
      )}
      {state.awaitingVerification ? renderOtpVerification() : renderSignUpForm()}
    </View>
  );
}
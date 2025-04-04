import React, { useState, useEffect, useCallback } from 'react';
import { useSignIn, useSession, useAuth, useClerk } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { Text, TextInput, View, TouchableOpacity } from 'react-native';
import Loader from '../../components/Loader';
import { Ionicons } from '@expo/vector-icons';

export default function SignInPage() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { session } = useSession();
  const { isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isResetFlow, setIsResetFlow] = useState(false);
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', title: '', actions: [] });
  
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleNewPasswordVisibility = () => {
    setNewPasswordVisible(!newPasswordVisible);
  };

  useEffect(() => {
    const checkExistingSession = async () => {
      if (!isLoaded) return;

      try {
        setLoading(true);
        setLoadingMessage('Checking session...');

        if (isSignedIn && session) {
          if (router.query?.fromReset) {
            await handleSignOut();
            return;
          }
          setLoadingMessage('Redirecting...');
          await router.replace('/home');
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkExistingSession();
  }, [isLoaded, session, isSignedIn, router]);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      showNotification('Error', 'Failed to sign out. Please try again.', [
        { text: 'OK', onPress: () => hideNotification() }
      ]);
    }
  }, [signOut]);

  const showNotification = (title, message, actions = []) => {
    setNotification({
      show: true,
      title,
      message,
      actions: actions.length ? actions : [{ text: 'OK', onPress: () => hideNotification() }]
    });
  };

  const hideNotification = () => {
    setNotification({ show: false, message: '', title: '', actions: [] });
  };

  const onSignInPress = useCallback(async () => {
    if (!isLoaded || !emailAddress || !password) return;

    setLoading(true);
    setLoadingMessage('Signing in...');
    setErrorMessage('');

    try {
      if (isSignedIn) {
        await handleSignOut();
      }

      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === 'complete') {
        setLoadingMessage('Setting up your session...');
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace('/home');
      } else {
        console.error('Sign-in incomplete', signInAttempt);
        setLoading(false);
      }
    } catch (err) {
      console.error('Error during sign-in:', err);
      handleSignInError(err);
    }
  }, [isLoaded, emailAddress, password, signIn, setActive, router, handleSignOut, isSignedIn]);

  const handleSignInError = (err) => {
    if (!err.errors?.length) {
      setErrorMessage('An unexpected error occurred. Please try again later.');
      setLoading(false);
      return;
    }

    const firstError = err.errors[0];
    switch (firstError.code) {
      case 'session_exists':
        showNotification(
          "Session Exists",
          "You're currently signed in to another account. Would you like to sign out and continue?",
          [
            {
              text: "Cancel",
              onPress: () => {
                hideNotification();
                setLoading(false);
              }
            },
            {
              text: "Sign Out & Continue",
              onPress: async () => {
                hideNotification();
                await handleSignOut();
                onSignInPress();
              },
            },
          ]
        );
        break;
      case 'form_password_incorrect':
        setErrorMessage('Incorrect password. Please try again.');
        break;
      case 'form_identifier_not_found':
        setErrorMessage('Email address does not exist.');
        break;
      default:
        setErrorMessage(firstError.message || 'Sign-in failed. Please try again.');
    }
    setLoading(false);
  };

  const handleResetPassword = useCallback(async () => {
    if (!isLoaded || !emailAddress) return;

    setLoading(true);
    setLoadingMessage('Sending reset code...');
    setErrorMessage('');

    try {
      if (isSignedIn) {
        await handleSignOut();
      }

      const firstFactor = await signIn.create({
        identifier: emailAddress,
        strategy: 'reset_password_email_code',
      });

      if (firstFactor.status === 'needs_first_factor') {
        setIsCodeSent(true);
        showNotification(
          'Check your email',
          "We've sent you a verification code. Please check your email and enter the code below."
        );
      }
    } catch (err) {
      console.error('Error sending reset email:', err);
      handleResetError(err);
    } finally {
      setLoading(false);
    }
  }, [isLoaded, emailAddress, signIn, handleSignOut, isSignedIn]);

  const handleResetError = (err) => {
    if (!err.errors?.length) {
      setErrorMessage('An unexpected error occurred. Please try again later.');
      return;
    }

    const firstError = err.errors[0];
    switch (firstError.code) {
      case 'session_exists':
        showNotification(
          'Session Exists',
          "You're currently signed in to another account. Would you like to sign out and continue?",
          [
            {
              text: 'Cancel',
              onPress: () => {
                hideNotification();
                setLoading(false);
              }
            },
            {
              text: 'Sign Out & Continue',
              onPress: async () => {
                hideNotification();
                await handleSignOut();
                handleResetPassword();
              },
            },
          ]
        );
        break;
      case 'form_identifier_not_found':
        setErrorMessage('Email address not found. Please check and try again.');
        break;
      default:
        setErrorMessage('Failed to send reset email. Please try again.');
    }
  };

  const handleVerifyCode = useCallback(async () => {
    if (!isLoaded || !resetCode || !newPassword) return;

    setLoading(true);
    setLoadingMessage('Verifying code...');
    setErrorMessage('');

    try {
      const attemptVerification = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code: resetCode,
        password: newPassword,
      });

      if (attemptVerification.status === 'complete') {
        await handleSignOut();
        showNotification(
          'Success',
          'Your password has been reset successfully. Please sign in with your new password.',
          [
            {
              text: 'OK',
              onPress: () => {
                hideNotification();
                resetForm();
                router.replace('/sign-in');
              },
            },
          ]
        );
      }
    } catch (err) {
      console.error('Error verifying code:', err);
      handleVerifyError(err);
    } finally {
      setLoading(false);
    }
  }, [isLoaded, resetCode, newPassword, signIn, handleSignOut, router]);

  const handleVerifyError = (err) => {
    if (!err.errors?.length) {
      setErrorMessage('Invalid code. Please try again.');
      return;
    }

    const firstError = err.errors[0];
    if (firstError.code === 'session_exists') {
      showNotification(
        'Session Exists',
        "You're currently signed in to another account. Would you like to sign out and continue?",
        [
          {
            text: 'Cancel',
            onPress: () => {
              hideNotification();
              setLoading(false);
            }
          },
          {
            text: 'Sign Out & Continue',
            onPress: async () => {
              hideNotification();
              await handleSignOut();
              handleVerifyCode();
            },
          },
        ]
      );
    } else {
      setErrorMessage(firstError.message || 'Invalid code. Please try again.');
    }
  };

  const resetForm = () => {
    setIsResetFlow(false);
    setIsCodeSent(false);
    setResetCode('');
    setNewPassword('');
    setErrorMessage('');
    setPassword('');
    setPasswordVisible(false);
    setNewPasswordVisible(false);
  };

  const NotificationModal = () => (
    notification.show ? (
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}>
        <View style={{
          backgroundColor: 'white',
          borderRadius: 10,
          padding: 20,
          width: '80%',
          alignItems: 'center',
        }}>
          <Text style={{ 
            fontFamily: 'Montserrat-Medium', 
            fontSize: 18, 
            marginBottom: 10 
          }}>
            {notification.title}
          </Text>
          <Text style={{ 
            fontFamily: 'Montserrat-Light', 
            textAlign: 'center', 
            marginBottom: 20 
          }}>
            {notification.message}
          </Text>
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-around',
            width: '100%' 
          }}>
            {notification.actions.map((action, index) => (
              <TouchableOpacity
                key={index}
                onPress={action.onPress}
                style={{
                  backgroundColor: index === notification.actions.length - 1 ? '#6d53f4' : '#e7e9eb',
                  borderRadius: 10,
                  paddingVertical: 8,
                  paddingHorizontal: 15,
                  marginHorizontal: 5,
                }}
              >
                <Text style={{
                  fontFamily: 'Montserrat-Medium',
                  color: index === notification.actions.length - 1 ? 'white' : 'black',
                }}>
                  {action.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    ) : null
  );

  const renderSignInForm = () => (
    <>
      <View style={{ display: 'flex', gap: 12,}}>
        <Text style={{ 
          fontFamily: 'Montserrat-Medium',
          fontSize: 26,
          textAlign: 'center',
          marginTop: 50
        }}>
          Sign In
        </Text>
        <Text style={{ 
          fontFamily: 'Montserrat-Medium',
          fontSize: 12,
          color: '#9fa1a1'
        }}>
          Hi! Welcome back, you've been missed
        </Text>
      </View>

      <View style={{ width: '90%' }}>
        <Text style={{ 
          fontFamily: 'Montserrat-Medium',
          fontSize: 12,
          marginBottom: 2
        }}>
          Email
        </Text>
        <TextInput
          value={emailAddress}
          onChangeText={setEmailAddress}
          placeholder="example@gmail.com"
          keyboardType="email-address"
          style={{
            width: '100%',
            backgroundColor: '#e7e9eb',
            paddingLeft: 10,
            fontFamily: 'Montserrat-Light',
            fontSize: 12,
            borderRadius: 10,
            marginBottom: 12,
            padding: 10
          }}
        />

        <Text style={{ 
          fontFamily: 'Montserrat-Medium',
          fontSize: 12,
          marginBottom: 2
        }}>
          Password
        </Text>
        <View style={{
          flexDirection: 'row',
          width: '100%',
          backgroundColor: '#e7e9eb',
          borderRadius: 10,
          alignItems: 'center',
          marginBottom: 12,
        }}>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="********"
            secureTextEntry={!passwordVisible}
            style={{
              flex: 1,
              paddingLeft: 10,
              fontFamily: 'Montserrat-Light',
              fontSize: 12,
              padding: 10
            }}
          />
          <TouchableOpacity onPress={togglePasswordVisibility} style={{ padding: 10 }}>
            <Ionicons 
              name={passwordVisible ? "eye" : "eye-off"} 
              size={20} 
              color="#6d53f4" 
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity onPress={() => setIsResetFlow(true)}>
        <Text style={{ 
          fontFamily: 'Montserrat-Medium',
          color: 'blue',
          textDecorationLine: 'underline',
        }}>
          Forgot password?
        </Text>
      </TouchableOpacity>

      {errorMessage && (
        <Text style={{ color: 'red', marginTop: 10 }}>{errorMessage}</Text>
      )}

      <TouchableOpacity
        disabled={loading || !emailAddress || !password}
        onPress={onSignInPress}
        style={{
          backgroundColor: '#6d53f4',
          borderRadius: 20,
          width: '90%'
        }}
      >
        <Text style={{
          fontFamily: 'Montserrat-Medium',
          fontSize: 14,
          color: 'white',
          padding: 10,
          textAlign: 'center'
        }}>
          Sign In
        </Text>
      </TouchableOpacity>

      <View style={{ display: 'flex', flexDirection: 'row', gap: 4 }}>
        <Text style={{ fontFamily: 'Montserrat-Medium' }}>
          Don't have an account?
        </Text>
        <TouchableOpacity onPress={() => router.push('/(auth)/sign-up')}>
          <Text style={{
            fontFamily: 'Montserrat-Medium',
            color: 'blue',
            textDecorationLine: 'underline'
          }}>
            Sign-up
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const renderResetPassword = () => (
    <>
      <View style={{
        width: '100%',
        alignItems: "center",
        display: 'flex',
        gap: 10,
      }}>
        <Text style={{
          fontFamily: 'Montserrat-Medium',
          fontSize: 26,
          textAlign: 'center',
          marginTop: 100
        }}>
          Reset Password
        </Text>
        <TextInput
          value={emailAddress}
          onChangeText={setEmailAddress}
          placeholder="Email"
          keyboardType="email-address"
          style={{
            width: '90%',
            backgroundColor: '#e7e9eb',
            paddingLeft: 10,
            fontFamily: 'Montserrat-Light',
            fontSize: 12,
            borderRadius: 10,
            marginBottom: 12,
            padding: 10
          }}
        />
        <TouchableOpacity
          disabled={loading || !emailAddress}
          onPress={handleResetPassword}
          style={{
            backgroundColor: '#6d53f4',
            borderRadius: 20,
            width: '90%'
          }}
        >
          <Text style={{
            fontFamily: 'Montserrat-Medium',
            fontSize: 14,
            color: 'white',
            padding: 10,
            textAlign: 'center'
          }}>
            Send Reset Code
          </Text>
        </TouchableOpacity>
        {errorMessage && <Text style={{ color: 'red', marginTop: 10 }}>{errorMessage}</Text>}
      </View>
    </>
  );

  const renderVerifyCode = () => (
    <>
      <Text style={{
        fontFamily: 'Montserrat-Medium',
        fontSize: 26,
        textAlign: 'center',
        marginTop: 100
      }}>
        Verify Code
      </Text>
      <TextInput
        value={resetCode}
        onChangeText={setResetCode}
        placeholder="Reset Code"
        keyboardType="numeric"
        style={{
          width: '90%',
          backgroundColor: '#e7e9eb',
          paddingLeft: 10,
          fontFamily: 'Montserrat-Light',
          fontSize: 12,
          borderRadius: 10,
          marginBottom: 12,
          padding: 10
        }}
      />
      <View style={{
        flexDirection: 'row',
        width: '90%',
        backgroundColor: '#e7e9eb',
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 12,
      }}>
        <TextInput
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="New Password"
          secureTextEntry={!newPasswordVisible}
          style={{
            flex: 1,
            paddingLeft: 10,
            fontFamily: 'Montserrat-Light',
            fontSize: 12,
            padding: 10
          }}
        />
        <TouchableOpacity onPress={toggleNewPasswordVisibility} style={{ padding: 10 }}>
          <Ionicons 
            name={newPasswordVisible ? "eye" : "eye-off"} 
            size={20} 
            color="#6d53f4" 
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        disabled={loading || !resetCode || !newPassword}
        onPress={handleVerifyCode}
        style={{
          backgroundColor: '#6d53f4',
          borderRadius: 20,
          width: '90%'
        }}
      >
        <Text style={{
          fontFamily: 'Montserrat-Medium',
          fontSize: 14,
          color: 'white',
          padding: 10,
          textAlign: 'center'
        }}>
          Verify Code
        </Text>
      </TouchableOpacity>
      {errorMessage && <Text style={{ color: 'red', marginTop: 10 }}>{errorMessage}</Text>}
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
      paddingTop: 150,
      gap: 20,
    }}>
      {loading && <Loader message={loadingMessage} />}
      <NotificationModal />

      {!isResetFlow 
        ? renderSignInForm()
        : !isCodeSent 
          ? renderResetPassword()
          : renderVerifyCode()
      }
    </View>
  );
}
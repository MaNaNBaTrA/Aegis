import React, { useState, useEffect, useCallback } from 'react';
import { useSignIn, useSession, useAuth, useClerk } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { Text, TextInput, Button, View, Alert } from 'react-native';
import Loader from '../../components/Loader';

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

  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        if (!isLoaded) return;

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
  }, [isLoaded, session, isSignedIn]);

  const handleSignOut = async () => {
    try {
      console.log('Signing out...');
      await signOut();
      console.log('Sign out successful.');
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  };

  const onSignInPress = useCallback(async () => {
    if (!isLoaded) return;
    setLoading(true);
    setLoadingMessage('Signing in...');
    setErrorMessage('');

    try {
      if (isSignedIn) {
        console.log('Existing session found, signing out...');
        await handleSignOut();
      }

      console.log(`Attempting to sign in: ${emailAddress}`);
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === 'complete') {
        setLoadingMessage('Setting up your session...');
        try {
          await setActive({ session: signInAttempt.createdSessionId });
          router.replace('/home');
        } catch (sessionError) {
          console.error('Error setting active session:', sessionError);
          setErrorMessage('Error establishing session. Please try again.');
          setLoading(false);
        }
      } else {
        console.error('Sign-in incomplete', JSON.stringify(signInAttempt, null, 2));
        setLoading(false);
      }
    } catch (err) {
      console.error('Error during sign-in:', JSON.stringify(err, null, 2));

      if (err.errors && err.errors.length > 0) {
        const firstError = err.errors[0];
        if (firstError.code === 'session_exists') {
          Alert.alert(
            "Session Exists",
            "You're currently signed in to another account. Would you like to sign out and continue?",
            [
              {
                text: "Cancel",
                style: "cancel",
                onPress: () => setLoading(false),
              },
              {
                text: "Sign Out & Continue",
                onPress: async () => {
                  await handleSignOut();
                  onSignInPress(); 
                },
              },
            ]
          );
        } else if (firstError.code === 'form_password_incorrect') {
          setErrorMessage('Incorrect password. Please try again.');
        } else if (firstError.code === 'form_identifier_not_found') {
          setErrorMessage('Email address does not exist.');
        } else {
          setErrorMessage(firstError.message || 'Sign-in failed. Please try again.');
        }
      } else {
        setErrorMessage('An unexpected error occurred. Please try again later.');
      }
      setLoading(false);
    }
  }, [isLoaded, emailAddress, password]);

  const handleResetPassword = async () => {
    if (!isLoaded) return;
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
        Alert.alert(
          'Check your email',
          "We've sent you a verification code. Please check your email and enter the code below."
        );
      }
    } catch (err) {
      console.error('Error sending reset email:', JSON.stringify(err, null, 2));

      if (err.errors && err.errors.length > 0) {
        const firstError = err.errors[0];
        if (firstError.code === 'session_exists') {
          Alert.alert(
            'Session Exists',
            "You're currently signed in to another account. Would you like to sign out and continue?",
            [
              {
                text: 'Cancel',
                style: 'cancel',
                onPress: () => setLoading(false),
              },
              {
                text: 'Sign Out & Continue',
                onPress: async () => {
                  await handleSignOut();
                  handleResetPassword();
                },
              },
            ]
          );
        } else if (firstError.code === 'form_identifier_not_found') {
          setErrorMessage('Email address not found. Please check and try again.');
        } else {
          setErrorMessage('Failed to send reset email. Please try again.');
        }
      } else {
        setErrorMessage('An unexpected error occurred. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!isLoaded) return;
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
        
        Alert.alert(
          'Success',
          'Your password has been reset successfully. Please sign in with your new password.',
          [
            {
              text: 'OK',
              onPress: async () => {
                setIsResetFlow(false);
                setIsCodeSent(false);
                setResetCode('');
                setNewPassword('');
                setErrorMessage('');
                setPassword('');
                router.replace('/sign-in');
              },
            },
          ]
        );
      }
    } catch (err) {
      console.error('Error verifying code:', JSON.stringify(err, null, 2));

      if (err.errors && err.errors.length > 0) {
        const firstError = err.errors[0];
        if (firstError.code === 'session_exists') {
          Alert.alert(
            'Session Exists',
            "You're currently signed in to another account. Would you like to sign out and continue?",
            [
              {
                text: 'Cancel',
                style: 'cancel',
                onPress: () => setLoading(false),
              },
              {
                text: 'Sign Out & Continue',
                onPress: async () => {
                  await handleSignOut();
                  handleVerifyCode();
                },
              },
            ]
          );
        } else {
          setErrorMessage(firstError.message || 'Invalid code. Please try again.');
        }
      } else {
        setErrorMessage('Invalid code. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      {loading && <Loader message={loadingMessage} />}

      {!isResetFlow ? (
        <>
          <Text style={{ fontSize: 24, marginBottom: 20 }}>Sign In</Text>
          <TextInput
            value={emailAddress}
            onChangeText={setEmailAddress}
            placeholder="Email"
            keyboardType="email-address"
            style={{ width: '100%', marginBottom: 10, borderWidth: 1, padding: 10, borderRadius: 5 }}
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
            style={{ width: '100%', marginBottom: 10, borderWidth: 1, padding: 10, borderRadius: 5 }}
          />
          {errorMessage ? <Text style={{ color: 'red', marginBottom: 10 }}>{errorMessage}</Text> : null}
          <Button title="Sign In" onPress={onSignInPress} disabled={loading} />
          <Text
            style={{ color: 'blue', marginTop: 20, textDecorationLine: 'underline' }}
            onPress={() => setIsResetFlow(true)}
          >
            Forgot password?
          </Text>
        </>
      ) : (
        <>
          {!isCodeSent ? (
            <>
              <Text style={{ fontSize: 24, marginBottom: 20 }}>Reset Password</Text>
              <TextInput
                value={emailAddress}
                onChangeText={setEmailAddress}
                placeholder="Email"
                keyboardType="email-address"
                style={{ width: '100%', marginBottom: 10, borderWidth: 1, padding: 10, borderRadius: 5 }}
              />
              <Button title="Send Reset Code" onPress={handleResetPassword} disabled={loading} />
              {errorMessage ? <Text style={{ color: 'red', marginTop: 10 }}>{errorMessage}</Text> : null}
            </>
          ) : (
            <>
              <Text style={{ fontSize: 24, marginBottom: 20 }}>Verify Code</Text>
              <TextInput
                value={resetCode}
                onChangeText={setResetCode}
                placeholder="Reset Code"
                keyboardType="numeric"
                style={{ width: '100%', marginBottom: 10, borderWidth: 1, padding: 10, borderRadius: 5 }}
              />
              <TextInput
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="New Password"
                secureTextEntry
                style={{ width: '100%', marginBottom: 10, borderWidth: 1, padding: 10, borderRadius: 5 }}
              />
              <Button title="Verify Code" onPress={handleVerifyCode} disabled={loading} />
              {errorMessage ? <Text style={{ color: 'red', marginTop: 10 }}>{errorMessage}</Text> : null}
            </>
          )}
        </>
      )}
    </View>
  );
}

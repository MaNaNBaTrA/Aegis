import React, { useState, useCallback } from 'react';
import { useSignIn } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { Text, TextInput, Button, View, Alert } from 'react-native';

export default function SignInPage() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); 

  const onSignInPress = useCallback(async () => {
    if (!isLoaded) return;

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === 'complete') {
        console.log('Sign-in successful, session ID:', signInAttempt.createdSessionId);
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace('/home'); 
      } else {
        console.error('Sign-in incomplete', JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      console.error('Error during sign-in:', JSON.stringify(err, null, 2));
      
      if (err.errors && err.errors.length > 0) {
        const firstError = err.errors[0];
        if (firstError.code === 'form_password_incorrect') {
          setErrorMessage('Incorrect password. Please try again.');
        } else if (firstError.code === 'form_identifier_not_found') {
          setErrorMessage('Email address does not exist.');
        } else {
          setErrorMessage('Sign-in failed. Please try again.');
        }
      } else {
        setErrorMessage('An unexpected error occurred. Please try again later.');
      }
    }
  }, [isLoaded, emailAddress, password]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <TextInput
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        style={{ marginBottom: 12, borderColor: 'gray', borderWidth: 1, padding: 10, width: '100%' }}
      />
      <TextInput
        value={password}
        placeholder="Enter password"
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
        style={{ marginBottom: 12, borderColor: 'gray', borderWidth: 1, padding: 10, width: '100%' }}
      />

      {errorMessage ? (
        <Text style={{ color: 'red', marginBottom: 12 }}>{errorMessage}</Text>
      ) : null}

      <Button title="Sign in" onPress={onSignInPress} />

      <View style={{ marginTop: 16 }}>
        <Text>Don't have an account?</Text>
        <Link href="/sign-up">
          <Text style={{ color: 'blue' }}>Sign up</Text>
        </Link>
      </View>
    </View>
  );
}

import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Text, TextInput, Button, View } from 'react-native'
import React from 'react'

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')

  const onSignInPress = React.useCallback(async () => {
    if (!isLoaded) return

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      if (signInAttempt.status === 'complete') {
        console.log('Sign-in successful, session ID:', signInAttempt.createdSessionId);
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace('/home');
      } else {
        console.error('Sign-in incomplete', JSON.stringify(signInAttempt, null, 2));
      }

    } catch (err) {
      console.error('Error during sign-in:', JSON.stringify(err, null, 2));
    }
  }, [isLoaded, emailAddress, password])

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <TextInput
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        style={{ marginBottom: 12, borderColor: 'gray', borderWidth: 1, padding: 10 }}
      />
      <TextInput
        value={password}
        placeholder="Enter password"
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
        style={{ marginBottom: 12, borderColor: 'gray', borderWidth: 1, padding: 10 }}
      />
      <Button title="Sign in" onPress={onSignInPress} />
      <View style={{ marginTop: 16 }}>
        <Text>Don't have an account?</Text>
        <Link href="/sign-up">
          <Text>Sign up</Text>
        </Link>
      </View>
    </View>

  )
}
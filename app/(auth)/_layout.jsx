import { Redirect, Stack } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'

export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth()

  if (isSignedIn) {
    return <Redirect href={'/home'} />
  }

  return (
    <Stack
      screenOptions={{
        headerShown:false
      }}
     
    >
      <Stack.Screen
        name="sign-in"
        options={{
          title: 'Sign In'
        }}
      />
      <Stack.Screen
        name="sign-up"
        options={{
          title: 'Create Account'
        }}
      />
    </Stack>
  )
}
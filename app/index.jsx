import { SignedIn, SignedOut, useAuth } from '@clerk/clerk-expo'
import { Link,Redirect } from 'expo-router'
import { Text, View ,ActivityIndicator} from 'react-native'

export default function Page() {

  const { isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View>
      <SignedIn>
      <Redirect href="/home" />
      </SignedIn>
      <SignedOut>
        <Link href="/(auth)/sign-in">
          <Text>Sign in</Text>
        </Link>
        <Link href="/(auth)/sign-up">
          <Text>Sign up</Text>
        </Link>
      </SignedOut>
    </View>
  )
}
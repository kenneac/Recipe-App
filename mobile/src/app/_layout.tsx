import { authStyles } from "@/assets/styles/auth.styles";
import SafeScreen from "@/components/SafeScreen";
import { ClerkProvider, useAuth } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { Slot, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, Image, View } from "react-native";
import { COLORS } from "@/constants/colors";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <SafeScreen>
        <RootNavigator />
        <StatusBar style="dark" />
      </SafeScreen>
    </ClerkProvider>
  );
}

function RootNavigator() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <AuthLoadingScreen />;
  }

  return (
    <Stack>
      <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={isSignedIn}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}

export function AuthLoadingScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.background }}>
        <Image
          source={require("@/assets/images/i1.png")}
          style={authStyles.image}
          resizeMode="contain"
        />

      <ActivityIndicator size="large" color="#000" />
    </View>
  );
}

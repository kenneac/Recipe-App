import { Stack } from "expo-router";

export default function AuthRoutesLayout() {
  return (
    <Stack initialRouteName="sign-in" screenOptions={{ headerShown: false }} />
  );
}

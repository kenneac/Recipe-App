import { useSignUp } from "@clerk/expo";
import { useState } from "react";
import {
  View,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { authStyles } from "@/assets/styles/auth.styles";
import { Image } from "expo-image";
import { COLORS } from "@/constants/colors";

const VerifyEmail = ({ email, onBack, onRestart }) => {
  const { signUp } = useSignUp();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerification = async () => {
    if (!code) return Alert.alert("Error", "Please enter the verification code");

    setLoading(true);
    try {
    const { error } = await signUp.verifications.verifyEmailCode({
        code: code.trim(),
      });
      if (error) {
        Alert.alert(
          "Error",
            error.message ||
            "Verification failed",
        );
        console.error(JSON.stringify(error, null, 2));
        return;
      }

      if (signUp.status === "complete") {
        const { error: finalizeError } = await signUp.finalize();
        if (finalizeError) {
          Alert.alert(
            "Error",
            JSON.stringify(finalizeError, null, 2) ||
              "Could not complete sign up",
          );
          console.error(JSON.stringify(finalizeError, null, 2));
        }
      } else {
        Alert.alert("Error", "Verification failed. Please try again.");
        console.error(JSON.stringify(signUp, null, 2));
      }
    } catch (err) {
      Alert.alert("Error", JSON.stringify(err, null, 2) || "Verification failed");
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={authStyles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={authStyles.keyboardView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView
          contentContainerStyle={authStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Image Container */}
          <View style={authStyles.imageContainer}>
            <Image
              source={require("@/assets/images/i3.png")}
              style={authStyles.image}
              contentFit="contain"
            />
          </View>

          {/* Title */}
          <Text style={authStyles.title}>Verify Your Email</Text>
          <Text style={authStyles.subtitle}>
            We&apos;ve sent a verification code to {email}
          </Text>

          <View style={authStyles.formContainer}>
            {/* Verification Code Input */}
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder="Enter verification code"
                placeholderTextColor={COLORS.textLight}
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                autoCapitalize="none"
                autoComplete="one-time-code"
              />
            </View>

            {/* Verify Button */}
            <TouchableOpacity
              style={[
                authStyles.authButton,
                loading && authStyles.buttonDisabled,
              ]}
              onPress={handleVerification}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={authStyles.buttonText}>
                {loading ? "Verifying..." : "Verify Email"}
              </Text>
            </TouchableOpacity>

            {/* Back to Sign Up */}
            <TouchableOpacity style={authStyles.linkContainer} onPress={onBack}>
              <Text style={authStyles.linkText}>
                <Text style={authStyles.link}>Back to Sign Up</Text>
              </Text>
            </TouchableOpacity>

            {/* Restart the entire registration (clears email & password too) */}
            <TouchableOpacity
              style={authStyles.linkContainer}
              onPress={onRestart ?? onBack}
              disabled={loading}
            >
              <Text style={authStyles.linkText}>
                Wrong email?{" "}
                <Text style={authStyles.link}>Start over</Text>
              </Text>
            </TouchableOpacity>

            {/* Required by Clerk for sign-up on Expo web; skipped on iOS/Android */}
            <View nativeID="clerk-captcha" />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};
export default VerifyEmail;
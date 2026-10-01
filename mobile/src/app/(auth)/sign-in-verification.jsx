import { useSignIn } from "@clerk/expo";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";

import { authStyles } from "@/assets/styles/auth.styles";
import { COLORS } from "@/constants/colors";

const supportedStrategies = ["email_code", "phone_code", "totp", "backup_code"];

const getFactorLabel = (factor) => {
  switch (factor.strategy) {
    case "email_code":
      return `Email code${factor.safeIdentifier ? ` (${factor.safeIdentifier})` : ""}`;
    case "phone_code":
      return `Text message${factor.safeIdentifier ? ` (${factor.safeIdentifier})` : ""}`;
    case "totp":
      return "Authenticator app";
    case "backup_code":
      return "Backup code";
    default:
      return "Verification code";
  }
};

const SignInVerificationScreen = () => {
  const router = useRouter();
  const { signIn, fetchStatus } = useSignIn();
  const factors = (signIn.supportedSecondFactors ?? []).filter((factor) =>
    supportedStrategies.includes(factor.strategy),
  );
  const [selectedStrategy, setSelectedStrategy] = useState(
    () => factors[0]?.strategy ?? null,
  );
  const [code, setCode] = useState("");
  const [sending, setSending] = useState(false);

  const selectedFactor = factors.find(
    (factor) => factor.strategy === selectedStrategy,
  );
  const isClientTrust = signIn.status === "needs_client_trust";
  const loading = sending || fetchStatus === "fetching";
  const codeIsSent =
    selectedStrategy === "email_code" || selectedStrategy === "phone_code";

  const sendCode = async (strategy) => {
    setSending(true);
    try {
      const { error } =
        strategy === "email_code"
          ? await signIn.mfa.sendEmailCode()
          : await signIn.mfa.sendPhoneCode();

      if (error) {
        Alert.alert(
          "Verification Failed",
          error.message || "Could not send a verification code.",
        );
      }
    } catch (error) {
      Alert.alert(
        "Verification Failed",
        error.message || "Could not send a verification code.",
      );
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (
      selectedStrategy === "email_code" ||
      selectedStrategy === "phone_code"
    ) {
      void sendCode(selectedStrategy);
    }
  }, [selectedStrategy, signIn]);

  const handleVerify = async () => {
    if (!code.trim()) {
      Alert.alert("Error", "Enter your verification code.");
      return;
    }

    setSending(true);
    try {
      let result;
      switch (selectedStrategy) {
        case "email_code":
          result = await signIn.mfa.verifyEmailCode({ code: code.trim() });
          break;
        case "phone_code":
          result = await signIn.mfa.verifyPhoneCode({ code: code.trim() });
          break;
        case "totp":
          result = await signIn.mfa.verifyTOTP({ code: code.trim() });
          break;
        case "backup_code":
          result = await signIn.mfa.verifyBackupCode({ code: code.trim() });
          break;
        default:
          Alert.alert(
            "Verification Unavailable",
            "No supported verification method is available.",
          );
          return;
      }

      if (result.error) {
        Alert.alert(
          "Verification Failed",
          result.error.message || "The code could not be verified.",
        );
        return;
      }

      if (signIn.status === "complete") {
        const { error } = await signIn.finalize();
        if (error) {
          Alert.alert(
            "Sign In Failed",
            error.message || "Could not complete sign in.",
          );
        }
      } else {
        Alert.alert(
          "Verification Incomplete",
          "Please try another verification code.",
        );
      }
    } catch (error) {
      Alert.alert(
        "Verification Failed",
        error.message || "The code could not be verified.",
      );
    } finally {
      setSending(false);
    }
  };

  const handleBack = async () => {
    await signIn.reset();
    router.replace("/(auth)/sign-in");
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
          <View style={authStyles.imageContainer}>
            <Image
              source={require("@/assets/images/i3.png")}
              style={authStyles.image}
              contentFit="contain"
            />
          </View>

          <Text style={authStyles.title}>
            {isClientTrust ? "Verify This Device" : "Two-Step Verification"}
          </Text>
          <Text style={authStyles.subtitle}>
            {selectedFactor
              ? `Enter the code from ${getFactorLabel(selectedFactor)}.`
              : "No supported verification method is available for this sign-in."}
          </Text>

          <View style={authStyles.formContainer}>
            {factors.length > 1 && (
              <View style={{ marginBottom: 20 }}>
                {factors.map((factor) => {
                  const selected = factor.strategy === selectedStrategy;
                  return (
                    <TouchableOpacity
                      key={`${factor.strategy}-${factor.safeIdentifier ?? ""}`}
                      style={{
                        padding: 14,
                        marginBottom: 8,
                        borderWidth: 1,
                        borderColor: selected ? COLORS.primary : COLORS.border,
                        borderRadius: 8,
                        backgroundColor: selected
                          ? COLORS.background
                          : "transparent",
                      }}
                      onPress={() => {
                        setCode("");
                        setSelectedStrategy(factor.strategy);
                      }}
                      disabled={loading}
                    >
                      <Text style={{ color: COLORS.text, textAlign: "center" }}>
                        {getFactorLabel(factor)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {selectedFactor && (
              <>
                <View style={authStyles.inputContainer}>
                  <TextInput
                    style={authStyles.textInput}
                    placeholder={
                      selectedStrategy === "backup_code"
                        ? "Enter backup code"
                        : "Enter verification code"
                    }
                    placeholderTextColor={COLORS.textLight}
                    value={code}
                    onChangeText={setCode}
                    keyboardType={
                      selectedStrategy === "backup_code"
                        ? "default"
                        : "number-pad"
                    }
                    autoCapitalize={
                      selectedStrategy === "backup_code" ? "characters" : "none"
                    }
                    autoComplete="one-time-code"
                    editable={!loading}
                  />
                </View>

                <TouchableOpacity
                  style={[
                    authStyles.authButton,
                    loading && authStyles.buttonDisabled,
                  ]}
                  onPress={handleVerify}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  <Text style={authStyles.buttonText}>
                    {loading ? "Verifying..." : "Verify"}
                  </Text>
                </TouchableOpacity>

                {codeIsSent && (
                  <TouchableOpacity
                    style={authStyles.linkContainer}
                    onPress={() => void sendCode(selectedStrategy)}
                    disabled={loading}
                  >
                    <Text style={authStyles.linkText}>
                      Didn&apos;t receive a code?{" "}
                      <Text style={authStyles.link}>Resend</Text>
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            )}

            <TouchableOpacity
              style={authStyles.linkContainer}
              onPress={handleBack}
              disabled={loading}
            >
              <Text style={authStyles.linkText}>
                <Text style={authStyles.link}>Back to Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignInVerificationScreen;

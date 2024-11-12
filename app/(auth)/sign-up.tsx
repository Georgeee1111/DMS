import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InputField from "@/components/InputField";
import { icons } from "@/constants";
import CustomButton from "@/components/CustomButton";
import { useRouter, useSegments } from "expo-router";
import axios, { AxiosError } from "axios";
import { useState } from "react";

const SignUp = () => {
  const router = useRouter();
  const segments = useSegments() as string[];
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://192.168.1.8:8000/api/register",
        formData
      );
      console.log("User registered successfully:", response.data);
      router.replace("/(auth)/sign-in");
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        console.error("Registration error:", error.response.data);
        console.error("Status code:", error.response.status);
      } else {
        console.error("An unknown error occurred:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const isSignUpScreen = segments.some((segment) => segment === "sign-up");

  return (
    <ImageBackground
      source={require("@/assets/images/Background.jpg")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <SafeAreaView className="flex-1 justify-center items-center bg-opacity-50">
        <View className="flex flex-row justify-between mb-4 w-full">
          <TouchableOpacity
            onPress={() => router.replace("/(auth)/sign-in")}
            className="ml-[2rem]"
          >
            <Text
              className={`flex flex-row text-[3rem] font-bold ${
                isSignUpScreen ? "text-gray-500" : "text-blue-600"
              }`}
            >
              <Text className="underline decoration-2 underline-offset-[10px]">
                Lo
              </Text>
              gin
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.replace("/(auth)/sign-up")}
            className="mr-[2rem]"
            disabled={isSignUpScreen}
          >
            <Text
              className={`flex flex-row text-[3rem] font-bold ${
                isSignUpScreen ? "text-blue-600" : "text-gray-500"
              }`}
            >
              <Text>Sign </Text>
              <Text className="underline decoration-2 underline-offset-[10px]">
                Up
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{ backgroundColor: "rgba(73, 88, 103, 0.5)" }}
          className="p-6 rounded-lg w-11/12 max-w-md"
        >
          <InputField
            label="Name"
            icon={icons.person}
            placeholder="Name"
            showLabel={false}
            placeholderTextColor="white"
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            className="text-white"
          />
          <InputField
            label="Phone Number"
            icon={icons.person}
            placeholder="Phone Number"
            showLabel={false}
            placeholderTextColor="white"
            onChangeText={(text) =>
              setFormData({ ...formData, phone_number: text })
            }
          />
          <InputField
            label="Email"
            icon={icons.email}
            placeholder="Email"
            showLabel={false}
            placeholderTextColor="white"
            onChangeText={(text) => setFormData({ ...formData, email: text })}
          />
          <InputField
            label="Password"
            secureTextEntry={true}
            icon={icons.lock}
            placeholder="Password"
            showLabel={false}
            placeholderTextColor="white"
            onChangeText={(text) =>
              setFormData({ ...formData, password: text })
            }
          />
          {loading ? (
            <ActivityIndicator
              size="large"
              color="#fff"
              style={{ marginTop: 16 }}
            />
          ) : (
            <CustomButton
              title="Sign Up"
              onPress={handleSignUp}
              style={{ backgroundColor: "rgba(0, 0, 0, 0.50)", marginTop: 16 }}
            />
          )}
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default SignUp;

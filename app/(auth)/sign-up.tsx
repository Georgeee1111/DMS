import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InputField from "@/components/InputField";
import { icons } from "@/constants";
import CustomButton from "@/components/CustomButton";
import { useRouter, useSegments } from "expo-router";

const SignUp = () => {
  const router = useRouter();
  const segments = useSegments() as string[];

  const handleSignUp = () => {
    console.log("Sign Up Button Pressed");
  };

  const isSignUpScreen = segments.some((segment) => segment === "sign-up");

  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-gray-100">
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
            <Text>Sign</Text>
            <Text className="underline decoration-2 underline-offset-[10px]">
              Up
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
      <View className="bg-white bg-opacity-70 p-6 rounded-lg shadow-lg w-11/12 max-w-md">
        <InputField
          label="Name"
          icon={icons.person}
          placeholder="Name"
          showLabel={false}
        />
        <InputField
          label="Phone Number"
          icon={icons.person}
          placeholder="Phone Number"
          showLabel={false}
        />
        <InputField
          label="Email"
          icon={icons.email}
          placeholder="Email"
          showLabel={false}
        />
        <InputField
          label="Password"
          secureTextEntry={true}
          icon={icons.lock}
          placeholder="Password"
          showLabel={false}
        />
        <CustomButton title="Sign Up" onPress={handleSignUp} className="mt-4" />
      </View>
    </SafeAreaView>
  );
};

export default SignUp;

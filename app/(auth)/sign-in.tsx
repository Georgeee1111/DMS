import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InputField from "@/components/InputField";
import { icons } from "@/constants";
import CustomButton from "@/components/CustomButton";
import { useRouter, useSegments } from "expo-router";

const SignIn = () => {
  const router = useRouter();
  const segments = useSegments() as string[];

  const handleSignIn = () => {
    console.log("Sign In Button Pressed");
  };

  const handleForgetPassword = () => {
    console.log("Forget Password Pressed");
  };

  const handleGoogleSignIn = () => {
    console.log("Google Sign In Pressed");
  };

  const handleFacebookSignIn = () => {
    console.log("Facebook Sign In Pressed");
  };

  const isSignInScreen = segments.some((segment) => segment === "sign-in");

  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-gray-100">
      <View className="flex flex-row justify-between mb-4 w-full">
        <TouchableOpacity
          onPress={() => router.replace("/(auth)/sign-in")}
          className="ml-[2rem]"
          disabled={isSignInScreen}
        >
          <Text
            className={`flex flex-row text-[3rem] font-bold ${
              isSignInScreen ? "text-blue-600" : "text-gray-500"
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
        >
          <Text
            className={`flex flex-row text-[3rem] font-bold ${
              isSignInScreen ? "text-gray-500" : "text-blue-600"
            }`}
          >
            <Text>Sign </Text>
            <Text className="underline decoration-2 underline-offset-[10px]">
              Up
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
      <View className="bg-white bg-opacity-70 p-6 rounded-lg shadow-lg w-11/12 max-w-md">
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
        <CustomButton title="Sign In" onPress={handleSignIn} className="mt-4" />

        <TouchableOpacity onPress={handleForgetPassword} className="mt-5">
          <Text className="text-black text-center">Forget Password?</Text>
        </TouchableOpacity>

        <Text className="text-center mt-2">Or</Text>

        <View className="flex flex-row items-center mt-2">
          <View className="flex-1 border-t border-gray-300" />
          <Text className="mx-2 text-gray-500">Sign Up with</Text>
          <View className="flex-1 border-t border-gray-300" />
        </View>

        <View className="flex flex-row justify-between mt-4">
          <CustomButton
            title="Google"
            onPress={handleGoogleSignIn}
            className="flex-1 mr-2"
          />
          <TouchableOpacity
            onPress={handleFacebookSignIn}
            className="flex-1 ml-2 border border-blue-600 rounded-full py-2 justify-center items-center"
            style={{ backgroundColor: "transparent" }}
          >
            <Text className="text-black text-center font-bold">Facebook</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignIn;

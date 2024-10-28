import { Redirect } from "expo-router";
import { useState, useEffect } from "react";
import SplashScreen from "@/components/SplashScreen";
const Home = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return <Redirect href="/(auth)/welcome" />;
};

export default Home;

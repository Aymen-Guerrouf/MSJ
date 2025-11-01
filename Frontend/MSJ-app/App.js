// App.js
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignIn from "./src/auth/SignIn";
import SignUp from "./src/auth/signup/SignUp";
import HomeTab from "./src/Home/HomeTab";
import ForgotPassword from "./src/auth/forgot/ForgotPassword";
import ResetPassword from "./src/auth/forgot/ResetPassword";
import ClubView from "./src/Home/screens/Map/ClubView";
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="HomeTab"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="HomeTab" component={HomeTab} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
        <Stack.Screen name="ClubView" component={ClubView} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

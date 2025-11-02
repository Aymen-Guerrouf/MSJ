// App.js
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignIn from "./src/auth/SignIn";
import SignUp from "./src/auth/signup/SignUp";
import VerifyCode from "./src/auth/signup/VerifyCode";
import HomeTab from "./src/Home/HomeTab";
import ForgotPassword from "./src/auth/forgot/ForgotPassword";
import ResetPassword from "./src/auth/forgot/ResetPassword";
import AdminPanel from "./src/admin/AdminPanel";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="SignIn"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="VerifyCode" component={VerifyCode} />
        <Stack.Screen name="HomeTab" component={HomeTab} />
        <Stack.Screen name="AdminPanel" component={AdminPanel} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

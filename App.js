import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import ForgetPasswordScreen from "./screens/ForgetPasswordScreen";
import MainScreen from "./screens/MainScreen";
import AddProductScreen from "./screens/AddProductScreen";
import ProductDetailScreen from "./screens/ProductDetailScreen";
import UserProfileToggle from "./screens/UserProfileToggle";
import EditUserScreen from "./screens/EditUserScreen";
import EditProductScreen from "./screens/EditProductScreen";
import PaymentScreen from "./screens/PaymentScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          options={{ headerShown: false }}
          component={LoginScreen}
        />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Forget Password" component={ForgetPasswordScreen} />
        <Stack.Screen
          name="MainScreen"
          options={{ headerShown: false }}
          component={MainScreen}
        />
        <Stack.Screen name="Sell" component={AddProductScreen} />
        <Stack.Screen
          name="Product Detail"
          // options={{ headerShown: false }}
          component={ProductDetailScreen}
        />
        <Stack.Screen
          name="ProductDetails"
          options={{ headerShown: false }}
          component={ProductDetailScreen}
        />
        <Stack.Screen name="UserProfileToggle" component={UserProfileToggle} />
        <Stack.Screen name="Edit User Profile" component={EditUserScreen} />
        <Stack.Screen name="Edit Product" component={EditProductScreen} />
        <Stack.Screen name="Payment" component={PaymentScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

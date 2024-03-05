import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Alert,
  ActivityIndicator, // Import ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";

import axios from "axios";
import React, { useState } from "react";
import { URL } from "../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = function ({ navigation }) {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false); // Initialize loading state

  const handleLogin = () => {
    // validate user input
    if (!data.email || !data.password) {
      Alert.alert("Missing Field", "Email and Password are require"),
        [{ text: "Okay" }];

      return;
    }

    // Set loading to true when login starts
    setLoading(true);

    // Making a request to our API for user login credentials
    axios
      .post(
        `${URL}/login`,
        {
          email: data.email,
          password: data.password,
        },
        {
          Headers: { "Content-Type": "application/json" },
        }
      )
      .then((response) => {
        console.log("Response!", response.data);

        //Getting Access, Refresh Token and id
        const {
          access_token,
          refresh_token,
          id,
          firstname,
          lastname,
          username,
          email,
          country,
          phone,
        } = response.data;

        //saving the tokens to AsyncStorage for future requests
        AsyncStorage.setItem("accessToken", access_token);
        AsyncStorage.setItem("refreshToken", refresh_token);
        AsyncStorage.setItem("UserId", String(id));
        AsyncStorage.setItem("firstname", firstname);
        AsyncStorage.setItem("lastname", lastname);
        AsyncStorage.setItem("username", username);
        AsyncStorage.setItem("email", email);
        AsyncStorage.setItem("country", country);
        AsyncStorage.setItem("phone", phone);

        // Navigating to the Home Screen
        // navigation.navigate("MainScreen");

        //This prevent route back to the login screen when user login
        navigation.reset({
          index: 0,
          routes: [{ name: "MainScreen" }],
        });
      })
      .catch((err) => {
        // This handle login failure
        console.log("Login attempt faild", err.response);

        //This display the error message to the user
        Alert.alert("Login Failed", "Invalid Username or Password.");
      })
      .finally(() => {
        // Set loading to false when login completes (whether successful or not)
        setLoading(false);
      });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <SafeAreaView style={styles.container}>
          {/* Background Image with Dark Overlay */}
          <ImageBackground
            source={require("../assets/shopping-background.jpg")}
            style={styles.backgroundImage}
          >
            {/* Dark Overlay */}
            <View style={styles.overlay} />

            {/* Logo and Welcome Back Text */}
            <View style={styles.logoContainer}>
              <Image
                source={require("../assets/logo.png")}
                style={styles.logo}
              />
              <Text style={styles.welcomeText}>Welcome Back</Text>
            </View>

            {/* Login Form */}
            <View style={styles.formContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={data.email}
                onChangeText={(val) => setData({ ...data, email: val })}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={data.password}
                onChangeText={(val) => setData({ ...data, password: val })}
                secureTextEntry={true}
              />
              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
              >
                {loading ? ( // Show ActivityIndicator if loading is true
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Sign In</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Forgot Password? and Don't have an account? Sign Up */}
            <View style={styles.bottomLinksContainer}>
              <TouchableOpacity
                style={styles.bottomLink}
                onPress={() => navigation.navigate("Forget Password")}
              >
                <Text style={styles.bottomLinkText}>Forget Password?</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.bottomLink}
                onPress={() => navigation.navigate("SignUp")}
              >
                <Text style={styles.bottomLinkText}>Sign Up</Text>
              </TouchableOpacity>
            </View>

            {/* -- or sign up with -- */}
            <View style={styles.orContainer}>
              <Text style={styles.orText}>---- or sign up with ----</Text>
              <View style={styles.socialButtonsContainer}>
                <TouchableOpacity style={styles.socialButton}>
                  <FontAwesome name="google" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <FontAwesome name="facebook" size={24} color="black" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Note */}
            <View style={styles.noteContainer}>
              <Text style={styles.noteText}>
                Welcome To Our Marketplace App. Connect With Buyers And Sellers
                To Discover Great Deals On A Variety Of Items
              </Text>
            </View>
          </ImageBackground>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Adjust opacity as needed
  },
  logoContainer: {
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
    marginTop: 20,
  },
  formContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    alignItems: "center",
    marginTop: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  loginButton: {
    backgroundColor: "#32CD32",
    borderRadius: 20,
    paddingVertical: 10,
    width: "100%",
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
  bottomLinksContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 15,
  },
  bottomLink: {
    justifyContent: "center",
  },
  bottomLinkText: {
    color: "white",
    textDecorationLine: "underline",
  },
  orContainer: {
    width: "80%",
    marginTop: 10,
    alignItems: "center",
  },
  orText: {
    color: "white",
    marginBottom: 10,
    textAlign: "center",
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  socialButton: {
    backgroundColor: "lightgrey",
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 10,
  },
  noteContainer: {
    position: "absolute",
    bottom: 20,
  },
  noteText: {
    color: "white",
    textAlign: "center",
    fontSize: 12,
    margin: 10,
    padding: 5,
  },
});

export default LoginScreen;

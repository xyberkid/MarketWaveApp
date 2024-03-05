import axios from "axios";
import { requestMediaLibraryPermissionsAsync } from "expo-image-picker";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Alert,
  Platform,
} from "react-native";
import { URL } from "../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignUpScreen = ({ navigation }) => {
  const [data, setData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    gender: "",
    country: "",
    address: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleSignUp = () => {
    if (
      !data.firstname ||
      !data.lastname ||
      !data.username ||
      !data.email ||
      !data.gender ||
      !data.country ||
      !data.address ||
      !data.phone ||
      !data.password
    ) {
      Alert.alert("Missing Fields", "You have some missing fields to fill");
      return;
    }

    if (data.password !== data.confirmPassword) {
      Alert.alert("Password Mismatch", "Password and Confirm did not match");
      return;
    }

    axios
      .post(
        `${URL}/register`,
        {
          firstname: data.firstname,
          lastname: data.lastname,
          username: data.username,
          email: data.email,
          gender: data.gender,
          country: data.country,
          address: data.address,
          phone: data.phone,
          password: data.password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((response) => {
        console.log("Response!", response.data);
        const jsonValue = JSON.stringify(response.data);
        AsyncStorage.setItem("userData", jsonValue);
        Alert.alert("Account Created Successfully", "Please Login", [
          { text: "Okay", onPress: () => navigation.navigate("Login") },
        ]);
      })
      .catch((err) => {
        console.log("Error!", err.response.data);
        if (err.response && err.response.data && err.response.data.message) {
          Alert.alert("Regisgration Error", err.response.data.message);
        }
      });
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContentContainer}
          style={styles.scrollView}
        >
          <View style={styles.container}>
            <Text style={styles.title}>Create An Account</Text>
            <View style={styles.formContainer}>
              <TextInput
                style={styles.input}
                placeholder="First Name"
                value={data.firstname}
                onChangeText={(val) => setData({ ...data, firstname: val })}
              />
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={data.lastname}
                onChangeText={(val) => setData({ ...data, lastname: val })}
              />
              <TextInput
                style={styles.input}
                placeholder="Username"
                value={data.username}
                onChangeText={(val) => setData({ ...data, username: val })}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={data.email}
                onChangeText={(val) => setData({ ...data, email: val })}
              />
              <TextInput
                style={styles.input}
                placeholder="Gender"
                value={data.gender}
                onChangeText={(val) => setData({ ...data, gender: val })}
              />
              <TextInput
                style={styles.input}
                placeholder="Country"
                value={data.country}
                onChangeText={(val) => setData({ ...data, country: val })}
              />
              <TextInput
                style={styles.input}
                placeholder="Address"
                value={data.address}
                onChangeText={(val) => setData({ ...data, address: val })}
              />
              <TextInput
                style={styles.input}
                placeholder="Phone"
                keyboardType="numeric"
                value={data.phone}
                onChangeText={(val) => setData({ ...data, phone: val })}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={data.password}
                onChangeText={(val) => setData({ ...data, password: val })}
              />
              <TextInput
                style={styles.input}
                placeholder="Comfirm Password"
                secureTextEntry
                value={data.confirmPassword}
                onChangeText={(val) =>
                  setData({ ...data, confirmPassword: val })
                }
              />
              <TouchableOpacity
                style={styles.createAccountButton}
                onPress={handleSignUp}
              >
                <Text style={styles.buttonText}>Create Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  formContainer: {
    width: "80%",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  createAccountButton: {
    backgroundColor: "#32CD32",
    borderRadius: 20,
    paddingVertical: 10,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
});

export default SignUpScreen;

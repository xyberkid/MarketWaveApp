import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { URL } from "../constants";

const UpdatePasswordScreen = function ({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [enableUpdatePassword, setEnableUpdatePassword] = useState(false);

  const handleUpdatePassword = async () => {
    setLoading(true); // Set loading to true when updating password
    try {
      const response = await fetch(`${URL}/update-password`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        setPasswordChanged(true);
        setShowModal(true);
      } else {
        const data = await response.json();
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      console.error("Error updating password:", error);
      Alert.alert("Error", "An error occurred while updating the password.");
    } finally {
      setLoading(false); // Set loading to false after updating password
    }
  };

  useEffect(() => {
    if (passwordChanged) {
      setTimeout(() => {
        setShowModal(false);
        navigation.navigate("Login"); // Navigate to the login screen
      }, 2000); // Wait for 2 seconds before navigating
    }
  }, [passwordChanged]);

  useEffect(() => {
    // Check if all fields are filled out before enabling the "Update Password" button
    if (firstName && lastName && phoneNumber && email && password) {
      setEnableUpdatePassword(true);
    } else {
      setEnableUpdatePassword(false);
    }
  }, [firstName, lastName, phoneNumber, email, password]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Update Password</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={(text) => setFirstName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={(text) => setLastName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={(text) => setPhoneNumber(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="New Password"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <TouchableOpacity
        style={styles.resetButton}
        onPress={handleUpdatePassword}
        disabled={!enableUpdatePassword} // Disable button if not all fields are filled out
      >
        <Text style={styles.buttonText}>Update Password</Text>
      </TouchableOpacity>
      <Modal visible={showModal} transparent={true}>
        <View style={styles.modalContainer}>
          {passwordChanged ? (
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>
                Password successfully changed!
              </Text>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.buttonText}>OK</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ActivityIndicator size="large" color="#0000ff" />
          )}
        </View>
      </Modal>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
    </SafeAreaView>
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
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: "80%",
  },
  resetButton: {
    backgroundColor: "#32CD32",
    borderRadius: 20,
    paddingVertical: 10,
    width: "80%",
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  confirmButton: {
    backgroundColor: "#32CD32",
    borderRadius: 20,
    paddingVertical: 10,
    width: "80%",
  },
});

export default UpdatePasswordScreen;

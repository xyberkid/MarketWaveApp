import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { URL } from "../constants";

const EditUserScreen = ({ route }) => {
  const { currentUserData } = route.params;
  const [firstname, setFirstname] = useState(currentUserData[0]);
  const [lastname, setLastname] = useState(currentUserData[1]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");

  const handleEditUser = async () => {
    try {
      // Retrieve access token from AsyncStorage
      const accessToken = await AsyncStorage.getItem("accessToken");

      // Get the user ID from the route params
      const { userId } = route.params;

      // Make a PUT request to update the user profile with the JWT token in the headers
      const response = await axios.put(
        `${URL}/user-update-profile/${userId}`,
        {
          firstname,
          lastname,
          username,
          email,
          gender,
          country,
          address,
          phone,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log("User profile updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  // Getting Image from Gallery
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0]?.uri);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <ScrollView>
          <View style={styles.container}>
            <Text style={styles.title}>Edit Profile</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="First Name"
                onChangeText={setFirstname}
                value={firstname}
              />
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                onChangeText={setLastname}
                value={lastname}
              />
              <TextInput
                style={styles.input}
                placeholder="Username"
                onChangeText={setUsername}
                value={username}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                onChangeText={setEmail}
                value={email}
              />
              <TextInput
                style={styles.input}
                placeholder="Gender"
                onChangeText={setGender}
                value={gender}
              />
              <TextInput
                style={styles.input}
                placeholder="Country"
                onChangeText={setCountry}
                value={country}
              />
              <TextInput
                style={styles.input}
                placeholder="Address"
                onChangeText={setAddress}
                value={address}
              />
              <TextInput
                style={styles.input}
                placeholder="Phone"
                keyboardType="numeric"
                onChangeText={setPhone}
                value={phone}
              />
              <TextInput
                style={styles.input}
                placeholder="Current Password"
                onChangeText={setCurrentPassword}
                value={currentPassword}
                secureTextEntry={true}
              />
            </View>
            <Button
              title="Save"
              onPress={handleEditUser}
              style={styles.saveButton}
            />
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
    padding: 20,
  },
  imageBox: {
    backgroundColor: "#094FAF",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    height: "45%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: "green",
    padding: 10,
    marginTop: 20,
  },
});

export default EditUserScreen;

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Alert,
  TouchableOpacity,
  Platform,
  Keyboard,
  Image,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { RadioButton } from "react-native-paper";
import { URL } from "../constants";
import * as ImagePicker from "expo-image-picker";
import { format } from "date-fns";

const AddProductScreen = ({ navigation }) => {
  const [productname, setProductName] = useState("");
  const [productdescription, setProductDescription] = useState("");
  const [productprice, setProductPrice] = useState("");
  const [location, setLocaton] = useState("");
  const [agentname, setAgentName] = useState("");
  const [agentnumber, setAgentNumber] = useState("");
  const [productcategory, setProductCategory] = useState("");
  const [publishDate, setpublishDate] = useState("");
  const [status, setStatus] = useState("");
  const [productimage, setProductImage] = useState("");

  useEffect(() => {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${
      currentDate.getMonth() + 1
    }-${currentDate.getDate()}`;

    setpublishDate(formattedDate);
  }, []);

  const handleAddProduct = async () => {
    try {
      const userId = await AsyncStorage.getItem("UserId");
      if (
        !productname ||
        !productdescription ||
        !productimage ||
        !productprice ||
        !location ||
        !agentname ||
        !agentnumber ||
        !productcategory ||
        !publishDate ||
        !status
      ) {
        Alert.alert("Missing Field", "Please fill in all fields");
        return;
      }

      const response = await axios.post(
        `${URL}/upload-product`,
        {
          productname: productname,
          productdescription: productdescription,
          productimage: productimage,
          productcategory: productcategory,
          productprice: productprice,
          location: location,
          agentname: agentname,
          agentnumber: agentnumber,
          publishdate: publishDate,
          status: status,
          user_id: userId,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("Success:", response.data);

      Alert.alert("Publish", "Product Successfully Upload", [{ text: "Okay" }]);

      navigation.navigate("MainScreen");
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProductImage(result.assets[0]?.uri);

      console.log(result.assets[0]?.uri);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <TextInput
              style={styles.input}
              placeholder="Product Name"
              value={productname}
              onChangeText={(text) => setProductName(text)}
            />
            <TextInput
              style={[styles.input, styles.largeInput]}
              placeholder="Product Description"
              value={productdescription}
              onChangeText={(text) => setProductDescription(text)}
              multiline
            />
            <TextInput
              style={styles.input}
              placeholder="Product Price"
              value={productprice}
              onChangeText={(text) => setProductPrice(text)}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Location"
              value={location}
              onChangeText={(text) => setLocaton(text)}
            />
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={productcategory}
                onValueChange={(itemValue, itemIndex) =>
                  setProductCategory(itemValue)
                }
              >
                <Picker.Item label="Select a category" value="" />
                <Picker.Item label="Fashion" value="Fashion" />
                <Picker.Item label="Food" value="Food" />
                <Picker.Item label="Electronic" value="Electronic" />
                <Picker.Item label="Others" value="Others" />
              </Picker>
            </View>

            <RadioButton.Group
              onValueChange={(value) => setStatus(value)}
              value={status}
            >
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={status}
                  onValueChange={(itemValue, itemIndex) => setStatus(itemValue)}
                >
                  <Picker.Item label="Select Product Conditon" value="" />
                  <Picker.Item label="New" value="New" />
                  <Picker.Item label="Used" value="Used" />
                </Picker>
              </View>
            </RadioButton.Group>
            <TextInput
              style={styles.input}
              placeholder="Seller / Agen Name"
              value={agentname}
              onChangeText={(text) => setAgentName(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Seller / Agen Number"
              keyboardType="numeric"
              value={agentnumber}
              onChangeText={(text) => setAgentNumber(text)}
            />
            <Text style={styles.DateStyle}>
              {format(new Date(), "yyyy-MM-dd")}
            </Text>
            <Button title="Upload Image" onPress={pickImage} />
            {productimage && (
              <Image
                source={{ uri: productimage }}
                style={{ width: 200, height: 200 }}
              />
            )}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.sellButton}
                onPress={handleAddProduct}
              >
                <Text style={styles.sellButtonText}>Sell</Text>
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
    padding: 20,
  },
  sellButtonText: {
    color: "white",
    fontWeight: "500",
  },
  buttonContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  sellButton: {
    height: 40,
    width: 150,
    backgroundColor: "green",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  DateStyle: {
    backgroundColor: "#eee",
    borderRadius: 5,
    padding: 10,
    display: "none",
  },
  radioGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 20,
  },
  condition: {},
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 50,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  largeInput: {
    height: 120,
    textAlignVertical: "top",
  },
  pickerContainer: {
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
});

export default AddProductScreen;

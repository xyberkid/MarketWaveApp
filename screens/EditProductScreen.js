import axios from "axios";
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { RadioButton } from "react-native-paper";
import { URL } from "../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EditProductScreen = ({ route, navigation }) => {
  // Get product data from navigation params
  const { productData } = route.params;

  const [productname, setProductName] = useState(productData.productname);
  const [productdescription, setProductDescription] = useState(
    productData.productdescription
  );
  const [productprice, setProductPrice] = useState(productData.productprice);
  const [productcategory, setProductCategory] = useState(
    productData.productcategory
  );
  //   const [publishdate, setPublishdate] = useState(productData.publishdate);
  const [status, setStatus] = useState(productData.status);
  const [productimage, setProductImage] = useState(productData.productimage);

  const handleProductUpdate = async () => {
    try {
      // Getting User ID from AsynStorage
      const userId = await AsyncStorage.getItem("UserId");
      console.log("user", userId);

      // if (!title || !description || !startDate || !endDate || !priority) {
      //     Alert.alert(
      //         'Missing field', 'You have some missing fields to fill'
      //     ), [{ text: 'Okay' }];
      //     return;
      // }

      const response = await axios.put(
        `${URL}/update-product/${productData.id}`,
        {
          productname: productname,
          productdescription: productdescription,
          productimage: productimage,
          productcategory: productcategory,
          productprice: productprice,
          //   publishdate: convertDateToBackendFormat(publishdate),
          status: status,
          user_id: userId,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Success:", response.data);
      // Alert Message
      Alert.alert("Upated", "Product Updated Successfully", [{ text: "Okay" }]);

      navigation.navigate("MainScreen");
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      ScrollView
      showsVerticalScrollIndicator={false}
    >
      <View style={{ marginBottom: 40 }}>
        <TextInput
          style={styles.input}
          placeholder="Product Name"
          value={productname}
          onChangeText={(val) => setProductName(val)}
        />

        <TextInput
          style={{ ...styles.input, height: 80 }}
          placeholder="Product Description"
          multiline
          numberOfLines={4}
          value={productdescription}
          onChangeText={(val) => setProductDescription(val)}
        />
        <TextInput
          style={styles.input}
          placeholder="Product Price"
          value={productprice.toString()}
          onChangeText={(text) => setProductPrice(text)}
          keyboardType="numeric"
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

        <Text style={styles.DateStyle}>Status</Text>

        <RadioButton.Group
          onValueChange={(val) => setStatus(val)}
          value={status}
        >
          <View style={styles.radioGroup}>
            <View style={styles.radioItem}>
              <RadioButton value="New" />
              <Text style={styles.radioLabel}>New</Text>
            </View>

            <View style={styles.radioItem}>
              <RadioButton value="Used" />
              <Text style={styles.radioLabel}>Used</Text>
            </View>
          </View>
        </RadioButton.Group>

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleProductUpdate}
        >
          <Text style={styles.buttonText}>Update Product</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    paddingLeft: 35,
    paddingRight: 35,
    textAlign: "center",
    paddingTopTop: 50,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  DateStyle: {
    backgroundColor: "#eee",
    borderRadius: 5,
    // marginBottom: 20,
    padding: 10,
  },
  radioGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 20,
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 50,
  },

  radioLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
  },

  addButton: {
    backgroundColor: "#094FAF",
    padding: 13, // All sides are 10
    paddingHorizontal: 20, // Left and right are 20
    borderRadius: 15,
    marginTop: 20,
    width: "100%",
    alignSelf: "center",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
  pickerContainer: {
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
});

export default EditProductScreen;

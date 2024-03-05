import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  Modal,
  TouchableOpacity,
  Text,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  FlatList,
  Alert,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome } from "@expo/vector-icons";
import { URL } from "../constants";

const magnifying_glass = require("../assets/magnifying-glass.png");

const UserProfileToggle = React.memo(({ userId }) => {
  const navigation = useNavigation();
  const [currentUserData, setCurrentUserData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userProducts, setUserProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [image, setImage] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  const handleLogout = () => {
    navigation.reset({ index: 0, routes: [{ name: "Login" }] });
  };

  const handleEditUser = () => {
    navigation.navigate("Edit User Profile", { currentUserData });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const userId = await AsyncStorage.getItem("UserId");
      const response = await axios.get(`${URL}/user-products/${userId}`);
      setUserProducts(response.data);
      setFilteredProducts(response.data.reverse());
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const firstname = await AsyncStorage.getItem("firstname");
        const lastname = await AsyncStorage.getItem("lastname");
        const username = await AsyncStorage.getItem("username");
        const country = await AsyncStorage.getItem("country");
        const phone = await AsyncStorage.getItem("phone");

        setCurrentUserData([firstname, lastname, username, country, phone]);
      } catch (error) {
        // Handle error
      }
    };

    getCurrentUser();
  }, []);

  const toggleModal = async () => {
    setIsModalVisible(!isModalVisible);
    // Fetch products only when the modal is opened
    if (!isModalVisible) {
      await fetchProducts();
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await axios.delete(`${URL}/delete-product/${productId}`);
      console.log("Success:", response.data);

      // Update the user products after deletion
      fetchProducts();
      Alert.alert("Deleted", "Deleted Successfully", [{ text: "Okay" }]);
    } catch (error) {
      console.log(error.response);
      Alert.alert("Error", "Failed to delete product", [{ text: "Okay" }]);
    }
  };

  const handleEditProduct = async (product) => {
    navigation.navigate("Edit Product", { productData: product });
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
    <View>
      <TouchableOpacity onPress={toggleModal}>
        <Image
          source={require("../assets/menu.png")}
          resizeMode="contain"
          style={{ width: 30, height: 40 }}
        />
      </TouchableOpacity>
      <Modal
        animationType="none"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <TouchableWithoutFeedback>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={toggleModal} // Close modal when clicked
              >
                <FontAwesome name="times" size={24} color="black" />
              </TouchableOpacity>
              <View style={styles.userInfoContainer}>
                <Pressable onPress={pickImage}>
                  {image ? (
                    <Image
                      source={{ uri: image }}
                      // style={{ width: 200, height: 200 }}
                      style={styles.profileImage}
                    />
                  ) : (
                    <Image
                      source={require("../assets/user.png")}
                      style={styles.profileImage}
                      resizeMode="cover"
                    />
                  )}
                </Pressable>

                <Text
                  style={styles.userName}
                >{`${currentUserData[0]} ${currentUserData[1]}`}</Text>
                <Text style={styles.userName}>
                  {"( "}
                  {`${currentUserData[2]}`}
                  {")"}
                </Text>
                <View />
                <Text style={styles.heading}>List Of Product</Text>
              </View>
              <FlatList
                data={filteredProducts}
                renderItem={({ item }) => (
                  <View key={item.id} style={styles.productItem}>
                    <Image
                      source={{ uri: item.productimage }}
                      style={styles.productImage}
                      resizeMode="cover"
                    />
                    <View style={styles.productInfo}>
                      <View style={styles.leftContent}>
                        <Text style={styles.productName}>
                          {item.productname}
                        </Text>
                        <Text style={styles.productPrice}>
                          ${item.productprice}
                        </Text>
                      </View>
                      <View style={styles.rightContent}>
                        {/* <TouchableOpacity
                          onPress={() => handleEditProduct(item)}
                        >
                          <FontAwesome name="edit" size={20} color="black" />
                        </TouchableOpacity> */}
                        <TouchableOpacity
                          onPress={() => handleDeleteProduct(item.id)}
                        >
                          <FontAwesome name="trash" size={20} color="black" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                )}
                keyExtractor={(item) => item.id.toString()}
                style={styles.productsContainer}
              />
              <View style={styles.settingsOptions}>
                <TouchableOpacity
                  style={styles.settingsOption}
                  onPress={() => {
                    handleEditUser(); // Handle edit user action
                    toggleModal(); // Close the modal after navigation
                  }}
                >
                  <Text>Edit Account</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.settingsOption}
                  onPress={() => {
                    handleLogout(); // Handle logout action
                    toggleModal(); // Close the modal after navigation
                  }}
                >
                  <Text>Logout</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
});

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignItems: "flex-start",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    width: "70%",
    height: "100%",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 15,
  },
  userInfoContainer: {
    alignItems: "center",
    borderBottomColor: "gray",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  userName: {
    fontSize: 15,
    fontWeight: "bold",
  },
  heading: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 15,
    marginTop: 20,
  },
  productsContainer: {
    maxHeight: 800,
  },
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "white",
    borderRadius: 5,
  },
  productImage: {
    width: 25,
    height: 25,
    borderRadius: 20,
    marginRight: 10,
    marginLeft: 5,
  },
  productInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  productName: {
    fontSize: 13,
    fontWeight: "bold",
  },
  productPrice: {
    fontSize: 10,
    color: "darkgreen",
    fontWeight: "bold",
  },
  settingsOptions: {
    marginTop: "30%",
    // marginBottom: 10,
  },
  settingsOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
  leftContent: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flex: 1,
  },
  rightContent: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    margin: 10,
  },
});

export default UserProfileToggle;

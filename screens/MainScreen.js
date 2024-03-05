import React, { useState, useEffect } from "react";
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator, // Import ActivityIndicator
  RefreshControl, // Import RefreshControl
} from "react-native";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import UserProfileToggle from "./UserProfileToggle";
import axios from "axios";
import { URL } from "../constants";

// const magnifying_glass = require("../assets/magnifying-glass.png");

const MainScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const { navigate } = useNavigation();
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true); // Initialize loading state
  const [refreshing, setRefreshing] = useState(false); // Initialize refreshing state

  const searchProducts = (keyword) => {
    const lowercasedKeyword = keyword.toLowerCase();

    if (lowercasedKeyword === "") {
      setFilteredProducts(products);
    } else {
      const results = products.filter((product) => {
        return product.productname.toLowerCase().includes(lowercasedKeyword);
      });
      setFilteredProducts(results);
    }
  };

  const filterProductsByCategory = (category) => {
    if (category === "All") {
      setFilteredProducts(products);
    } else {
      const results = products.filter(
        (product) => product.productcategory === category
      );
      setFilteredProducts(results);
    }
    setSelectedCategory(category);
  };

  useEffect(() => {
    fetchProducts(); // Fetch products when the component mounts
  }, []);

  const fetchProducts = async () => {
    try {
      // const userId = await AsyncStorage.getItem("UserId");
      const response = await axios.get(`${URL}/get-all`);
      setProducts(response.data.products);
      setFilteredProducts(response.data.products.reverse());

      console.log("response:", response.data.products);
    } catch (error) {
      console.log(error);
    } finally {
      // Set loading to false when products are fetched
      setLoading(false);
      setRefreshing(false); // Set refreshing to false when products are fetched
    }
  };

  const onRefresh = () => {
    setRefreshing(true); // Set refreshing to true when the user pulls to refresh
    fetchProducts(); // Fetch products when the user pulls to refresh
  };

  const toggleProfile = () => {
    setIsProfileVisible(!isProfileVisible);
    setIsModalVisible(true); // Set isModalVisible to true when the profile is visible
    navigation.setOptions({ userData: currentUserData });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerSection}>
          <View>
            <UserProfileToggle />
          </View>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search for a product"
              onChangeText={(text) => searchProducts(text)}
            />
            {/* <Image
              source={magnifying_glass}
              resizeMode="contain"
              style={styles.magnifyingIconStyle}
            /> */}
          </View>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={() => navigate("Sell")}>
              <FontAwesome name="shopping-cart" size={25} color="green" />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.title}>
          All Your{" "}
          <Text style={{ color: "green", fontSize: 20 }}>Favorite</Text> At One
          Place
        </Text>
        <View style={styles.slider}>
          <ScrollView horizontal>
            <Image
              source={require("../assets/car.png")}
              resizeMode="contain"
              style={{ width: 100, height: 100 }}
            />
            <Image
              source={require("../assets/IPhone15.png")}
              resizeMode="contain"
              style={{ width: 100, height: 100 }}
            />
            <Image
              source={require("../assets/mouse.png")}
              resizeMode="contain"
              style={{ width: 100, height: 100 }}
            />
            <Image
              source={require("../assets/pizza.jpg")}
              resizeMode="contain"
              style={{ width: 100, height: 100 }}
            />
            <Image
              source={require("../assets/pc.png")}
              resizeMode="contain"
              style={{ width: 100, height: 100 }}
            />
            <Image
              source={require("../assets/dress.png")}
              resizeMode="contain"
              style={{ width: 100, height: 100 }}
            />
          </ScrollView>
        </View>
        <View style={styles.typesSection}>
          {["All", "Fashion", "Food", "Electronic", "Others"].map(
            (category) => (
              <TouchableOpacity
                key={category}
                onPress={() => filterProductsByCategory(category)}
              >
                <Text
                  style={[
                    styles.typesText,
                    selectedCategory === category && styles.typesTextActive,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>
        <View style={styles.listSection}>
          <Text style={styles.headText}>Most Recent Product</Text>
          {}
          <ScrollView
            style={styles.elementPallet}
            refreshControl={
              // Add RefreshControl to the ScrollView
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {loading ? ( // Show ActivityIndicator if loading is true
              <ActivityIndicator size="large" color="green" />
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <TouchableOpacity
                  style={styles.element}
                  key={product.id}
                  activeOpacity={0.8}
                  onPress={() =>
                    navigation.navigate("Product Detail", {
                      product: product,
                    })
                  }
                >
                  <View style={styles.infoArea}>
                    <Text style={styles.infoTitle}>{product.productname}</Text>
                    <Text style={styles.infoSub}>
                      {product.productcategory}
                    </Text>
                    <Text style={styles.infoSub}>{product.status}</Text>
                    <Text style={styles.infoPrice}>
                      <Text style={styles.infoAmount}>
                        ${product.productprice}
                      </Text>
                    </Text>
                  </View>
                  <View style={styles.imageArea}>
                    <Image
                      style={styles.productImage}
                      source={{ uri: product.productimage }}
                      resizeMode="contain"
                    />
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.notFoundText}>Product not found</Text>
            )}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#e7e7e7",
  },
  container: {
    flex: 1,
    paddingRight: 25,
    paddingLeft: 20,
  },
  headerSection: {
    height: 110,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    marginLeft: -15,
    marginRight: -15,
  },
  // magnifying_glass: {
  //   marginLeft: 14,
  // },
  buttonsContainer: {
    flexDirection: "row",
  },
  faceIconStyle: {
    width: 40,
    height: 40,
    borderRadius: 60,
    overflow: "hidden",
    marginLeft: -15,
  },
  menu: {
    position: "absolute",
    top: 70,
    left: 0,
    width: 200,
    height: 200,
    backgroundColor: "white",
    zIndex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "left",
    marginTop: -20,
    marginLeft: -10,
  },

  slider: {
    height: 100,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: "white",
    width: "110%",
    marginLeft: -15,
  },

  typesSection: {
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "center",
    paddingLeft: 30,
  },
  typesTextActive: {
    fontSize: 15,
    marginRight: 34,
    fontWeight: "bold",
    color: "green",
  },
  typesText: {
    fontSize: 15,
    marginRight: 33,
    fontWeight: "500",
    color: "#696969",
  },

  listSection: {
    marginTop: 10,
  },
  headText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft: -10,
  },
  elementPallet: {
    marginLeft: -15,
    width: "110%",
    height: 525,
  },
  element: {
    height: 100,
    padding: 15,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: "white",
    flexDirection: "row",
    marginBottom: 13,
  },
  infoArea: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: "bold",
  },
  infoSub: {
    fontSize: 11,
    fontWeight: "600",
    color: "darkgreen",
  },
  infoPrice: {
    position: "absolute",
    bottom: 0,
    fontSize: 10,
    color: "#696969",
    fontWeight: "bold",
  },
  infoAmount: {
    fontSize: 12,
    color: "black",
    fontWeight: "600",
  },
  imageArea: {
    flex: 1,
  },
  productImage: {
    position: "absolute",
    top: -5,
    left: -5,
    width: "130%",
    height: "120%",
  },

  searchInput: {
    width: "80%",
    height: 30,
    backgroundColor: "white",
    paddingLeft: 10,
  },
  magnifyingIconStyle: {
    width: 24,
    height: 24,
  },
  notFoundText: {
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
});

export default MainScreen;

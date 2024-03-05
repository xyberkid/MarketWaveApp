import React, { useState, useEffect } from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
const back = require("../assets/left-arrow.png");

const ProductDetailScreen = ({ route }) => {
  const navigation = useNavigation();
  const { product } = route.params;

  const handleBuyNow = () => {
    navigation.navigate("Payment", {
      productImage: product.productimage,
      productName: product.productname,
      productPrice: product.productprice,
      sellerName: product.agentname,
      sellerContact: product.agentnumber,
      productLocation: product.location,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.imageSection}>
            <Image
              source={{ uri: product.productimage }}
              resizeMode="contain"
              style={styles.productImage}
            />
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.makemodelText}>{product.productname}</Text>
            <Text style={styles.typetranText}>
              Category: {product.productcategory}
            </Text>
            <Text style={styles.typetranText}>Condition: {product.status}</Text>
            <Text style={styles.typetranText}>
              Location: {product.location}
            </Text>
            <Text style={styles.typetranText}>
              Post Date: {product.publishdate}
            </Text>
            <Text style={styles.price}>
              <Text style={styles.amount}>${product.productprice}</Text>
            </Text>
            <Text style={styles.agent}>
              <Text style={styles.agentname}>Agent: {product.agentname}</Text>
            </Text>
            <ScrollView>
              <Text style={styles.descriptionText}>
                {product.productdescription}
              </Text>
            </ScrollView>
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.buyButton} onPress={handleBuyNow}>
            <Text style={styles.buyButtonText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    paddingRight: 35,
    paddingLeft: 35,
  },
  headerSection: {
    height: 120,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  menuIconStyle: {
    width: 25,
  },
  HeaderText: {
    fontSize: 20,
    marginLeft: 5,
    fontWeight: "500",
    alignContent: "center",
  },
  faceIconStyle: {
    width: 30,
  },

  imageSection: {
    width: "100%",
    height: 250,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  productImage: {
    width: 300,
    height: 300,
    marginTop: 40,
  },

  infoSection: {
    marginTop: 30,
  },
  topTextArea: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  userInfoSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  userImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 5,
  },
  userName: {
    fontSize: 12,
    fontWeight: "500",
  },
  makemodelText: {
    fontSize: 20,
    fontWeight: "500",
  },
  agent: {
    fontWeight: "500",
  },
  price: {
    fontWeight: "400",
    color: "green",
    textAlign: "right",
  },
  amount: {
    fontWeight: "bold",
  },
  typetranText: {
    marginTop: 1,
    color: "#696969",
    fontWeight: "600",
    fontSize: 12,
  },
  descriptionText: {
    marginTop: 10,
    fontSize: 14,
    letterSpacing: 0.1,
    lineHeight: 18,
    color: "#696969",
    fontWeight: "500",
  },
  buttonContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  buyButton: {
    height: 40,
    width: 150,
    backgroundColor: "green",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buyButtonText: {
    color: "white",
    fontWeight: "500",
  },
  addToCartButton: {
    height: 40,
    width: 150,
    backgroundColor: "green",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  addToCartButtonText: {
    color: "white",
    fontWeight: "500",
  },
});

export default ProductDetailScreen;

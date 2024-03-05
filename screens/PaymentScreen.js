import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Linking,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { RadioButton } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";

const PaymentScreen = ({ route }) => {
  const {
    productImage,
    productName,
    productPrice,
    sellerName,
    sellerContact,
    productLocation,
  } = route.params;

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [mobileMoneyProvider, setMobileMoneyProvider] = useState("");
  const [paymentDetails, setPaymentDetails] = useState({
    senderNumber: "",
    accountNumber: "",
  });

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const handleMobileMoneyProvider = (provider) => {
    setMobileMoneyProvider(provider);
    // Show a popup asking for payment details
    if (provider === "Orange Money" || provider === "MTN Mobile Money") {
      Alert.alert(`Enter ${provider} Payment Details`, "", [
        {
          text: "Confirm Payment",
          onPress: () => handleMobileMoneyPayment(),
        },
      ]);
    } else if (provider === "TipMe" || provider === "Ewallie") {
      Alert.alert(`Enter ${provider} Account Number`, "", [
        {
          text: "Confirm Payment",
          onPress: () => handleTipMeEwalliePayment(),
        },
      ]);
    } else if (provider === "In Person") {
      Alert.alert(
        `Contact Seller`,
        `Name: ${sellerName}\nPhone: ${sellerContact}`,
        [
          {
            text: "Contact",
            onPress: () => handleInPersonPayment(sellerContact),
          },
        ]
      );
    }
  };

  const handleMobileMoneyPayment = () => {
    // Handle mobile money payment
    // Send payment details to server, etc.
    Alert.alert("Payment Successful", "", [{ text: "OK" }]);
  };

  const handleTipMeEwalliePayment = () => {
    // Handle TipMe or Ewallie payment
    // Send payment details to server, etc.
    Alert.alert("Payment Successful", "", [{ text: "OK" }]);
  };

  const handleInPersonPayment = (phoneNumber) => {
    // Handle in-person payment
    // Initiate call to seller
    // This is a placeholder, actual implementation may vary based on platform
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const renderPaymentForm = () => {
    if (paymentMethod === "card") {
      return (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Card Number"
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Expiry Date (MM/YY)"
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="CVV"
            keyboardType="numeric"
          />
          <TextInput style={styles.input} placeholder="Name on Card" />
        </View>
      );
    } else if (paymentMethod === "mobileMoney") {
      return (
        <View style={styles.form}>
          <Text style={styles.mobileMoneyText}>
            Select Mobile Money Provider:
          </Text>
          <RadioButton.Group
            onValueChange={(value) => handleMobileMoneyProvider(value)}
            value={mobileMoneyProvider}
          >
            <View style={styles.mobileMoneyButton}>
              <RadioButton value="Orange Money" />
              <Image
                source={require("../assets/orange.png")}
                style={styles.mobileMoneyLogo}
              />
              <Text>Orange Money</Text>
            </View>
            <View style={styles.mobileMoneyButton}>
              <RadioButton value="MTN Mobile Money" />
              <Image
                source={require("../assets/momo.jpg")}
                style={styles.mobileMoneyLogo}
              />
              <Text>MTN Mobile Money</Text>
            </View>
            <View style={styles.mobileMoneyButton}>
              <RadioButton value="TipMe" />
              <Image
                source={require("../assets/tipme.png")}
                style={styles.mobileMoneyLogo}
              />
              <Text>TipMe</Text>
            </View>
            <View style={styles.mobileMoneyButton}>
              <RadioButton value="Ewallie" />
              <Image
                source={require("../assets/ewallie.png")}
                style={styles.mobileMoneyLogo}
              />
              <Text>Ewallie</Text>
            </View>
            <View style={styles.mobileMoneyButton}>
              <RadioButton value="In Person" />
              <Icon name="handshake-o" size={30} color="black" />
              <Text>In Person</Text>
            </View>
          </RadioButton.Group>
        </View>
      );
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.productInfo}>
          <Image
            source={{ uri: productImage }}
            resizeMode="contain"
            style={styles.productImage}
          />
          <View style={styles.productDetails}>
            <Text style={styles.productName}>{productName}</Text>
            <Text style={styles.productPrice}>Price: ${productPrice}</Text>
            <Text style={styles.sellerName}>Seller: {sellerName}</Text>
            <Text style={styles.sellerPhone}>Phone: {sellerContact}</Text>
            <Text style={styles.productLocation}>
              Location: {productLocation}
            </Text>
          </View>
        </View>
        <View style={styles.paymentMethodContainer}>
          <TouchableOpacity
            style={[
              styles.paymentMethodButton,
              paymentMethod === "card" && styles.selectedPaymentMethod,
            ]}
            onPress={() => handlePaymentMethodChange("card")}
          >
            <Text style={styles.paymentMethodButtonText}>Bank Card</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.paymentMethodButton,
              paymentMethod === "mobileMoney" && styles.selectedPaymentMethod,
            ]}
            onPress={() => handlePaymentMethodChange("mobileMoney")}
          >
            <Text style={styles.paymentMethodButtonText}>Mobile Payment</Text>
          </TouchableOpacity>
        </View>
        {renderPaymentForm()}
        <TouchableOpacity style={styles.payButton}>
          <Text style={styles.payButtonText}>Pay Now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  productInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  productImage: {
    width: 100,
    height: 100,
    marginRight: 20,
    marginLeft: 40,
  },
  productDetails: {
    flex: 1,
    marginTop: 35,
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 18,
    marginBottom: 10,
  },
  sellerName: {
    fontSize: 16,
    marginBottom: 5,
  },
  sellerPhone: {
    fontSize: 16,
    marginBottom: 5,
  },
  productLocation: {
    fontSize: 16,
  },
  paymentMethodContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  paymentMethodButton: {
    backgroundColor: "#ddd",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginRight: 10,
  },
  selectedPaymentMethod: {
    backgroundColor: "green",
  },
  paymentMethodButtonText: {
    color: "black",
    fontSize: 16,
  },
  form: {
    width: "80%",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  payButton: {
    backgroundColor: "green",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  payButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  mobileMoneyLogo: {
    width: 50,
    height: 50,
    marginBottom: 5,
  },
  mobileMoneyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "left",
    marginBottom: 10,
  },
  mobileMoneyText: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default PaymentScreen;

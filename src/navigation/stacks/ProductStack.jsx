import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity, View, Text } from "react-native";

import ProductScreen from "../../screen/ProductScreen";
import DetailsScreen from "../../screen/DetailsScreen";
import ProductModal from "../modals/ProductModal";
import CartScreen from "../../screen/CartScreen";

const Stack = createNativeStackNavigator();

export default function ProductStack({ navigation }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        // headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: "#FFFFFF",
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: "#E5E7EB",
        },
        headerTintColor: "#111827",
        headerTitleStyle: {
          fontWeight: "600",
          fontSize: 18,
        },
        headerBackTitleVisible: false,
        cardStyle: {
          backgroundColor: "#F9FAFB",
        },
      }}
    >
      <Stack.Screen
        name="Products"
        component={ProductScreen}
        options={
          {
            // headerLeft: () => (
            //   <TouchableOpacity onPress={() => navigation.openDrawer()}>
            //     <Ionicons name="menu" size={24} />
            //   </TouchableOpacity>
            // ),
            // headerRight: () => (
            //         <CartIconButton />
            //       ),
          }
        }
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductModal}
        options={{
          title: "Modal",
          presentation: "modal",
          animation: "fade_from_bottom",
        }}
      />
      <Stack.Screen name="Details" component={DetailsScreen} />
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{
          title: "Shopping Cart",
        }}
      />
    </Stack.Navigator>
  );
}

// Cart Icon Component for Header
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useCart } from "../../context/CartContext";

const CartIconButton = () => {
  const { cartCount } = useCart();
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={{ marginRight: 16, position: "relative" }}
      onPress={() => navigation.navigate("Cart")}
    >
      <Icon name="cart-outline" size={24} color="#374151" />
      {cartCount > 0 && (
        <View
          style={{
            position: "absolute",
            top: -5,
            right: -5,
            backgroundColor: "#EF4444",
            borderRadius: 10,
            minWidth: 18,
            height: 18,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 4,
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 10,
              fontWeight: "700",
            }}
          >
            {cartCount > 9 ? "9+" : cartCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

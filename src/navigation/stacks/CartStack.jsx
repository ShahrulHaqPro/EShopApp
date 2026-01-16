import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CartScreen from "../../screen/CartScreen";
import DetailsScreen from "../../screen/DetailsScreen";

const Stack = createNativeStackNavigator();

export default function CartStack({ navigation }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={
          {
            // headerLeft: () => (
            //   <TouchableOpacity onPress={() => navigation.openDrawer()}>
            //     <Ionicons name="menu" size={24} />
            //   </TouchableOpacity>
            // ),
          }
        }
      />
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  );
}

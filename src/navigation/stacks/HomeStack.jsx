import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../../screen/HomeScreen";
import DetailsScreen from "../../screen/DetailsScreen";

const Stack = createNativeStackNavigator();

export default function HomeStack({ navigation }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
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

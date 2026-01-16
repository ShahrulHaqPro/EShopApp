import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
// import ProfileScreen from "../../screen/ProfileScreen";
import ProfileScreen from '../../screen/auth/ProfileScreen';
import SettingsScreen from "../../screen/SettingsScreen";

const Stack = createNativeStackNavigator();

export default function ProfileStack({ navigation }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={
          {
            // headerLeft: () => (
            //     <TouchableOpacity onPress={() => navigation.openDrawer()}>
            //       <Ionicons name="menu" size={24} />
            //     </TouchableOpacity>
            //   ),
          }
        }
      />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

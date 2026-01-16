import { createDrawerNavigator } from "@react-navigation/drawer";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import CustomDrawerContent from "../components/CustomDrawerContent";
import TabNavigator from "./TabNavigator";
import RegisterScreen from "../screen/auth/RegisterScreen";
import LoginScreen from "../screen/auth/LoginScreen";

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      //   screenOptions={({ navigation, route }) => {
      //     const canGoBack = navigation.canGoBack();

      //     return {
      //       headerLeft: () =>
      //         canGoBack ? (
      //           // BACK BUTTON
      //           <Pressable onPress={() => navigation.goBack()}>
      //             <Ionicons name="arrow-back" size={24} style={{ marginLeft: 16 }} />
      //           </Pressable>
      //         ) : (
      //           // DRAWER BUTTON
      //           <Pressable onPress={() => navigation.openDrawer()}>
      //             <Ionicons name="menu" size={24} style={{ marginLeft: 16 }} />
      //           </Pressable>
      //         ),
      //     };
      //   }
      // },
      screenOptions={({ navigation }) => ({
        // Global screen options for all drawer screens
        // headerShown: true,
        headerStyle: {
          backgroundColor: "#FFFFFF",
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: "#E5E7EB",
        },
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: "700",
          color: "#111827",
        },
        headerTintColor: "#374151",
        // headerLeft: () => (
        //   <TouchableOpacity
        //     style={{ marginLeft: 16 }}
        //     onPress={() => navigation.toggleDrawer()}
        //   >
        //     <Icon name="menu" size={24} color="#374151" />
        //   </TouchableOpacity>
        // ),
        // headerRight: () => (
        //   <View style={{ flexDirection: "row", marginRight: 16 }}>
        //     <TouchableOpacity style={{ marginRight: 16 }}>
        //       <Icon name="magnify" size={24} color="#374151" />
        //     </TouchableOpacity>
        //     <TouchableOpacity>
        //       <Icon name="cart-outline" size={24} color="#374151" />
        //       <View style={styles.headerCartBadge}>
        //         <Text style={styles.headerCartBadgeText}>3</Text>
        //       </View>
        //     </TouchableOpacity>
        //   </View>
        // ),
        drawerStyle: {
          width: "85%",
          backgroundColor: "#FFFFFF",
        },
        drawerType: "slide",
        overlayColor: "rgba(0, 0, 0, 0.5)",
        swipeEdgeWidth: 50,
        swipeEnabled: true,
        sceneContainerStyle: {
          backgroundColor: "#F8FAFC",
        },
      })}
    >
      <Drawer.Screen
        name="Home"
        component={TabNavigator}
        options={{
          title: "Home",
          headerShown: false,
          drawerLabel: "Home",
          // drawerIcon: ({ color, size }) => (
          //   <Ionicons name="home" size={size} color={color} />
          // ),
          // headerTitle: "Home",
          // headerRight: () => (
          //   <TouchableOpacity style={{ marginRight: 16 }}>
          //     <Text style={styles.markAllRead}>Mark all read</Text>
          //   </TouchableOpacity>
          // ),
        }}
      />

      <Drawer.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          title: "Register",
          drawerLabel: "Register",
          headerShown:false,
          // drawerIcon: ({ color, size }) => (
          //   <Ionicons name="power" size={size} color={color} />
          // ),
          // headerTitle: "Register",
          // headerRight: () => (
          //   <TouchableOpacity style={{ marginRight: 16 }}>
          //     <Text style={styles.markAllRead}>Mark all read</Text>
          //   </TouchableOpacity>
          // ),
        }}
      />
      <Drawer.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: "Login",
          drawerLabel: "Login",
          // drawerIcon: ({ color, size }) => (
          //   <Ionicons name="power" size={size} color={color} />
          // ),
          // headerTitle: "Register",
          // headerRight: () => (
          //   <TouchableOpacity style={{ marginRight: 16 }}>
          //     <Text style={styles.markAllRead}>Mark all read</Text>
          //   </TouchableOpacity>
          // ),
        }}
      />
    </Drawer.Navigator>
  );
}

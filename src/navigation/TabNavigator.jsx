import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import HomeStack from "./stacks/HomeStack";
import ProfileStack from "./stacks/ProfileStack";
import CartStack from "./stacks/CartStack";
import ProductStack from "./stacks/ProductStack";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: "purple",
        tabBarInactiveTintColor: "lightblue",
        tabBarItemStyle: {
          paddingVertical: 6,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
          // tabBarBadge: 3,
        }}
      />
      <Tab.Screen
        name="ProductScreen"
        component={ProductStack}
        options={{
          headerShown: false,
          title: "Product",
          tabBarIcon: ({ color }) => (
            <Ionicons name="gift" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="CartScreen"
        component={CartStack}
        options={{
          headerShown: false,
          title: "Cart",
          tabBarIcon: ({ color }) => (
            <Ionicons name="cart" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{
          headerShown: false,
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={24} color={color} />
          ),
        }}
      />
      
    </Tab.Navigator>
  );
}

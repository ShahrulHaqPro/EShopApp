import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import DrawerNavigator from "./src/navigation/DrawerNavigator";
import { StatusBar, StyleSheet, Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { CartProvider } from "./src/context/CartContext";

export default function App() {
  return (
    <SafeAreaProvider style={styles.container}>
      <CartProvider>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <NavigationContainer>
          <DrawerNavigator />
        </NavigationContainer>
      </CartProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight || 0,
    // paddingTop: Platform.OS === "android" ? 25 : 0,
  },
});

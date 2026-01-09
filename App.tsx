// App.tsx
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Info from "./frames/Info";
import Signin from "./frames/Signin";
import Dashboard from "./frames/Dashboard";

const Stack = createNativeStackNavigator();

// STARTUP SCREEN
function Startup({ navigation }: any) {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <Image
        source={require("./images/Logo.png")}
        style={styles.logoImage}
        resizeMode="contain"
      />

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("Info")}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </Pressable>
    </View>
  );
}

// APP ENTRY POINT
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Startup" component={Startup} />
        <Stack.Screen name="Info" component={Info} />
        <Stack.Screen name="Signin" component={Signin} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#20232A",
    alignItems: "center",
    justifyContent: "center",
  },
  logoImage: {
    width: 500,
    height: 500,
    marginBottom: 20,
  },
  button: {
    position: "absolute",
    bottom: 60,
    backgroundColor: "#61DAFB",
    paddingVertical: 14,
    paddingHorizontal: 70,
    borderRadius: 30,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

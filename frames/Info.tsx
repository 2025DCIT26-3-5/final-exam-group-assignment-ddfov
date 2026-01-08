// Info.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

// Define the navigation stack
type RootStackParamList = {
  Startup: undefined;
  Info: undefined;
  Signin: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, "Info">;

const Info: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  // API
  const API_URL = "https://glowing-space-carnival-4jgp45wjj6542qr9r-3000.app.github.dev";

const handleLogin = async () => {
  if (!username || !password) {
    Alert.alert("Error", "Please enter both username and password");
    return;
  }

  try {
    // Send POST request to /login
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      Alert.alert(
        "Success",
        data.message,
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Dashboard", { userId: data.userId }),
          },
        ]
      );

      setUsername("");
      setPassword("");

      navigation.navigate("Dashboard", { userId: data.userId });
    } else {
      Alert.alert("Error", data.message);
    }
  } catch (error: any) {
    Alert.alert("Error", error.message);
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Start Learning</Text>

      {/* Username Input */}
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#888"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Login Button */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      {/* Sign Up Link */}
      <TouchableOpacity onPress={() => navigation.navigate("Signin")}>
        <Text style={styles.signUpText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Info;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#20232A",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#61DAFB",
    marginBottom: 25,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#2C2F36",
    color: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#61DAFB",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#20232A",
    fontWeight: "bold",
    fontSize: 16,
  },
  signUpText: {
    color: "#61DAFB",
    textAlign: "center",
    marginTop: 12,
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
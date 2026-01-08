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

// Define the navigation stack params
type RootStackParamList = {
  Startup: undefined;
  Info: undefined;
};

// Type for the props
type Props = NativeStackScreenProps<RootStackParamList, "Info">;

const Info: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = () => {
    if (!username || !password) {
      Alert.alert("Error", "Please enter both username and password");
      return;
    }

    Alert.alert(
      "Info Submitted",
      `Username: ${username}\nPassword: ${password}`
    );
    // Example: navigate back or to another screen
    // navigation.navigate("Startup");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Your Info</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#888"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
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
});

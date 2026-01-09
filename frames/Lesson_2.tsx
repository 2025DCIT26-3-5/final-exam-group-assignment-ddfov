// Lesson_2.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";

const API_URL = "https://glowing-space-carnival-4jgp45wjj6542qr9r-3000.app.github.dev";

const Lesson_2 = ({ route, navigation }: any) => {
  const { userId, onComplete } = route.params;

  const markCompleted = async () => {
    try {
      const res = await fetch(`${API_URL}/progress/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, lesson_order: 2 }),
      });

      const data = await res.json();
      if (res.ok) {
        Alert.alert("Success", "Lesson marked as completed!");
        if (onComplete) onComplete(); // refresh Dashboard
        navigation.goBack(); // go back to dashboard
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Lesson 2 Content for User ID: {userId}</Text>
      <TouchableOpacity style={styles.button} onPress={markCompleted}>
        <Text style={styles.buttonText}>Mark as Completed</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Lesson_2;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#20232A", justifyContent: "center", alignItems: "center" },
  text: { color: "#fff", fontSize: 20, marginBottom: 20 },
  button: { backgroundColor: "#61DAFB", padding: 14, borderRadius: 10 },
  buttonText: { color: "#20232A", fontWeight: "bold", fontSize: 16 },
});

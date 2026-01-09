// Lesson_2.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Lesson_2 = ({ route }: any) => {
  const { userId } = route.params;
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Lesson 2 Content for User ID: {userId}</Text>
    </View>
  );
};

export default Lesson_2;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#20232A", justifyContent: "center", alignItems: "center" },
  text: { color: "#fff", fontSize: 20 },
});

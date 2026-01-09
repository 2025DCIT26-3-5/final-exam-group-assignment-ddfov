// Lesson_3.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Lesson_3 = ({ route }: any) => {
  const { userId } = route.params;
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Lesson 3 Content for User ID: {userId}</Text>
    </View>
  );
};

export default Lesson_3;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#20232A", justifyContent: "center", alignItems: "center" },
  text: { color: "#fff", fontSize: 20 },
});

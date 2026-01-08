// Dashboard.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type RootStackParamList = {
  Dashboard: { userId: number };
};

type Props = NativeStackScreenProps<RootStackParamList, "Dashboard">;

const Dashboard: React.FC<Props> = ({ route }) => {
  const { userId } = route.params;
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // API
  const API_URL = "https://glowing-space-carnival-4jgp45wjj6542qr9r-3000.app.github.dev";

  useEffect(() => {
    fetch(`${API_URL}/dashboard/${userId}`)
    .then((res) => res.json())
    .then((data) => {
      setLessons(data);
      setLoading(false);
    })
    .catch(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#61DAFB" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Courses</Text>

      <FlatList
        data={lessons}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          let icon = "🔒";
          if (item.completed) icon = "✅";
          else if (item.unlocked) icon = "➡️";

          return (
            <TouchableOpacity
              disabled={!item.unlocked}
              style={[styles.card, !item.unlocked && styles.locked]}
            >
              <Text style={styles.cardText}>
                {icon} Lesson {item.lesson_order}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#20232A",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#61DAFB",
    marginBottom: 20,
    textAlign: "center",
    padding: 50,
  },
  card: {
    backgroundColor: "#2C2F36",
    padding: 18,
    borderRadius: 10,
    marginBottom: 12,
  },
  locked: {
    opacity: 0.4,
  },
  cardText: {
    color: "#fff",
    fontSize: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

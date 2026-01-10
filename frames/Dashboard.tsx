// Dashboard.tsx
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";

const API_URL = "https://glowing-space-carnival-4jgp45wjj6542qr9r-3000.app.github.dev";

// ICONS
const ICON_CHECKED = require("../images/Checked.png");
const ICON_UNLOCK = require("../images/Unlock.png");
const ICON_LOCK = require("../images/Lock.png");

const Dashboard = ({ navigation, route }: any) => {
  const { userId } = route.params;

  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/dashboard/${userId}`);
      const data = await res.json();
      if (Array.isArray(data)) setLessons(data);
      else setLessons([]);
    } catch (err) {
      console.error("Dashboard fetch failed:", err);
      setLessons([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Courses</Text>

      {lessons.length === 0 && <Text style={styles.empty}>No courses found</Text>}

      {lessons.map((lesson: any) => {
        let icon = ICON_LOCK;
        if (lesson.completed) icon = ICON_CHECKED;
        else if (lesson.unlocked) icon = ICON_UNLOCK;

        const screenName = `Lesson_${lesson.lesson_order}`;

        return (
          <TouchableOpacity
            key={lesson.id}
            disabled={!lesson.unlocked}
            style={[styles.card, !lesson.unlocked && styles.locked]}
            onPress={() =>
              navigation.navigate(screenName, {
                userId,
                onComplete: loadDashboard, // <-- pass callback to refresh progress
              })
            }
          >
            <Image source={icon} style={styles.icon} />
            <Text style={styles.cardText}>{lesson.title}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#20232A", padding: 20 },
  title: { fontSize: 26, fontWeight: "bold", color: "#61DAFB", marginBottom: 20, textAlign: "center" },
  card: { backgroundColor: "#2C2F36", padding: 16, borderRadius: 10, marginBottom: 12, flexDirection: "row", alignItems: "center" },
  locked: { opacity: 0.4 },
  icon: { width: 24, height: 24, marginRight: 12, resizeMode: "contain" },
  cardText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  empty: { color: "#aaa", textAlign: "center", marginTop: 40 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
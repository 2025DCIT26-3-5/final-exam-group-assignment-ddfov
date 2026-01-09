// Lesson_2.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";

const API_URL =
  "https://glowing-space-carnival-4jgp45wjj6542qr9r-3000.app.github.dev";

// Define type for questions
type Question = {
  type: "fill-in" | "multiple-choice" | "true-false" | "lesson";
  question: string;
  snippet?: string;
  options?: string[];
  correctAnswer?: string;
};

const Lesson_2 = ({ route, navigation }: any) => {
  const { userId, onComplete } = route.params;

  const questions: Question[] = [
    {
      type: "fill-in",
      question: "Complete the StyleSheet:",
      snippet: "container: {\n  flexDirection: ___\n}",
      options: ["row", "column", "row-reverse", "column-reverse"],
      correctAnswer: "row",
    },
    {
      type: "multiple-choice",
      question: "Which best describes a React Native component?",
      options: [
        "A database reusable",
        "A reusable UI element",
        "A CSS file",
        "A backend function",
      ],
      correctAnswer: "A reusable UI element",
    },
    {
      type: "true-false",
      question: "React Native uses JavaScript as its programming language.",
      options: ["True", "False"],
      correctAnswer: "True",
    },
    {
      type: "lesson",
      question: `You know that React Native can perform operations directly inside components, 
      such as updating numbers or text when a button is pressed. However, putting all the logic 
      directly in the UI can make the code harder to read and manage.`,
    },
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"none" | "correct" | "wrong">(
    "none"
  );

  const currentQuestion = questions[currentQuestionIndex];

  // Complete lesson
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
        if (onComplete) onComplete();
        navigation.goBack();
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  const handleCheck = () => {
    if (!selected) return;
    setFeedback(
      selected === currentQuestion.correctAnswer ? "correct" : "wrong"
    );
  };

  const handleNext = () => {
    setSelected(null);
    setFeedback("none");

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      markCompleted();
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heart}>❤️ 5</Text>

      <Text style={styles.question}>{currentQuestion.question}</Text>

      {/* Lesson type: just show text + Continue button */}
      {currentQuestion.type === "lesson" && (
        <TouchableOpacity
          style={[styles.checkButton]}
          onPress={handleNext}
        >
          <Text style={styles.checkText}>Continue</Text>
        </TouchableOpacity>
      )}

      {/* Fill-in type */}
      {currentQuestion.type === "fill-in" && (
        <>
          <View style={styles.snippetBox}>
            <Text style={styles.snippet}>
              {currentQuestion.snippet?.split("___")[0]}
              <Text style={styles.blank}>{selected || "___"}</Text>
              {currentQuestion.snippet?.split("___")[1]}
            </Text>
          </View>
          <View style={styles.options}>
            {currentQuestion.options?.map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[
                  styles.optionButton,
                  selected === opt && styles.selectedOption,
                  feedback === "correct" &&
                    opt === currentQuestion.correctAnswer &&
                    styles.correctOption,
                  feedback === "wrong" &&
                    selected === opt &&
                    styles.wrongOption,
                ]}
                onPress={() => feedback === "none" && setSelected(opt)}
              >
                <Text style={styles.optionText}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      {/* Multiple-choice or true-false */}
      {(currentQuestion.type === "multiple-choice" ||
        currentQuestion.type === "true-false") && (
        <View style={styles.options}>
          {currentQuestion.options?.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[
                styles.optionButton,
                selected === opt && styles.selectedOption,
                feedback === "correct" &&
                  opt === currentQuestion.correctAnswer &&
                  styles.correctOption,
                feedback === "wrong" && selected === opt && styles.wrongOption,
              ]}
              onPress={() => feedback === "none" && setSelected(opt)}
            >
              <Text style={styles.optionText}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Buttons */}
      {currentQuestion.type !== "lesson" && feedback === "none" && (
        <TouchableOpacity
          style={[styles.checkButton, !selected && styles.disabledButton]}
          disabled={!selected}
          onPress={handleCheck}
        >
          <Text style={styles.checkText}>Check</Text>
        </TouchableOpacity>
      )}

      {feedback === "correct" && (
        <TouchableOpacity
          style={[styles.checkButton, styles.correctButton]}
          onPress={handleNext}
        >
          <Text style={styles.checkText}>
            {currentQuestionIndex < questions.length - 1
              ? "Next Question"
              : "Finish Lesson"}
          </Text>
        </TouchableOpacity>
      )}

      {feedback === "wrong" && (
        <TouchableOpacity
          style={[styles.checkButton, styles.wrongButton]}
          onPress={() => setFeedback("none")}
        >
          <Text style={styles.checkText}>Try Again</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

export default Lesson_2;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#20232A",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  heart: { fontSize: 20, marginBottom: 10 },
  question: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  snippetBox: {
    backgroundColor: "#fff",
    width: "100%",
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
  },
  snippet: { fontFamily: "monospace", fontSize: 16, color: "#000" },
  blank: {
    backgroundColor: "#eee",
    paddingHorizontal: 4,
    borderRadius: 4,
    fontWeight: "bold",
  },
  options: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: "#2C2F36",
    padding: 12,
    borderRadius: 8,
    margin: 5,
  },
  selectedOption: { borderWidth: 2, borderColor: "#61DAFB" },
  correctOption: { backgroundColor: "green" },
  wrongOption: { backgroundColor: "red" },
  optionText: { color: "#fff", fontWeight: "bold" },
  checkButton: {
    backgroundColor: "#61DAFB",
    padding: 14,
    borderRadius: 10,
    width: "50%",
    alignItems: "center",
    marginBottom: 10,
  },
  checkText: { color: "#20232A", fontWeight: "bold" },
  disabledButton: { opacity: 0.5 },
  correctButton: { backgroundColor: "green" },
  wrongButton: { backgroundColor: "red" },
});
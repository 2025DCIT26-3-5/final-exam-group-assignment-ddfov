// Lesson_6.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from "react-native";

const API_URL = "https://glowing-space-carnival-4jgp45wjj6542qr9r-3000.app.github.dev";

type Question = {
  type: "fill-in" | "multiple-choice" | "true-false" | "lesson";
  question: string;
  snippet?: string;
  options?: string[];
  correctAnswer?: string;
};

const Lesson_6 = ({ route, navigation }: any) => {
  const { userId, onComplete } = route.params;

  const questions: Question[] = [
    {
    type: "lesson",
    question: `TextInput (User Input)`,
  },
  {
    type: "lesson",
    question: `In this lesson, you will learn how to accept user input using the TextInput component in React Native.`,
  },
  {
    type: "lesson",
    question: `Before starting the quiz, let’s look at some examples of how TextInput works.`,
  },

  {
    type: "fill-in",
    question: "<TextInput> is used to let the user type text.",
    snippet: "<___ placeholder=\"Enter text\" />",
    options: ["TextInput", "Text", "View"],
    correctAnswer: "TextInput",
  },

  {
    type: "fill-in",
    question: "placeholder shows a hint inside the input field.",
    snippet: "<TextInput ___=\"Enter name\" />",
    options: ["placeholder", "value"],
    correctAnswer: "placeholder",
  },

  {
    type: "fill-in",
    question: "value holds the current text value.",
    snippet: "<TextInput value={___} />",
    options: ["text", "setText"],
    correctAnswer: "text",
  },

  {
    type: "fill-in",
    question: "onChangeText updates the value when typing.",
    snippet: "<TextInput onChangeText={___} />",
    options: ["setText", "text"],
    correctAnswer: "setText",
  },

  {
    type: "lesson",
    question: `Great! You’ve learned the basics of TextInput.\n\nLet’s start the quiz to test your knowledge!`,
  },

  {
    type: "fill-in",
    question: "Complete the code to display user input:",
    snippet: "<Text>{___}</Text>",
    options: ["text", "setText"],
    correctAnswer: "text",
  },

  {
    type: "fill-in",
    question: "Complete the state declaration:",
    snippet: "const [text, ___] = useState('');",
    options: ["setText", "text"],
    correctAnswer: "setText",
  },

  {
    type: "true-false",
    question: "TextInput allows users to enter text.",
    options: ["True", "False"],
    correctAnswer: "True",
  },

  {
    type: "true-false",
    question: "TextInput can display placeholder text.",
    options: ["True", "False"],
    correctAnswer: "True",
  },

  {
    type: "true-false",
    question: "TextInput is used to show images.",
    options: ["True", "False"],
    correctAnswer: "False",
  },

  {
    type: "multiple-choice",
    question: "Which prop updates the text value?",
    options: ["value", "onChangeText", "placeholder", "style"],
    correctAnswer: "onChangeText",
  },

  {
    type: "multiple-choice",
    question: "Which hook is commonly used with TextInput?",
    options: ["useStyle", "useState", "useView", "useText"],
    correctAnswer: "useState",
  },

  {
    type: "multiple-choice",
    question: "Where is user input usually displayed?",
    options: ["Image", "Text", "View", "ScrollView"],
    correctAnswer: "Text",
  },
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"none" | "correct" | "wrong">("none");
  const [hearts, setHearts] = useState(5);

  const currentQuestion = questions[currentQuestionIndex];

  const markCompleted = async () => {
    try {
      const res = await fetch(`${API_URL}/progress/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userId: Number(userId),
          lesson_order: 6
        }),
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
    setFeedback(selected === currentQuestion.correctAnswer ? "correct" : "wrong");
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
      <Text style={styles.heart}>❤️ {hearts}</Text>
      <Text style={styles.question}>{currentQuestion.question}</Text>

      {currentQuestion.type === "lesson" && (
        <TouchableOpacity style={styles.checkButton} onPress={handleNext}>
          <Text style={styles.checkText}>Continue</Text>
        </TouchableOpacity>
      )}

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
                  feedback === "correct" && opt === currentQuestion.correctAnswer && styles.correctOption,
                  feedback === "wrong" && selected === opt && styles.wrongOption,
                ]}
                onPress={() => feedback === "none" && setSelected(opt)}
              >
                <Text style={styles.optionText}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      {(currentQuestion.type === "multiple-choice" || currentQuestion.type === "true-false") && (
        <View style={styles.options}>
          {currentQuestion.options?.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[
                styles.optionButton,
                selected === opt && styles.selectedOption,
                feedback === "correct" && opt === currentQuestion.correctAnswer && styles.correctOption,
                feedback === "wrong" && selected === opt && styles.wrongOption,
              ]}
              onPress={() => feedback === "none" && setSelected(opt)}
            >
              <Text style={styles.optionText}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

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
        <TouchableOpacity style={[styles.checkButton, styles.correctButton]} onPress={handleNext}>
          <Text style={styles.checkText}>
            {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Finish Lesson"}
          </Text>
        </TouchableOpacity>
      )}

      {feedback === "wrong" && (
        <TouchableOpacity
          style={[styles.checkButton, styles.wrongButton]}
          onPress={() => {
            const newHearts = hearts - 1;
            if (newHearts <= 0) {
              Alert.alert("Out of hearts!", "You reached 0 hearts. Restarting the lesson.", [
                {
                  text: "OK",
                  onPress: () => {
                    setCurrentQuestionIndex(0);
                    setSelected(null);
                    setFeedback("none");
                    setHearts(5); // reset hearts
                  },
                },
              ]);
            } else {
              setHearts(newHearts);
              setFeedback("none");
              setSelected(null);
            }
          }}
        >
          <Text style={styles.checkText}>Try Again</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

export default Lesson_6;

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#20232A", padding: 20, alignItems: "center", justifyContent: "center" },
  heart: { fontSize: 20, marginBottom: 10 },
  question: { color: "#fff", fontSize: 18, marginBottom: 20, fontWeight: "bold", textAlign: "center" },
  snippetBox: { backgroundColor: "#fff", width: "100%", padding: 16, borderRadius: 10, marginBottom: 20 },
  snippet: { fontFamily: "monospace", fontSize: 16, color: "#000" },
  blank: { backgroundColor: "#eee", paddingHorizontal: 4, borderRadius: 4, fontWeight: "bold" },
  options: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 10, marginBottom: 20 },
  optionButton: { backgroundColor: "#2C2F36", padding: 12, borderRadius: 8, margin: 5 },
  selectedOption: { borderWidth: 2, borderColor: "#61DAFB" },
  correctOption: { backgroundColor: "green" },
  wrongOption: { backgroundColor: "red" },
  optionText: { color: "#fff", fontWeight: "bold" },
  checkButton: { backgroundColor: "#61DAFB", padding: 14, borderRadius: 10, width: "50%", alignItems: "center", marginBottom: 10 },
  checkText: { color: "#20232A", fontWeight: "bold" },
  disabledButton: { opacity: 0.5 },
  correctButton: { backgroundColor: "green" },
  wrongButton: { backgroundColor: "red" },
});
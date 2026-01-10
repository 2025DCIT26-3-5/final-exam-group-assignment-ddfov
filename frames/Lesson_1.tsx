// Lesson_1.tsx
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

const Lesson_1 = ({ route, navigation }: any) => {
  const { userId, onComplete } = route.params;

  const questions: Question[] = [
    {
      type: "lesson",
      question: `Print and Display Image`, 
    },
    {
      type: "lesson",
      question: `In this lesson, you will learn how to display text using the Text component, group content using View, show values using variables, and display images in React Native.`,
    },
    {
      type: "lesson",
      question: `Before starting the quiz, let’s look at some examples of how Text, View, variables, and Image work in React Native.`,
    },
    {
      type: "fill-in",
      question: "<Text> is used to display text on the screen.",
      snippet: "<___>Hello, world!</Text>",
      options: ["Text", "View"],
      correctAnswer: "Text",
    },
    {
      type: "fill-in",
      question: "<View> is used as a container for other components..",
      snippet: "<___>\n   <Text>Hello!</Text>  \n</View>",
      options: ["Text", "View"],
      correctAnswer: "View",
    },
    {
      type: "fill-in",
      question: "Variables can be displayed inside Text using {}.",
      snippet: "const name = Alice; \n <Text>Hello, {___}!</Text>",
      options: ["Text", "name", "View"],
      correctAnswer: "name",
    },
    {
      type: "fill-in",
      question: "<Image> is used to display pictures",
      snippet: "<___ source={{ uri: 'image_url' }} style={{ width: 100, height: 100 }} />",
      options: ["Text", "Image", "View"],
      correctAnswer: "Image",
    },
    {
      type: "lesson",
      question: `Great! You’ve learned the basics of Text, View, Variables, and Image.\n\nLet’s start the quiz to test your knowledge!`, 
    },
    {
      type: "fill-in",
      question: "Complete the code to wrap “Hello!” inside a box",
      snippet: "<___>\n   <Text>Hello!</Text>  \n<View>",
      options: ["Text", "View"],
      correctAnswer: "View",
    },
    {
      type: "fill-in",
      question: "Complete the code to show a variable inside text:",
      snippet: "const name = Alice; \n <Text>Hello, {___}!</Text>",
      options: ["Text", "name", "View"],
      correctAnswer: "name",
    },
    {
      type: "fill-in",
      question: "Complete the code to show “Hello, world!” :",
      snippet: "<___>Hello, world!</Text>}",
      options: ["Text", "View"],
      correctAnswer: "Text",
    },
    {
      type: "fill-in",
      question: "Complete the code to display an image:",
      snippet: "<___ source={{ uri: 'image_url' }} style={{ width: 100, height: 100 }} />",
      options: ["Text", "Image", "View"],
      correctAnswer: "Image",
    },
    {
      type: "true-false",
      question: "Variables can be displayed inside the Text component using curly braces {}.",
      options: ["True", "False"],
      correctAnswer: "True",
    },
    {
      type: "true-false",
      question: "The Image component can be used to display pictures in React Native.",
      options: ["True", "False"],
      correctAnswer: "True",
    },
    {
      type: "true-false",
      question: "Text component is used to display words on the screen in React Native.",
      options: ["True", "False"],
      correctAnswer: "True",
    },
    {
      type: "true-false",
      question: "The View component displays text on the screen by itself.",
      options: ["True", "False"],
      correctAnswer: "False",
    },
    {
      type: "multiple-choice",
      question: "Which component is used to display text on the screen in React Native?",
      options: ["View", "Variable", "Text", "Button"],
      correctAnswer: "Text",
    },
    {
      type: "multiple-choice",
      question: "Which component is used to group multiple elements together?",
      options: ["View", "Variable", "Text", "Image"],
      correctAnswer: "View",
    },
    {
      type: "multiple-choice",
      question: "How do you display a variable inside Text?",
      options: [ "Use curly braces {}", "Use parentheses ()", "Use quotes \"\"", "Use View component"],
      correctAnswer: "Use curly braces {}",
    },
    {
      type: "multiple-choice",
      question: "Which component is used to display images in React Native?",
      options: ["View", "Text", "Variable", "Image"],
      correctAnswer: "Image",
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
          lesson_order: 1
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

export default Lesson_1;

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
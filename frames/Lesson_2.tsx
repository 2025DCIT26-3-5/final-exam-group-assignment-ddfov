// Lesson_2.tsx
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

const Lesson_2 = ({ route, navigation }: any) => {
  const { userId, onComplete } = route.params;

  const questions: Question[] = [
    {
      type: "lesson",
      question: `What is Components? \n\n- A component is a reusable piece of UI. In React Native, everything you see on the screen is a component (Text, View, Button, or your own custom ones).`,
    },

    {
      type: "lesson",
      question: `Example: \n\nfunction Hello() { \n  return <Text>Hello World</Text>; \n}`,
    },

    {
      type: "lesson",
      question: `What is Props? \n\n- Props (properties) are used to pass data from a parent component to a child component. Props are read-only — you do not modify them inside the component.`,
    },

    {
      type: "lesson",
      question: `Example: \n\nfunction Greeting(props) { \n  return <Text>Hello {props.name}</Text>; \n}`,
    },

    {
      type: "lesson",
      question: `Usage: \n\n<Greeting name="Juan" />`,
    },

    //Question 1
    {
      type: "fill-in",
      question: "Fill in the blank:",
      snippet: "container: { A ___ is a reusable piece of UI in React Native.}",
      options: ["table", "props", "component", "variable"],
      correctAnswer: "component",
    },

    //Question 2
    {
      type: "fill-in",
      question: "Complete the code to display text:",
      snippet:
        "container: { <View> \n  <___>Hello React Native</Text> \n</View>}",
      options: ["Text", "h1", "print", "script"],
      correctAnswer: "Text",
    },

    //Question 3
    {
      type: "multiple-choice",
      question: "Which best describes a React Native component?",
      options: [
        "A database table",
        "A reusable UI element",
        "A CSS file",
        "A backend function",
      ],
      correctAnswer: "A reusable UI element",
    },

    //Question 4
    {
      type: "true-false",
      question: "A component can work even if it does not receive any props.",
      options: ["True", "False"],
      correctAnswer: "True",
    },

    //Question 5
    {
      type: "multiple-choice",
      question: "Which code correctly defines a functional component?",
      options: [
        "<Text>Hello</Text>",
        "function Hello() {\n  return <Text>Hello</Text>; \n}",
        'const Hello = "Hello";',
        'View("Hello");',
      ],
      correctAnswer: "function Hello() {\n  return <Text>Hello</Text>; \n}",
    },

    //Question 6
    {
      type: "fill-in",
      question: "Fill in the blank",
      snippet: "container: { Props are passed to a component as a ___}",
      options: ["loop", "variable", "function", "parameter"],
      correctAnswer: "parameter",
    },

    //Question 7
    {
      type: "true-false",
      question:
        "Props are used to pass data from parent components to child components.",
      options: ["True", "False"],
      correctAnswer: "True",
    },

    //Question 8
    {
      type: "multiple-choice",
      question: "How do you pass a prop called title?",
      options: [
        "<Header title />",
        '<Header "title" />',
        '<Header title="Home" />',
        '<Header = title="Home" />',
      ],
      correctAnswer: '<Header title="Home" />',
    },

    //Question 9
    {
      type: "true-false",
      question:
        "Props can be modified inside the component that receives them.",
      options: ["True", "False"],
      correctAnswer: "False",
    },

    //Question 10
    {
      type: "fill-in",
      question: "Fill in the missing word:",
      snippet:
        "container: { function Greeting(props) {\n  return <Text>{props.___}</Text>; \n}}",
      options: ["title", "name", "component", "const"],
      correctAnswer: "name",
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
          lesson_order: 2
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

export default Lesson_2;

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
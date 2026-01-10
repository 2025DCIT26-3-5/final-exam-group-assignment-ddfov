// Lesson_5.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from "react-native";

const API_URL = "https://glowing-space-carnival-4jgp45wjj6542qr9r-3000.app.github.dev";

type Question = {
  type: "fill-in" | "multiple-choice" | "true-false" | "lesson" | "question";
  question: string;
  snippet?: string;
  options?: string[];
  correctAnswer?: string;
};

const Lesson_5 = ({ route, navigation }: any) => {
  const { userId, onComplete } = route.params;

  const questions: Question[] = [
    {
      type: "lesson",
      question: `React native Buttons and Press`,
    },
    {
      type: "lesson",
      question: `Button and Press, Its like telling a button that when its pressed, do this action`,
    },
    {
      type: "lesson",
      question: `Example: \n\n <Button title='Click me'onPress={() => alert('Hello!')} />`,
    },
    {
      type: "true-false",
      question: `Example: Problem \n\n A button must have a 'title' prop.`,
      options: ["True","False"],
      correctAnswer: "True",
    },
    {
      type: "lesson",
      question: `That is only for starter. \n Now to begin our first lesson there are 5 question you will first answer, guess the correct answer based on your understanding from the 1st example`,
    },
    {
      type: "question",
      question: "Question \n\n Which component is used to create a button in React Native?",
      options: ["A. Press", "B. Touchable", "C. Button","D. Click"],
      correctAnswer: "C. Button",
    },
    {
      type: "true-false",
      question: "The onPress prop is used to handle button press events.",
      options: ["True", "False"],
      correctAnswer: "True",
    },
    {
      type: "multiple-choice",
      question: "Question \n\n What happens when the button is pressed? \n\n <Button title='Click Me' onPress={sayHello} />",
      options: ["A. The button disappears", "B. The 'sayHello' function runs", "C. The app closes","D. Nothing happens"],
      correctAnswer: "B. The 'sayHello' function runs",
    },
    {
      type: "fill-in",
      question: "Fill in the blank \n \n Complete the code to show an alert when the button is pressed:",
      snippet: "<Button \n title='Press Me' \nonPress={() => ___('Hello')} \n/>",
      options: ["alert", "console", "log", "none of the above"],
      correctAnswer: "alert",
    },
    {
      type: "true-false",
      question: "onClick is used instead of onPress in React Native.",
      options: ["True", "False"],
      correctAnswer: "False",
    },
    {
      type: "lesson",
      question: `That is all for the React native Buttons and Press \n\n Thank You!`,
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
          lesson_order: 5
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
      {currentQuestion.type === "question" && (
        <>
          
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
      )
      }

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

export default Lesson_5;

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#20232A", padding: 20, alignItems: "center", justifyContent: "center" },
  heart: { fontSize: 20, marginBottom: 10 },
  question: { color: "#fff", fontSize: 18, marginBottom: 20, fontWeight: "bold", textAlign: "center" },
  snippetBox: { backgroundColor: "#fff", width: "100%", padding: 16, borderRadius: 10, marginBottom: 20 , height: 326 },
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
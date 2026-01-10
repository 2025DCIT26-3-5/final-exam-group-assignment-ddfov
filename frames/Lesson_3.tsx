// Lesson_3.tsx
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

const Lesson_3 = ({ route, navigation }: any) => {
  const { userId, onComplete } = route.params;

  const questions: Question[] = [
    {
      type: "lesson",
      question: `Operations`,
    },
    {
      type: "lesson",
      question: `You know that React Native can perform operations directly inside components, such as updating numbers or text when a button is pressed. However, putting all the logic directly in the UI can make the code harder to read and manage.`,
    },
    {
      type: "lesson",
      question: `In this lesson, you'll learn how operations work in React Native, and how state and functions are used to update the app smoothly.Our first example is counting up for each click.`,
    },
    {
      type: "lesson",
      question: `Next is a simple practice for you in order to understand and learn operations in react native.`,
    },
    {
      type: "fill-in",
      question: "Fill in the blank \n \n Complete the missing operation so that the number increases by 1 when the button is pressed.",
      snippet: "import { View, Text, Button } from 'react-native'; \n import { useState } from 'react'; \n function Counter() { \n const [count, setCount] = useState(0); \n  return ( \n<View> \n<Text>Count: {count}</Text> \n<Button \n title='Increase' \n onPress={() => setCount(___)}  \n/> \n </View> \n); \n} ",
      options: ["count - 1", "count + 1", "count * 1", "count / 1"],
      correctAnswer: "count + 1",
    },
    {
      type: "lesson",
      question: `Now to start our practice, we have a 1 set of question in each basic operations. Each question has 2 tries for you to analyze and guess the correct answer.`,
    },
    {
      type: "lesson",
      question: `Start Quiz`,
    },
    {
      type: "question",
      question: "Question \n\n If the counter is 6 and the code is:  \n\nWhat is the output after pressing the button once?",
      snippet: "         onPress={() => setCount(count - 2)} \n\n",
      options: ["6", "8", "4","2"],
      correctAnswer: "4",
    },
    {
      type: "true-false",
      question: "Pressing the button with the following code decreases the counter by 2 if the initial value is 5:",
      snippet: "         onPress={() => setCount(count - 2)} \n\n                                    ",
      options: ["True", "False"],
      correctAnswer: "True",
    },
    {
      type: "question",
      question: "Question \n\n If the counter is 10 and the button code is: \n\nWhat will the counter display after one button press?",
      snippet: "         onPress={() => setCount(count - 2)} \n\n                                    ",
      options: ["2", "20", "0","5"],
      correctAnswer: "5",
    },
    {
      type: "fill-in",
      question: "Fill in the blank \n \n Complete the missing part so that the counter doubles each time the button is pressed. \nInitial value: count 4\nOutput should be : count 8",
      snippet: "          onPress={() => setValue(___)}",
      options: ["value - 2", "value + 2", "value * 2", "value / 2"],
      correctAnswer: "value * 2",
    },
    {
      type: "fill-in",
      question: "Fill in the blank \n \n Complete the missing part so that the counter resets to 0. \n\nInitial value: count 7\nOutput should be : count 0",
      snippet: "              onPress={() => setValue(___)}",
      options: ["count", "count - 1", "0", "null"],
      correctAnswer: "0",
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
          lesson_order: 3
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
          <View style={styles.snippetBox}>
            <Text style={styles.snippet}>
              {currentQuestion.snippet?.split("___")[0]}
              <Text style={styles.blank}></Text>
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
      )
      }

      {(currentQuestion.type === "multiple-choice" || currentQuestion.type === "true-false") && (
        <View style={styles.options}>
           <View style={styles.snippetBox}>
            <Text style={styles.snippet}>
              {currentQuestion.snippet?.split("___")[0]}
              <Text style={styles.blank}></Text>
            </Text>
          </View>
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

export default Lesson_3;

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
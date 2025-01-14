import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Timer = () => {
  const [seconds, setSeconds] = useState(0); // Timer in seconds
  const [isActive, setIsActive] = useState(false); // Timer state (active or paused)
  const [inputTime, setInputTime] = useState(0); // Input time in seconds

  useEffect(() => {
    let interval;

    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (seconds === 0 && isActive) {
      setIsActive(false);
      alert('Time is up!');
    }

    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const startTimer = () => {
    if (inputTime > 0) {
      setSeconds(inputTime); // Set the timer with input time
      setIsActive(true); // Start the timer
    } else {
      alert('Please enter a valid time');
    }
  };

  const stopTimer = () => {
    setIsActive(false); // Pause the timer
  };

  const resetTimer = () => {
    setIsActive(false);
    setSeconds(inputTime); // Reset to the initial input time
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Timer</Text>
      <Text style={styles.timeText}>{formatTime(seconds)}</Text>

      {/* Input for Time */}
      <TextInput
        style={styles.input}
        placeholder="Enter time in seconds"
        keyboardType="numeric"
        onChangeText={(text) => setInputTime(parseInt(text) || 0)}
        value={inputTime.toString()}
      />

      {/* Start, Stop, Reset Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={startTimer}>
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={stopTimer}>
          <Text style={styles.buttonText}>Stop</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={resetTimer}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Format seconds to MM:SS
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 30, fontWeight: 'bold' },
  timeText: { fontSize: 50, marginBottom: 20 },
  input: {
    height: 40,
    width: 200,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 18,
  },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '80%' },
  button: { padding: 10, backgroundColor: 'tomato', borderRadius: 5 },
  buttonText: { color: 'white', fontSize: 18 },
});

export default Timer;

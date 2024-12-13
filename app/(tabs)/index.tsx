import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Keyboard,
} from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';

export default function App() {
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState<string[]>([]);
  const width = useSharedValue(50); // Start with a small width
  const translateX = useSharedValue(0); // For movement
  const rotation = useSharedValue(0); // For rotating the button
  const colorValue = useSharedValue(0); // For color transition
  const maxWidth = 300; // Set a maximum width for the note box

  const handleAddNote = () => {
    if (note.trim()) {
      setNotes([...notes, note]);
      setNote('');
      Keyboard.dismiss();

      // Increase the width until maxWidth
      width.value = width.value + 50 <= maxWidth ? width.value + 50 : maxWidth;

      // Trigger animations
      translateX.value = withSpring(100, { damping: 10 }, () => {
        translateX.value = withSpring(0); // Reset position after animation
      });

      colorValue.value = colorValue.value === 0 ? withTiming(1, { duration: 500 }) : withTiming(0, { duration: 500 });

      rotation.value = withTiming(rotation.value + 360, { duration: 800 }); // Rotate the button
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    let backgroundColor = 'red'; // Default color for low width
    if (width.value > 200) backgroundColor = 'green'; // Max width: green
    else if (width.value > 100) backgroundColor = 'yellow'; // Medium width: yellow

    return {
      transform: [{ translateX: translateX.value }], // Horizontal movement
      width: withTiming(width.value, { duration: 500 }), // Smooth width increase
      height: 50,
      backgroundColor, // Dynamically change background color
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 5,
    };
  });

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }], // Rotate the button
    };
  });

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🔋 Animated Note App</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Write your note here..."
          value={note}
          onChangeText={(text) => setNote(text)}
        />
        <TouchableOpacity onPress={handleAddNote}>
          <Animated.View style={[styles.addButton, animatedButtonStyle]}>
            <Text style={styles.addButtonText}>+</Text>
          </Animated.View>
        </TouchableOpacity>
      </View>
      <FlatList
        data={notes}
        renderItem={({ item }) => (
          <Animated.View style={[styles.noteContainer, animatedStyle]}>
            <Text style={styles.noteText}>{item}</Text>
          </Animated.View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  addButton: {
    marginLeft: 10,
    backgroundColor: '#007AFF',
    borderRadius: 50,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  noteContainer: {
    marginBottom: 10,
    padding: 10,
  },
  noteText: {
    fontSize: 16,
    color: '#000',
  },
});

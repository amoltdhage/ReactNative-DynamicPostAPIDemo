// // /**
// //  * Sample React Native App
// //  * https://github.com/facebook/react-native
// //  *
// //  * @format
// //  */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  TouchableHighlight,
  Alert,
} from 'react-native';

const App = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [apiResult, setApiResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const activityIndicatorRef = useRef(null);

  const validateEmail = (inputText) => {
    // A more robust email validation regex
    const emailRegex =
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}(\.[a-zA-Z]{2,4})?$/;
    return emailRegex.test(inputText);
  };

  const saveAPIData = async () => {
    // Validation for the name field
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Please enter your name.');
      return;
    }

    // Allow names with single spaces and alphabets
    if (!/^[a-zA-Z]+(\s[a-zA-Z]+)*$/.test(name)) {
      Alert.alert('Validation Error', 'Name can only contain alphabets and single spaces between words.');
      return;
    }

    // Validation for the age field
    if (!age) {
      Alert.alert('Validation Error', 'Please enter your age.');
      return;
    }

    const ageNumber = parseInt(age, 10);

    // Allow only two-digit numbers for age
    if (!/^\d{2}$/.test(age) || ageNumber < 10 || ageNumber > 99) {
      Alert.alert('Validation Error', 'Age should be a number with two digits between 10 and 99.');
      return;
    }

    if (!email || !validateEmail(email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    setShowModal(false);
    setLoadingText('Adding New Data...');

    const data = {
      name: name,
      age: ageNumber, // assuming age is a number
      email: email,
    };

    const url = 'http://127.0.0.1:3000/users';

    try {
      let result = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      // Introduce a delay to ensure at least 2 seconds
      await new Promise((resolve) => setTimeout(resolve, 2000));

      result = await result.json();
      setApiResult(result);
    } catch (error) {
      console.error('Error calling API:', error);
    } finally {
      setIsLoading(false);
      setShowModal(true);
      setLoadingText('');

      // Clear text fields
      setName('');
      setAge('');
      setEmail('');
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Post API Call</Text>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name<Text style={styles.required}>*</Text>:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={name}
            onChangeText={(text) => setName(text)}
            keyboardType="default" // Default keyboard for name
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Age<Text style={styles.required}>*</Text>:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your age (10-99)"
            value={age}
            onChangeText={(text) => {
              // Allow only two digits
              if (/^\d{0,2}$/.test(text)) {
                setAge(text);
              }
            }}
            keyboardType="numeric" // Numeric keyboard for age
            maxLength={2} // Limit the input to 2 characters
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email<Text style={styles.required}>*</Text>:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            keyboardType="email-address" // Email keyboard for email
          />
        </View>
      </View>

      <TouchableOpacity style={styles.blueButton} onPress={saveAPIData}>
        <Text style={styles.buttonText}>Save Data</Text>
      </TouchableOpacity>

      {isLoading && (
        <View>
          <ActivityIndicator
            ref={activityIndicatorRef}
            size="large"
            color="#4CAF50" // Green color for activity indicator
            style={styles.activityIndicator}
          />
          {loadingText !== '' && (
            <Text style={styles.loadingTextGreen}>{loadingText}</Text>
          )}
        </View>
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={showModal}
        onRequestClose={() => {
          setShowModal(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitleGreen}>New Data Added!</Text>
            {apiResult && (
              <View style={styles.resultContainer}>
                <Text style={styles.resultText}>ID: {apiResult.id}</Text>
                <Text style={styles.resultText}>Name: {apiResult.name}</Text>
                <Text style={styles.resultText}>Age: {apiResult.age}</Text>
                <Text style={styles.resultText}>Email: {apiResult.email}</Text>
              </View>
            )}
            <TouchableHighlight
              style={styles.okButtonBlue} // Sky blue color for OK button
              onPress={closeModal}
              underlayColor="#2196F3"
            >
              <Text style={styles.okButtonText}>OK</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 30,
    marginBottom: 20,
    color: '#333',
  },
  formContainer: {
    width: '100%',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
  required: {
    color: 'red',
  },
  input: {
    height: 40,
    borderColor: '#3498db',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  blueButton: {
    backgroundColor: '#3498db', // Blue color for Save button
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10, // Increase border radius
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  resultContainer: {
    marginTop: 20,
    alignItems: 'flex-start',
  },
  resultText: {
    marginBottom: 10,
    fontSize: 18,
    color: '#333',
  },
  activityIndicator: {
    marginTop: 20,
  },
  loadingTextGreen: {
    marginTop: 10,
    fontSize: 16,
    color: '#4CAF50', // Green color for loading text
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    borderWidth: 2,
    borderColor: '#4CAF50', // Green color for modal border
  },
  modalTitleGreen: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50', // Green color for modal title
    marginBottom: 10,
    textAlign: 'left',
  },
  okButtonBlue: {
    backgroundColor: '#2196F3', // Sky blue color for OK button
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  okButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default App;

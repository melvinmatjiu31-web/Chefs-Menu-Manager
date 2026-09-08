import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  FlatList,
  Modal,
  Alert,
} from 'react-native';

export default function App() {
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('');
  const [price, setPrice] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  const [showCoursePicker, setShowCoursePicker] = useState(false);

  const courses = ['Starter', 'Main Course', 'Dessert'];

  const addMenuItem = () => {
    if (!dishName.trim()) {
      Alert.alert('Missing Information', 'Please enter the dish name.');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Missing Information', 'Please enter a description.');
      return;
    }

    if (!course) {
      Alert.alert('Missing Information', 'Please select a course.');
      return;
    }

    if (!price.trim()) {
      Alert.alert('Missing Information', 'Please enter the price.');
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      dishName: dishName.trim(),
      description: description.trim(),
      course,
      price: price.trim(),
    };

    setMenuItems((currentItems) => [...currentItems, newItem]);

    setDishName('');
    setDescription('');
    setCourse('');
    setPrice('');

    Alert.alert('Success', 'Menu item added successfully!');
  };

  const renderMenuItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.dishName}>{item.dishName}</Text>
      <Text style={styles.course}>{item.course}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.price}>R {item.price}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chef's Menu Manager</Text>
      <Text style={styles.subtitle}>Add and manage restaurant menu items</Text>

      <TextInput
        style={styles.input}
        placeholder="Dish Name"
        value={dishName}
        onChangeText={setDishName}
      />

      <TextInput
        style={[styles.input, styles.descriptionInput]}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Pressable
        style={styles.input}
        onPress={() => setShowCoursePicker(true)}
      >
        <Text style={course ? styles.inputText : styles.placeholder}>
          {course || 'Select Course'}
        </Text>
      </Pressable>

      <TextInput
        style={styles.input}
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      <Pressable style={styles.addButton} onPress={addMenuItem}>
        <Text style={styles.buttonText}>Add Menu Item</Text>
      </Pressable>

      <Text style={styles.menuTitle}>Menu Items</Text>

      {menuItems.length === 0 ? (
        <Text style={styles.emptyText}>
          No menu items added yet.
        </Text>
      ) : (
        <FlatList
          data={menuItems}
          keyExtractor={(item) => item.id}
          renderItem={renderMenuItem}
          contentContainerStyle={styles.list}
        />
      )}

      <Modal
        visible={showCoursePicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCoursePicker(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Select Course</Text>

            {courses.map((item) => (
              <Pressable
                key={item}
                style={styles.courseOption}
                onPress={() => {
                  setCourse(item);
                  setShowCoursePicker(false);
                }}
              >
                <Text style={styles.courseOptionText}>{item}</Text>
              </Pressable>
            ))}

            <Pressable
              style={styles.cancelButton}
              onPress={() => setShowCoursePicker(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 55,
    backgroundColor: '#F5F5F5',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },

  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    fontSize: 16,
  },

  descriptionInput: {
    height: 90,
    textAlignVertical: 'top',
  },

  inputText: {
    fontSize: 16,
    color: '#222',
  },

  placeholder: {
    fontSize: 16,
    color: '#888',
  },

  addButton: {
    backgroundColor: '#222',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },

  menuTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  emptyText: {
    textAlign: 'center',
    color: '#777',
    marginTop: 20,
    fontSize: 16,
  },

  list: {
    paddingBottom: 20,
  },

  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },

  dishName: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  course: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
  },

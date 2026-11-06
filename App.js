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
  const [editingId, setEditingId] = useState(null);
  const [searchText, setSearchText] = useState('');
const [selectedFilter, setSelectedFilter] = useState('All');
  const courses = ['Starter', 'Main Course', 'Dessert'];

  const clearForm = () => {
    setDishName('');
    setDescription('');
    setCourse('');
    setPrice('');
    setEditingId(null);
  };

  const saveMenuItem = () => {
    if (!dishName.trim() || !description.trim() ||
        !course || !price.trim()) {
      Alert.alert('Missing Information', 'Please complete all fields.');
      return;
    }

    if (isNaN(Number(price)) || Number(price) <= 0) {
      Alert.alert('Invalid Price', 'Please enter a valid price.');
      return;
    }

    if (editingId) {
      setMenuItems(items =>
        items.map(item =>
          item.id === editingId
            ? {
                ...item,
                dishName: dishName.trim(),
                description: description.trim(),
                course,
                price: price.trim(),
              }
            : item
        )
      );

      Alert.alert('Updated', 'Menu item updated successfully!');
    } else {
      const newItem = {
        id: Date.now().toString(),
        dishName: dishName.trim(),
        description: description.trim(),
        course,
        price: price.trim(),
      };

      setMenuItems(items => [...items, newItem]);

      Alert.alert('Success', 'Menu item added successfully!');
    }

    clearForm();
  };

  const editMenuItem = (item) => {
    setDishName(item.dishName);
    setDescription(item.description);
    setCourse(item.course);
    setPrice(item.price);
    setEditingId(item.id);
  };

  const deleteMenuItem = (id) => {
    Alert.alert(
      'Delete Menu Item',
      'Are you sure you want to delete this item?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setMenuItems(items =>
              items.filter(item => item.id !== id)
            );

            Alert.alert('Deleted', 'Menu item removed successfully.');
          },
        },
      ]
    );
  };
const filteredMenuItems = menuItems.filter(item => {
  const matchesSearch = item.dishName
    .toLowerCase()
    .includes(searchText.toLowerCase());

  const matchesCourse =
    selectedFilter === 'All' ||
    item.course === selectedFilter;

  return matchesSearch && matchesCourse;
});
const totalItems = menuItems.length;

const averagePrice = totalItems > 0
  ? menuItems.reduce((total, item) => total + Number(item.price), 0) / totalItems
  : 0;

const starterCount = menuItems.filter(
  item => item.course === 'Starter'
).length;

const mainCourseCount = menuItems.filter(
  item => item.course === 'Main Course'
).length;

const dessertCount = menuItems.filter(
  item => item.course === 'Dessert'
).length;
  const renderMenuItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.dishName}>{item.dishName}</Text>
      <Text style={styles.course}>{item.course}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.price}>R {item.price}</Text>

      <View style={styles.buttonRow}>
        <Pressable
          style={styles.editButton}
          onPress={() => editMenuItem(item)}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </Pressable>

        <Pressable
          style={styles.deleteButton}
          onPress={() => deleteMenuItem(item.id)}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chef's Menu Manager</Text>
      <Text style={styles.subtitle}>
        Manage your restaurant menu
      </Text>

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

      <Pressable style={styles.addButton} onPress={saveMenuItem}>
        <Text style={styles.buttonText}>
          {editingId ? 'Save Changes' : 'Add Menu Item'}
        </Text>
      </Pressable>

      {editingId && (
        <Pressable style={styles.cancelEdit} onPress={clearForm}>
          <Text style={styles.cancelText}>Cancel Editing</Text>
        </Pressable>
      )}
<TextInput
  style={styles.input}
  placeholder="Search dishes by name..."
  value={searchText}
  onChangeText={setSearchText}
/>
<View style={styles.filterRow}>
  {['All', 'Starter', 'Main Course', 'Dessert'].map(filter => (
    <Pressable
      key={filter}
      style={[
        styles.filterButton,
        selectedFilter === filter && styles.activeFilter
      ]}
      onPress={() => setSelectedFilter(filter)}
    >
      <Text style={styles.filterText}>{filter}</Text>
    </Pressable>
  ))}
</View>
<Text style={styles.statsTitle}>Menu Statistics</Text>

<View style={styles.statsCard}>
  <Text style={styles.statsText}>
    Total Menu Items: {totalItems}
  </Text>

  <Text style={styles.statsText}>
    Average Price: R {averagePrice.toFixed(2)}
  </Text>

  <Text style={styles.statsText}>
    Starters: {starterCount}
  </Text>

  <Text style={styles.statsText}>
    Main Courses: {mainCourseCount}
  </Text>

  <Text style={styles.statsText}>
    Desserts: {dessertCount}
  </Text>
</View>
      <Text style={styles.menuTitle}>Menu Items</Text>

      {menuItems.length === 0 ? (
  <Text style={styles.emptyText}>
    No menu items added yet.
  </Text>
) : filteredMenuItems.length === 0 ? (
  <Text style={styles.emptyText}>
    No matching menu items found.
  </Text>
) : (
  <FlatList
    data={filteredMenuItems}
    keyExtractor={item => item.id}
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

            {courses.map(item => (
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
  backgroundColor: '#F0F4F5',
},
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#173B45',
  },
  subtitle: {
    textAlign: 'center',
    color: '#668087',
    marginBottom: 25,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D5E1E3',
    borderRadius: 12,
    padding: 15,
    marginBottom: 14,
    fontSize: 16,
    color: '#173B45'
  },
  descriptionInput: {
    height: 85,
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
    backgroundColor: '#147D78',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  cancelEdit: {
    padding: 10,
    alignItems: 'center',
  },
  cancelText: {
    color: '#333',
    fontWeight: 'bold',
  },
  menuTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 12,
  },
  emptyText: {
    textAlign: 'center',
    color: '#777',
    marginTop: 20,
  },
  list: {
    paddingBottom: 30,
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
    fontWeight: 'bold',
    marginTop: 5,
  },
  description: {
    marginTop: 8,
    color: '#555',
  },
  price: {
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 15,
    gap: 10,
  },
  editButton: {
    backgroundColor: '#2878B5',
    padding: 11,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#C0392B',
    padding: 11,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 25,
  },
  modalBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  courseOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  courseOptionText: {
    fontSize: 17,
  },
  cancelButton: {
    marginTop: 15,
    padding: 12,
    alignItems: 'center',
  },
  filterRow: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 8,
  marginBottom: 12,
},

filterButton: {
  backgroundColor: '#DDDDDD',
  padding: 10,
  borderRadius: 8,
},

activeFilter: {
  backgroundColor: '#2878B5',
},

filterText: {
  fontSize: 12,
  fontWeight: 'bold',
  color: '#222222',
},
statsTitle: {
  fontSize: 22,
  fontWeight: 'bold',
  color: '#173B45' , 
  marginTop: 15,
  marginBottom: 12,
},

statsCard: {
  backgroundColor: '#FFFFFF',
  padding: 18,
  borderRadius: 14,
  marginBottom: 18,
  borderWidth: 1,
  borderColor: '#D5E1E3',
},

statsText: {
  fontSize: 15,
  marginBottom: 8,
  fontWeight: '500',
},
});

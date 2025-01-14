import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, TextInput, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import WorldClock from './Worldclock';
import Timer from './Timer';
import Settings from './Setting';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeScreen = ({ navigation }) => (
  <View style={styles.container}>
    <TouchableOpacity onPress={() => navigation.navigate('Timer')}>
      <Text style={styles.text}>Go to Timer</Text>
    </TouchableOpacity>
  </View>
);

const TabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="World Clock" component={WorldClock} />
    <Tab.Screen name="Timer" component={Timer} />
    <Tab.Screen name="Settings" component={Settings} />
  </Tab.Navigator>
);

const ClockApp = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alarmList, setAlarmList] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [alarmLabel, setAlarmLabel] = useState("");

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  useEffect(() => {
    const triggeredAlarms = new Set();

    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      const formattedTime = formatTime(now);

      alarmList.forEach((alarm) => {
        if (!triggeredAlarms.has(alarm.id) && alarm.time === formattedTime) {
          triggeredAlarms.add(alarm.id);

          Alert.alert(
            'Alarm Alert',
            `এলার্ম "${alarm.label}" বাজছে!`,
            [{ text: 'OK', onPress: () => triggeredAlarms.delete(alarm.id) }]
          );

          setTimeout(() => {
            triggeredAlarms.delete(alarm.id);
          }, 5000);
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [alarmList]);

  const addAlarm = () => {
    if (!selectedTime || !alarmLabel.trim()) {
      Alert.alert('Error', 'Please set a valid alarm time and label.');
      return;
    }

    const formattedTime = formatTime(selectedTime);

    if (selectedTime <= new Date()) {
      Alert.alert('Invalid Time', 'You cannot set an alarm for a past time.');
      return;
    }

    const newAlarm = {
      id: Date.now(),
      label: alarmLabel.trim(),
      time: formattedTime,
    };

    setAlarmList((prev) => [...prev, newAlarm]);
    setAlarmLabel('');
    setSelectedTime(null);
    setShowTimePicker(false);

    Alert.alert('Success', `Alarm for "${newAlarm.label}" set at ${formattedTime}.`);
  };

  const handleTimeChange = (event, selectedDate) => {
    if (event.type === 'dismissed') {
      setShowTimePicker(false);
      return;
    }
    setSelectedTime(selectedDate || null);
    setShowTimePicker(false);
  };

  const calculateHandAngles = () => {
    const hours = currentTime.getHours() % 12;
    const minutes = currentTime.getMinutes();
    const seconds = currentTime.getSeconds();

    return {
      hourAngle: (hours + minutes / 60) * 30,
      minuteAngle: minutes * 6,
      secondAngle: seconds * 6,
    };
  };

  const { hourAngle, minuteAngle, secondAngle } = calculateHandAngles();

  const deleteAlarm = (index) => {
    setAlarmList((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>নিয়মিত ঘড়ি এবং অ্যালার্ম</Text>

      <View style={styles.clockContainer}>
        <View style={styles.analogClock}>
          <View
            style={[
              styles.clockHand,
              styles.hourHand,
              { transform: [{ rotate: `${hourAngle}deg` }] },
            ]}
          />
          <View
            style={[
              styles.clockHand,
              styles.minuteHand,
              { transform: [{ rotate: `${minuteAngle}deg` }] },
            ]}
          />
          <View
            style={[
              styles.clockHand,
              styles.secondHand,
              { transform: [{ rotate: `${secondAngle}deg` }] },
            ]}
          />
          <View style={styles.clockCenter} />
        </View>
        <Text style={styles.message}>উৎপাদনশীল থাকুন! নিচে আপনার অ্যালার্ম সেট করুন।</Text>
      </View>

      <TouchableOpacity
        style={styles.addAlarmButton}
        onPress={() => setShowTimePicker(true)}
      >
        <Text style={styles.addAlarmButtonText}>Add Alarm</Text>
      </TouchableOpacity>

      {showTimePicker && (
        <DateTimePicker
          value={selectedTime || new Date()}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleTimeChange}
        />
      )}

      {!showTimePicker && (
        <TextInput
          style={styles.alarmLabelInput}
          placeholder="অ্যালার্মের বিষয় লিখুন"
          value={alarmLabel}
          onChangeText={(text) => setAlarmLabel(text)}
        />
      )}

      {!showTimePicker && alarmLabel && (
        <TouchableOpacity
          style={styles.addAlarmButton}
          onPress={addAlarm}
        >
          <Text style={styles.addAlarmButtonText}>Confirm Alarm</Text>
        </TouchableOpacity>
      )}

      <View style={styles.alarmListContainer}>
        <Text style={styles.alarmListTitle}>Alarm List</Text>
        {alarmList.length > 0 ? (
          <FlatList
            data={alarmList}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.alarmItemContainer}>
                <Text style={styles.alarmItem}>{item.label}</Text>
                <Text style={[styles.alarmTime, { marginRight: 10 }]}>{item.time}</Text>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteAlarm(index)}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        ) : (
          <Text style={styles.noAlarmsText}>No alarms set.</Text>
        )}
      </View>

      <NavigationContainer>
        <Stack.Navigator initialRouteName="Tabs">
          <Stack.Screen name="Tabs" component={TabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f8',
    alignItems: 'center',
    padding: 40,

  },
  header: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20, // Adds a gap below the title
  },
  clockContainer: {
    alignItems: 'center',
    marginBottom: 30, // Ensures space between the clock and other elements
  },
  analogClock: {
    width: 200,
    height: 200,
    borderRadius: 100, // Ensures the clock face is a perfect circle
    borderWidth: 6,
    borderColor: '#00bcd4',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  clockHand: {
    position: 'absolute',
    width: 2, // Uniform hand width for better proportions
    backgroundColor: '#333',
    borderRadius: 2,
    bottom: '50%', // Aligns the hand's base at the center of the circle
    left: '50%', // Ensures the hand is horizontally centered
    transformOrigin: 'bottom center', // Correct pivot point for rotation
  },
  hourHand: {
    height: '25%', // Shorter hand for hours
    backgroundColor: '#000', // Darker color for hour hand
  },
  minuteHand: {
    height: '40%', // Medium length for minutes
    backgroundColor: '#007bff', // Distinct color for minute hand
  },
  secondHand: {
    height: '45%', // Longest hand for seconds
    backgroundColor: '#e74c3c', // Red for visibility
  },
  clockCenter: {
    width: 12,
    height: 12,
    backgroundColor: '#000',
    borderRadius: 6, // Slightly larger center point for visual balance
    position: 'absolute',
    zIndex: 1, // Ensures the center covers hand overlaps
    top: '50%', // Centers the circle vertically
    left: '50%', // Centers the circle horizontally
    transform: [{ translateX: -6 }, { translateY: -6 }], // Offsets the circle to the exact center
  },

  message: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  addAlarmButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 10,
  },
  addAlarmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  alarmLabelInput: {
    height: 40,
    width: '100%',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginTop: 10,
    fontSize: 16,
  },
  alarmListContainer: {
    marginTop: 20,
    width: '100%',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  alarmListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  alarmItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center',
  },
  alarmItem: {
    fontSize: 16,
    color: '#555',
    flex: 1,
  },
  alarmTime: {
    fontSize: 16,
    color: '#555',
    fontStyle: 'italic',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  noAlarmsText: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 20,
  },
  tabBar: {
    backgroundColor: '#ffffff', // White background for the tab bar
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0', // Light gray border on top of the tab bar
    height: 70, // Increase height for a better button layout
  },
  tabBarLabel: {
    fontSize: 12, // Adjust font size
    fontWeight: 'bold', // Make the label text bold
  },
  tabBarItem: {
    paddingVertical: 10, // Add vertical padding to buttons
    justifyContent: 'center',
    alignItems: 'center', // Center icon and label
  },
});
export default ClockApp;
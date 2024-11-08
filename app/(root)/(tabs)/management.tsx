import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InputField from "@/components/InputField";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Room {
  id: string;
  room_number: string;
  capacity: string;
  price: string;
  floor: string;
  description: string;
  status: string;
}

const RoomManagement = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [editRoomId, setEditRoomId] = useState<string | null>(null);
  const [roomNumber, setRoomNumber] = useState("");
  const [capacity, setCapacity] = useState("");
  const [price, setPrice] = useState("");
  const [floor, setFloor] = useState("");
  const [description, setDescription] = useState("");
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
      } else {
        console.error("Token not found");
      }
    };
    fetchToken();
  }, []);

  const fetchRooms = async () => {
    if (!token) return;
    try {
      const response = await axios.get("http://192.168.1.8:8000/api/rooms", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRooms(response.data.rooms);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  useEffect(() => {
    if (token) fetchRooms();
  }, [token]);

  const handleSaveRoom = async () => {
    if (!token) {
      console.error("Token not available");
      return;
    }

    const roomData = {
      room_number: roomNumber,
      capacity,
      price,
      floor,
      description,
      status: "vacant",
    };

    try {
      if (editRoomId) {
        // Update existing room
        const response = await axios.put(
          `http://192.168.1.8:8000/api/rooms/${editRoomId}`,
          roomData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRooms(
          rooms.map((room) =>
            room.id === editRoomId ? response.data.room : room
          )
        );
      } else {
        // Add new room
        const response = await axios.post(
          "http://192.168.1.8:8000/api/add-room",
          roomData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRooms([...rooms, response.data.room]);
      }

      resetForm();
    } catch (error) {
      console.error("Error saving room:", error);
    }
  };

  const deleteRoom = async (roomId: string) => {
    try {
      const response = await axios.delete(
        `http://192.168.1.8:8000/api/rooms/${roomId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Room deleted successfully", response.data);
      setRooms((prevRooms) => prevRooms.filter((room) => room.id !== roomId));
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  };

  const resetForm = () => {
    setEditRoomId(null);
    setRoomNumber("");
    setCapacity("");
    setPrice("");
    setFloor("");
    setDescription("");
    setModalVisible(false);
  };

  const openEditModal = (room: Room) => {
    setEditRoomId(room.id);
    setRoomNumber(room.room_number);
    setCapacity(room.capacity);
    setPrice(room.price);
    setFloor(room.floor);
    setDescription(room.description);
    setModalVisible(true);
  };

  const renderRoom = ({ item }: { item: Room }) => (
    <View className="w-1/2 p-2">
      <View className="border border-gray-300 p-4 rounded-lg">
        <Text className="font-bold text-lg">{item.room_number}</Text>
        <Text>Capacity: {item.capacity}</Text>
        <Text>Price: {item.price}</Text>
        <Text>Floor: {item.floor}</Text>
        <Text>Description: {item.description}</Text>
        <Text>Status: {item.status}</Text>
        <TouchableOpacity
          onPress={() => openEditModal(item)}
          className="mt-2 bg-yellow-500 p-2 rounded-lg"
        >
          <Text className="text-white text-center">Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => deleteRoom(item.id)}
          className="mt-2 bg-red-500 p-2 rounded-lg"
        >
          <Text className="text-white text-center">Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 p-4">
      <Text className="text-2xl font-bold mb-4">Room Management</Text>

      <FlatList
        data={rooms}
        renderItem={renderRoom}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="absolute bottom-28 right-8 bg-blue-500 p-4 rounded-full"
      >
        <Text className="text-white font-bold text-lg">+</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white p-6 rounded-lg w-11/12">
            <Text className="text-xl font-bold mb-4">
              {editRoomId ? "Edit Room" : "Add New Room"}
            </Text>

            <InputField
              label="Room Number"
              value={roomNumber}
              onChangeText={setRoomNumber}
              placeholder="Enter room number"
            />

            <InputField
              label="Capacity"
              value={capacity}
              onChangeText={setCapacity}
              placeholder="Enter capacity"
            />

            <InputField
              label="Price"
              value={price}
              onChangeText={setPrice}
              placeholder="Enter price"
            />

            <InputField
              label="Floor"
              value={floor}
              onChangeText={setFloor}
              placeholder="Enter floor"
            />

            <InputField
              label="Description"
              value={description}
              onChangeText={setDescription}
              placeholder="Enter description"
            />

            <TouchableOpacity
              onPress={handleSaveRoom}
              className="bg-blue-500 p-3 mt-4 rounded-lg"
            >
              <Text className="text-white text-center font-bold">
                {editRoomId ? "Update Room" : "Add Room"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default RoomManagement;

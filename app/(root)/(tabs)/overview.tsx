import React, { useState, useEffect } from "react";
import { View, Text, Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

type RoomStat = {
  name: string;
  population: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
};

const RoomAnalytics = () => {
  const [data, setData] = useState<RoomStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalRooms, setTotalRooms] = useState(0);
  const [currentTenants, setCurrentTenants] = useState(0);

  useEffect(() => {
    const getRoomStats = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          setError("User is not authenticated");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          "http://192.168.1.8:8000/api/room-statistics",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const roomStats = response.data;
        const totalRoomsCount =
          roomStats.occupied + roomStats.vacant + roomStats.maintenance;
        setTotalRooms(totalRoomsCount);

        setCurrentTenants(roomStats.occupied);

        const occupiedPercentage = (
          (roomStats.occupied / totalRoomsCount) *
          100
        ).toFixed(0);
        const vacantPercentage = (
          (roomStats.vacant / totalRoomsCount) *
          100
        ).toFixed(0);
        const maintenancePercentage = (
          (roomStats.maintenance / totalRoomsCount) *
          100
        ).toFixed(0);

        setData([
          {
            name: `Occupied\n${occupiedPercentage}%`,
            population: roomStats.occupied,
            color: "rgba(255, 99, 132, 0.6)",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15,
          },
          {
            name: `Vacant\n${vacantPercentage}%`,
            population: roomStats.vacant,
            color: "rgba(54, 162, 235, 0.6)",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15,
          },
          {
            name: `Under Maintenance\n${maintenancePercentage}%`,
            population: roomStats.maintenance,
            color: "rgba(255, 206, 86, 0.6)",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15,
          },
        ]);
      } catch (error) {
        setError("Failed to fetch room statistics");
      } finally {
        setLoading(false);
      }
    };

    getRoomStats();
  }, []);

  if (loading) {
    return (
      <View className="p-4 flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="p-4 flex-1 justify-center items-center">
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-4 mt-[4rem]">
      <View className="flex-row justify-center items-start">
        <View className="flex-col">
          <View className="bg-gray-200 p-5 rounded-lg border border-gray-300 items-center mb-5">
            <Text className="text-lg font-bold">Total Rooms</Text>
            <Text className="text-2xl font-bold text-gray-800">
              {totalRooms}
            </Text>
          </View>

          <View className="bg-gray-200 p-5 rounded-lg border border-gray-300 items-center">
            <Text className="text-lg font-bold">Current Tenants</Text>
            <Text className="text-2xl font-bold text-gray-800">
              {currentTenants}
            </Text>
          </View>
        </View>

        <View className="items-center">
          <PieChart
            data={data}
            width={Dimensions.get("window").width - 160}
            height={200}
            chartConfig={{
              backgroundColor: "#e26a00",
              backgroundGradientFrom: "#fb8c00",
              backgroundGradientTo: "#ffa726",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
                alignItems: "center",
              },
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="40"
            hasLegend={false}
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
          />
          <View>
            <View className="flex-row items-center">
              <View className="w-5 h-5 bg-pink-400 mr-2" />
              <Text>Occupied</Text>
              <View className="w-5 h-5 bg-blue-400 mr-2 ml-4" />
              <Text>Vacant</Text>
            </View>
            <View className="flex-row items-center mt-2">
              <View className="w-5 h-5 bg-yellow-400 mr-2" />
              <Text>Under Maintenance</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default RoomAnalytics;

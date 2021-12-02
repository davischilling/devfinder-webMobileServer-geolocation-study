import { MaterialIcons } from "@expo/vector-icons";
import {
  Accuracy,
  getCurrentPositionAsync,
  requestPermissionsAsync,
} from "expo-location";
import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import MapView from "react-native-maps";
import { DevMarker } from "../components/DevMarker";
import api from "../services/api";
import { connect, disconnect, subscribeToNewDev } from "../services/socket";

interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

interface Coordinate {
  coordinates: [number];
  _id: string;
  type: "Point";
}

interface Dev {
  techs: [string];
  _id: string;
  github_username: string;
  avatar_url: string;
  bio: string;
  name: string;
  location: Coordinate;
  html_url: string;
  __v: number;
}

export const Main = () => {
  const [currentRegion, setCurrentRegion]: any = useState(null);
  const [devs, setDevs]: any = useState([]);
  const [techs, setTechs] = useState("");

  useEffect(() => {
    const loadInitialPosition = async () => {
      let { granted } = await requestPermissionsAsync();
      if (granted) {
        const { coords } = await getCurrentPositionAsync({
          accuracy: Accuracy.High,
        });
        const { latitude, longitude } = coords;

        setCurrentRegion({
          latitude,
          longitude,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04,
        });
      }
    };
    loadInitialPosition();
  }, []);

  useEffect(() => {
    subscribeToNewDev((dev: Dev) => setDevs([...devs, dev]));
  }, [devs]);

  const handleRegionChanged = (region: Region) => {
    setCurrentRegion(region);
  };

  const setupWebSocket = () => {
    disconnect();
    const { latitude, longitude } = currentRegion;
    connect(latitude, longitude, techs);
  };

  const loadDevs = async () => {
    const { latitude, longitude } = currentRegion;
    try {
      const response = await api.get("/devs", {
        params: {
          latitude,
          longitude,
          techs,
        },
      });
      setDevs(response.data);
      setupWebSocket();
    } catch (err) {
      console.log(err);
    }
  };

  if (!currentRegion) {
    return null;
  }

  return (
    <>
      <MapView
        onRegionChangeComplete={handleRegionChanged}
        initialRegion={currentRegion}
        style={styles.map}
      >
        {devs.length > 0 &&
          devs.map((dev: Dev) => <DevMarker key={dev._id} dev={dev} />)}
      </MapView>

      <View style={styles.searchForm}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar devs por techs..."
          placeholderTextColor="#999"
          autoCapitalize="words"
          autoCorrect={false}
          value={techs}
          onChangeText={text => setTechs(text)}
        />
        <TouchableOpacity onPress={loadDevs} style={styles.loadButton}>
          <MaterialIcons name="my-location" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },

  searchForm: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    zIndex: 5,
    display: "flex",
    flexDirection: "row",
  },

  searchInput: {
    flex: 1,
    height: 50,
    backgroundColor: "#FFF",
    color: "#333",
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 4,
      height: 4,
    },
    elevation: 2,
  },

  loadButton: {
    width: 50,
    height: 50,
    backgroundColor: "#8E4Dff",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 15,
  },
});

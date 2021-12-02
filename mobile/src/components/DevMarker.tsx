import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Callout, Marker } from "react-native-maps";

export const DevMarker = ({ dev }: any) => {
  const navigation = useNavigation();

  return (
    <Marker
      coordinate={{
        longitude: dev.location.coordinates[0],
        latitude: dev.location.coordinates[1],
      }}
    >
      <Image
        style={styles.avatar}
        source={{
          uri: dev.avatar_url,
        }}
      />
      <Callout
        onPress={() =>
          navigation.navigate("Profile", {
            github_username: dev.github_username,
          })
        }
      >
        <View style={styles.callout}>
          <Text style={styles.devName}>{dev.name}</Text>
          <Text style={styles.devBio}>{dev.bio}</Text>
          <Text style={styles.devTechs}>{dev.techs.join(", ")}</Text>
        </View>
      </Callout>
    </Marker>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 4,
    borderWidth: 4,
    borderColor: "#FFF",
  },

  callout: {
    width: 260,
  },

  devName: {
    fontWeight: "bold",
    fontSize: 16,
  },

  devBio: {
    color: "#666",
    marginTop: 5,
  },

  devTechs: {
    marginTop: 5,
  },
});

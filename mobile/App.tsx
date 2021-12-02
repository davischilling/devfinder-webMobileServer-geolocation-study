import { NavigationContainer } from "@react-navigation/native";
import * as React from "react";
import "react-native-gesture-handler";
import { Navigation } from "./src/routes/Navigation";
import { routes } from "./src/routes";
import { StatusBar, LogBox } from "react-native";

LogBox.ignoreLogs(["Unrecognized WebSocket"]);

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#7D40E7" />
      <Navigation routes={routes} />
    </NavigationContainer>
  );
}

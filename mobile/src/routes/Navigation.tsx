import React, { ComponentType } from "react";
import { createStackNavigator } from "@react-navigation/stack";
const Stack = createStackNavigator();

interface Route {
  name: string;
  component: ComponentType<any>;
  title: string;
}

interface Router {
  routes: Array<Route>;
}

export const Navigation = ({ routes }: Router) => {
  const renderRoutes = () => {
    return routes.map((route: Route) => (
      <Stack.Screen
        key={route.name}
        name={route.name}
        component={route.component}
        options={{ title: route.title }}
      />
    ));
  };

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#7D40E7",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
          textAlign: "center",
        },
        headerBackTitleVisible: false,
      }}
    >
      {renderRoutes()}
    </Stack.Navigator>
  );
};

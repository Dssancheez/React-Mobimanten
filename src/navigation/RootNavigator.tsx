import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ActivityIndicator, View } from 'react-native';

import { AuthContext } from '../context/AuthContext';
import { Colors, globalStyles } from '../styles/theme';

import HomeScreen from '../screans/HomeScreen';
import LoginScreen from '../screans/LoginScreen';
import RegisterScreen from '../screans/RegisterScreen';
import GarageScreen from '../screans/GarageScreen';
import CarDetailsScreen from '../screans/CarDetailsScreen';
import RegisterMaintenanceScreen from '../screans/RegisterMaintenanceScreen';
import MaintenanceDetailsScreen from '../screans/MaintenanceDetailsScreen';
import ProfileScreen from '../screans/ProfileScreen';
import MyMaintenancesScreen from '../screans/MyMaintenancesScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
        tabBarStyle: {
            backgroundColor: '#1E1E50',
            height: 70,
            borderTopWidth: 0,
        },
        tabBarActiveTintColor: Colors.primario,
        tabBarInactiveTintColor: Colors.textoGris,
        headerStyle: { backgroundColor: '#191970' },
        headerTintColor: Colors.primario,
    }}
  >
    <Tab.Screen
        name="Catálogo"
        component={HomeScreen}
        options={{
            tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="car-search" color={color} size={size} />
            ),
        }}
    />
    <Tab.Screen
        name="Mi Garaje"
        component={GarageScreen}
        options={{
            tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="garage" color={color} size={size} />
            ),
        }}
    />
    <Tab.Screen
        name="Historial"
        component={MyMaintenancesScreen}
        options={{
            tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="calendar-clock" color={color} size={size} />
            ),
        }}
    />
    <Tab.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{
            tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="account" color={color} size={size} />
            ),
        }}
    />
  </Tab.Navigator>
);

const AppStack = () => (
    <Stack.Navigator screenOptions={{ 
        headerStyle: { backgroundColor: '#191970' },
        headerTintColor: Colors.primario,
        headerBackTitleVisible: false
    }}>
        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Details" component={CarDetailsScreen} options={{ title: 'Detalles del Vehículo' }} />
        <Stack.Screen name="MaintenanceDetails" component={MaintenanceDetailsScreen} options={{ title: 'Mantenimiento' }} />
        <Stack.Screen name="RegisterMaintenance" component={RegisterMaintenanceScreen} options={{ title: 'Registrar' }} />
    </Stack.Navigator>
);

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

export const RootNavigator = () => {
  const { token, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={globalStyles.center}>
        <ActivityIndicator size="large" color={Colors.primario} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {token ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

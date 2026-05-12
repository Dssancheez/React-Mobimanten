import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ActivityIndicator, View, Image, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuthContext } from '../context/AuthContext';
import { useGlobalStyles, useAppTheme } from '../styles/theme';

import HomeScreen from '../screans/HomeScreen';
import LoginScreen from '../screans/LoginScreen';
import RegisterScreen from '../screans/RegisterScreen';
import GarageScreen from '../screans/GarageScreen';
import CarDetailsScreen from '../screans/CarDetailsScreen';
import RegisterMaintenanceScreen from '../screans/RegisterMaintenanceScreen';
import MaintenanceDetailsScreen from '../screans/MaintenanceDetailsScreen';
import ProfileScreen from '../screans/ProfileScreen';
import MyMaintenancesScreen from '../screans/MyMaintenancesScreen';

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

const MainTabs = () => {
  const theme = useAppTheme();
  const Colors = theme.customColors;
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: Colors.fondo }}>
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center', 
        paddingVertical: 12,
        backgroundColor: Colors.fondo,
        borderBottomWidth: 0.5,
        borderBottomColor: Colors.tarjeta
      }}>
        <Text style={{ 
          fontSize: 26, 
          color: Colors.primario,
          fontFamily: Platform.OS === 'ios' ? 'Snell Roundhand' : 'serif',
          fontStyle: 'italic',
          letterSpacing: 0.5
        }}>
          MobiManten
        </Text>
      </View>
      <Tab.Navigator
        tabBarPosition="bottom"
        screenOptions={{
            tabBarStyle: {
                backgroundColor: Colors.tarjeta,
                height: 70,
                borderTopWidth: 0,
                elevation: 0,
            },
            tabBarActiveTintColor: Colors.primario,
            tabBarInactiveTintColor: Colors.textoGris,
            tabBarIndicatorStyle: { backgroundColor: Colors.primario, top: 0 },
            tabBarShowIcon: true,
            tabBarLabelStyle: { fontSize: 10, textTransform: 'none' },
        }}
      >
        <Tab.Screen
            name="Catálogo"
            component={HomeScreen}
            options={{
                tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name="car-search" color={color} size={24} />
                ),
            }}
        />
        <Tab.Screen
            name="Mi Garaje"
            component={GarageScreen}
            options={{
                tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name="garage" color={color} size={24} />
                ),
            }}
        />
        <Tab.Screen
            name="Historial"
            component={MyMaintenancesScreen}
            options={{
                tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name="calendar-clock" color={color} size={24} />
                ),
            }}
        />
        <Tab.Screen
            name="Perfil"
            component={ProfileScreen}
            options={{
                tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name="account" color={color} size={24} />
                ),
            }}
        />
      </Tab.Navigator>
    </View>
  );
};

const AppStack = () => {
    const theme = useAppTheme();
    const Colors = theme.customColors;

    return (
        <Stack.Navigator screenOptions={{ 
            headerStyle: { backgroundColor: Colors.fondo },
            headerTintColor: Colors.primario,
            headerBackTitleVisible: false,
            gestureEnabled: true,
            gestureDirection: 'horizontal',
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}>
            <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
            <Stack.Screen name="Details" component={CarDetailsScreen} options={{ title: 'Detalles del Vehículo' }} />
            <Stack.Screen name="MaintenanceDetails" component={MaintenanceDetailsScreen} options={{ title: 'Mantenimiento' }} />
            <Stack.Screen name="RegisterMaintenance" component={RegisterMaintenanceScreen} options={{ title: 'Registrar' }} />
        </Stack.Navigator>
    );
};

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ 
      headerShown: false,
      gestureEnabled: true,
      gestureDirection: 'horizontal',
  }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

export const RootNavigator = () => {
  const { token, isLoading } = useContext(AuthContext);
  const globalStyles = useGlobalStyles();
  const theme = useAppTheme();
  const Colors = theme.customColors;

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

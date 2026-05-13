import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ActivityIndicator, View, Image, Platform, useWindowDimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuthContext } from '../context/AuthContext';
import { useGlobalStyles, useAppTheme, useIsDesktop } from '../styles/theme';


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

const CatalogStack = () => {
    const theme = useAppTheme();
    const Colors = theme.customColors;
    const isWeb = Platform.OS === 'web';

    return (
        <Stack.Navigator screenOptions={{ 
            headerShown: true,
            headerStyle: { backgroundColor: Colors.fondo, elevation: 0, shadowOpacity: 0 },
            headerTintColor: Colors.primario,
            headerBackTitleVisible: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}>
            <Stack.Screen name="CatalogoHome" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="CarDetails" component={CarDetailsScreen} options={{ title: 'Detalles del Vehículo' }} />
            <Stack.Screen name="MaintenanceDetails" component={MaintenanceDetailsScreen} options={{ title: 'Mantenimiento' }} />
            <Stack.Screen name="RegisterMaintenance" component={RegisterMaintenanceScreen} options={{ title: 'Registrar' }} />
        </Stack.Navigator>
    );
};

const GarageStack = () => {
    const theme = useAppTheme();
    const Colors = theme.customColors;
    const isWeb = Platform.OS === 'web';

    return (
        <Stack.Navigator screenOptions={{ 
            headerShown: true,
            headerStyle: { backgroundColor: Colors.fondo, elevation: 0, shadowOpacity: 0 },
            headerTintColor: Colors.primario,
            headerBackTitleVisible: false,
        }}>
            <Stack.Screen name="GarageHome" component={GarageScreen} options={{ headerShown: false }} />
            <Stack.Screen name="CarDetails" component={CarDetailsScreen} options={{ title: 'Detalles' }} />
            <Stack.Screen name="MaintenanceDetails" component={MaintenanceDetailsScreen} options={{ title: 'Mantenimiento' }} />
            <Stack.Screen name="RegisterMaintenance" component={RegisterMaintenanceScreen} options={{ title: 'Registrar' }} />
        </Stack.Navigator>
    );
};

const MainTabs = () => {
  const theme = useAppTheme();
  const Colors = theme.customColors;
  const insets = useSafeAreaInsets();

  const isWeb = Platform.OS === 'web';
  const isDesktop = useIsDesktop();
  const { width } = useWindowDimensions();


  return (
    <View style={{ 
        flex: 1, 
        backgroundColor: Colors.fondo 
    }}>
      {isDesktop && (

        <View style={{ 
          height: 80, 
          backgroundColor: Colors.fondo, 
          flexDirection: 'row', 
          alignItems: 'center', 
          justifyContent: 'center',
          paddingHorizontal: 30,
          borderBottomWidth: 0.5,
          borderBottomColor: Colors.tarjeta,
          zIndex: 1000
        }}>
          <Text style={{ 
            fontSize: 32, 
            color: Colors.primario,
            fontFamily: Platform.OS === 'ios' ? 'Snell Roundhand' : 'serif',
            fontStyle: 'italic',
            letterSpacing: 0.5
          }}>
            MobiManten
          </Text>
        </View>
      )}

      {!isDesktop && (
        <View style={{ 
          flexDirection: 'row', 
          paddingTop: isWeb ? 20 : 50, 
          paddingBottom: 15, 
          paddingHorizontal: 20, 
          backgroundColor: Colors.fondo, 
          alignItems: 'center', 
          justifyContent: 'center',
          borderBottomWidth: 0.5,
          borderBottomColor: Colors.tarjeta,
        }}>
          <Text style={{ 
            fontSize: 28, 
            color: Colors.primario,
            fontFamily: Platform.OS === 'ios' ? 'Snell Roundhand' : 'serif',
            fontStyle: 'italic',
            fontWeight: 'bold',
            letterSpacing: 0.5
          }}>
            MobiManten
          </Text>
        </View>
      )}

      <View style={{ 
        flex: 1, 
        width: '100%', 
        backgroundColor: Colors.fondo
      }}>
        <Tab.Navigator
            tabBarPosition={isDesktop ? "top" : "bottom"}
            swipeEnabled={!isDesktop}
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: Colors.tarjeta,
                    height: isDesktop ? 65 : (isWeb ? 80 : 70),
                    borderTopWidth: 0,
                    borderBottomWidth: isDesktop ? 1 : 0,
                    borderBottomColor: Colors.tarjeta,
                    elevation: 0,
                    paddingTop: 5,
                    paddingBottom: !isDesktop && isWeb ? 15 : 0,
                },

                tabBarActiveTintColor: Colors.primario,
                tabBarInactiveTintColor: Colors.textoGris,
                tabBarIndicatorStyle: { 
                    backgroundColor: Colors.primario, 
                    top: isDesktop ? undefined : 0,
                    bottom: isDesktop ? 0 : undefined,
                    height: 3
                },

                tabBarShowIcon: true,
                tabBarLabelStyle: { fontSize: 10, textTransform: 'none', fontWeight: 'bold' },

            }}
        >
            <Tab.Screen
                name="Catálogo"
                component={CatalogStack}
                options={{
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="car-search" color={color} size={24} />
                    ),
                }}
            />
            <Tab.Screen
                name="Mi Garaje"
                component={GarageStack}
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
    </View>
  );
};

const AppStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Main" component={MainTabs} />
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

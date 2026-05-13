import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ActivityIndicator, View, Image, Platform, useWindowDimensions, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';


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
const BottomTab = createBottomTabNavigator();
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

const CustomWebTabBar = ({ state, descriptors, navigation }: any) => {
    const theme = useAppTheme();
    const Colors = theme.customColors;

    return (
        <View style={{ 
            height: 85, 
            backgroundColor: Colors.fondo, 
            flexDirection: 'row', 
            alignItems: 'center', 
            paddingHorizontal: 50,
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(255, 126, 0, 0.1)',
            zIndex: 1000
        }}>
            {/* Logo */}
            <TouchableOpacity onPress={() => navigation.navigate('Catálogo')} style={{ marginRight: 60 }}>
                <Text style={{ 
                    fontSize: 30, 
                    color: Colors.primario,
                    fontFamily: Platform.OS === 'ios' ? 'Snell Roundhand' : 'serif',
                    fontStyle: 'italic',
                    fontWeight: 'bold',
                    letterSpacing: 0.5
                }}>
                    MobiManten
                </Text>
            </TouchableOpacity>

            {/* Nav Links */}
            <View style={{ flexDirection: 'row', gap: 10, flex: 1 }}>
                {state.routes.map((route: any, index: number) => {
                    const { options } = descriptors[route.key];
                    const label = options.tabBarLabel !== undefined ? options.tabBarLabel : options.title !== undefined ? options.title : route.name;
                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    return (
                        <TouchableOpacity
                            key={index}
                            onPress={onPress}
                            style={{
                                paddingHorizontal: 20,
                                paddingVertical: 10,
                                borderRadius: 12,
                                backgroundColor: isFocused ? 'rgba(255, 126, 0, 0.08)' : 'transparent',
                            }}
                        >
                            <Text style={{ 
                                color: isFocused ? Colors.primario : Colors.textoGris,
                                fontWeight: 'bold',
                                fontSize: 15,
                                letterSpacing: 0.3
                            }}>
                                {label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Right side placeholder or Action button */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                <MaterialCommunityIcons name="bell-outline" size={24} color={Colors.textoGris} />
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.tarjeta, alignItems: 'center', justifyContent: 'center' }}>
                    <MaterialCommunityIcons name="account" size={24} color={Colors.primario} />
                </View>
            </View>
        </View>
    );
};

const MainTabs = () => {
  const theme = useAppTheme();
  const Colors = theme.customColors;
  const isWeb = Platform.OS === 'web';
  const isDesktop = useIsDesktop();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.fondo }}>
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

      <View style={{ flex: 1, width: '100%', backgroundColor: Colors.fondo }}>
        {isDesktop ? (
            <Tab.Navigator
                tabBar={props => <CustomWebTabBar {...props} />}
                tabBarPosition="top"
                swipeEnabled={false}
                screenOptions={{
                    tabBarShowIcon: true,
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
        ) : (
            <BottomTab.Navigator
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: {
                        backgroundColor: Colors.tarjeta,
                        height: isWeb ? 85 : 70,
                        borderTopWidth: 0,
                        paddingTop: 10,
                        paddingBottom: isWeb ? 25 : 10,
                        position: isWeb ? 'absolute' : 'relative',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        zIndex: 1000,
                        elevation: 5,
                    },

                    tabBarActiveTintColor: Colors.primario,
                    tabBarInactiveTintColor: Colors.textoGris,
                    tabBarLabelStyle: { fontSize: 12, fontWeight: 'bold' },
                }}
            >
                <BottomTab.Screen
                    name="Catálogo"
                    component={CatalogStack}
                    options={{
                        tabBarIcon: ({ color }) => (
                            <MaterialCommunityIcons name="car-search" color={color} size={26} />
                        ),
                    }}
                />
                <BottomTab.Screen
                    name="Mi Garaje"
                    component={GarageStack}
                    options={{
                        tabBarIcon: ({ color }) => (
                            <MaterialCommunityIcons name="garage" color={color} size={26} />
                        ),
                    }}
                />
                <BottomTab.Screen
                    name="Historial"
                    component={MyMaintenancesScreen}
                    options={{
                        tabBarIcon: ({ color }) => (
                            <MaterialCommunityIcons name="calendar-clock" color={color} size={26} />
                        ),
                    }}
                />
                <BottomTab.Screen
                    name="Perfil"
                    component={ProfileScreen}
                    options={{
                        tabBarIcon: ({ color }) => (
                            <MaterialCommunityIcons name="account" color={color} size={26} />
                        ),
                    }}
                />
            </BottomTab.Navigator>
        )}
      </View>

    </SafeAreaView>

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

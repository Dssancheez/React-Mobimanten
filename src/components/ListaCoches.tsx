import React from 'react';
import {FlatList, RefreshControl, Platform, useWindowDimensions} from 'react-native';
import { Card, Text } from 'react-native-paper';
import { Coche } from '../graphql/queries';
import { useAppTheme } from '../styles/theme';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View } from 'react-native';

interface ListaProps {
    navigation: any;
    coches: Coche[];
    refetch: () => Promise<any>;
}

export const ListaCoches = ({ navigation, coches, refetch }: ListaProps) => {
    const [refreshing, setRefreshing] = React.useState(false);
    const theme = useAppTheme();
    const Colors = theme.customColors;
    const { width } = useWindowDimensions();

    // Determinar número de columnas según el ancho de pantalla en web
    const getNumColumns = () => {
        if (Platform.OS !== 'web') return 1;
        if (width > 900) return 3;
        if (width > 600) return 2;
        return 1;
    };

    const numColumns = getNumColumns();

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await refetch();
        } catch (e) {
            console.error("Error al refrescar:", e);
        }
        setRefreshing(false);
    };

    return (
        <FlatList
            data={coches}
            keyExtractor={(item) => item.id}
            key={numColumns} // Re-renderizar cuando cambie el número de columnas
            numColumns={numColumns}
            contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: Platform.OS === 'web' ? 8 : 0 }}
            columnWrapperStyle={numColumns > 1 ? { justifyContent: 'flex-start' } : undefined}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor={theme.colors.text}
                    colors={[Colors.primario]}
                />
            }
            renderItem={({ item }) => {
                const imagenSource = item.imagen
                    ? { uri: item.imagen }
                    : require('../../assets/images/logo.png');

                return (
                    <Card
                        style={{ 
                            flex: 1 / numColumns,
                            marginHorizontal: Platform.OS === 'web' ? 15 : 8, 
                            marginVertical: Platform.OS === 'web' ? 20 : 10, 
                            backgroundColor: Colors.tarjeta,
                            elevation: 4,
                            borderRadius: 12,
                            overflow: 'hidden',
                            maxWidth: Platform.OS === 'web' && numColumns === 1 ? 600 : 'none',
                            alignSelf: Platform.OS === 'web' && numColumns === 1 ? 'center' : 'auto',
                            width: Platform.OS === 'web' && numColumns === 1 ? '100%' : 'auto'
                        }}
                        onPress={() => navigation.navigate('CarDetails', { cocheId: item.id })}
                    >
                        <Card.Cover
                            source={imagenSource}
                            resizeMode="cover"
                            style={{ 
                                height: Platform.OS === 'web' ? 280 : 180, 
                                backgroundColor: Colors.fondo,
                                borderBottomLeftRadius: 0, 
                                borderBottomRightRadius: 0 
                            }}
                        />
                        <Card.Title
                            title={`${item.marca} ${item.modelo}`}
                            subtitle={`${item.motor} • Año ${item.anio}`}
                            titleStyle={{ color: Colors.primario, fontWeight: 'bold', fontSize: 18 }}
                            subtitleStyle={{ color: Colors.textoGris }}
                        />
                    </Card>
                );
            }}
            ListEmptyComponent={
                <View style={{ flex: 1, alignItems: 'center', marginTop: 50 }}>
                    <MaterialCommunityIcons name="car-off" size={60} color={Colors.textoGris} />
                    <Text style={{ textAlign: 'center', marginTop: 10, color: Colors.textoGris, fontSize: 16 }}>
                        No se han encontrado vehículos.
                    </Text>
                </View>
            }
        />
    );
};
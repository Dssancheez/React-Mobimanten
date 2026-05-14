import React from 'react';
import {FlatList, RefreshControl, Platform, useWindowDimensions} from 'react-native';
import { Card, Text } from 'react-native-paper';
import { Coche } from '../graphql/queries';
import { useAppTheme, useIsDesktop, useGlobalStyles } from '../styles/theme';


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
    const isDesktop = useIsDesktop();


    // Determinar número de columnas según el ancho de pantalla en web
    const getNumColumns = () => {
        if (!isDesktop) return 1;
        if (width > 1200) return 3;
        if (width > 800) return 2;
        return 2;
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

    const globalStyles = useGlobalStyles();

    return (
        <FlatList
            data={coches}
            keyExtractor={(item) => item.id}
            key={numColumns}
            numColumns={numColumns}
            contentContainerStyle={[
                globalStyles.webMaxWidth, 
                { paddingBottom: 60, alignSelf: 'center' }
            ]}
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
                            marginLeft: isDesktop ? 15 : 8, 
                            marginRight: isDesktop ? 5 : 8,
                            marginVertical: isDesktop ? 20 : 10, 
                            backgroundColor: Colors.tarjeta,
                            elevation: 4,
                            borderRadius: 12,
                            overflow: 'hidden',
                            maxWidth: isDesktop && numColumns === 1 ? 600 : 'none',
                            alignSelf: isDesktop && numColumns === 1 ? 'center' : 'auto',
                            width: isDesktop && numColumns === 1 ? '100%' : 'auto'
                        }}

                        onPress={() => navigation.navigate('CarDetails', { cocheId: item.id })}
                    >
                        <Card.Cover
                            source={imagenSource}
                            resizeMode="contain"
                            style={{ 
                                height: isDesktop ? 320 : 180, 
                                backgroundColor: Colors.fondo,
                                borderBottomLeftRadius: 0, 
                                borderBottomRightRadius: 0 
                            }}
                        />
                        <Card.Title
                            title={`${item.marca} ${item.modelo}`}
                            subtitle={`${item.motor} • ${item.combustible} • Año ${item.anio}`}
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
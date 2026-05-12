import React from 'react';
import {FlatList, RefreshControl} from 'react-native';
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
            contentContainerStyle={{ paddingBottom: 20 }}
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
                            marginHorizontal: 16, 
                            marginVertical: 10, 
                            backgroundColor: Colors.tarjeta,
                            elevation: 4,
                            borderRadius: 12,
                            overflow: 'hidden'
                        }}
                        onPress={() => navigation.navigate('Details', { cocheId: item.id })}
                    >
                        <Card.Cover
                            source={imagenSource}
                            style={{ height: 180, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
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
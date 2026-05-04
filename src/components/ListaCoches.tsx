import React from 'react';
import {FlatList, RefreshControl} from 'react-native';
import { Card, Text } from 'react-native-paper';
import { Coche } from '../graphql/queries';

interface ListaProps {
    navigation: any;
    coches: Coche[];
    refetch: () => Promise<any>;
}

export const ListaCoches = ({ navigation, coches, refetch }: ListaProps) => {
    const [refreshing, setRefreshing] = React.useState(false);

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
                    tintColor="white"
                    colors={['#1E1E50']}
                />
            }
            renderItem={({ item }) => {
                const imagenSource = item.imagen
                    ? { uri: item.imagen }
                    : require('../../assets/images/logo.jpeg');

                return (
                    <Card
                        style={{ marginHorizontal: 16, marginVertical: 8, backgroundColor: '#1E1E50' }}
                        onPress={() => navigation.navigate('Details', { cocheId: item.id })}
                    >
                        <Card.Cover
                            source={imagenSource}
                            style={{ height: 180, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
                        />
                        <Card.Title
                            title={`${item.marca} ${item.modelo}`}
                            subtitle={`${item.motor} • Año ${item.anio}`}
                            titleStyle={{ color: 'white', fontWeight: 'bold' }}
                            subtitleStyle={{ color: '#B0C4DE' }}
                        />
                    </Card>
                );
            }}
            ListEmptyComponent={
                <Text style={{ textAlign: 'center', marginTop: 20, color: '#B0C4DE' }}>
                    No se han encontrado vehículos.
                </Text>
            }
        />
    );
};
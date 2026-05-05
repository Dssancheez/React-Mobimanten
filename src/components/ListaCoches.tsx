import React from 'react';
import {FlatList, RefreshControl} from 'react-native';
import { Card, Text } from 'react-native-paper';
import { Coche } from '../graphql/queries';
import { useAppTheme } from '../styles/theme';

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
                    : require('../../assets/images/logo.jpeg');

                return (
                    <Card
                        style={{ marginHorizontal: 16, marginVertical: 8, backgroundColor: Colors.tarjeta }}
                        onPress={() => navigation.navigate('Details', { cocheId: item.id })}
                    >
                        <Card.Cover
                            source={imagenSource}
                            style={{ height: 180, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
                        />
                        <Card.Title
                            title={`${item.marca} ${item.modelo}`}
                            subtitle={`${item.motor} • Año ${item.anio}`}
                            titleStyle={{ color: theme.colors.text, fontWeight: 'bold' }}
                            subtitleStyle={{ color: Colors.textoGris }}
                        />
                    </Card>
                );
            }}
            ListEmptyComponent={
                <Text style={{ textAlign: 'center', marginTop: 20, color: Colors.textoGris }}>
                    No se han encontrado vehículos.
                </Text>
            }
        />
    );
};
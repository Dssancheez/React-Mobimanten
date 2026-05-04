import React, { useContext, useState } from 'react';
import { View, ActivityIndicator, FlatList, RefreshControl, StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { useQuery } from '@apollo/client/react';
import { GET_MI_GARAJE, Garaje } from '../graphql/queries';
import { AuthContext } from '../context/AuthContext';
import { Colors, globalStyles } from '../styles/theme';

const GarageScreen = ({ navigation }: any) => {
    const { usuario } = useContext(AuthContext);
    const [refreshing, setRefreshing] = useState(false);

    const { data, loading, error, refetch } = useQuery<{ obtenerMiGaraje: Garaje[] }>(
        GET_MI_GARAJE,
        { variables: { usuarioId: usuario?.id }, skip: !usuario?.id }
    );

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await refetch();
        } catch (e) {
            console.error("Error al refrescar:", e);
        }
        setRefreshing(false);
    };

    if (loading) return (
        <View style={globalStyles.center}>
            <ActivityIndicator size="large" color={Colors.primario}/>
        </View>
    );

    if (error) return (
        <View style={globalStyles.center}>
            <Text style={{color: Colors.error}}>
                Error al cargar tu garaje: {error.message}
            </Text>
        </View>
    )

    const garajeItems = data?.obtenerMiGaraje || [];

    return (
        <View style={globalStyles.container}>
            <View style={{ padding: 16 }}>
                <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>
                    Tus vehículos guardados
                </Text>
            </View>
            <FlatList
                data={garajeItems}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 20 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="white"
                        colors={[Colors.primario]}
                    />
                }
                renderItem={({ item }) => {
                    const imagenSource = item.coche.imagen
                        ? { uri: item.coche.imagen }
                        : require('../../assets/images/logo.jpeg');

                    return (
                        <Card
                            style={styles.card}
                            onPress={() => navigation.navigate('Details', { cocheId: item.coche.id })}
                        >
                            <Card.Cover
                                source={imagenSource}
                                style={styles.cardImage}
                            />
                            <Card.Content style={styles.cardContent}>
                                <Text style={styles.apodo}>{item.apodo}</Text>
                                <Text style={styles.cocheDetails}>
                                    {item.coche.marca} {item.coche.modelo} • {item.coche.motor}
                                </Text>
                            </Card.Content>
                        </Card>
                    );
                }}
                ListEmptyComponent={
                    <Text style={{ textAlign: 'center', marginTop: 20, color: '#B0C4DE', fontSize: 16 }}>
                        No tienes ningún coche guardado. ¡Ve al catálogo y añade uno!
                    </Text>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        marginHorizontal: 16, 
        marginVertical: 8, 
        backgroundColor: '#1E1E50',
    },
    cardImage: {
        height: 200, 
        borderBottomLeftRadius: 0, 
        borderBottomRightRadius: 0 
    },
    cardContent: {
        paddingTop: 15,
        paddingBottom: 15,
    },
    apodo: {
        color: '#FF8C00', 
        fontWeight: 'bold', 
        fontSize: 26,
        marginBottom: 5,
    },
    cocheDetails: {
        color: '#B0C4DE',
        fontSize: 16,
    }
});

export default GarageScreen;

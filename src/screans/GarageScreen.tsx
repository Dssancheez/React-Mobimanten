import React, { useContext, useState } from 'react';
import { View, ActivityIndicator, FlatList, RefreshControl, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuery } from '@apollo/client/react';
import { GET_MI_GARAJE, Garaje } from '../graphql/queries';
import { AuthContext } from '../context/AuthContext';
import { useGlobalStyles, useAppTheme, useIsDesktop } from '../styles/theme';


const GarageScreen = ({ navigation }: any) => {
    const { usuario } = useContext(AuthContext);
    const [refreshing, setRefreshing] = useState(false);
    const globalStyles = useGlobalStyles();
    const theme = useAppTheme();
    const Colors = theme.customColors;
    const { width } = useWindowDimensions();
    const isDesktop = useIsDesktop();


    const getNumColumns = () => {
        if (!isDesktop) return 1;
        if (width > 1200) return 3;
        if (width > 800) return 2;
        return 2; // Default for desktop below 800 but above 768
    };


    const numColumns = getNumColumns();

    const styles = StyleSheet.create({
        card: {
            marginHorizontal: isDesktop ? 15 : 8, 
            marginVertical: isDesktop ? 15 : 8, 
            backgroundColor: Colors.tarjeta,
            flex: 1,
        },

        cardImage: {
            height: isDesktop ? 320 : 200, 
            backgroundColor: Colors.fondo,
            borderBottomLeftRadius: 0, 
            borderBottomRightRadius: 0 
        },
        cardContent: {
            paddingTop: 15,
            paddingBottom: 15,
        },
        apodo: {
            color: Colors.textoPrincipal, 
            fontWeight: 'bold', 
            fontSize: 26,
            marginBottom: 5,
        },
        cocheDetails: {
            color: Colors.textoGris,
            fontSize: 16,
        }
    });

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
            <View style={globalStyles.webMaxWidth}>
                <View style={{ paddingVertical: isDesktop ? 40 : 20 }}>
                    <Text style={[globalStyles.tituloPrincipal, { marginBottom: 5 }]}>
                        Mi Garaje
                    </Text>
                    {isDesktop && (
                        <Text style={{ color: Colors.textoGris, fontSize: 18 }}>
                            Gestiona tus vehículos y sus mantenimientos inteligentes.
                        </Text>
                    )}
                </View>
                <FlatList
                    data={garajeItems}
                    keyExtractor={(item) => item.id}
                    key={numColumns}
                    numColumns={numColumns}
                    contentContainerStyle={{ paddingBottom: 60 }}

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
                    const imagenSource = item.coche.imagen
                        ? { uri: item.coche.imagen }
                        : require('../../assets/images/logo.png');

                    return (
                        <Card
                            style={[
                                styles.card,
                                isDesktop && numColumns === 1 && { maxWidth: 600, alignSelf: 'center', width: '100%' }
                            ]}

                            onPress={() => navigation.navigate('CarDetails', { cocheId: item.coche.id })}
                        >
                            <Card.Cover
                                source={imagenSource}
                                resizeMode="cover"
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
                    <View style={{ flex: 1, alignItems: 'center', marginTop: 50, paddingHorizontal: 40 }}>
                        <MaterialCommunityIcons name="garage-open" size={80} color={Colors.textoGris} />
                        <Text style={{ textAlign: 'center', marginTop: 20, color: Colors.textoGris, fontSize: 16 }}>
                            No tienes ningún coche guardado. ¡Ve al catálogo y añade uno!
                        </Text>
                    </View>
                }
            />
            </View>
        </View>
    );
};

export default GarageScreen;

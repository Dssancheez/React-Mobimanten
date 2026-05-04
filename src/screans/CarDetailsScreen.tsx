import React, { useState, useContext, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Image, ActivityIndicator, Alert } from 'react-native';
import { Text, Card, Button, Divider, IconButton, Modal, TextInput as PaperInput, Portal } from 'react-native-paper';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_COCHES, GET_MANTENIMIENTOS, GET_MI_GARAJE, Coche, Mantenimiento } from '../graphql/queries';
import { ANADIR_COCHE_GARAJE, ELIMINAR_COCHE_GARAJE } from '../graphql/mutations';
import { AuthContext } from '../context/AuthContext';
import { Colors, globalStyles } from '../styles/theme';

const CarDetailsScreen = ({ route, navigation }: any) => {
    const { cocheId } = route.params;
    const { usuario } = useContext(AuthContext);

    const [modalVisible, setModalVisible] = useState(false);
    const [apodo, setApodo] = useState('');

    // Fetch lists
    const { data: cochesData } = useQuery<{ getCoches: Coche[] }>(GET_COCHES);
    const coche = cochesData?.getCoches.find(c => c.id === cocheId);

    const { data: mantData, loading: mantLoading } = useQuery<{ obtenerMantenimientosPorCoche: Mantenimiento[] }>(
        GET_MANTENIMIENTOS,
        { variables: { cocheId } }
    );

    const { data: garajeData } = useQuery(GET_MI_GARAJE, {
        variables: { usuarioId: usuario?.id },
        skip: !usuario?.id,
        fetchPolicy: 'cache-and-network',
    });

    // Check if the car is already in favorites safely
    const isFavorito = garajeData?.obtenerMiGaraje?.some((g: any) => String(g.coche.id) === String(cocheId));

    const [anadirGaraje, { loading: adding }] = useMutation(ANADIR_COCHE_GARAJE, {
        refetchQueries: [
            { query: GET_MI_GARAJE, variables: { usuarioId: usuario?.id } }
        ]
    });

    const [eliminarGaraje, { loading: removing }] = useMutation(ELIMINAR_COCHE_GARAJE, {
        refetchQueries: [
            { query: GET_MI_GARAJE, variables: { usuarioId: usuario?.id } }
        ]
    });

    useEffect(() => {
        if (coche) setApodo(`${coche.marca} ${coche.modelo}`);
    }, [coche]);

    const handleOpenModal = async () => {
        if (isFavorito) {
            try {
                await eliminarGaraje({
                    variables: {
                        usuarioId: usuario?.id,
                        cocheId: cocheId
                    }
                });
                Alert.alert("Aviso", "El vehículo se ha eliminado de tu garaje.");
            } catch (e) {
                console.error(e);
                Alert.alert("Error", "No se pudo eliminar el vehículo.");
            }
        } else {
            setModalVisible(true);
        }
    };

    const handleConfirmAdd = async () => {
        try {
            await anadirGaraje({
                variables: {
                    usuarioId: usuario?.id,
                    cocheId: cocheId,
                    apodo: apodo || `${coche?.marca} ${coche?.modelo}`
                }
            });
            setModalVisible(false);
            Alert.alert("Éxito", "El vehículo se ha añadido a tu garaje.");
        } catch (e) {
            console.error(e);
            Alert.alert("Error", "No se pudo añadir al garaje.");
        }
    };

    if (!coche) return (
        <View style={globalStyles.center}><Text style={{color:'white'}}>Coche no encontrado.</Text></View>
    );

    const mantenimientos = mantData?.obtenerMantenimientosPorCoche || [];
    const imagenSource = coche.imagen ? { uri: coche.imagen } : require('../../assets/images/logo.jpeg');

    return (
        <View style={{flex: 1}}>
            <ScrollView style={globalStyles.container} contentContainerStyle={{ paddingBottom: 40 }}>
                <Image source={imagenSource} style={styles.image} />
                
                <View style={styles.headerInfo}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.title}>{coche.marca} {coche.modelo}</Text>
                        <Text style={styles.subtitle}>{coche.motor} • Año {coche.anio}</Text>
                    </View>
                    <IconButton
                        icon={isFavorito ? "star" : "star-outline"}
                        iconColor={isFavorito ? "#FFD700" : Colors.primario}
                        size={35}
                        onPress={handleOpenModal}
                        disabled={adding || removing}
                    />
                </View>

                <Divider style={styles.divider} />

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Mantenimientos Recomendados</Text>
                    
                    {mantLoading ? (
                        <ActivityIndicator color={Colors.primario} style={{marginTop: 20}} />
                    ) : mantenimientos.length === 0 ? (
                        <Text style={styles.noData}>No hay mantenimientos registrados por el fabricante.</Text>
                    ) : (
                        mantenimientos.map((mant) => (
                            <Card key={mant.id} style={styles.card}>
                                <Card.Content>
                                    <Text style={styles.cardTitle}>{mant.tarea}</Text>
                                    <Text style={styles.cardSubtitle}>
                                        {mant.intervaloKm ? `Cada ${mant.intervaloKm} km` : ''} 
                                        {mant.intervaloKm && mant.intervaloMeses ? ' / ' : ''} 
                                        {mant.intervaloMeses ? `${mant.intervaloMeses} meses` : ''}
                                    </Text>
                                </Card.Content>
                                <Card.Actions>
                                    <Button 
                                        mode="contained" 
                                        buttonColor={Colors.primario}
                                        onPress={() => navigation.navigate('MaintenanceDetails', { cocheId, mant })}
                                    >
                                        Ver Detalles
                                    </Button>
                                </Card.Actions>
                            </Card>
                        ))
                    )}
                </View>
            </ScrollView>

            <Portal>
                <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modalContent}>
                    <Text style={styles.modalTitle}>Añadir al Garaje</Text>
                    <Text style={styles.modalSubtitle}>Ponle un apodo a tu vehículo (ej. Coche de familia, El de trabajo...)</Text>
                    <PaperInput
                        label="Apodo"
                        value={apodo}
                        onChangeText={setApodo}
                        mode="outlined"
                        style={{backgroundColor: '#191970', marginBottom: 20}}
                        textColor="white"
                        outlineColor={Colors.textoGris}
                        activeOutlineColor={Colors.primario}
                    />
                    <View style={styles.modalButtons}>
                        <Button mode="text" textColor={Colors.textoGris} onPress={() => setModalVisible(false)}>Cancelar</Button>
                        <Button mode="contained" buttonColor={Colors.primario} onPress={handleConfirmAdd} loading={adding}>
                            Guardar
                        </Button>
                    </View>
                </Modal>
            </Portal>
        </View>
    );
};

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: 250,
    },
    headerInfo: {
        flexDirection: 'row',
        padding: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#191970',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        marginBottom: 10,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: 'white',
    },
    subtitle: {
        fontSize: 16,
        color: '#B0C4DE',
        marginTop: 5,
    },
    divider: {
        backgroundColor: '#1E1E50',
        height: 2,
        marginHorizontal: 20,
    },
    section: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 15,
    },
    noData: {
        color: Colors.textoGris,
        fontStyle: 'italic',
    },
    card: {
        backgroundColor: '#1E1E50',
        marginBottom: 15,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 14,
        color: Colors.textoGris,
    },
    modalContent: {
        backgroundColor: '#1E1E50',
        padding: 20,
        margin: 20,
        borderRadius: 12,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
    },
    modalSubtitle: {
        fontSize: 14,
        color: '#B0C4DE',
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10
    }
});

export default CarDetailsScreen;

import React, { useState, useContext, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Image, ActivityIndicator, Alert } from 'react-native';
import { Text, Card, Button, Divider, IconButton, Modal, TextInput as PaperInput, Portal, List } from 'react-native-paper';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_COCHES, GET_MANTENIMIENTOS, GET_MI_GARAJE, Coche, Mantenimiento } from '../graphql/queries';
import { ANADIR_COCHE_GARAJE, ELIMINAR_COCHE_GARAJE } from '../graphql/mutations';
import { AuthContext } from '../context/AuthContext';
import { useGlobalStyles, useAppTheme } from '../styles/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const CarDetailsScreen = ({ route, navigation }: any) => {
    const { cocheId } = route.params;
    const { usuario } = useContext(AuthContext);
    const globalStyles = useGlobalStyles();
    const theme = useAppTheme();
    const Colors = theme.customColors;

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
            backgroundColor: Colors.fondo,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            marginBottom: 10,
        },
        title: {
            fontSize: 26,
            fontWeight: 'bold',
            color: theme.colors.text,
        },
        detailRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 8,
        },
        subtitle: {
            fontSize: 16,
            color: Colors.textoGris,
            marginLeft: 5,
            marginRight: 15,
        },
        divider: {
            backgroundColor: Colors.tarjeta,
            height: 2,
            marginHorizontal: 20,
        },
        section: {
            padding: 20,
        },
        sectionTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: 15,
        },
        noData: {
            color: Colors.textoGris,
            fontStyle: 'italic',
        },
        card: {
            backgroundColor: Colors.tarjeta,
            marginBottom: 15,
            elevation: 4,
            borderRadius: 12,
        },
        cardTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: 4,
        },
        cardSubtitle: {
            fontSize: 14,
            color: Colors.textoGris,
        },
        modalContent: {
            backgroundColor: Colors.tarjeta,
            padding: 20,
            margin: 20,
            borderRadius: 12,
        },
        modalTitle: {
            fontSize: 22,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: 10,
        },
        modalSubtitle: {
            fontSize: 14,
            color: Colors.textoGris,
            marginBottom: 20,
        },
        modalButtons: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            gap: 10
        }
    });

    const [modalVisible, setModalVisible] = useState(false);
    const [apodo, setApodo] = useState('');

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
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Medium);
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
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setModalVisible(false);
            Alert.alert("Éxito", "El vehículo se ha añadido a tu garaje.");
        } catch (e) {
            console.error(e);
            Alert.alert("Error", "No se pudo añadir al garaje.");
        }
    };

    if (!coche) return (
        <View style={globalStyles.center}><Text style={{ color: theme.colors.text }}>Coche no encontrado.</Text></View>
    );

    const mantenimientos = mantData?.obtenerMantenimientosPorCoche || [];
    const imagenSource = coche.imagen ? { uri: coche.imagen } : require('../../assets/images/logo.png');

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={globalStyles.container} contentContainerStyle={{ paddingBottom: 40 }}>
                <Image source={imagenSource} style={styles.image} />

                <View style={styles.headerInfo}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.title}>{coche.marca} {coche.modelo}</Text>
                        <View style={styles.detailRow}>
                            <MaterialCommunityIcons name="engine-outline" size={18} color={Colors.primario} />
                            <Text style={styles.subtitle}>{coche.motor}</Text>

                            <MaterialCommunityIcons name="calendar-range" size={18} color={Colors.primario} />
                            <Text style={styles.subtitle}>{coche.anio}</Text>
                        </View>
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
                        <ActivityIndicator color={Colors.primario} style={{ marginTop: 20 }} />
                    ) : mantenimientos.length === 0 ? (
                        <Text style={styles.noData}>No hay mantenimientos registrados por el fabricante.</Text>
                    ) : (
                        (() => {
                            const categorias = {
                                Motor: [] as Mantenimiento[],
                                Neumaticos: [] as Mantenimiento[],
                                Otros: [] as Mantenimiento[],
                            };

                            mantenimientos.forEach((mant: Mantenimiento) => {
                                const tareaLower = mant.tarea.toLowerCase();
                                if (tareaLower.includes('aceite') || tareaLower.includes('correa') || tareaLower.includes('refrigerante') || tareaLower.includes('motor') || tareaLower.includes('bujía') || tareaLower.includes('bujias') || tareaLower.includes('bujia') || tareaLower.includes('filtro')) {
                                    categorias.Motor.push(mant);
                                } else if (tareaLower.includes('neumático') || tareaLower.includes('neumatico') || tareaLower.includes('llanta') || tareaLower.includes('rueda')) {
                                    categorias.Neumaticos.push(mant);
                                } else {
                                    categorias.Otros.push(mant);
                                }
                            });

                            const renderCard = (mant: Mantenimiento) => (
                                <Card key={mant.id} style={styles.card}>
                                    <Card.Content>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                                            <MaterialCommunityIcons name="tools" size={20} color={Colors.primario} style={{ marginRight: 10 }} />
                                            <Text style={styles.cardTitle}>{mant.tarea}</Text>
                                        </View>
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
                                            onPress={() => {
                                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                                const garajeItem = garajeData?.obtenerMiGaraje?.find((g: any) => String(g.coche.id) === String(cocheId));
                                                navigation.navigate('MaintenanceDetails', { 
                                                    cocheId, 
                                                    cocheGarajeId: garajeItem?.id,
                                                    mant 
                                                });
                                            }}
                                        >
                                            Ver Detalles
                                        </Button>
                                    </Card.Actions>
                                </Card>
                            );

                            return (
                                <List.Section>
                                    {categorias.Motor.length > 0 && (
                                        <List.Accordion
                                            title="Mantenimientos de Motor"
                                            left={props => <List.Icon {...props} icon="engine" color={Colors.primario} />}
                                            titleStyle={{ color: theme.colors.text, fontWeight: 'bold' }}
                                            theme={{ colors: { background: 'transparent' } }}
                                        >
                                            {categorias.Motor.map(renderCard)}
                                        </List.Accordion>
                                    )}
                                    {categorias.Neumaticos.length > 0 && (
                                        <List.Accordion
                                            title="Neumáticos y Ruedas"
                                            left={props => <List.Icon {...props} icon="tire" color={Colors.primario} />}
                                            titleStyle={{ color: theme.colors.text, fontWeight: 'bold' }}
                                            theme={{ colors: { background: 'transparent' } }}
                                        >
                                            {categorias.Neumaticos.map(renderCard)}
                                        </List.Accordion>
                                    )}
                                    {categorias.Otros.length > 0 && (
                                        <List.Accordion
                                            title="Otros Mantenimientos"
                                            left={props => <List.Icon {...props} icon="tools" color={Colors.primario} />}
                                            titleStyle={{ color: theme.colors.text, fontWeight: 'bold' }}
                                            theme={{ colors: { background: 'transparent' } }}
                                        >
                                            {categorias.Otros.map(renderCard)}
                                        </List.Accordion>
                                    )}
                                </List.Section>
                            );
                        })()
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
                        style={{ backgroundColor: Colors.fondo, marginBottom: 20 }}
                        textColor={theme.colors.text}
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

export default CarDetailsScreen;

import React, { useState, useContext, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Image, ActivityIndicator, Alert } from 'react-native';
import { Text, Card, Button, Divider, IconButton, Modal, TextInput as PaperInput, Portal, List } from 'react-native-paper';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_COCHES, GET_MANTENIMIENTOS, GET_MI_GARAJE, Coche, Mantenimiento } from '../graphql/queries';
import { ANADIR_COCHE_GARAJE, ELIMINAR_COCHE_GARAJE } from '../graphql/mutations';
import { AuthContext } from '../context/AuthContext';
import { useGlobalStyles, useAppTheme, useIsDesktop } from '../styles/theme';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { ResponsiveContainer } from '../components/ResponsiveContainer';
import { Platform, useWindowDimensions } from 'react-native';

const CarDetailsScreen = ({ route, navigation }: any) => {
    const { cocheId } = route.params;
    const { usuario } = useContext(AuthContext);
    const globalStyles = useGlobalStyles();
    const theme = useAppTheme();
    const Colors = theme.customColors;
    const { width } = useWindowDimensions();
    const isDesktop = useIsDesktop();


    const styles = StyleSheet.create({
        image: {
            width: '100%',
            height: 250,
            backgroundColor: Colors.fondo,
        },
        webHero: {
            flexDirection: 'row',
            padding: 30,
            backgroundColor: Colors.tarjeta,
            borderRadius: 20,
            margin: isDesktop ? 30 : 20,

            elevation: 8,
            alignItems: 'center',
            gap: 40,
        },
        webImage: {
            width: 400,
            height: 250,
            borderRadius: 15,
        },
        webSpecs: {
            flex: 1,
            justifyContent: 'center',
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
            fontSize: isDesktop ? 32 : 26,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: isDesktop ? 10 : 5,
        },

        detailRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 4,
            gap: isDesktop ? 15 : 10,
        },

        specBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 126, 0, 0.1)',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 8,
        },
        subtitle: {
            fontSize: 16,
            color: Colors.textoGris,
            marginLeft: 5,
        },
        section: {
            padding: 20,
        },
        sectionTitle: {
            fontSize: 24,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: 20,
            marginTop: 10,
            borderLeftWidth: 4,
            borderLeftColor: Colors.primario,
            paddingLeft: 15,
        },
        card: {
            backgroundColor: Colors.tarjeta,
            marginBottom: 15,
            elevation: 4,
            borderRadius: 12,
            width: isDesktop ? (width > 1600 ? '23.5%' : width > 1100 ? '31.5%' : '48%') : '100%',
            marginRight: isDesktop ? '1.5%' : 0,

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

    const [expandedId, setExpandedId] = useState<string | number>('motor');

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
            <ResponsiveContainer contentContainerStyle={{ paddingBottom: 40 }}>
                {isDesktop ? (

                    <View style={styles.webHero}>
                        <Image 
                            source={imagenSource} 
                            style={styles.webImage} 
                            resizeMode="cover" 
                        />
                        <View style={styles.webSpecs}>
                            <Text style={styles.title}>{coche.marca} {coche.modelo}</Text>
                            <View style={styles.detailRow}>
                                <View style={styles.specBadge}>
                                    <MaterialCommunityIcons name="engine-outline" size={20} color={Colors.primario} />
                                    <Text style={styles.subtitle}>{coche.motor}</Text>
                                </View>
                                <View style={styles.specBadge}>
                                    <MaterialCommunityIcons name="calendar-range" size={20} color={Colors.primario} />
                                    <Text style={styles.subtitle}>{coche.anio}</Text>
                                </View>
                            </View>
                            <View style={{ marginTop: 25 }}>
                                <Button
                                    mode="contained"
                                    buttonColor={isFavorito ? "#FFD700" : Colors.primario}
                                    icon={isFavorito ? "star" : "star-plus"}
                                    onPress={handleOpenModal}
                                    disabled={adding || removing}
                                    style={{ width: 250, borderRadius: 10 }}
                                >
                                    {isFavorito ? "Eliminar del Garaje" : "Añadir a mi Garaje"}
                                </Button>
                            </View>
                        </View>
                    </View>
                ) : (
                    <>
                        <Image 
                            source={imagenSource} 
                            style={styles.image} 
                            resizeMode="cover" 
                        />
                        <View style={styles.headerInfo}>
                            <View style={{ flex: 1, paddingRight: 10 }}>
                                <Text style={styles.title} numberOfLines={2}>{coche.marca} {coche.modelo}</Text>
                                <View style={styles.detailRow}>
                                    <MaterialCommunityIcons name="engine-outline" size={18} color={Colors.primario} />
                                    <Text style={styles.subtitle}>{coche.motor}</Text>
                                    <View style={{ width: 10 }} />
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
                        <Divider style={{ backgroundColor: Colors.tarjeta, height: 2, marginHorizontal: 20 }} />
                    </>
                )}

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

                            const renderSection = (title: string, items: Mantenimiento[], icon: string) => (
                                items.length > 0 && (
                                    <View style={{ marginBottom: 30 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                                            <MaterialCommunityIcons name={icon as any} size={28} color={Colors.primario} />
                                            <Text style={[styles.sectionTitle, { borderLeftWidth: 0, marginTop: 0 }]}>{title}</Text>
                                        </View>
                                        <View style={{ 
                                            flexDirection: 'row', 
                                            flexWrap: 'wrap', 
                                            width: '100%' 
                                        }}>
                                            {items.map(renderCard)}
                                        </View>
                                    </View>
                                )
                            );

                            if (isDesktop) {

                                return (
                                    <View style={{ paddingHorizontal: 20 }}>
                                        {renderSection("Mantenimientos de Motor", categorias.Motor, "engine")}
                                        {renderSection("Neumáticos y Ruedas", categorias.Neumaticos, "tire")}
                                        {renderSection("Otros Mantenimientos", categorias.Otros, "tools")}
                                    </View>
                                );
                            }

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
            </ResponsiveContainer>

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

import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, ScrollView, StyleSheet, Linking } from 'react-native';
import { Text, Card, Button, Divider, List } from 'react-native-paper';
import { useGlobalStyles, useAppTheme } from '../styles/theme';
import { RepuestoOpcion } from '../graphql/queries';
import { ResponsiveContainer } from '../components/ResponsiveContainer';
import { Platform } from 'react-native';
import { getAffiliateLink, isAmazonLink } from '../utils/affiliate';

const MaintenanceDetailsScreen = ({ route, navigation }: any) => {
    const { cocheId, cocheGarajeId, mant } = route.params;
    const globalStyles = useGlobalStyles();
    const theme = useAppTheme();
    const Colors = theme.customColors;

    if (!mant) {
        return (
            <View style={globalStyles.center}>
                <Text style={{ color: theme.colors.text }}>Error: No se pudieron cargar los detalles del mantenimiento.</Text>
            </View>
        );
    }

    const styles = StyleSheet.create({
        container: {
            padding: 20,
        },
        headerContainer: {
            marginBottom: 25,
            alignItems: 'center',
            backgroundColor: Colors.tarjeta,
            padding: 20,
            borderRadius: 15,
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            color: Colors.primario,
            textAlign: 'center',
            marginBottom: 10,
        },
        chipContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 10,
        },
        statChip: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: Colors.fondo,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: Colors.tarjeta,
        },
        statText: {
            marginLeft: 6,
            fontSize: 14,
            fontWeight: '600',
            color: theme.colors.text,
        },
        sectionTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: 15,
            marginTop: 10,
        },
        repuestoCard: {
            backgroundColor: Colors.tarjeta,
            marginBottom: 15,
            borderRadius: 16,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: 'rgba(255, 140, 0, 0.1)',
        },
        amazonBadge: {
            position: 'absolute',
            top: 10,
            right: 10,
            backgroundColor: '#FF9900',
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 4,
            zIndex: 1,
        },
        amazonBadgeText: {
            fontSize: 10,
            fontWeight: 'bold',
            color: '#000000',
        },
        cardContent: {
            padding: 16,
        },
        brandText: {
            color: Colors.primario,
            fontSize: 12,
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: 1,
            marginBottom: 4,
        },
        repuestoName: {
            fontSize: 18,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: 4,
        },
        durationText: {
            fontSize: 13,
            color: Colors.textoGris,
        },
        buyButton: {
            marginTop: 12,
            borderRadius: 25,
        },
        registerButton: {
            marginVertical: 20,
            paddingVertical: 10,
            borderRadius: 12,
            elevation: 2,
        },
        noData: {
            color: Colors.textoGris,
            textAlign: 'center',
            fontStyle: 'italic',
            padding: 20,
        }
    });

    const handleOpenLink = async (url: string) => {
        if (!url) return;
        try {
            await Linking.openURL(url);
        } catch (e) {
            console.error("Error opening link", e);
        }
    };

    const repuestos = mant.opcionesRepuestos || [];

    return (
        <ResponsiveContainer contentContainerStyle={styles.container}>
            <View style={styles.headerContainer}>
                <MaterialCommunityIcons name="wrench-clock" size={48} color={Colors.primario} style={{ marginBottom: 10 }} />
                <Text style={styles.title}>{mant.tarea}</Text>
                
                <View style={styles.chipContainer}>
                    <View style={styles.statChip}>
                        <MaterialCommunityIcons name="speedometer" size={16} color={Colors.primario} />
                        <Text style={styles.statText}>{mant.intervaloKm ? `${mant.intervaloKm} km` : 'N/A'}</Text>
                    </View>
                    <View style={styles.statChip}>
                        <MaterialCommunityIcons name="calendar-range" size={16} color={Colors.primario} />
                        <Text style={styles.statText}>{mant.intervaloMeses ? `${mant.intervaloMeses} meses` : 'N/A'}</Text>
                    </View>
                </View>
            </View>

            <Text style={styles.sectionTitle}>Repuestos Recomendados</Text>
            
            {repuestos.length > 0 ? (
                repuestos.map((rep: RepuestoOpcion, idx: number) => {
                    const isAmazon = isAmazonLink(rep.enlaceCompra || '');
                    return (
                        <View key={idx} style={styles.repuestoCard}>
                            {isAmazon && (
                                <View style={styles.amazonBadge}>
                                    <Text style={styles.amazonBadgeText}>AMAZON'S CHOICE</Text>
                                </View>
                            )}
                            <View style={styles.cardContent}>
                                <Text style={styles.brandText}>{rep.marca}</Text>
                                <Text style={styles.repuestoName}>{rep.nombre}</Text>
                                <Text style={styles.durationText}>
                                    <MaterialCommunityIcons name="clock-outline" size={14} color={Colors.textoGris} />
                                    {rep.duracionKm ? ` Vida útil: ${rep.duracionKm} km` : ' Larga duración'}
                                </Text>
                                
                                {rep.enlaceCompra && (
                                    <Button 
                                        mode="contained"
                                        onPress={() => handleOpenLink(getAffiliateLink(rep.enlaceCompra!))}
                                        buttonColor={isAmazon ? "#FF9900" : Colors.primario}
                                        textColor={isAmazon ? "#000000" : "#FFFFFF"}
                                        style={styles.buyButton}
                                        icon={isAmazon ? "cart" : "link"}
                                        labelStyle={{ fontWeight: 'bold' }}
                                    >
                                        {isAmazon ? "Ver en Amazon" : "Comprar ahora"}
                                    </Button>
                                )}
                            </View>
                        </View>
                    );
                })
            ) : (
                <Text style={styles.noData}>No hay repuestos específicos para esta tarea.</Text>
            )}

            <Button 
                mode="contained" 
                buttonColor={Colors.primario}
                style={styles.registerButton}
                disabled={!cocheGarajeId}
                onPress={() => navigation.navigate('RegisterMaintenance', { 
                    cocheGarajeId, 
                    tarea: mant.tarea,
                    mantenimientoId: mant.id
                })}
                icon="check-circle"
            >
                {cocheGarajeId ? "Registrar como Realizado" : "Añade el coche para registrar"}
            </Button>
        </ResponsiveContainer>
    );
};

export default MaintenanceDetailsScreen;

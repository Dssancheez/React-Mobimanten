import React from 'react';
import { View, ScrollView, StyleSheet, Linking } from 'react-native';
import { Text, Card, Button, Divider, List } from 'react-native-paper';
import { useGlobalStyles, useAppTheme } from '../styles/theme';
import { RepuestoOpcion } from '../graphql/queries';
import { ResponsiveContainer } from '../components/ResponsiveContainer';
import { Platform } from 'react-native';

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
        title: {
            fontSize: 26,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: 20,
        },
        infoRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 10,
        },
        infoLabel: {
            color: Colors.textoGris,
            fontSize: 16,
        },
        infoValue: {
            color: theme.colors.text,
            fontSize: 16,
            fontWeight: 'bold',
        },
        divider: {
            backgroundColor: Colors.tarjeta,
            height: 1,
            marginVertical: 20,
        },
        sectionTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: 10,
        },
        noData: {
            color: Colors.textoGris,
            fontStyle: 'italic',
        },
        buyButton: {
            marginBottom: 15,
            paddingVertical: 8,
        },
        registerButton: {
            borderColor: Colors.primario,
            paddingVertical: 8,
            marginTop: 10,
        },
        repuestoCard: {
            backgroundColor: Colors.tarjeta,
            marginBottom: 15,
            borderRadius: 12,
            elevation: 4,
        }
    });

    const handleOpenLink = async (url: string) => {
        if (!url) return;
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        }
    };

    const repuestos = mant.opcionesRepuestos || [];

    return (
        <ResponsiveContainer contentContainerStyle={{ padding: 20 }}>
            <Text style={styles.title}>{mant.tarea}</Text>
            
            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Frecuencia por Kilometraje:</Text>
                <Text style={styles.infoValue}>{mant.intervaloKm ? `Cada ${mant.intervaloKm} km` : 'No especificado'}</Text>
            </View>
            
            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Frecuencia de Tiempo:</Text>
                <Text style={styles.infoValue}>{mant.intervaloMeses ? `Cada ${mant.intervaloMeses} meses` : 'No especificado'}</Text>
            </View>

            <Divider style={styles.divider} />

            <Text style={styles.sectionTitle}>Repuestos Recomendados</Text>
            {repuestos.length > 0 ? (
                repuestos.map((rep: RepuestoOpcion, idx: number) => (
                    <Card key={idx} style={styles.repuestoCard}>
                        <Card.Title 
                            title={`${rep.nombre} (${rep.marca})`}
                            titleStyle={{ color: theme.colors.text, fontWeight: 'bold' }}
                            subtitle={rep.duracionKm ? `Dura aprox. ${rep.duracionKm} km` : ''}
                            subtitleStyle={{ color: Colors.textoGris }}
                            left={props => <List.Icon {...props} icon="tools" color={Colors.primario} />}
                        />
                        {rep.enlaceCompra && (
                            <Card.Actions>
                                <Button 
                                    onPress={() => handleOpenLink(rep.enlaceCompra!)}
                                    textColor={Colors.primario}
                                >
                                    Comprar
                                </Button>
                            </Card.Actions>
                        )}
                    </Card>
                ))
            ) : (
                <Text style={styles.noData}>No hay repuestos específicos para esta tarea en el catálogo.</Text>
            )}

            <Divider style={styles.divider} />

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
            >
                {cocheGarajeId ? "Registrar Mantenimiento Realizado" : "Añade el coche a tu garaje para registrar"}
            </Button>

        </ResponsiveContainer>
    );
};

export default MaintenanceDetailsScreen;

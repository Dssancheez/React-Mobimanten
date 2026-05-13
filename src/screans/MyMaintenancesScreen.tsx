import React, { useContext, useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Text, Card, SegmentedButtons } from 'react-native-paper';
import { useQuery, useApolloClient } from '@apollo/client/react';
import { GET_HISTORIAL_USUARIO, GET_MI_GARAJE, HistorialMantenimiento, Garaje } from '../graphql/queries';
import { AuthContext } from '../context/AuthContext';
import { useGlobalStyles, useAppTheme, useIsDesktop } from '../styles/theme';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ResponsiveContainer } from '../components/ResponsiveContainer';
import { Platform, useWindowDimensions } from 'react-native';

interface HistorialRecord {
    id: string;
    cocheId: string;
    apodo: string;
    tarea: string;
    fecha: string;
    kmActuales: number;
    observaciones: string;
}

interface AlertaRecord {
    cocheId: string;
    apodo: string;
    tarea: string;
    diasRestantes: number;
    urgente: boolean;
    fechaVencimiento: string;
}

const MyMaintenancesScreen = ({ navigation }: any) => {
    const { usuario } = useContext(AuthContext);
    const client = useApolloClient();
    const isFocused = useIsFocused();
    const globalStyles = useGlobalStyles();
    const theme = useAppTheme();
    const Colors = theme.customColors;
    const { width } = useWindowDimensions();
    const isDesktop = useIsDesktop();


    const styles = StyleSheet.create({
        noData: {
            color: Colors.textoGris,
            textAlign: 'center',
            marginTop: 40,
            fontSize: 16,
        },
        card: {
            backgroundColor: Colors.tarjeta,
            marginBottom: 15,
            width: isDesktop && width > 1200 ? '23%' : isDesktop && width > 800 ? '48%' : '100%',
            marginHorizontal: isDesktop && width > 800 ? '1%' : 0,
            elevation: 2,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: 'rgba(255, 126, 0, 0.1)',
            overflow: 'hidden',
        },
        cardUrgente: {
            backgroundColor: '#D32F2F',
            borderColor: '#FF5252',
            borderWidth: 2,
        },
        headerRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 5,
        },
        cardTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: theme.colors.text,
            flex: 1,
        },
        cardSubtitle: {
            fontSize: 14,
            color: Colors.textoGris,
            marginBottom: 10,
        },
        fecha: {
            color: Colors.primario,
            fontWeight: 'bold',
        },
        diasContainer: {
            marginTop: 5,
            padding: 10,
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: 8,
        },
        diasTexto: {
            color: Colors.textoPrincipal,
            fontSize: 16,
            fontWeight: 'bold',
            textAlign: 'center',
        },
        kmTexto: {
            color: theme.colors.text,
            fontSize: 14,
            marginBottom: 5,
        },
        observaciones: {
            color: Colors.textoGris,
            fontSize: 13,
            fontStyle: 'italic',
            marginTop: 5,
        }
    });

    const [viewMode, setViewMode] = useState('proximos'); // 'proximos' | 'historial'

    const { data: garajeData, loading: garajeLoading, refetch: refetchGaraje } = useQuery<{ obtenerMiGaraje: Garaje[] }>(
        GET_MI_GARAJE,
        { variables: { usuarioId: usuario?.id }, skip: !usuario?.id }
    );

    const { data: historialData, loading: historyLoading, refetch: refetchHistorial } = useQuery<{ obtenerHistorialUsuario: HistorialMantenimiento[] }>(
        GET_HISTORIAL_USUARIO,
        { variables: { usuarioId: usuario?.id }, skip: !usuario?.id }
    );

    useEffect(() => {
        if (isFocused) {
            refetchHistorial();
            refetchGaraje();
        }
    }, [isFocused]);

    if (historyLoading) {
        return (
            <View style={globalStyles.center}>
                <ActivityIndicator size="large" color={Colors.primario} />
            </View>
        );
    }

    const records = historialData?.obtenerHistorialUsuario || [];
    const garajes = garajeData?.obtenerMiGaraje || [];

    // Lógica Inteligente de Alertas
    const hoy = new Date();
    
    // 1. Agrupar por coche y tarea para obtener el último registro de cada uno
    const ultimosRegistros = new Map<string, HistorialMantenimiento>();
    records.forEach(r => {
        const key = `${r.cocheGarajeId}-${r.tarea}`;
        const existing = ultimosRegistros.get(key);
        if (!existing || new Date(r.fechaRealizado) > new Date(existing.fechaRealizado)) {
            ultimosRegistros.set(key, r);
        }
    });

    // 2. Calcular alertas basadas en los últimos registros
    const alertas = Array.from(ultimosRegistros.values())
        .filter(r => r.proximoCambioFecha || r.proximoCambioKm)
        .map(r => {
            const cocheGaraje = garajes.find(g => g.id === r.cocheGarajeId);
            const kmActuales = cocheGaraje?.kilometrajeActual || 0;

            // Alerta por fecha
            let diasRestantes = 999;
            if (r.proximoCambioFecha) {
                const fechaVencimiento = new Date(r.proximoCambioFecha);
                diasRestantes = Math.ceil((fechaVencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
            }

            // Alerta por kilómetros
            let kmRestantes = 99999;
            if (r.proximoCambioKm) {
                kmRestantes = r.proximoCambioKm - kmActuales;
            }

            // Es urgente si faltan 5 días o 200 km, o si ya está vencido
            const esUrgente = diasRestantes <= 5 || kmRestantes <= 200 || diasRestantes < 0 || kmRestantes < 0;

            return {
                id: r.id,
                cocheGarajeId: r.cocheGarajeId,
                tarea: r.tarea,
                apodo: r.cocheApodo || 'Mi Coche',
                diasRestantes,
                kmRestantes,
                urgente: esUrgente,
                fechaVencimiento: r.proximoCambioFecha,
                kmVencimiento: r.proximoCambioKm
            };
        })
        .filter(a => a.diasRestantes <= 30 || a.kmRestantes <= 1000)
        .sort((a, b) => {
            // Priorizar urgencia, luego proximidad (días o km proporcionalmente)
            if (a.urgente !== b.urgente) return a.urgente ? -1 : 1;
            return a.diasRestantes - b.diasRestantes;
        });

    const historialSorted = [...records].sort((a, b) => 
        new Date(b.fechaRealizado).getTime() - new Date(a.fechaRealizado).getTime()
    );

    // No more manual loading check here as it's handled above

    return (
        <View style={globalStyles.container}>
            <View style={globalStyles.webMaxWidth}>
                <View style={{ padding: 16 }}>
                    <SegmentedButtons
                        value={viewMode}
                        onValueChange={setViewMode}
                        buttons={[
                            { value: 'proximos', label: 'Próximos', icon: 'bell-alert' },
                            { value: 'historial', label: 'Historial', icon: 'history' },
                        ]}
                        theme={{ colors: { secondaryContainer: Colors.primario } }}
                    />
                </View>
            </View>

            <ResponsiveContainer maxWidth={1200}>
                <View style={{ 
                    flexDirection: isDesktop && width > 600 ? 'row' : 'column', 
                    flexWrap: 'wrap',
                    padding: 16
                }}>
                    {viewMode === 'proximos' ? (
                        alertas.length === 0 ? (
                            <Text style={[styles.noData, { width: '100%' }]}>No tienes ningún mantenimiento próximo en los próximos 30 días.</Text>
                        ) : (
                            alertas.map((alerta, index) => (
                                <Card
                                    key={index}
                                    style={[styles.card, alerta.urgente && styles.cardUrgente]}
                                    onPress={() => navigation.navigate('RegisterMaintenance', {
                                        cocheGarajeId: alerta.cocheGarajeId,
                                        tarea: alerta.tarea
                                    })}
                                >
                                    <Card.Content>
                                        <Text style={{ 
                                            color: alerta.urgente ? '#FFE4E1' : Colors.primario, 
                                            fontSize: 10, 
                                            fontWeight: 'bold', 
                                            textTransform: 'uppercase', 
                                            letterSpacing: 1.1,
                                            marginBottom: 4 
                                        }}>
                                            {alerta.urgente ? 'Urgente' : 'Próximo'}
                                        </Text>
                                        <View style={styles.headerRow}>
                                            <Text style={[styles.cardTitle, { fontSize: 19 }, alerta.urgente ? { color: 'white' } : { color: theme.colors.text }]}>
                                                {alerta.tarea}
                                            </Text>
                                            {alerta.urgente && (
                                                <MaterialCommunityIcons name="alert" size={24} color="white" />
                                            )}
                                        </View>
                                        <Text style={[styles.cardSubtitle, { marginBottom: 12 }, alerta.urgente && { color: '#FFE4E1' }]}>
                                            {alerta.apodo}
                                        </Text>

                                        <View style={styles.diasContainer}>
                                            <Text style={[styles.diasTexto, alerta.urgente && { color: 'white' }]}>
                                                {alerta.diasRestantes < 0
                                                    ? `¡Vencido por tiempo! (${Math.abs(alerta.diasRestantes)} días)`
                                                    : alerta.kmRestantes < 0
                                                    ? `¡Vencido por uso! (${Math.abs(alerta.kmRestantes)} km extra)`
                                                    : alerta.diasRestantes <= 30
                                                    ? `Próximo mantenimiento en ${alerta.diasRestantes} días`
                                                    : `Próximo mantenimiento en ${alerta.kmRestantes} km`
                                                }
                                            </Text>
                                            {(alerta.diasRestantes >= 0 && alerta.kmRestantes >= 0) && (
                                                <Text style={{color: 'white', fontSize: 12, textAlign: 'center', marginTop: 4, opacity: 0.8}}>
                                                    Límite: {alerta.kmVencimiento} km o {alerta.fechaVencimiento}
                                                </Text>
                                            )}
                                        </View>
                                    </Card.Content>
                                </Card>
                            ))
                        )
                    ) : (
                        historialSorted.length === 0 ? (
                            <Text style={[styles.noData, { width: '100%' }]}>Aún no has registrado ningún mantenimiento.</Text>
                        ) : (
                            historialSorted.map((reg) => (
                                <Card key={reg.id} style={styles.card}>
                                    <Card.Content>
                                        <Text style={{ 
                                            color: Colors.primario, 
                                            fontSize: 10, 
                                            fontWeight: 'bold', 
                                            textTransform: 'uppercase', 
                                            letterSpacing: 1.1,
                                            marginBottom: 4 
                                        }}>
                                            Realizado
                                        </Text>
                                        <View style={styles.headerRow}>
                                            <Text style={[styles.cardTitle, { fontSize: 19 }]}>{reg.tarea}</Text>
                                            <Text style={styles.fecha}>{reg.fechaRealizado}</Text>
                                        </View>
                                        <Text style={[styles.cardSubtitle, { marginBottom: 8 }]}>{reg.cocheApodo}</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                                            <MaterialCommunityIcons name="speedometer" size={14} color={Colors.textoGris} />
                                            <Text style={[styles.kmTexto, { marginBottom: 0, marginLeft: 6 }]}>{reg.kilometrosRealizado} km</Text>
                                        </View>
                                        {reg.observaciones ? (
                                            <Text style={styles.observaciones}>Nota: {reg.observaciones}</Text>
                                        ) : null}
                                        {reg.proximoCambioKm && (
                                            <Text style={{color: Colors.primario, marginTop: 5}}>
                                                Próximo cambio: {reg.proximoCambioKm} km
                                            </Text>
                                        )}
                                    </Card.Content>
                                </Card>
                            ))
                        )
                    )}
                </View>
            </ResponsiveContainer>
        </View>
    );
};

export default MyMaintenancesScreen;

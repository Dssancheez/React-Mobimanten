import React, { useContext, useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Text, Card, SegmentedButtons } from 'react-native-paper';
import { useQuery, useApolloClient } from '@apollo/client/react';
import { GET_MI_GARAJE, GET_MANTENIMIENTOS, Garaje, Mantenimiento } from '../graphql/queries';
import { AuthContext } from '../context/AuthContext';
import { useGlobalStyles, useAppTheme } from '../styles/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
        },
        cardUrgente: {
            backgroundColor: '#D32F2F', // Rojo oscuro para alerta
            borderColor: '#FF5252',
            borderWidth: 1,
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
    
    const [historial, setHistorial] = useState<HistorialRecord[]>([]);
    const [alertas, setAlertas] = useState<AlertaRecord[]>([]);
    const [loadingData, setLoadingData] = useState(true);

    const { data: garajeData, loading: garajeLoading } = useQuery<{ obtenerMiGaraje: Garaje[] }>(
        GET_MI_GARAJE,
        { variables: { usuarioId: usuario?.id }, skip: !usuario?.id }
    );

    useEffect(() => {
        if (!isFocused || garajeLoading) return;

        const cargarMantenimientos = async () => {
            setLoadingData(true);
            try {
                const coches = garajeData?.obtenerMiGaraje || [];
                
                let allHistorial: HistorialRecord[] = [];
                let allAlertas: AlertaRecord[] = [];

                const hoy = new Date();

                for (const g of coches) {
                    const cocheId = g.coche.id;
                    const apodo = g.apodo || `${g.coche.marca} ${g.coche.modelo}`;

                    // 1. Cargar historial local
                    const key = `mantenimientos_realizados_${cocheId}`;
                    const existingStr = await AsyncStorage.getItem(key);
                    const records = existingStr ? JSON.parse(existingStr) : [];
                    
                    // Mapear añadiendo el apodo
                    const recordsConInfo = records.map((r: any) => ({ ...r, apodo }));
                    allHistorial = [...allHistorial, ...recordsConInfo];

                    // 2. Consultar mantenimientos recomendados del servidor
                    const { data: mantData } = await client.query({
                        query: GET_MANTENIMIENTOS,
                        variables: { cocheId },
                        fetchPolicy: 'cache-first'
                    });

                    const recomendados = mantData?.obtenerMantenimientosPorCoche || [];

                    // 3. Calcular alertas cruzando recomendados con el último registro de cada tarea
                    recomendados.forEach((rec: Mantenimiento) => {
                        if (!rec.intervaloMeses) return; // Si no hay intervalo de tiempo, no podemos calcular días

                        // Buscar el registro más reciente para esta tarea en concreto
                        const registrosDeTarea = records.filter((r: any) => r.tarea === rec.tarea);
                        if (registrosDeTarea.length === 0) return; // Si nunca lo ha hecho, no sabemos desde cuándo calcular

                        // Ordenar por fecha descendente
                        registrosDeTarea.sort((a: any, b: any) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
                        const ultimoRegistro = registrosDeTarea[0];

                        const fechaUltimo = new Date(ultimoRegistro.fecha);
                        const fechaVencimiento = new Date(fechaUltimo);
                        fechaVencimiento.setMonth(fechaVencimiento.getMonth() + rec.intervaloMeses);

                        const diferenciaMilisegundos = fechaVencimiento.getTime() - hoy.getTime();
                        const diasRestantes = Math.ceil(diferenciaMilisegundos / (1000 * 60 * 60 * 24));

                        // Si faltan 30 días o menos (incluso negativos si está caducado)
                        if (diasRestantes <= 30) {
                            allAlertas.push({
                                cocheId,
                                apodo,
                                tarea: rec.tarea,
                                diasRestantes,
                                urgente: diasRestantes <= 5,
                                fechaVencimiento: fechaVencimiento.toISOString().split('T')[0]
                            });
                        }
                    });
                }

                // Ordenar historiales (más recientes primero)
                allHistorial.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
                // Ordenar alertas (más urgentes primero)
                allAlertas.sort((a, b) => a.diasRestantes - b.diasRestantes);

                setHistorial(allHistorial);
                setAlertas(allAlertas);

            } catch (error) {
                console.error("Error calculando mantenimientos", error);
            } finally {
                setLoadingData(false);
            }
        };

        cargarMantenimientos();

    }, [garajeData, isFocused, client]);

    if (garajeLoading || loadingData) {
        return (
            <View style={globalStyles.center}>
                <ActivityIndicator size="large" color={Colors.primario} />
            </View>
        );
    }

    return (
        <View style={globalStyles.container}>
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

            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
                {viewMode === 'proximos' ? (
                    alertas.length === 0 ? (
                        <Text style={styles.noData}>No tienes ningún mantenimiento próximo en los próximos 30 días.</Text>
                    ) : (
                        alertas.map((alerta, index) => (
                            <Card 
                                key={index} 
                                style={[styles.card, alerta.urgente && styles.cardUrgente]}
                            >
                                <Card.Content>
                                    <View style={styles.headerRow}>
                                        <Text style={[styles.cardTitle, alerta.urgente ? {color: 'white'} : {color: theme.colors.text}]}>
                                            {alerta.tarea}
                                        </Text>
                                        {alerta.urgente && (
                                            <MaterialCommunityIcons name="alert" size={24} color="white" />
                                        )}
                                    </View>
                                    <Text style={[styles.cardSubtitle, alerta.urgente && {color: '#FFE4E1'}]}>
                                        Vehículo: {alerta.apodo}
                                    </Text>
                                    
                                    <View style={styles.diasContainer}>
                                        <Text style={[styles.diasTexto, alerta.urgente && {color: 'white'}]}>
                                            {alerta.diasRestantes < 0 
                                                ? `¡Vencido hace ${Math.abs(alerta.diasRestantes)} días!`
                                                : `Próximo mantenimiento en ${alerta.diasRestantes} días`
                                            }
                                        </Text>
                                    </View>
                                </Card.Content>
                            </Card>
                        ))
                    )
                ) : (
                    historial.length === 0 ? (
                        <Text style={styles.noData}>Aún no has registrado ningún mantenimiento.</Text>
                    ) : (
                        historial.map((reg) => (
                            <Card key={reg.id} style={styles.card}>
                                <Card.Content>
                                    <View style={styles.headerRow}>
                                        <Text style={styles.cardTitle}>{reg.tarea}</Text>
                                        <Text style={styles.fecha}>{reg.fecha}</Text>
                                    </View>
                                    <Text style={styles.cardSubtitle}>Vehículo: {reg.apodo}</Text>
                                    <Text style={styles.kmTexto}>{reg.kmActuales} km</Text>
                                    {reg.observaciones ? (
                                        <Text style={styles.observaciones}>Nota: {reg.observaciones}</Text>
                                    ) : null}
                                </Card.Content>
                            </Card>
                        ))
                    )
                )}
            </ScrollView>
        </View>
    );
};

export default MyMaintenancesScreen;

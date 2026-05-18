import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Text } from 'react-native-paper';
import { useAppTheme } from '../styles/theme';

interface TimelineProgressProps {
    fechaInicio?: string | null;
    fechaFin?: string | null;
    diasRestantes?: number;
    kmInicio?: number;
    kmFin?: number;
    kmActuales?: number;
}

export const TimelineProgress: React.FC<TimelineProgressProps> = ({
    fechaInicio,
    fechaFin,
    diasRestantes,
    kmInicio,
    kmFin,
    kmActuales,
}) => {
    const theme = useAppTheme();
    const Colors = theme.customColors;
    const progressAnim = useRef(new Animated.Value(0)).current;

    // Determinar el color basado en días restantes o km restantes
    let color = '#4CAF50'; // Verde por defecto (> 15 días)
    let isUrgent = false;

    if (diasRestantes !== undefined) {
        if (diasRestantes <= 0) {
            color = '#F44336'; // Rojo (Vencido)
            isUrgent = true;
        } else if (diasRestantes <= 15) {
            color = '#FFC107'; // Amarillo (Pronto)
        }
    } else if (kmInicio !== undefined && kmFin !== undefined && kmActuales !== undefined) {
        const kmRestantes = kmFin - kmActuales;
        if (kmRestantes <= 0) {
            color = '#F44336';
            isUrgent = true;
        } else if (kmRestantes <= 500) {
            color = '#FFC107';
        }
    }

    // Calcular el porcentaje de progreso
    let percentage = 0;
    
    if (fechaInicio && fechaFin && diasRestantes !== undefined) {
        // Asumiendo formato de fecha ISO o parseable por Date
        const start = new Date(fechaInicio).getTime();
        const end = new Date(fechaFin).getTime();
        const now = new Date().getTime();
        
        if (end > start) {
            const totalDuration = end - start;
            const elapsed = now - start;
            percentage = Math.max(0, Math.min(100, (elapsed / totalDuration) * 100));
        } else {
            percentage = 100;
        }
    } else if (kmInicio !== undefined && kmFin !== undefined && kmActuales !== undefined) {
        const totalKm = kmFin - kmInicio;
        if (totalKm > 0) {
            const elapsedKm = kmActuales - kmInicio;
            percentage = Math.max(0, Math.min(100, (elapsedKm / totalKm) * 100));
        } else {
            percentage = 100;
        }
    }

    // Si ya está vencido, forzamos la barra al 100%
    if (isUrgent) {
        percentage = 100;
    }

    useEffect(() => {
        Animated.timing(progressAnim, {
            toValue: percentage,
            duration: 1000,
            useNativeDriver: false,
        }).start();
    }, [percentage]);

    const formatLabelDate = (dateString?: string | null) => {
        if (!dateString) return '---';
        try {
            const d = new Date(dateString);
            if (isNaN(d.getTime())) return dateString; // Si no es parseable, devolver tal cual
            return d.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
        } catch (e) {
            return dateString;
        }
    };

    const labelStart = fechaInicio ? formatLabelDate(fechaInicio) : kmInicio ? `${kmInicio} km` : 'Inicio';
    const labelEnd = fechaFin ? formatLabelDate(fechaFin) : kmFin ? `${kmFin} km` : 'Fin';

    let statusText = '';
    if (diasRestantes !== undefined) {
        if (diasRestantes < 0) statusText = `Vencido hace ${Math.abs(diasRestantes)} días`;
        else if (diasRestantes === 0) statusText = '¡Vence hoy!';
        else statusText = `Faltan ${diasRestantes} días`;
    } else if (kmFin !== undefined && kmActuales !== undefined) {
        const kmR = kmFin - kmActuales;
        if (kmR < 0) statusText = `Excedido en ${Math.abs(kmR)} km`;
        else statusText = `Faltan ${kmR} km`;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.statusText, { color }]}>{statusText}</Text>
            </View>
            
            <View style={styles.timelineContainer}>
                {/* Nodos y etiquetas (Fondo) */}
                <View style={styles.labelsContainer}>
                    <Text style={styles.nodeLabel}>{labelStart}</Text>
                    <Text style={styles.nodeLabel}>{labelEnd}</Text>
                </View>

                {/* Barra principal */}
                <View style={styles.track}>
                    <Animated.View 
                        style={[
                            styles.progress, 
                            { 
                                backgroundColor: color,
                                width: progressAnim.interpolate({
                                    inputRange: [0, 100],
                                    outputRange: ['0%', '100%']
                                })
                            }
                        ]} 
                    />
                    {/* Punto luminoso al final del progreso */}
                    <Animated.View 
                        style={[
                            styles.glowDot,
                            { backgroundColor: color, shadowColor: color },
                            {
                                left: progressAnim.interpolate({
                                    inputRange: [0, 100],
                                    outputRange: ['0%', '100%']
                                })
                            }
                        ]} 
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 15,
        padding: 15,
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    header: {
        alignItems: 'center',
        marginBottom: 10,
    },
    statusText: {
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    timelineContainer: {
        position: 'relative',
        height: 40,
        justifyContent: 'center',
    },
    labelsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute',
        width: '100%',
        bottom: -5,
    },
    nodeLabel: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.6)',
        fontWeight: '500',
    },
    track: {
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 3,
        width: '100%',
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
    },
    progress: {
        height: '100%',
        borderRadius: 3,
        position: 'absolute',
        left: 0,
        top: 0,
    },
    glowDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        position: 'absolute',
        top: -3,
        marginLeft: -6, // Centrar el dot en la punta
        elevation: 5,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
    }
});

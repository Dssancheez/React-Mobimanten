import React from 'react';
import { View, ScrollView, StyleSheet, Linking } from 'react-native';
import { Text, Card, Button, Divider, List } from 'react-native-paper';
import { Colors, globalStyles } from '../styles/theme';

const MaintenanceDetailsScreen = ({ route, navigation }: any) => {
    const { cocheId, mant } = route.params;

    const handleOpenLink = async (url: string) => {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        }
    };

    return (
        <ScrollView style={globalStyles.container} contentContainerStyle={{ padding: 20 }}>
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
            {mant.repuestos && mant.repuestos.length > 0 ? (
                mant.repuestos.map((rep: string, idx: number) => (
                    <List.Item
                        key={idx}
                        title={rep}
                        titleStyle={{ color: 'white' }}
                        left={props => <List.Icon {...props} icon="tools" color={Colors.primario} />}
                    />
                ))
            ) : (
                <Text style={styles.noData}>No hay repuestos especificados para esta tarea.</Text>
            )}

            <Divider style={styles.divider} />

            {mant.enlaceCompra && (
                <Button 
                    mode="contained" 
                    icon="cart"
                    buttonColor="#FF8C00"
                    onPress={() => handleOpenLink(mant.enlaceCompra)}
                    style={styles.buyButton}
                >
                    Comprar Kit / Repuestos
                </Button>
            )}

            <Button 
                mode="outlined" 
                textColor={Colors.primario}
                style={styles.registerButton}
                onPress={() => navigation.navigate('RegisterMaintenance', { cocheId, tarea: mant.tarea })}
            >
                Registrar Mantenimiento Realizado
            </Button>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 20,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    infoLabel: {
        color: '#B0C4DE',
        fontSize: 16,
    },
    infoValue: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    divider: {
        backgroundColor: '#1E1E50',
        height: 1,
        marginVertical: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
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
    }
});

export default MaintenanceDetailsScreen;

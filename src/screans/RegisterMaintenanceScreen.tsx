import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { useGlobalStyles, useAppTheme } from '../styles/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegisterMaintenanceScreen = ({ route, navigation }: any) => {
    const { cocheId, tarea } = route.params;
    const globalStyles = useGlobalStyles();
    const theme = useAppTheme();
    const Colors = theme.customColors;

    const styles = StyleSheet.create({
        content: {
            flex: 1,
            padding: 20,
            justifyContent: 'center',
        },
        title: {
            fontSize: 26,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: 5,
        },
        subtitle: {
            fontSize: 18,
            color: Colors.textoPrincipal,
            marginBottom: 30,
            fontWeight: 'bold',
        },
        form: {
            width: '100%',
        },
        input: {
            marginBottom: 15,
            backgroundColor: Colors.tarjeta,
        },
        button: {
            marginTop: 20,
            paddingVertical: 8,
            borderRadius: 8,
        },
        buttonLabel: {
            fontSize: 16,
            fontWeight: 'bold',
        }
    });
    
    const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
    const [kmActuales, setKmActuales] = useState('');
    const [observaciones, setObservaciones] = useState('');

    const handleSave = async () => {
        if (!kmActuales) {
            Alert.alert("Error", "Por favor ingresa los kilómetros actuales.");
            return;
        }

        try {
            // Simulamos guardarlo en el almacenamiento local ya que no hay endpoint en el backend
            // para "Mantenimiento Realizado".
            const key = `mantenimientos_realizados_${cocheId}`;
            const existingStr = await AsyncStorage.getItem(key);
            const existing = existingStr ? JSON.parse(existingStr) : [];
            
            const newRecord = {
                id: Date.now().toString(),
                cocheId,
                tarea,
                fecha,
                kmActuales: parseInt(kmActuales),
                observaciones
            };

            await AsyncStorage.setItem(key, JSON.stringify([...existing, newRecord]));
            
            Alert.alert(
                "¡Registrado!", 
                "El mantenimiento se ha registrado correctamente. Se te notificará cuando se acerque el próximo límite.",
                [{ text: "OK", onPress: () => navigation.goBack() }]
            );

        } catch (e) {
            console.error("Error saving maintenance", e);
            Alert.alert("Error", "Hubo un problema al guardar el registro.");
        }
    };

    return (
        <KeyboardAvoidingView 
            style={globalStyles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={styles.content}>
                <Text style={styles.title}>Registrar Mantenimiento</Text>
                <Text style={styles.subtitle}>Tarea: {tarea}</Text>

                <View style={styles.form}>
                    <TextInput
                        label="Fecha (YYYY-MM-DD)"
                        value={fecha}
                        onChangeText={setFecha}
                        style={styles.input}
                        mode="outlined"
                        outlineColor={Colors.textoGris}
                        activeOutlineColor={Colors.primario}
                        textColor={theme.colors.text}
                    />
                    
                    <TextInput
                        label="Kilómetros actuales del vehículo"
                        value={kmActuales}
                        onChangeText={setKmActuales}
                        keyboardType="numeric"
                        style={styles.input}
                        mode="outlined"
                        outlineColor={Colors.textoGris}
                        activeOutlineColor={Colors.primario}
                        textColor={theme.colors.text}
                    />

                    <TextInput
                        label="Observaciones (Opcional)"
                        value={observaciones}
                        onChangeText={setObservaciones}
                        multiline
                        numberOfLines={3}
                        style={styles.input}
                        mode="outlined"
                        outlineColor={Colors.textoGris}
                        activeOutlineColor={Colors.primario}
                        textColor={theme.colors.text}
                    />

                    <Button 
                        mode="contained" 
                        onPress={handleSave} 
                        style={styles.button}
                        buttonColor={Colors.primario}
                        labelStyle={styles.buttonLabel}
                    >
                        Guardar Registro
                    </Button>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

export default RegisterMaintenanceScreen;

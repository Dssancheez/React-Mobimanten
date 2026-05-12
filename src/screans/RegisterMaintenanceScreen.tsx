import React, { useState, useContext } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { useGlobalStyles, useAppTheme } from '../styles/theme';
import * as Haptics from 'expo-haptics';
import { useMutation } from '@apollo/client/react';
import { REGISTRAR_MANTENIMIENTO } from '../graphql/mutations';
import { GET_HISTORIAL_USUARIO } from '../graphql/queries';
import { AuthContext } from '../context/AuthContext';

const RegisterMaintenanceScreen = ({ route, navigation }: any) => {
    const { cocheGarajeId, tarea, mantenimientoId } = route.params;
    const { usuario } = useContext<any>(AuthContext);
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

    const [registrarMantenimiento, { loading }] = useMutation(REGISTRAR_MANTENIMIENTO, {
        onCompleted: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert(
                "¡Registrado!",
                "El mantenimiento se ha registrado correctamente en el sistema inteligente.",
                [{ text: "OK", onPress: () => navigation.goBack() }]
            );
        },
        onError: (err: any) => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            console.error("Error saving maintenance", err);
            Alert.alert("Error", `Hubo un problema al guardar el registro: ${err.message}`);
        },
        refetchQueries: [
            { query: GET_HISTORIAL_USUARIO, variables: { usuarioId: usuario?.id } }
        ]
    });

    const handleSave = async () => {
        if (!kmActuales) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert("Error", "Por favor ingresa los kilómetros actuales.");
            return;
        }

        if (!usuario?.id) {
            Alert.alert("Error", "Debes estar identificado para registrar mantenimientos.");
            return;
        }

        registrarMantenimiento({
            variables: {
                input: {
                    usuarioId: usuario.id,
                    cocheGarajeId: cocheGarajeId,
                    mantenimientoId: mantenimientoId || "",
                    tarea: tarea,
                    fechaRealizado: fecha,
                    kilometrosRealizado: parseInt(kmActuales),
                    observaciones: observaciones,
                    repuestoSeleccionado: null
                }
            }
        });
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
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                            handleSave();
                        }}
                        style={styles.button}
                        buttonColor={Colors.primario}
                        labelStyle={styles.buttonLabel}
                        loading={loading}
                        disabled={loading}
                    >
                        Guardar Registro
                    </Button>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

export default RegisterMaintenanceScreen;

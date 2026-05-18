import React, { useState, useContext } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { useGlobalStyles, useAppTheme, useIsDesktop } from '../styles/theme';
import * as Haptics from 'expo-haptics';
import { useMutation } from '@apollo/client/react';
import { REGISTRAR_MANTENIMIENTO } from '../graphql/mutations';
import { GET_HISTORIAL_USUARIO } from '../graphql/queries';
import { AuthContext } from '../context/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface RepuestoOpcion {
    nombre: string;
    marca: string;
    duracionKm?: number;
    duracionMeses?: number;
    enlaceCompra?: string;
}

const RegisterMaintenanceScreen = ({ route, navigation }: any) => {
    const { cocheGarajeId, tarea, mantenimientoId, opcionesRepuestos } = route.params || {};
    const { usuario } = useContext<any>(AuthContext);
    const globalStyles = useGlobalStyles();
    const theme = useAppTheme();
    const Colors = theme.customColors;
    const isDesktop = useIsDesktop();

    const repuestos: RepuestoOpcion[] = opcionesRepuestos || [];

    const styles = StyleSheet.create({
        container: {
            flexGrow: 1,
            backgroundColor: Colors.fondo,
            justifyContent: isDesktop ? 'center' : 'flex-start',
            alignItems: 'center',
            paddingVertical: isDesktop ? 40 : 10,
        },
        content: {
            width: '100%',
            maxWidth: isDesktop ? 650 : undefined,
            padding: isDesktop ? 40 : 20,
            borderRadius: isDesktop ? 20 : 0,
        },
        title: {
            fontSize: isDesktop ? 30 : 26,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: 5,
            textAlign: isDesktop ? 'center' : 'left',
        },
        subtitle: {
            fontSize: 18,
            color: Colors.textoPrincipal,
            marginBottom: 25,
            fontWeight: 'bold',
            textAlign: isDesktop ? 'center' : 'left',
        },
        sectionLabel: {
            fontSize: 16,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginTop: 20,
            marginBottom: 10,
        },
        form: {
            width: '100%',
        },
        input: {
            marginBottom: 15,
            backgroundColor: Colors.tarjeta,
        },
        rowInputs: {
            flexDirection: isDesktop ? 'row' : 'column',
            justifyContent: 'space-between',
            gap: isDesktop ? 15 : 0,
        },
        halfInput: {
            flex: 1,
            marginBottom: 15,
            backgroundColor: Colors.tarjeta,
        },
        optionCard: {
            backgroundColor: Colors.tarjeta,
            borderWidth: 1.5,
            borderColor: 'rgba(255, 126, 0, 0.1)',
            borderRadius: 12,
            padding: 14,
            marginBottom: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        optionCardSelected: {
            borderColor: Colors.primario,
            backgroundColor: 'rgba(255, 126, 0, 0.08)',
        },
        optionTextContainer: {
            flex: 1,
            paddingRight: 10,
        },
        optionTitle: {
            fontSize: 15,
            fontWeight: 'bold',
            color: theme.colors.text,
        },
        optionSubtitle: {
            fontSize: 13,
            color: Colors.textoGris,
            marginTop: 2,
        },
        customFieldsContainer: {
            backgroundColor: 'rgba(255, 126, 0, 0.03)',
            borderRadius: 12,
            padding: 15,
            borderWidth: 1,
            borderColor: 'rgba(255, 126, 0, 0.15)',
            marginBottom: 15,
            marginTop: 5,
        },
        button: {
            marginTop: 25,
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
    const [coste, setCoste] = useState('');
    const [taller, setTaller] = useState('');

    // Selection state
    const [selectedOption, setSelectedOption] = useState<string>(repuestos.length > 0 ? '0' : 'custom');
    
    // Custom repuesto state
    const [customNombre, setCustomNombre] = useState('');
    const [customMarca, setCustomMarca] = useState('');
    const [customEnlace, setCustomEnlace] = useState('');

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

        // Build repuesto input
        let repuestoInput = null;
        if (selectedOption === 'custom') {
            if (!customNombre || !customMarca) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                Alert.alert("Error", "Por favor introduce la marca y nombre del repuesto personalizado.");
                return;
            }
            repuestoInput = {
                nombre: customNombre,
                marca: customMarca,
                duracionKm: null,
                duracionMeses: null,
                enlaceCompra: customEnlace || null
            };
        } else if (selectedOption !== 'none') {
            const idx = parseInt(selectedOption);
            if (repuestos[idx]) {
                const rep = repuestos[idx];
                repuestoInput = {
                    nombre: rep.nombre,
                    marca: rep.marca,
                    duracionKm: rep.duracionKm || null,
                    duracionMeses: rep.duracionMeses || null,
                    enlaceCompra: rep.enlaceCompra || null
                };
            }
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
                    coste: coste ? parseFloat(coste) : null,
                    taller: taller || null,
                    observaciones: observaciones,
                    repuestoSeleccionado: repuestoInput
                }
            }
        });
    };

    return (
        <KeyboardAvoidingView
            style={globalStyles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView 
                contentContainerStyle={styles.container} 
                showsVerticalScrollIndicator={false}
            >
                <View style={[styles.content, isDesktop && globalStyles.glassCard]}>
                    <Text style={styles.title}>Registrar Mantenimiento</Text>
                    <Text style={styles.subtitle}>Tarea: {tarea}</Text>

                    <View style={styles.form}>
                        {/* Fecha y Kilómetros en Fila si es PC */}
                        <View style={styles.rowInputs}>
                            <TextInput
                                label="Fecha (YYYY-MM-DD)"
                                value={fecha}
                                onChangeText={setFecha}
                                style={styles.halfInput}
                                mode="outlined"
                                outlineColor={Colors.textoGris}
                                activeOutlineColor={Colors.primario}
                                textColor={theme.colors.text}
                            />

                            <TextInput
                                label="Kilómetros actuales"
                                value={kmActuales}
                                onChangeText={setKmActuales}
                                keyboardType="numeric"
                                style={styles.halfInput}
                                mode="outlined"
                                outlineColor={Colors.textoGris}
                                activeOutlineColor={Colors.primario}
                                textColor={theme.colors.text}
                            />
                        </View>

                        {/* Taller y Coste en Fila si es PC */}
                        <View style={styles.rowInputs}>
                            <TextInput
                                label="Taller / Lugar (Opcional)"
                                value={taller}
                                onChangeText={setTaller}
                                style={styles.halfInput}
                                mode="outlined"
                                outlineColor={Colors.textoGris}
                                activeOutlineColor={Colors.primario}
                                textColor={theme.colors.text}
                            />

                            <TextInput
                                label="Coste total en € (Opcional)"
                                value={coste}
                                onChangeText={setCoste}
                                keyboardType="numeric"
                                style={styles.halfInput}
                                mode="outlined"
                                outlineColor={Colors.textoGris}
                                activeOutlineColor={Colors.primario}
                                textColor={theme.colors.text}
                            />
                        </View>

                        {/* SECCIÓN SELECCIÓN DE REPUESTO */}
                        <Text style={styles.sectionLabel}>Selección de Repuesto Utilizado</Text>
                        
                        {repuestos.map((rep, idx) => {
                            const isSelected = selectedOption === idx.toString();
                            return (
                                <TouchableOpacity 
                                    key={idx}
                                    activeOpacity={0.8}
                                    onPress={() => setSelectedOption(idx.toString())}
                                    style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                                >
                                    <View style={styles.optionTextContainer}>
                                        <Text style={styles.optionTitle}>{rep.nombre}</Text>
                                        <Text style={styles.optionSubtitle}>Marca oficial recomendada: {rep.marca}</Text>
                                    </View>
                                    <MaterialCommunityIcons 
                                        name={isSelected ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"} 
                                        size={24} 
                                        color={isSelected ? Colors.primario : Colors.textoGris} 
                                    />
                                </TouchableOpacity>
                            );
                        })}

                        {/* Opción Personalizada */}
                        <TouchableOpacity 
                            activeOpacity={0.8}
                            onPress={() => setSelectedOption('custom')}
                            style={[
                                styles.optionCard, 
                                selectedOption === 'custom' && styles.optionCardSelected
                            ]}
                        >
                            <View style={styles.optionTextContainer}>
                                <Text style={styles.optionTitle}>Otro repuesto personalizado</Text>
                                <Text style={styles.optionSubtitle}>Ingresa una marca y modelo diferente</Text>
                            </View>
                            <MaterialCommunityIcons 
                                name={selectedOption === 'custom' ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"} 
                                size={24} 
                                color={selectedOption === 'custom' ? Colors.primario : Colors.textoGris} 
                            />
                        </TouchableOpacity>

                        {/* Campos para Opción Personalizada */}
                        {selectedOption === 'custom' && (
                            <View style={styles.customFieldsContainer}>
                                <Text style={[styles.sectionLabel, { marginTop: 0, fontSize: 14, color: Colors.primario }]}>
                                    Detalles del Repuesto Personalizado
                                </Text>
                                <TextInput
                                    label="Marca (ej. Bosch, Brembo, Castrol...)"
                                    value={customMarca}
                                    onChangeText={setCustomMarca}
                                    style={styles.input}
                                    mode="outlined"
                                    outlineColor={Colors.textoGris}
                                    activeOutlineColor={Colors.primario}
                                    textColor={theme.colors.text}
                                />
                                <TextInput
                                    label="Nombre / Modelo del repuesto"
                                    value={customNombre}
                                    onChangeText={setCustomNombre}
                                    style={styles.input}
                                    mode="outlined"
                                    outlineColor={Colors.textoGris}
                                    activeOutlineColor={Colors.primario}
                                    textColor={theme.colors.text}
                                />
                                <TextInput
                                    label="Enlace de compra (Opcional)"
                                    value={customEnlace}
                                    onChangeText={setCustomEnlace}
                                    style={[styles.input, { marginBottom: 0 }]}
                                    mode="outlined"
                                    outlineColor={Colors.textoGris}
                                    activeOutlineColor={Colors.primario}
                                    textColor={theme.colors.text}
                                />
                            </View>
                        )}

                        {/* Opción Ninguno */}
                        <TouchableOpacity 
                            activeOpacity={0.8}
                            onPress={() => setSelectedOption('none')}
                            style={[
                                styles.optionCard, 
                                selectedOption === 'none' && styles.optionCardSelected
                            ]}
                        >
                            <View style={styles.optionTextContainer}>
                                <Text style={styles.optionTitle}>Ningún repuesto / Solo revisión</Text>
                                <Text style={styles.optionSubtitle}>No se ha sustituido ningún componente físico</Text>
                            </View>
                            <MaterialCommunityIcons 
                                name={selectedOption === 'none' ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"} 
                                size={24} 
                                color={selectedOption === 'none' ? Colors.primario : Colors.textoGris} 
                            />
                        </TouchableOpacity>

                        {/* OBSERVACIONES */}
                        <Text style={styles.sectionLabel}>Observaciones</Text>
                        <TextInput
                            label="Notas adicionales (ej. estado de las piezas viejas...)"
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
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default RegisterMaintenanceScreen;

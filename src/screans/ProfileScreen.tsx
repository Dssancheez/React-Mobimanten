import React, { useContext, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, FlatList, ActivityIndicator, Image } from 'react-native';
import { Text, Button, Avatar, Switch, List, Card, Divider, Modal, Portal } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';
import { useGlobalStyles, useAppTheme } from '../styles/theme';
import { ThemeContext } from '../context/ThemeContext';
import { useMutation } from '@apollo/client/react';
import { ACTUALIZAR_USUARIO } from '../graphql/mutations';
import { ResponsiveContainer } from '../components/ResponsiveContainer';

// Mapeo de imágenes locales para que funcionen con require
const AVATARES_LOCALES: { [key: string]: any } = {
    'BMW-Logo.png': require('../../assets/images/BMW-Logo.png'),
    'Mustang-Logo.png': require('../../assets/images/Mustang-Logo.png'),
    'SEAT-Logo.png': require('../../assets/images/SEAT-Logo.png'),
    'ferrari-logo.png': require('../../assets/images/ferrari-logo.png'),
    'renault-logo.png': require('../../assets/images/renault-logo.png'),
    'toyota-logo.png': require('../../assets/images/toyota-logo.png'),
    'logo.png': require('../../assets/images/logo.png'),
};

const AVATARES_PREDEFINIDOS = [
    { id: '1', name: 'BMW', fileName: 'BMW-Logo.png' },
    { id: '2', name: 'Mustang', fileName: 'Mustang-Logo.png' },
    { id: '3', name: 'SEAT', fileName: 'SEAT-Logo.png' },
    { id: '4', name: 'Ferrari', fileName: 'ferrari-logo.png' },
    { id: '5', name: 'Renault', fileName: 'renault-logo.png' },
    { id: '6', name: 'Toyota', fileName: 'toyota-logo.png' },
    { id: '7', name: 'MobiManten', fileName: 'logo.png' },
];

const ProfileScreen = () => {
    const { usuario, logout, login, token } = useContext<any>(AuthContext);
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const [modalVisible, setModalVisible] = useState(false);
    const [actualizarUsuario, { loading: updating }] = useMutation(ACTUALIZAR_USUARIO);
    const theme = useAppTheme();
    const Colors = theme.customColors;

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: 'rgba(20, 20, 20, 0.9)', // Negro translúcido tirando a gris
            paddingTop: Platform.OS === 'ios' ? 50 : 20,
            // @ts-ignore - backdropFilter solo funciona en web pero no rompe en nativo
            backdropFilter: 'blur(15px)',
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingBottom: 20,
        },
        headerCard: {
            margin: 16,
            padding: 20,
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.05)', // Tarjeta muy sutil
            borderRadius: 16,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.1)',
        },
        avatarContainer: {
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: '#F0F0F0',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 15,
            borderWidth: 1,
            borderColor: '#DDD',
            overflow: 'hidden',
        },
        avatarImage: {
            width: 70,
            height: 70,
        },
        fullAvatarImage: {
            width: 100,
            height: 100,
        },
        userName: {
            fontSize: 24,
            fontWeight: 'bold',
            color: theme.colors.text,
            textAlign: 'center',
        },
        userEmail: {
            fontSize: 14,
            color: Colors.textoGris,
            marginTop: 4,
            textAlign: 'center',
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            marginLeft: 20,
            marginTop: 20,
            marginBottom: 10,
            color: Colors.primario,
        },
        logoutButton: {
            margin: 20,
            marginTop: 40,
            borderRadius: 10,
            paddingVertical: 6,
        },
        modalContainer: {
            backgroundColor: Colors.tarjeta,
            padding: 20,
            margin: 20,
            borderRadius: 20,
            maxHeight: '80%',
        },
        avatarOption: {
            flex: 1,
            margin: 10,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 10,
            backgroundColor: Colors.fondo,
            borderRadius: 15,
            borderWidth: 2,
            borderColor: 'transparent',
        },
        avatarSelected: {
            borderColor: Colors.primario,
        }
    });

    const handleSelectAvatar = async (fileName: string) => {
        try {
            const { data } = await actualizarUsuario({
                variables: {
                    id: usuario.id,
                    avatar: fileName
                }
            });
            if (data?.actualizarUsuario) {
                await login(data.actualizarUsuario, token);
                setModalVisible(false);
            }
        } catch (e) {
            console.error("Error updating avatar", e);
        }
    };

    const renderProfileAvatar = () => {
        if (usuario?.avatar && AVATARES_LOCALES[usuario.avatar]) {
            const isBMW = usuario.avatar === 'BMW-Logo.png';
            return (
                <View style={styles.avatarContainer}>
                    <Image 
                        source={AVATARES_LOCALES[usuario.avatar]} 
                        style={isBMW ? styles.fullAvatarImage : styles.avatarImage} 
                        resizeMode={isBMW ? "cover" : "contain"}
                    />
                </View>
            );
        }
        
        return (
            <View style={[styles.avatarContainer, { backgroundColor: Colors.primario }]}>
                <Avatar.Icon size={100} icon="account" color="white" style={{ backgroundColor: 'transparent' }} />
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons name="chevron-left" size={32} color={Colors.primario} />
                </TouchableOpacity>
                <Text style={[styles.userName, { marginLeft: 15 }]}>Mi Perfil</Text>
            </View>

            <ScrollView>
                <Card style={styles.headerCard}>
                    <View style={{ alignItems: 'center', width: '100%' }}>
                        {renderProfileAvatar()}
                        <Text style={styles.userName}>{usuario?.nombre || 'Usuario'}</Text>
                        <Text style={styles.userEmail}>{usuario?.email || 'Sin correo'}</Text>
                    </View>
                </Card>

                <Text style={styles.sectionTitle}>Ajustes de la Aplicación</Text>
                <List.Section>
                    <List.Item
                        title="Modo Oscuro"
                        description="Cambia el aspecto visual de la app"
                        left={props => <List.Icon {...props} icon="theme-light-dark" color={Colors.primario} />}
                        right={() => (
                            <Switch 
                                value={isDarkMode} 
                                onValueChange={toggleTheme} 
                                color={Colors.primario} 
                            />
                        )}
                        style={{ paddingVertical: 10 }}
                        titleStyle={{ color: 'white' }}
                        descriptionStyle={{ color: 'rgba(255,255,255,0.6)' }}
                    />
                </List.Section>

                <Text style={styles.sectionTitle}>Cuenta y Seguridad</Text>
                <List.Section>
                    <List.Item
                        title="Editar Perfil"
                        left={props => <List.Icon {...props} icon="account-edit-outline" color={Colors.primario} />}
                        right={() => <List.Icon icon="chevron-right" color="rgba(255,255,255,0.3)" />}
                        onPress={() => setModalVisible(true)}
                        titleStyle={{ color: 'white' }}
                    />
                    <Divider style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
                    <List.Item
                        title="Cambiar Contraseña"
                        left={props => <List.Icon {...props} icon="lock-outline" color={Colors.primario} />}
                        right={() => <List.Icon icon="chevron-right" color="rgba(255,255,255,0.3)" />}
                        onPress={() => {}}
                        titleStyle={{ color: 'white' }}
                    />
                </List.Section>

                <Button 
                    mode="contained" 
                    onPress={logout} 
                    style={styles.logoutButton}
                    buttonColor={Colors.error}
                    icon="logout"
                >
                    Cerrar Sesión
                </Button>
            </ScrollView>

            <Portal>
                <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modalContainer}>
                    <Text style={[styles.sectionTitle, { marginLeft: 0, marginTop: 0 }]}>Elige tu Escudería</Text>
                    <Text style={{ color: Colors.textoGris, marginBottom: 20 }}>Selecciona tu marca favorita para tu perfil</Text>
                    
                    {updating ? (
                        <ActivityIndicator color={Colors.primario} size="large" style={{ marginVertical: 40 }} />
                    ) : (
                        <FlatList
                            data={AVATARES_PREDEFINIDOS}
                            numColumns={3}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => {
                                const isBMW = item.fileName === 'BMW-Logo.png';
                                return (
                                    <TouchableOpacity 
                                        style={[styles.avatarOption, usuario?.avatar === item.fileName && styles.avatarSelected]}
                                        onPress={() => handleSelectAvatar(item.fileName)}
                                    >
                                        <View style={{ 
                                            width: 60, 
                                            height: 60, 
                                            backgroundColor: '#F0F0F0', 
                                            borderRadius: 30, 
                                            justifyContent: 'center', 
                                            alignItems: 'center',
                                            borderWidth: 1,
                                            borderColor: '#DDD',
                                            overflow: 'hidden'
                                        }}>
                                            <Image 
                                                source={AVATARES_LOCALES[item.fileName]} 
                                                style={isBMW ? { width: 60, height: 60 } : { width: 40, height: 40 }} 
                                                resizeMode={isBMW ? "cover" : "contain"} 
                                            />
                                        </View>
                                        <Text style={{ fontSize: 10, marginTop: 5, color: theme.colors.text }}>{item.name}</Text>
                                    </TouchableOpacity>
                                );
                            }}
                        />
                    )}
                    
                    <Button mode="text" onPress={() => setModalVisible(false)} style={{ marginTop: 20 }} textColor={Colors.primario}>
                        Cancelar
                    </Button>
                </Modal>
            </Portal>
        </ResponsiveContainer>
    );
};

export default ProfileScreen;

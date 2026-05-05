import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Avatar, Switch } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';
import { useGlobalStyles, useAppTheme } from '../styles/theme';
import { ThemeContext } from '../context/ThemeContext';

const ProfileScreen = () => {
    const { usuario, logout } = useContext(AuthContext);
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const globalStyles = useGlobalStyles();
    const theme = useAppTheme();
    const Colors = theme.customColors;

    return (
        <View style={globalStyles.container}>
            <View style={styles.content}>
                <Avatar.Icon size={100} icon="account" style={[styles.avatar, { backgroundColor: Colors.primario }]} color="white" />
                
                <Text style={[styles.name, { color: theme.colors.text }]}>{usuario?.nombre || 'Usuario'}</Text>
                <Text style={[styles.email, { color: Colors.textoGris }]}>{usuario?.email || 'Sin correo'}</Text>

                <View style={[styles.themeToggleContainer, { backgroundColor: Colors.tarjeta }]}>
                    <Text style={{ color: theme.colors.text, fontSize: 16 }}>Modo Oscuro</Text>
                    <Switch value={isDarkMode} onValueChange={toggleTheme} color={Colors.primario} />
                </View>

                <Button 
                    mode="contained" 
                    onPress={logout} 
                    style={styles.logoutButton}
                    buttonColor={Colors.error}
                    icon="logout"
                >
                    Cerrar Sesión
                </Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    avatar: {
        marginBottom: 20,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    email: {
        fontSize: 16,
        marginBottom: 40,
    },
    themeToggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 15,
        marginBottom: 30,
        borderRadius: 10,
    },
    logoutButton: {
        width: '100%',
        paddingVertical: 8,
        borderRadius: 8,
    }
});

export default ProfileScreen;

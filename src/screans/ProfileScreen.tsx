import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Avatar } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';
import { Colors, globalStyles } from '../styles/theme';

const ProfileScreen = () => {
    const { usuario, logout } = useContext(AuthContext);

    return (
        <View style={globalStyles.container}>
            <View style={styles.content}>
                <Avatar.Icon size={100} icon="account" style={styles.avatar} color="white" />
                
                <Text style={styles.name}>{usuario?.nombre || 'Usuario'}</Text>
                <Text style={styles.email}>{usuario?.email || 'Sin correo'}</Text>

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
        backgroundColor: Colors.primario,
        marginBottom: 20,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 5,
    },
    email: {
        fontSize: 16,
        color: Colors.textoGris,
        marginBottom: 40,
    },
    logoutButton: {
        width: '100%',
        paddingVertical: 8,
        borderRadius: 8,
    }
});

export default ProfileScreen;

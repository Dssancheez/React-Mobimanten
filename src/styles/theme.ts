import { StyleSheet } from 'react-native';
import { MD3DarkTheme } from 'react-native-paper';

// 1. Definimos los colores base
export const Colors = {
    primario: '#FF8C00',
    fondo: '#191970',
    tarjeta: '#1E1E50',
    textoBlanco: '#F0F8FF',
    textoGris: '#B0C4DE',
    error: '#FF4444'
};

// 2. Este es el objeto que espera <PaperProvider theme={theme}>
// ¡IMPORTANTE!: No uses StyleSheet.create aquí
export const theme = {
    ...MD3DarkTheme,
    colors: {
        ...MD3DarkTheme.colors,
        primary: Colors.primario,
        background: Colors.fondo,
        surface: Colors.tarjeta,
        text: Colors.textoBlanco,
        onSurface: Colors.textoBlanco,
    },
};

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.fondo,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tituloPrincipal: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.textoBlanco,
        textAlign: 'center',
        marginVertical: 10
    }
});
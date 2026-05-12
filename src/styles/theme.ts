import { StyleSheet } from 'react-native';
import { MD3DarkTheme, MD3LightTheme, useTheme } from 'react-native-paper';

export const lightColors = {
    primario: '#FF8C00', // Naranja
    fondo: '#FFFFFF', // Blanco
    tarjeta: '#F0F0F0', // Gris muy claro
    textoPrincipal: '#FF8C00', // Naranja para textos principales según petición
    textoSecundario: '#333333', // Texto normal oscuro para legibilidad
    textoGris: '#666666',
    error: '#FF4444'
};

export const darkColors = {
    primario: '#FF8C00', // Naranja brillante para el modo oscuro
    fondo: '#000000', // Negro puro para el fondo
    tarjeta: '#1A1A1A', // Gris muy oscuro para las tarjetas
    textoPrincipal: '#FF8C00', // Naranja para títulos y detalles
    textoSecundario: '#FFFFFF', // Blanco puro para texto normal
    textoGris: '#9E9E9E', // Gris medio para subtítulos
    error: '#FF5252'
};

export const lightTheme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        primary: lightColors.primario,
        background: lightColors.fondo,
        surface: lightColors.tarjeta,
        text: lightColors.textoSecundario,
        onSurface: lightColors.textoSecundario,
    },
    customColors: lightColors,
};

export const darkTheme = {
    ...MD3DarkTheme,
    colors: {
        ...MD3DarkTheme.colors,
        primary: darkColors.primario,
        background: darkColors.fondo,
        surface: darkColors.tarjeta,
        text: darkColors.textoSecundario,
        onSurface: darkColors.textoSecundario,
    },
    customColors: darkColors,
};

export type AppTheme = typeof lightTheme;

export const useAppTheme = () => useTheme<AppTheme>();

export const useGlobalStyles = () => {
    const theme = useAppTheme();
    const colors = theme.customColors;

    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.fondo,
        },
        center: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.fondo,
        },
        tituloPrincipal: {
            fontSize: 24,
            fontWeight: 'bold',
            color: colors.textoPrincipal,
            textAlign: 'center',
            marginVertical: 10
        },
        webContainer: {
            flex: 1,
            width: '100%',
            maxWidth: 1000,
            alignSelf: 'center',
            backgroundColor: colors.fondo,
        }
    });
};
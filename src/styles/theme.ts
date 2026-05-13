import { StyleSheet } from 'react-native';
import { MD3DarkTheme, MD3LightTheme, useTheme } from 'react-native-paper';
import { Platform, useWindowDimensions } from 'react-native';

export const BREAKPOINT_WEB = 768;


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

export const useIsDesktop = () => {
    const { width } = useWindowDimensions();
    return Platform.OS === 'web' && width >= BREAKPOINT_WEB;
};

export const useGlobalStyles = () => {
    const theme = useAppTheme();
    const colors = theme.customColors;
    const isDesktop = useIsDesktop();

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
            fontSize: isDesktop ? 32 : 24,
            fontWeight: 'bold',
            color: colors.textoPrincipal,
            textAlign: isDesktop ? 'left' : 'center',
            marginVertical: 10
        },
        glassCard: {
            backgroundColor: colors.tarjeta,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.1)',
            ...Platform.select({
                web: {
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                }
            })
        },
        webMaxWidth: {
            maxWidth: 1200,
            width: '100%',
            alignSelf: 'center',
            paddingHorizontal: isDesktop ? 30 : 15
        }
    });
};
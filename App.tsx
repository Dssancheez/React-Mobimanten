import 'react-native-gesture-handler';
import React, { useContext } from 'react';
import { PaperProvider } from 'react-native-paper';
import { ApolloProvider } from "@apollo/client/react";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import client from './src/graphql/apolloClient';
import { lightTheme, darkTheme } from './src/styles/theme';
import { AuthProvider } from './src/context/AuthContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { ThemeProvider, ThemeContext } from './src/context/ThemeContext';
import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

// Manejar la redirección de autenticación en web lo antes posible
if (Platform.OS === 'web') {
    // 1. Intento estándar de Expo
    WebBrowser.maybeCompleteAuthSession();

    // 2. Fallback manual: Si detectamos parámetros de Google y estamos en un popup, cerramos y avisamos
    const url = window.location.href;
    const isAuthRedirect = url.includes('state=') || url.includes('code=') || url.includes('id_token=');

    if (isAuthRedirect && window.opener) {
        // Usamos '*' para el origin para evitar fallos si hay discrepancias entre www y no-www
        window.opener.postMessage(url, "*");
        // Cerrar lo más rápido posible si detectamos que es una redirección de auth
        setTimeout(() => window.close(), 200);
    }

    const style = document.createElement('style');
    style.textContent = `
        html, body, #root {
            margin: 0;
            padding: 0;
            height: 100%;
            width: 100%;
        }
        #root {
            display: flex;
            flex-direction: column;
        }
    `;
    document.head.append(style);
}

const MainApp = () => {
    const { isDarkMode } = useContext(ThemeContext);
    const theme = isDarkMode ? darkTheme : lightTheme;

    return (
        <PaperProvider theme={theme}>
            <RootNavigator />
        </PaperProvider>
    );
};

export default function App() {
    return (
        <SafeAreaProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <ApolloProvider client={client}>
                    <ThemeProvider>
                        <AuthProvider>
                            <MainApp />
                        </AuthProvider>
                    </ThemeProvider>
                </ApolloProvider>
            </GestureHandlerRootView>
        </SafeAreaProvider>
    );
}
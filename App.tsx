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

// Manejar la limpieza de Service Workers antiguos y redirecciones de auth
if (Platform.OS === 'web') {
    // 1. Unregister any existing service workers to fix the "blank screen" issue
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(function(registrations) {
            for(let registration of registrations) {
                registration.unregister();
                console.log('Service Worker unregistered');
            }
        });
    }

    // 2. Intento estándar de Expo para auth
    WebBrowser.maybeCompleteAuthSession();

    // 3. Fallback manual para auth
    const url = window.location.href;
    if ((url.includes('state=') || url.includes('code=')) && window.opener) {
        window.opener.postMessage(url, "*");
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
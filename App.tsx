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

if (Platform.OS === 'web') {
    const style = document.createElement('style');
    style.textContent = `
        html, body, #root {
            margin: 0;
            padding: 0;
            height: 100%;
            overflow: hidden;
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
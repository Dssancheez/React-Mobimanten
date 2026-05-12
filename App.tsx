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
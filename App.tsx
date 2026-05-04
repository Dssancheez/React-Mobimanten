import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { ApolloProvider } from "@apollo/client/react";

import client from './src/graphql/apolloClient';
import { theme } from './src/styles/theme';
import { AuthProvider } from './src/context/AuthContext';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
    return (
        <ApolloProvider client={client}>
            <AuthProvider>
                <PaperProvider theme={theme}>
                    <RootNavigator />
                </PaperProvider>
            </AuthProvider>
        </ApolloProvider>
    );
}
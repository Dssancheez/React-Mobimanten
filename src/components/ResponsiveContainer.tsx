import React from 'react';
import { View, ScrollView, Platform, StyleSheet } from 'react-native';
import { useGlobalStyles, useIsDesktop } from '../styles/theme';

interface ResponsiveContainerProps {
    children: React.ReactNode;
    scrollable?: boolean;
    maxWidth?: number;
    style?: any;
    contentContainerStyle?: any;
}

export const ResponsiveContainer = ({ 
    children, 
    scrollable = true, 
    maxWidth = 1000, 
    style,
    contentContainerStyle 
}: ResponsiveContainerProps) => {
    const globalStyles = useGlobalStyles();
    const isDesktop = useIsDesktop();

    // Contenedor principal que ocupa todo el espacio
    const containerStyle = [
        globalStyles.container,
        style
    ];

    // Contenido centrado si es escritorio
    const renderContent = () => (
        <View style={[
            { width: '100%' },
            isDesktop && { maxWidth: maxWidth, alignSelf: 'center' }
        ]}>
            {children}
        </View>
    );

    if (scrollable) {
        return (
            <View style={containerStyle}>
                <ScrollView 
                    contentContainerStyle={[
                        { flexGrow: 1, paddingBottom: 40 },
                        contentContainerStyle
                    ]}
                    showsVerticalScrollIndicator={true}
                >
                    {renderContent()}
                </ScrollView>
            </View>
        );
    }

    return (
        <View style={[containerStyle, isDesktop && { justifyContent: 'center' }]}>
            {renderContent()}
        </View>
    );
};

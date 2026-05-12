import React from 'react';
import { View, ScrollView, Platform, StyleSheet, useWindowDimensions } from 'react-native';
import { useGlobalStyles } from '../styles/theme';

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
    const { width } = useWindowDimensions();
    const isWeb = Platform.OS === 'web';

    const outerStyle = [
        globalStyles.container,
        isWeb && { flex: 1 },
        { backgroundColor: globalStyles.container.backgroundColor },
        style
    ];

    const innerStyle = [
        { flex: 1, width: '100%' },
        // En web permitimos que ocupe todo el ancho para una experiencia de escritorio real
    ];

    if (scrollable) {
        return (
            <View style={outerStyle}>
                <ScrollView 
                    style={innerStyle} 
                    contentContainerStyle={[
                        { flexGrow: 1, paddingBottom: 40 },
                        contentContainerStyle
                    ]}
                    showsVerticalScrollIndicator={true}
                    // Forzar el scroll nativo en web
                    {...(isWeb ? { accessibilityRole: 'main' } : {})}
                >
                    {children}
                </ScrollView>
            </View>
        );
    }

    return (
        <View style={outerStyle}>
            <View style={innerStyle}>
                {children}
            </View>
        </View>
    );
};

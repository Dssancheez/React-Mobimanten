import React from 'react';
import { View, ScrollView, Platform } from 'react-native';
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
    const isWeb = Platform.OS === 'web';

    const outerStyle = [
        globalStyles.container,
        isWeb && { flex: 1 },
        style
    ];

    const innerStyle = [
        { flex: 1, width: '100%' },
        isDesktop && { maxWidth: maxWidth, alignSelf: 'center' }
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
                    {...(isDesktop ? { accessibilityRole: 'main' } : {})}
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

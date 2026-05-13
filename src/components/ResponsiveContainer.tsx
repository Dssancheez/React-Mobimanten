import React from 'react';
import { View, ScrollView, Platform, StyleSheet, useWindowDimensions } from 'react-native';
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
        { backgroundColor: globalStyles.container.backgroundColor },
        style
    ];


    const innerStyle = [
        { flex: 1, width: '100%' },
        isDesktop && { 
            maxWidth: maxWidth, 
            alignSelf: 'center',
            // En escritorio, si el ancho es menor que la pantalla, centramos el contenedor
            width: '100%',
        },
    ];

    if (scrollable) {
        return (
            <View style={outerStyle}>
                <ScrollView 
                    style={innerStyle} 
                    contentContainerStyle={[
                        { flexGrow: 1, paddingBottom: 40 },
                        isDesktop && { alignItems: 'center' }, 
                        contentContainerStyle
                    ]}
                    showsVerticalScrollIndicator={true}
                    {...(isDesktop ? { accessibilityRole: 'main' } : {})}

                >
                    <View style={[
                        { width: '100%', flex: 1 },
                        isDesktop && { maxWidth: maxWidth }
                    ]}>
                        {children}
                    </View>
                </ScrollView>
            </View>
        );
    }

    return (
        <View style={outerStyle}>
            <View style={[
                innerStyle,
                isDesktop && { alignItems: 'center', justifyContent: 'center' }
            ]}>
                <View style={[
                    { width: '100%', flex: 1 },
                    isDesktop && { maxWidth: maxWidth }
                ]}>
                    {children}
                </View>
            </View>
        </View>
    );
};

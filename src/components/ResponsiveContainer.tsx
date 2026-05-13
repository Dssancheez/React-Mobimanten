import React from 'react';
import { View, ScrollView, Platform, StyleSheet, useWindowDimensions } from 'react-native';
import { useGlobalStyles, useIsDesktop, useAppTheme } from '../styles/theme';


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
    const theme = useAppTheme();
    const globalStyles = useGlobalStyles();
    const isDesktop = useIsDesktop();
    const isWeb = Platform.OS === 'web';


    const outerStyle = [
        globalStyles.container,
        isWeb && { flex: 1 },
        isDesktop && { 
            backgroundColor: isWeb ? (theme.customColors.fondo === '#FFFFFF' ? '#F5F5F5' : '#0A0A0A') : globalStyles.container.backgroundColor,
        },
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
                    {children}
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
                {children}
            </View>
        </View>
    );
};

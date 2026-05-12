import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as Haptics from 'expo-haptics';

type ThemeContextType = {
    isDarkMode: boolean;
    toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType>({
    isDarkMode: true,
    toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem('@app_theme');
                if (savedTheme !== null) {
                    setIsDarkMode(savedTheme === 'dark');
                }
            } catch (error) {
                console.log('Error loading theme:', error);
            }
        };
        loadTheme();
    }, []);

    const toggleTheme = async () => {
        try {
            const newTheme = !isDarkMode;
            setIsDarkMode(newTheme);
            Haptics.selectionAsync(); // Vibración sutil al cambiar de tema
            await AsyncStorage.setItem('@app_theme', newTheme ? 'dark' : 'light');
        } catch (error) {
            console.log('Error saving theme:', error);
        }
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

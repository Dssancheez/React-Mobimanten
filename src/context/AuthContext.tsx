import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Usuario } from '../graphql/queries'; // we'll use a type from there or define inline

interface AuthContextData {
  usuario: { id: string; nombre: string; email: string; avatar?: string } | null;
  token: string | null;
  login: (userData: any, token: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [usuario, setUsuario] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if token exists on app start
    const loadStorageData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const storedUser = await AsyncStorage.getItem('usuario');
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUsuario(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error loading data from storage', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStorageData();
  }, []);

  const login = async (userData: any, authToken: string) => {
    setUsuario(userData);
    setToken(authToken);
    await AsyncStorage.setItem('token', authToken);
    await AsyncStorage.setItem('usuario', JSON.stringify(userData));
  };

  const logout = async () => {
    setUsuario(null);
    setToken(null);
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('usuario');
  };

  return (
    <AuthContext.Provider value={{ usuario, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

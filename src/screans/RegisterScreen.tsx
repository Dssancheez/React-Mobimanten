import React, { useState, useContext } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { useMutation } from '@apollo/client/react';
import { REGISTRO, LOGIN } from '../graphql/mutations';
import { AuthContext } from '../context/AuthContext';
import { useGlobalStyles, useAppTheme, useIsDesktop } from '../styles/theme';
import { ResponsiveContainer } from '../components/ResponsiveContainer';

const RegisterScreen = ({ navigation }: any) => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { login } = useContext<any>(AuthContext);
  const globalStyles = useGlobalStyles();
  const theme = useAppTheme();
  const Colors = theme.customColors;

  const isDesktop = useIsDesktop();

  const styles = StyleSheet.create({
    scroll: {
      flexGrow: 1,
      width: '100%',
      justifyContent: 'center',
      padding: 20,
      ...(isDesktop ? {
        backgroundColor: theme.colors.background,
        borderRadius: 20,
        marginVertical: 40,
        padding: 40,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 15,
        borderWidth: 1,
        borderColor: 'rgba(255, 140, 0, 0.2)',
      } : {}),
    },
    header: {
      marginBottom: 40,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 16,
      color: Colors.textoGris,
    },
    form: {
      width: '100%',
    },
    input: {
      marginBottom: 15,
      backgroundColor: isDesktop ? Colors.fondo : Colors.tarjeta,
    },
    button: {
      marginTop: 15,
      paddingVertical: 6,
      borderRadius: 8,
    },
    buttonLabel: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    errorText: {
      color: Colors.error,
      textAlign: 'center',
      marginBottom: 10,
    }
  });

  const [registroMutation, { loading: loadingRegistro, error: errorRegistro }] = useMutation<any>(REGISTRO);

  const [loginMutation, { loading: loadingLogin }] = useMutation<any>(LOGIN);

  const handleRegister = async () => {
    try {
      const { data } = await registroMutation({
        variables: { nombre, email, password }
      });
      
      if (data?.registrarUsuario) {
        // Auto-login after register
        const { data: loginData } = await loginMutation({
            variables: { email, password }
        });
        if (loginData?.login) {
            await login(loginData.login.usuario, loginData.login.token);
        }
      }
    } catch (e) {
      console.error("Register error", e);
    }
  };

  const isLoading = loadingRegistro || loadingLogin;

  return (
    <ResponsiveContainer 
        maxWidth={450}
        scrollable={true}
    >
      <View style={styles.scroll}>
        <View style={styles.header}>
            <Text style={styles.title}>Crear Cuenta</Text>
            <Text style={styles.subtitle}>Únete a MobiManten para gestionar tus vehículos</Text>
        </View>

        <View style={styles.form}>
            <TextInput
            label="Nombre Completo"
            value={nombre}
            onChangeText={setNombre}
            style={styles.input}
            mode="outlined"
            outlineColor={Colors.textoGris}
            activeOutlineColor={Colors.primario}
            textColor={theme.colors.text}
            />
            <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
            mode="outlined"
            outlineColor={Colors.textoGris}
            activeOutlineColor={Colors.primario}
            textColor={theme.colors.text}
            />
            <TextInput
            label="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            mode="outlined"
            outlineColor={Colors.textoGris}
            activeOutlineColor={Colors.primario}
            textColor={theme.colors.text}
            />

            {errorRegistro && <Text style={styles.errorText}>Error: {errorRegistro.message}</Text>}

            <Button 
            mode="contained" 
            onPress={handleRegister} 
            loading={isLoading}
            disabled={isLoading}
            style={styles.button}
            buttonColor={Colors.primario}
            labelStyle={styles.buttonLabel}
            >
            Registrarse
            </Button>

            <Button 
            mode="text" 
            onPress={() => navigation.goBack()}
            textColor={Colors.textoGris}
            style={{marginTop: 10}}
            >
            ¿Ya tienes cuenta? Inicia sesión
            </Button>
        </View>
      </View>
    </ResponsiveContainer>
  );
};

export default RegisterScreen;

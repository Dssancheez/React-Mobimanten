import React, { useState, useContext } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { useMutation } from '@apollo/client/react';
import { REGISTRO, LOGIN } from '../graphql/mutations';
import { AuthContext } from '../context/AuthContext';
import { useGlobalStyles, useAppTheme } from '../styles/theme';

const RegisterScreen = ({ navigation }: any) => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { login } = useContext<any>(AuthContext);
  const globalStyles = useGlobalStyles();
  const theme = useAppTheme();
  const Colors = theme.customColors;

  const styles = StyleSheet.create({
    scroll: {
      flexGrow: 1,
      justifyContent: 'center',
      padding: 20,
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
      backgroundColor: Colors.tarjeta,
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
    <KeyboardAvoidingView 
        style={globalStyles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

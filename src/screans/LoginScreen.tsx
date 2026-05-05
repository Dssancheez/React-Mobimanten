import React, { useState, useContext } from 'react';
import { View, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, ActivityIndicator } from 'react-native-paper';
import { useMutation } from '@apollo/client/react';
import { LOGIN } from '../graphql/mutations';
import { AuthContext } from '../context/AuthContext';
import { useGlobalStyles, useAppTheme } from '../styles/theme';

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const globalStyles = useGlobalStyles();
  const theme = useAppTheme();
  const Colors = theme.customColors;

  const styles = StyleSheet.create({
    content: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
    },
    header: {
      alignItems: 'center',
      marginBottom: 40,
    },
    logo: {
      width: 120,
      height: 120,
      borderRadius: 60,
      marginBottom: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.colors.text,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      color: Colors.textoGris,
      marginTop: 5,
    },
    form: {
      width: '100%',
    },
    input: {
      marginBottom: 15,
      backgroundColor: Colors.tarjeta,
    },
    button: {
      marginTop: 10,
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

  const [loginMutation, { loading, error }] = useMutation(LOGIN);

  const handleLogin = async () => {
    try {
      const { data } = await loginMutation({
        variables: { email, password }
      });
      if (data?.login) {
        await login(data.login.usuario, data.login.token);
      }
    } catch (e) {
      console.error("Login error", e);
    }
  };

  return (
    <KeyboardAvoidingView
      style={globalStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Image
            source={require('../../assets/images/logo.jpeg')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Bienvenido a MobiManten</Text>
          <Text style={styles.subtitle}>Tu taller en el bolsillo</Text>
        </View>

        <View style={styles.form}>
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

          {error && <Text style={styles.errorText}>Credenciales incorrectas o error de conexión</Text>}

          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            style={styles.button}
            buttonColor={Colors.primario}
            labelStyle={styles.buttonLabel}
          >
            Iniciar Sesión
          </Button>

          <Button
            mode="text"
            onPress={() => navigation.navigate('Register')}
            textColor={Colors.textoGris}
            style={{ marginTop: 10 }}
          >
            ¿No tienes cuenta? Regístrate
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;




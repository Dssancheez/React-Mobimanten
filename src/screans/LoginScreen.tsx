import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, Image, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Text, TextInput, Button, Divider } from 'react-native-paper';
import { useMutation } from '@apollo/client/react';
import { LOGIN, LOGIN_CON_GOOGLE } from '../graphql/mutations';
import { AuthContext } from '../context/AuthContext';
import { useGlobalStyles, useAppTheme, useIsDesktop } from '../styles/theme';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ResponsiveContainer } from '../components/ResponsiveContainer';

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext<any>(AuthContext);
  const globalStyles = useGlobalStyles();
  const theme = useAppTheme();
  const Colors = theme.customColors;
  const isDesktop = useIsDesktop();

  const [request, response, promptAsync] = Google.useAuthRequest({
    // Usa diferentes IDs para cada plataforma si los tienes, si no, el de web
    clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID, 
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    useProxy: false,
    
    // En web, no usamos el proxy ni esquema para evitar la pantalla intermedia de Expo
    redirectUri: AuthSession.makeRedirectUri({
      scheme: Platform.OS === 'web' ? undefined : 'mobimanten',
      useProxy: false,
    }),
    responseType: AuthSession.ResponseType.IdToken,
  }, { useProxy: false });



  const [loginMutation, { loading, error }] = useMutation<any>(LOGIN);
  const [loginConGoogleMutation, { loading: googleLoading }] = useMutation<any>(LOGIN_CON_GOOGLE);

  useEffect(() => {
    const redirectUri = AuthSession.makeRedirectUri();
    console.log("Redirect URI being used:", redirectUri);
    console.log("Google Auth Response:", response?.type);
    
    if (response?.type === 'success') {
      const { id_token } = response.params;
      // El token puede venir en params (id_token) o en el objeto authentication del response
      const token = id_token || response.authentication?.idToken;

      if (token) {
        handleGoogleLogin(token);
      } else {
        console.warn("No id_token found in response", response.params);
        Alert.alert("Error", "No se pudo obtener el token de Google.");
      }
    } else if (response?.type === 'error') {
      Alert.alert("Error de Google", response.error?.message || "Error desconocido");
    }
  }, [response]);

  const handleGoogleLogin = async (idToken: string) => {
    try {
      const { data } = await loginConGoogleMutation({
        variables: { idToken }
      });
      if (data?.loginConGoogle) {
        await login(data.loginConGoogle.usuario, data.loginConGoogle.token);
      }
    } catch (e: any) {
      console.error("Google login error", e);
      Alert.alert("Error de Servidor", e.message || "Error al conectar con el backend.");
    }
  };

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




  const styles = StyleSheet.create({
    content: {
      flex: 1,
      width: '100%',
      justifyContent: 'center',
      padding: 20,
      ...(isDesktop ? {
        backgroundColor: theme.colors.background, // Blanco o color de fondo del tema
        borderRadius: 20,
        marginVertical: 40,
        padding: 40,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 15,
        borderWidth: 1,
        borderColor: 'rgba(255, 140, 0, 0.2)', // Naranja MobiManten sutil
      } : {}),
    },
    header: {
      alignItems: 'center',
      marginBottom: 30,
    },
    logo: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 15,
    },
    title: {
      fontSize: 26,
      fontWeight: 'bold',
      color: theme.colors.text,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 15,
      color: Colors.textoGris,
      marginTop: 5,
    },
    form: {
      width: '100%',
    },
    input: {
      marginBottom: 15,
      backgroundColor: isDesktop ? Colors.fondo : Colors.tarjeta,
    },
    button: {
      marginTop: 10,
      paddingVertical: 6,
      borderRadius: 8,
    },
    googleButton: {
      marginTop: 15,
      paddingVertical: 6,
      borderRadius: 8,
      borderColor: Colors.textoGris,
    },
    buttonLabel: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    errorText: {
      color: Colors.error,
      textAlign: 'center',
      marginBottom: 10,
    },
    dividerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 20,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: isDesktop ? Colors.fondo : Colors.tarjeta,
    },
    dividerText: {
      marginHorizontal: 10,
      color: Colors.textoGris,
      fontSize: 14,
    }
  });

  return (
    <ResponsiveContainer
      maxWidth={450}
      scrollable={true}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Image
            source={require('../../assets/images/logo.png')}
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
            disabled={loading || googleLoading}
            style={styles.button}
            buttonColor={Colors.primario}
            labelStyle={styles.buttonLabel}
          >
            Iniciar Sesión
          </Button>

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>O continúa con</Text>
            <View style={styles.dividerLine} />
          </View>

          <Button
            mode="outlined"
            onPress={() => promptAsync()}

            loading={googleLoading}
            disabled={loading || googleLoading || !request}
            style={styles.googleButton}
            textColor={theme.colors.text}
            icon={({ size, color }) => (
              <MaterialCommunityIcons name="google" size={size} color="#DB4437" />
            )}
            labelStyle={styles.buttonLabel}
          >
            Google
          </Button>

          <Button
            mode="text"
            onPress={() => navigation.navigate('Register')}
            textColor={Colors.textoGris}
            style={{ marginTop: 20 }}
          >
            ¿No tienes cuenta? Regístrate
          </Button>
        </View>
      </View>
    </ResponsiveContainer>
  );
};

export default LoginScreen;

import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, Image, KeyboardAvoidingView, Platform, Divider, Alert } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { useMutation } from '@apollo/client/react';
import { LOGIN, LOGIN_CON_GOOGLE } from '../graphql/mutations';
import { AuthContext } from '../context/AuthContext';
import { useGlobalStyles, useAppTheme } from '../styles/theme';
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

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    redirectUri: "https://auth.expo.io/@anonymous/React-MobiManten",
    responseType: AuthSession.ResponseType.IdToken,
  });

  const [loginMutation, { loading, error }] = useMutation<any>(LOGIN);
  const [loginConGoogleMutation, { loading: googleLoading }] = useMutation<any>(LOGIN_CON_GOOGLE);

  useEffect(() => {
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
    } catch (e) {
      console.error("Google login error", e);
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

  const handleCustomProxyLogin = async () => {
    if (!request) return;

    try {
      const returnUrl = AuthSession.makeRedirectUri();
      
      const authUrl = encodeURIComponent(request.url);
      const encodedReturnUrl = encodeURIComponent(returnUrl);
      const proxyUrl = `https://auth.expo.io/@anonymous/React-MobiManten/start?authUrl=${authUrl}&returnUrl=${encodedReturnUrl}`;

      const result = await WebBrowser.openAuthSessionAsync(proxyUrl, returnUrl);

      if (result.type === 'success' && result.url) {
        console.log("DEBUG - Full Redirect URL from Proxy:", result.url);
        let queryString = '';
        if (result.url.includes('#')) {
          queryString = result.url.split('#')[1];
        } else if (result.url.includes('?')) {
          queryString = result.url.split('?')[1];
        }

        let id_token = null;
        if (queryString) {
          const paramsArr = queryString.split('&');
          for (let param of paramsArr) {
            const [key, val] = param.split('=');
            if (key === 'id_token' || key === 'access_token') {
              id_token = decodeURIComponent(val);
              break;
            }
          }
        }
        
        if (id_token) {
          handleGoogleLogin(id_token);
        } else {
          console.warn("Token not found. Query string parsed:", queryString);
          Alert.alert("Error", "No se encontró el token en la respuesta");
        }
      }
    } catch (e) {
      console.error("Proxy login error", e);
      Alert.alert("Error", "Fallo al iniciar sesión con Google");
    }
  };

  const styles = StyleSheet.create({
    content: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
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
      backgroundColor: Colors.tarjeta,
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
      backgroundColor: Colors.tarjeta,
    },
    dividerText: {
      marginHorizontal: 10,
      color: Colors.textoGris,
      fontSize: 14,
    }
  });

  return (
    <ResponsiveContainer
      style={globalStyles.container}
      maxWidth={500}
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
            onPress={handleCustomProxyLogin}
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

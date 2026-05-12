import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const debuggerHost = Constants.expoConfig?.hostUri;
const localhost = debuggerHost?.split(':').shift() || 'localhost';

const uri = __DEV__ 
  ? `http://${localhost}:8080/graphql` 
  : 'https://backend-mobimanten-production.up.railway.app/graphql';

const httpLink = createHttpLink({
  uri: uri,
});

const authLink = setContext(async (_, { headers }) => {
  const token = await AsyncStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
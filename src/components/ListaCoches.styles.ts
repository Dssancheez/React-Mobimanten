import { StyleSheet } from 'react-native';
import { Colors } from '../styles/theme';

export const styles = StyleSheet.create({
    listContent: {
        padding: 16,
    },
    card: {
        marginBottom: 16,
        backgroundColor: Colors.tarjeta,
    },
    title: {
        color: Colors.primario,
        fontWeight: 'bold',
    },
    subtitle: {
        color: Colors.textoGris,
    },
    infoText: {
        color: Colors.textoBlanco,
    }
});
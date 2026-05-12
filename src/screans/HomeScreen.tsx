import React, {useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {ListaCoches} from '../components/ListaCoches';
import {useQuery} from "@apollo/client/react";
import {Coche, GET_COCHES} from "@/src/graphql/queries";
import {useGlobalStyles, useAppTheme} from "@/src/styles/theme";
import {Searchbar, Text} from "react-native-paper";

const HomeScreen = ({navigation}: any) => {

    const [searchQuery, setSearchQuery] = useState('');
    const {data, loading, error, refetch} = useQuery<{ getCoches: Coche[] }>(GET_COCHES);
    const globalStyles = useGlobalStyles();
    const theme = useAppTheme();
    const Colors = theme.customColors;



    const cochesFiltrados = data?.getCoches.filter((coche: Coche) => {
        const busqueda = searchQuery.toLowerCase();

        return (
            coche.marca.toLowerCase().includes(busqueda) ||
            coche.modelo.toLowerCase().includes(busqueda) ||
            coche.motor.toLowerCase().includes(busqueda) ||
            coche.anio.toString().includes(busqueda)
        );
    });

    if (loading) return (
        <View style={globalStyles.center}>
            <ActivityIndicator size="large" color={Colors.primario}/>
        </View>
    );

    if (error) return (
        <View style={globalStyles.center}>
            <Text style={{color: Colors.error}}>
                Error de conexion con el servidor
            </Text>
        </View>
    )


    return (
        <View style={globalStyles.container}>
            <Searchbar
                placeholder="Marca, modelo, motor o año..."
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={{
                    margin: 16,
                    backgroundColor: Colors.tarjeta,
                    borderRadius: 12
                }}
                iconColor={Colors.primario}
                inputStyle={{color: theme.colors.text}}
                placeholderTextColor={Colors.textoGris}
            />

            <ListaCoches 
                navigation={navigation}
                coches={cochesFiltrados || []}
                refetch={refetch}
            />
        </View>
    );
};

export default HomeScreen;
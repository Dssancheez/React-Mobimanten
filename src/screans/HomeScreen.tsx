import React, {useState} from 'react';
import {ActivityIndicator, View, Platform} from 'react-native';
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
    const isDesktop = useIsDesktop();



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
            <View style={globalStyles.webMaxWidth}>
                {isDesktop && (
                    <View style={{ marginTop: 40, marginBottom: 20 }}>
                        <Text style={[globalStyles.tituloPrincipal, { marginBottom: 5 }]}>
                            Catálogo de Mantenimiento
                        </Text>
                        <Text style={{ color: Colors.textoGris, fontSize: 18, marginBottom: 20 }}>
                            Busca tu vehículo para ver el mantenimiento recomendado por el fabricante.
                        </Text>
                    </View>
                )}
                
                <Searchbar
                    placeholder="Marca, modelo, motor o año..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={{
                        marginVertical: 16,
                        backgroundColor: Colors.tarjeta,
                        borderRadius: 16,
                        elevation: 4,
                        borderWidth: isDesktop ? 1 : 0,
                        borderColor: 'rgba(255, 126, 0, 0.2)',
                    }}
                    iconColor={Colors.primario}
                    inputStyle={{ color: theme.colors.text }}
                    placeholderTextColor={Colors.textoGris}
                />

                <ListaCoches 
                    navigation={navigation}
                    coches={cochesFiltrados || []}
                    refetch={refetch}
                />
            </View>
        </View>
    );
};

export default HomeScreen;
import React, {useState} from 'react';
import {ActivityIndicator, View, Platform} from 'react-native';
import {ListaCoches} from '../components/ListaCoches';
import {useQuery} from "@apollo/client/react";
import {Coche, GET_COCHES} from "@/src/graphql/queries";
import {useGlobalStyles, useAppTheme, useIsDesktop} from "@/src/styles/theme";
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
            <View style={[
                { flex: 1, alignSelf: 'center', width: '100%' },
                isDesktop ? { flexDirection: 'row', maxWidth: 1400, paddingHorizontal: 20 } : { maxWidth: 1000 }
            ]}>
                {/* Sidebar para Escritorio / Header para Móvil */}
                <View style={isDesktop ? { width: 350, paddingRight: 40, paddingTop: 40 } : { paddingHorizontal: 20 }}>
                    <View style={isDesktop ? { 
                        position: 'sticky', 
                        top: 20,
                        backgroundColor: Colors.tarjeta,
                        padding: 25,
                        borderRadius: 24,
                        borderWidth: 1,
                        borderColor: 'rgba(255, 126, 0, 0.15)',
                    } : {}}>
                        <Text style={[globalStyles.tituloPrincipal, { fontSize: isDesktop ? 28 : 24, marginBottom: 5 }]}>
                            {isDesktop ? 'Filtros' : 'Catálogo'}
                        </Text>
                        <Text style={{ color: Colors.textoGris, fontSize: 14, marginBottom: 20 }}>
                            {isDesktop ? 'Encuentra el mantenimiento exacto para tu motor.' : 'Busca tu vehículo para ver su mantenimiento.'}
                        </Text>

                        <Searchbar
                            placeholder="Marca, modelo..."
                            onChangeText={setSearchQuery}
                            value={searchQuery}
                            style={{
                                marginBottom: 20,
                                backgroundColor: isDesktop ? Colors.fondo : Colors.tarjeta,
                                borderRadius: 12,
                                elevation: 0,
                                borderWidth: 1,
                                borderColor: 'rgba(255, 126, 0, 0.1)',
                            }}
                            iconColor={Colors.primario}
                            inputStyle={{ color: theme.colors.text, fontSize: 14 }}
                            placeholderTextColor={Colors.textoGris}
                        />

                        {isDesktop && (
                            <View>
                                <Text style={{ color: Colors.primario, fontWeight: 'bold', marginBottom: 15, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
                                    Sugerencias
                                </Text>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                                    {['BMW', 'Audi', 'TDI', 'GTI', '2024'].map(tag => (
                                        <View key={tag} style={{ 
                                            backgroundColor: 'rgba(255, 126, 0, 0.05)', 
                                            paddingHorizontal: 12, 
                                            paddingVertical: 6, 
                                            borderRadius: 8,
                                            borderWidth: 1,
                                            borderColor: 'rgba(255, 126, 0, 0.1)'
                                        }}>
                                            <Text style={{ color: Colors.textoGris, fontSize: 12 }}>{tag}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}
                    </View>
                </View>

                {/* Lista de Coches Principal */}
                <View style={{ flex: 1, paddingTop: isDesktop ? 40 : 0 }}>
                    <ListaCoches 
                        navigation={navigation}
                        coches={cochesFiltrados || []}
                        refetch={refetch}
                    />
                </View>
            </View>
        </View>
    );
};

export default HomeScreen;
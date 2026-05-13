import React, {useState} from 'react';
import {ActivityIndicator, View, Platform} from 'react-native';
import {ListaCoches} from '../components/ListaCoches';
import {useQuery} from "@apollo/client/react";
import {Coche, GET_COCHES} from "@/src/graphql/queries";
import {useGlobalStyles, useAppTheme, useIsDesktop} from "@/src/styles/theme";
import {Searchbar, Text, TextInput, Chip} from "react-native-paper";

const HomeScreen = ({navigation}: any) => {
    const [filters, setFilters] = useState({
        marca: '',
        modelo: '',
        motor: '',
        anio: ''
    });

    const {data, loading, error, refetch} = useQuery<{ getCoches: Coche[] }>(GET_COCHES);
    const globalStyles = useGlobalStyles();
    const theme = useAppTheme();
    const Colors = theme.customColors;
    const isDesktop = useIsDesktop();

    // Obtener años únicos para el filtro
    const añosUnicos = Array.from(new Set(data?.getCoches.map(c => c.anio.toString()) || [])).sort((a, b) => b.localeCompare(a));

    const cochesFiltrados = data?.getCoches.filter((coche: Coche) => {
        return (
            coche.marca.toLowerCase().includes(filters.marca.toLowerCase()) &&
            coche.modelo.toLowerCase().includes(filters.modelo.toLowerCase()) &&
            coche.motor.toLowerCase().includes(filters.motor.toLowerCase()) &&
            (filters.anio === '' || coche.anio.toString() === filters.anio)
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
                { flex: 1, width: '100%' },
                isDesktop ? { flexDirection: 'row' } : { maxWidth: 1000, alignSelf: 'center' }
            ]}>
                {/* Sidebar para Escritorio / Header para Móvil */}
                <View style={isDesktop ? { 
                    width: 320, 
                    paddingLeft: 20, 
                    paddingRight: 20, 
                    paddingTop: 30,
                    borderRightWidth: 1,
                    borderRightColor: 'rgba(255, 126, 0, 0.1)',
                    height: '100%'
                } : { paddingHorizontal: 20 }}>
                    
                    <View style={isDesktop ? { position: 'sticky', top: 20 } : {}}>
                        <Text style={[globalStyles.tituloPrincipal, { fontSize: isDesktop ? 26 : 24, marginBottom: 5 }]}>
                            {isDesktop ? 'Buscador' : 'Catálogo'}
                        </Text>
                        <Text style={{ color: Colors.textoGris, fontSize: 13, marginBottom: 25 }}>
                            Filtra por los detalles de tu vehículo.
                        </Text>

                        <View style={{ gap: 15 }}>
                            <TextInput
                                label="Marca"
                                value={filters.marca}
                                onChangeText={(val) => setFilters({...filters, marca: val})}
                                mode="outlined"
                                dense
                                style={{ backgroundColor: Colors.tarjeta }}
                                outlineColor="rgba(255, 126, 0, 0.2)"
                                activeOutlineColor={Colors.primario}
                                textColor={theme.colors.text}
                            />
                            <TextInput
                                label="Modelo"
                                value={filters.modelo}
                                onChangeText={(val) => setFilters({...filters, modelo: val})}
                                mode="outlined"
                                dense
                                style={{ backgroundColor: Colors.tarjeta }}
                                outlineColor="rgba(255, 126, 0, 0.2)"
                                activeOutlineColor={Colors.primario}
                                textColor={theme.colors.text}
                            />
                            <TextInput
                                label="Motor"
                                value={filters.motor}
                                onChangeText={(val) => setFilters({...filters, motor: val})}
                                mode="outlined"
                                dense
                                style={{ backgroundColor: Colors.tarjeta }}
                                outlineColor="rgba(255, 126, 0, 0.2)"
                                activeOutlineColor={Colors.primario}
                                textColor={theme.colors.text}
                            />
                            
                            {isDesktop && (
                                <View>
                                    <Text style={{ color: Colors.textoGris, fontSize: 12, marginBottom: 8, marginTop: 10 }}>Año de fabricación</Text>
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                                        <Chip 
                                            selected={filters.anio === ''} 
                                            onPress={() => setFilters({...filters, anio: ''})}
                                            style={{ backgroundColor: filters.anio === '' ? Colors.primario : Colors.tarjeta }}
                                            textStyle={{ color: filters.anio === '' ? 'white' : theme.colors.text, fontSize: 11 }}
                                        >
                                            Todos
                                        </Chip>
                                        {añosUnicos.map(año => (
                                            <Chip 
                                                key={año}
                                                selected={filters.anio === año} 
                                                onPress={() => setFilters({...filters, anio: año})}
                                                style={{ backgroundColor: filters.anio === año ? Colors.primario : Colors.tarjeta }}
                                                textStyle={{ color: filters.anio === año ? 'white' : theme.colors.text, fontSize: 11 }}
                                            >
                                                {año}
                                            </Chip>
                                        ))}
                                    </View>
                                </View>
                            )}

                            <Button 
                                mode="text" 
                                onPress={() => setFilters({marca: '', modelo: '', motor: '', anio: ''})}
                                textColor={Colors.textoGris}
                                style={{ marginTop: 10 }}
                                icon="refresh"
                            >
                                Limpiar filtros
                            </Button>
                        </View>
                    </View>
                </View>

                {/* Lista de Coches Principal */}
                <View style={{ flex: 1, paddingTop: isDesktop ? 20 : 0 }}>
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
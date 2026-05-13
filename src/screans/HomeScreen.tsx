import React, {useState} from 'react';
import {ActivityIndicator, View, Platform} from 'react-native';
import {ListaCoches} from '../components/ListaCoches';
import {useQuery} from "@apollo/client/react";
import {Coche, GET_COCHES} from "@/src/graphql/queries";
import {useGlobalStyles, useAppTheme, useIsDesktop} from "@/src/styles/theme";
import {Searchbar, Text, TextInput, Chip, Button, Menu, Divider} from "react-native-paper";

const HomeScreen = ({navigation}: any) => {
    const [filters, setFilters] = useState({
        marca: '',
        modelo: '',
        motor: '',
        anio: ''
    });
    const [menuVisible, setMenuVisible] = useState(false);

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
                    width: 420, 
                    paddingLeft: 50, 
                    paddingRight: 50, 
                    paddingTop: 50,
                    borderRightWidth: 1,
                    borderRightColor: 'rgba(255, 126, 0, 0.08)',
                    height: '100%',
                    backgroundColor: 'rgba(255, 126, 0, 0.02)'
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
                            
                            <View style={{ marginTop: 5 }}>
                                <Menu
                                    visible={menuVisible}
                                    onDismiss={() => setMenuVisible(false)}
                                    anchor={
                                        <Button 
                                            mode="outlined" 
                                            onPress={() => setMenuVisible(true)}
                                            style={{ backgroundColor: Colors.tarjeta, borderRadius: 4 }}
                                            textColor={theme.colors.text}
                                            contentStyle={{ justifyContent: 'space-between', flexDirection: 'row-reverse' }}
                                            icon="chevron-down"
                                        >
                                            {filters.anio === '' ? 'Año de fabricación' : `Año: ${filters.anio}`}
                                        </Button>
                                    }
                                    contentStyle={{ backgroundColor: Colors.tarjeta }}
                                >
                                    <Menu.Item 
                                        onPress={() => { setFilters({...filters, anio: ''}); setMenuVisible(false); }} 
                                        title="Todos los años" 
                                        titleStyle={{ color: theme.colors.text }}
                                    />
                                    <Divider />
                                    {añosUnicos.map(año => (
                                        <Menu.Item 
                                            key={año}
                                            onPress={() => { setFilters({...filters, anio: año}); setMenuVisible(false); }} 
                                            title={año} 
                                            titleStyle={{ color: theme.colors.text }}
                                        />
                                    ))}
                                </Menu>
                            </View>

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
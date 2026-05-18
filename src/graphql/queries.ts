import { gql } from '@apollo/client';

export interface Coche {
  id: string;
  marca: string;
  modelo: string;
  anio: number;
  motor: string;
  imagen: string;
  tipo?: string;
  combustible: string;
}

export interface Garaje {
  id: string;
  usuarioId: string;
  apodo: string;
  kilometrajeActual?: number;
  coche: Coche;
}

export interface RepuestoOpcion {
  nombre: string;
  marca: string;
  duracionKm?: number;
  duracionMeses?: number;
  enlaceCompra?: string;
}

export interface Mantenimiento {
  id: string;
  aplicaA?: string[];
  tarea: string;
  intervaloKm?: number;
  intervaloMeses?: number;
  anioDesde?: number;
  anioHasta?: number;
  opcionesRepuestos?: RepuestoOpcion[];
}

export interface HistorialMantenimiento {
  id: string;
  usuarioId: string;
  cocheGarajeId: string;
  cocheApodo?: string;
  tarea: string;
  fechaRealizado: string;
  kilometrosRealizado: number;
  coste?: number;
  taller?: string;
  observaciones?: string;
  proximoCambioKm?: number;
  proximoCambioFecha?: string;
  repuestoSeleccionado?: RepuestoOpcion;
}

export const GET_COCHES = gql`
  query {
    getCoches {
      id
      marca
      modelo
      anio
      motor
      imagen  
      tipo
      combustible
    }
  }
`;

export const GET_MI_GARAJE = gql`
  query ObtenerMiGaraje($usuarioId: String!) {
    obtenerMiGaraje(usuarioId: $usuarioId) {
      id
      apodo
      kilometrajeActual
      coche {
        id
        marca
        modelo
        anio
        motor
        imagen
        tipo
        combustible
      }
    }
  }
`;

export const GET_MANTENIMIENTOS_RECOMENDADOS = gql`
  query ObtenerMantenimientosRecomendados($cocheGarajeId: String!) {
    obtenerMantenimientosRecomendados(cocheGarajeId: $cocheGarajeId) {
      id
      aplicaA
      tarea
      seccion
      intervaloKm
      intervaloMeses
      anioDesde
      anioHasta
      opcionesRepuestos {
        nombre
        marca
        duracionKm
        duracionMeses
        enlaceCompra
      }
    }
  }
`;

export const GET_HISTORIAL_USUARIO = gql`
  query ObtenerHistorialUsuario($usuarioId: String!) {
    obtenerHistorialUsuario(usuarioId: $usuarioId) {
      id
      cocheGarajeId
      cocheApodo
      tarea
      fechaRealizado
      kilometrosRealizado
      coste
      taller
      observaciones
      proximoCambioKm
      proximoCambioFecha
      repuestoSeleccionado {
        nombre
        marca
      }
    }
  }
`;

export const GET_MANTENIMIENTOS = gql`
  query ObtenerMantenimientosPorCoche($cocheId: String!) {
    obtenerMantenimientosPorCoche(cocheId: $cocheId) {
      id
      aplicaA
      tarea
      seccion
      intervaloKm
      intervaloMeses
      anioDesde
      anioHasta
      opcionesRepuestos {
        nombre
        marca
        duracionKm
        duracionMeses
        enlaceCompra
      }
    }
  }
`;
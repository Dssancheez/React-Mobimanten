import { gql } from '@apollo/client';

// 1. Definimos el "molde" de los datos para TypeScript
export interface Coche {
    id: string;
    marca: string;
    modelo: string;
    anio: number;
    motor: string;
    imagen: string;
    tipo?: string;
}

export interface Garaje {
    id: string;
    usuarioId: string;
    apodo: string;
    coche: Coche;
}

export interface Mantenimiento {
    id: string;
    cocheId: string;
    tarea: string;
    intervaloKm?: number;
    intervaloMeses?: number;
    repuestos?: string[];
    enlaceCompra?: string;
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
    }
  }
`;

export const GET_MI_GARAJE = gql`
  query ObtenerMiGaraje($usuarioId: String!) {
    obtenerMiGaraje(usuarioId: $usuarioId) {
      id
      apodo
      coche {
        id
        marca
        modelo
        anio
        motor
        imagen
        tipo
      }
    }
  }
`;

export const GET_MANTENIMIENTOS = gql`
  query ObtenerMantenimientosPorCoche($cocheId: String!) {
    obtenerMantenimientosPorCoche(cocheId: $cocheId) {
      id
      tarea
      intervaloKm
      intervaloMeses
      repuestos
      enlaceCompra
    }
  }
`;
import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(input: { email: $email, password: $password }) {
      token
      usuario {
        id
        nombre
        email
      }
    }
  }
`;

export const REGISTRO = gql`
  mutation RegistrarUsuario($nombre: String!, $email: String!, $password: String!) {
    registrarUsuario(input: { nombre: $nombre, email: $email, password: $password }) {
      id
      nombre
      email
    }
  }
`;

export const ANADIR_COCHE_GARAJE = gql`
  mutation AnadirCocheGaraje($usuarioId: String!, $cocheId: String!, $apodo: String!) {
    anadirCocheGaraje(input: { usuarioId: $usuarioId, cocheId: $cocheId, apodo: $apodo }) {
      id
      apodo
      coche {
        id
        marca
        modelo
      }
    }
  }
`;

export const CREAR_COCHE = gql`
  mutation CrearCoche($input: CocheInput!) {
    crearCoche(input: $input) {
      id
      marca
      modelo
    }
  }
`;

export const ANADIR_MANTENIMIENTO = gql`
  mutation AnadirMantenimiento($input: MantenimientoInput!) {
    anadirMantenimiento(input: $input) {
      id
      tarea
      intervaloKm
      intervaloMeses
    }
  }
`;

export const ELIMINAR_COCHE_GARAJE = gql`
  mutation EliminarCocheDeGaraje($usuarioId: String!, $cocheId: String!) {
    eliminarCocheDeGaraje(usuarioId: $usuarioId, cocheId: $cocheId)
  }
`;

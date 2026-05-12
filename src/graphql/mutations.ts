import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(input: { email: $email, password: $password }) {
      token
      usuario {
        id
        nombre
        email
        avatar
      }
    }
  }
`;

export const LOGIN_CON_GOOGLE = gql`
  mutation LoginConGoogle($idToken: String!) {
    loginConGoogle(idToken: $idToken) {
      token
      usuario {
        id
        nombre
        email
        avatar
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
      avatar
    }
  }
`;

export const ANADIR_COCHE_GARAJE = gql`
  mutation AnadirCocheGaraje($usuarioId: String!, $cocheId: String!, $apodo: String!, $kilometrajeActual: Int) {
    anadirCocheGaraje(input: { usuarioId: $usuarioId, cocheId: $cocheId, apodo: $apodo, kilometrajeActual: $kilometrajeActual }) {
      id
      apodo
      kilometrajeActual
      coche {
        id
        marca
        modelo
      }
    }
  }
`;

export const REGISTRAR_MANTENIMIENTO = gql`
  mutation RegistrarMantenimiento($input: RegistroMantenimientoInput!) {
    registrarMantenimiento(input: $input) {
      id
      tarea
      fechaRealizado
      proximoCambioKm
      proximoCambioFecha
    }
  }
`;

export const ELIMINAR_COCHE_GARAJE = gql`
  mutation EliminarCocheDeGaraje($usuarioId: String!, $cocheId: String!) {
    eliminarCocheDeGaraje(usuarioId: $usuarioId, cocheId: $cocheId)
  }
`;

export const ACTUALIZAR_USUARIO = gql`
  mutation ActualizarUsuario($id: ID!, $nombre: String, $avatar: String) {
    actualizarUsuario(id: $id, nombre: $nombre, avatar: $avatar) {
      id
      nombre
      email
      avatar
    }
  }
`;

import types from "./types";

export function autenticarUsuario(dadosDoUsuario) {
    return { type: types.AUTENTICAR_USUARIO, dadosDoUsuario };
}

export function usuarioAutenticado(dadosDoUsuarioAutenticado){
    return { type: types.AUTENTICADO_USUARIO, dadosDoUsuarioAutenticado };
}
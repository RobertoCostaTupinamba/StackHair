import types from './types';

export function getUser() {
  return {type: types.GET_USER};
}

export function updateUser(user) {
  return {type: types.UPDATE_USER, user};
}

export function updateForm(key, value) {
  return {type: types.UPDATE_FORM, key, value};
}

export function resetUser() {
  return {type: types.RESET_USER};
}


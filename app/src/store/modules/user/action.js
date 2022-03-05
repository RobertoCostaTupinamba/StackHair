import types from './types';

export function createUser(data) {
  return { type: types.CREATE_USER, data };
}

export function getUser(data) {
  return { type: types.GET_USER, data };
}

export function updateUser(user) {
  console.log(user);
  return { type: types.UPDATE_USER, user };
}

export function updateForm(key, value) {
  return { type: types.UPDATE_FORM, key, value };
}

export function resetUser() {
  return { type: types.RESET_USER };
}

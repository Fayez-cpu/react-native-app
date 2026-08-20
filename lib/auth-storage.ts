import * as SecureStore from "expo-secure-store";

const AUTH_TOKEN_KEY = "auth_token";

export const saveAuthToken = (token: string) => SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);

export const getAuthToken = () => SecureStore.getItemAsync(AUTH_TOKEN_KEY);

export const deleteAuthToken = () => SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);

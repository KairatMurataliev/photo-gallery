import { createAsyncThunk } from '@reduxjs/toolkit';
import { GlobalError, LoginMutation, RegisterMutation, RegisterResponse, User, ValidationError } from '../../types';
import axiosApi from '../../axios.ts';
import { isAxiosError } from 'axios';
import {RootState} from "../store.ts";

export const register = createAsyncThunk<User, RegisterMutation, { rejectValue: ValidationError }>(
  'users/register',
  async (registerMutation, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      const keys = Object.keys(registerMutation) as (keyof RegisterMutation)[];
      keys.forEach((key) => {
        const value = registerMutation[key];
        if (value !== null) {
          formData.append(key, value);
        }
      });
      const response = await axiosApi.post<RegisterResponse>('/auth/register', formData);
      return response.data.user;
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 400) {
        return rejectWithValue(e.response.data as ValidationError);
      }
      throw e;
    }
  },
);

export const login = createAsyncThunk<User, LoginMutation, { rejectValue: GlobalError }>(
  'users/login',
  async (loginMutation, { rejectWithValue }) => {
    try {
      const response = await axiosApi.post<RegisterResponse>('/auth/login', loginMutation);
      return response.data.user;
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 400) {
        return rejectWithValue(e.response.data as GlobalError);
      }
      throw e;
    }
  },
);

export const logout = createAsyncThunk<void, undefined, { state: RootState }>(
  'users/logout',
  async (_, {getState}) => {
  const user = getState().users.user;

  await axiosApi.delete('/auth/logout', { headers: {Authorization: user?.token} });
});

export const toggleFavourite = createAsyncThunk<User, string, { state: RootState }>(
  'gallery/toggleFavourite',
  async (id, { getState }) => {
    const user = getState().users.user;
    if (user) {
      try {
        const response = await axiosApi.put(`/users/toggleFavourite/${id}`, { headers: {Authorization: user.token} });
        return response.data
      } catch (err) {
        console.log(err);
      }
    }
  }
);

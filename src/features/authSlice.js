import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BACKEND_URL } from "../config/url"


// Se crea un estado inicial que ira cambiando conforme vayan cambiando de acuerdo con los estados en el "createSlice"
const initialState = {
    user: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ""
}

// Solicitud a la API para iniciar sesión. Este se usa para proteger los "components"
export const LoginUser = createAsyncThunk("user/LoginUser", async (user, thunkAPI) => {

    //axios.post('http://localhost:5000/api/auth/'
    // await axios.post(`${BACKEND_URL}/api/auth/`
    try {
        const response = await axios.post('http://localhost:4000/api/auth/', {
            correo: user.correo,
            clave: user.clave
        });
        const token = response.data.token;
        localStorage.setItem('token', token)
        //return response.data;
    } catch (error) {
        if (error.response) {
            const message = error.response.data.msg; // recibe mensaje del backend con error
            return thunkAPI.rejectWithValue(message); // Luego de enviar el manejo de error, se crea "extraReducers" abajo y esto ayudará a modificar los estados en el "authSlice"
        }
    }
});


// Método logout elimina la sesión creada protegiendo los accesos al aplicativo
export const logoutUser = () => {
    return (dispatch) => {
        localStorage.removeItem('token');
    };
}; 

/* 
    APLICANDO PROCESOS A LOS "INITIALSTATES" PARA QUE SE MODIFIQUEN DE ACUERDO CON LOS CAMBIOS DE ESTADO EN LA APLICACIÓN AL MOMENTO DE INICIAR O CERRAR SESIÓN, Y TENIENDO EN CUENTA EL TIPO DE USUARIO (ADMIN, USER)
*/
export const authSlice = createSlice({
    name: "auth", // Se le asigna nombre 
    initialState, // Invocar los estados iniciales arriba
    reducers: { // Función resetea estado inicial. Recibe paramétro (state) con el nuevo "estado"
        reset: (state) => initialState
    },
    extraReducers: (builder) => { // Constructor "builder" como parámetro y se agregan casos dependiendo del estado
        builder.addCase(LoginUser.pending, (state) => {
            state.isLoading = true; // Si usuario esta cargando, actualiza a true "isLoading" del initialState
        });
        builder.addCase(LoginUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.user = action.payload;
            // Si usuario carga con éxito, actualiza a false "isLoading" del initialState, luego "isSuccess" a true como aprobación, y "action.payload" retorna los datos a la función "LoginUser" para acceder como el usuario autenticado
        });
        builder.addCase(LoginUser.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
            // Si usuario tiene error, actualiza a false "isLoading" del initialState, luego "isError" a true y se envia el "state.message" como "action.payload" a la función "LoginUser" mostrando el error generado
        })
    } 
});

// Se exportan la función {reset} con las acción y "authSlice". Posteriormente ir a la carpeta app que contiene "store.js"
export const { reset } = authSlice.actions;
export default authSlice.reducer; 
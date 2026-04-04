// Archivo de configuración central de Firebase para el navegador (ESM)

// Importar funciones desde los paquetes de Firebase (para Vite)
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Tu configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyA6GpnfuM9aJpH1-TEA5bWZWVA-x2jDnrE",
    authDomain: "copyfast-control-v2.firebaseapp.com",
    projectId: "copyfast-control-v2",
    storageBucket: "copyfast-control-v2.firebasestorage.app",
    messagingSenderId: "331896837052",
    appId: "1:331896837052:web:d4ca4dc73963686bd651b9"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar y exportar los servicios que necesites
export const auth = getAuth(app);
export const db = getFirestore(app);

// Exportar la URL de la API basada en el entorno (Vite manejará esto)
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

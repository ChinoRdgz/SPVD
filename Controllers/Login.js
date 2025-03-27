import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { addDoc, getFirestore, collection } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBNeUIIrJlQ1LYCmXSuVDGWlYHd_YwhGP8",
    authDomain: "spvd-e99ae.firebaseapp.com",
    projectId: "spvd-e99ae",
    storageBucket: "spvd-e99ae.firebasestorage.app",
    messagingSenderId: "1011235959405",
    appId: "1:1011235959405:web:bdbf0ecc29e56ca56dc564",
    measurementId: "G-TPC02L880L"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

import { getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Verificar si Firestore está accesible
async function verificarFirestore() {
    try {
        const snapshot = await getDocs(collection(db, "Bitacora"));
        console.log("🔎 Firestore conectado. Documentos en 'Bitacora':", snapshot.docs.length);
    } catch (error) {
        console.error("❌ Error al conectar con Firestore:", error.code, "-", error.message);
    }
}

// Llamar a la función al cargar la página
verificarFirestore();


console.log("Firebase inicializado:", app);
console.log("Firestore conectado:", db);



document.addEventListener("DOMContentLoaded", function () {
    // Asociamos el evento al botón con id="login"
    document.getElementById("login").addEventListener("click", async function (event) {
        event.preventDefault();  // Evita la acción predeterminada
    
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        
        if (username === "admin" && password === "1234") {
            alert("Bienvenido!");
            
            const dbRef = collection(db, "Bitacora");

            // Crear el registro con la acción y la fecha actual
            const nuevoRegistro = {
                accion: "Inicio de sesión por admin", // Acción que quieres almacenar
                fecha: new Date().toISOString()      // Fecha en formato ISO
            };
    
            console.log("📌 Datos preparados para Firestore:", nuevoRegistro);
    
            // Agregar el registro a Firestore
            const docRef = await addDoc(dbRef, nuevoRegistro);
            console.log("✅ Registro agregado con ID:", docRef.id);
            
            window.location.href = "Models/Principal.html";
        } else {
            alert("Usuario o contraseña incorrectos.");
        }
    });
});




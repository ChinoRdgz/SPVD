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

console.log("Firebase inicializado:", app);
console.log("Firestore conectado:", db);

async function agregarRegistroBitacora() {
    console.log("Intentando agregar registro a la bitácora...");
    try {
        const accion = "Inicio de sesión por admin";
        const nuevoRegistro = {
            accion: accion,
            fecha: new Date().toISOString()
        };

        await addDoc(collection(db, "Bitacora"), nuevoRegistro);
        console.log("Registro agregado a la bitácora.");
    } catch (error) {
        console.error("Error al agregar registro a la bitácora:", error);
    }
}


// Hacer que la función sea accesible globalmente
window.agregarRegistroBitacora = agregarRegistroBitacora;


document.addEventListener("DOMContentLoaded", function () {
    // Asociamos el evento al botón con id="login"
    document.getElementById('login').addEventListener('click', function (event) {
        event.preventDefault();  // Prevenir la acción predeterminada del botón (aunque no es necesario, ya que no es un submit de un formulario)

        // Obtener los valores de usuario y contraseña
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('errorMessage');

        // Validar usuario y contraseña
        if (username === 'admin' && password === '1234') {
            alert('Bienvenido!');
            // Redirigir a la página principal
            window.location.href = '/Models/Principal.html';
        } else {
            // Mostrar el mensaje de error
            errorMessage.textContent = 'Usuario o contraseña incorrectos.';
            errorMessage.style.display = 'block';
        }
    });
});




import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

document.getElementById("enviar").addEventListener("click", enviarDatos);
document.getElementById("mostrar").addEventListener("click", mostrarDatos);

async function enviarDatos() {
    let valor = document.getElementById("nombre").value;
    if (valor.trim() !== "") {
        try {
            console.log("Valor a guardar:", valor); // Para debug
            await setDoc(doc(db, "Datos", "informacion"), { valor });
            alert("¡Valor enviado a Firebase!");
            document.getElementById("nombre").value = "";
        } catch (error) {
            console.error("Error al guardar:", error);
        }
    } else {
        alert("El campo está vacío");
    }
}

async function mostrarDatos() {
    try {
        const docRef = doc(db, "Datos", "informacion");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            // Muestra el valor en la página
            document.getElementById("resultado").textContent = 
                "Valor en Firebase: " + docSnap.data().valor;
        } else {
            console.log("No se encontró el documento.");
            document.getElementById("resultado").textContent = 
                "No se encontró el documento en Firebase.";
        }
    } catch (error) {
        console.error("Error al obtener datos:", error);
        document.getElementById("resultado").textContent = 
            "Ocurrió un error al obtener los datos.";
    }
}

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {addDoc, getFirestore, doc, setDoc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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
//========================================================================================================

async function agregarTecnico() {
    const nombre = document.getElementById("txtNombreTec").value;
    const apellido = document.getElementById("txtApellidoTec").value;
    const telefono = document.getElementById("txtTelefonoTec").value;
    const correo = document.getElementById("txtCorreoTec").value;


    if (nombre.trim() && apellido.trim() && telefono.trim() && correo.trim()) {
        try {
            const docRef = await addDoc(collection(db, "Tecnicos"), { // ← GENERA ID AUTOMÁTICO
                nombre,
                apellido,
                telefono,
                correo
            });

            console.log("Técnico agregado con ID:", docRef.id);
            alert("¡Técnico agregado exitosamente!");

            // Limpiar los campos
            document.getElementById("txtNombreTec").value = "";
            document.getElementById("txtApellidoTec").value = "";
            document.getElementById("txtTelefonoTec").value = "";
            document.getElementById("txtCorreoTec").value = "";
        } catch (error) {
            console.error("Error al agregar técnico:", error);
            alert("Error al agregar técnico. Revisa la consola para más detalles.");
        }
    } else {
        alert("Por favor, complete todos los campos.");
    }
}

async function mostrarTecnicos() {
    const tecnicosContainer = document.getElementById("tecnicos-container");
    tecnicosContainer.innerHTML = ""; // Clear previous content

    try {
        const querySnapshot = await getDocs(collection(db, "Tecnicos"));
        querySnapshot.forEach((doc) => {
            const tecnico = doc.data();
            const tecnicoDiv = document.createElement("div");
            tecnicoDiv.textContent = `${tecnico.nombre} ${tecnico.apellido} - ${tecnico.telefono} - ${tecnico.correo}`;
            tecnicosContainer.appendChild(tecnicoDiv);
        });
    } catch (error) {
        console.error("Error al obtener técnicos:", error);
        alert("Error al obtener técnicos. Por favor, inténtelo de nuevo.");
    }
}

// ========================================================================================================

async function agregarCliente() {
    const nombre = document.getElementById("txtNombreClient").value;
    const apellido = document.getElementById("txtApellidoClient").value;
    const telefono = document.getElementById("txtTelefonoClient").value;
    const correo = document.getElementById("txtCorreoClient").value;


    if (nombre.trim() && apellido.trim() && telefono.trim() && correo.trim()) {
        try {
            const docRef = await addDoc(collection(db, "Clientes"), { // ← GENERA ID AUTOMÁTICO
                nombre,
                apellido,
                telefono,
                correo
            });

            console.log("Client agregado con ID:", docRef.id);
            alert("¡Client agregado exitosamente!");

            // Limpiar los campos
            document.getElementById("txtNombreClient").value = "";
            document.getElementById("txtApellidoClient").value = "";
            document.getElementById("txtTelefonoClient").value = "";
            document.getElementById("txtCorreoClient").value = "";
        } catch (error) {
            console.error("Error al agregar Cliente:", error);
            alert("Error al agregar Cliente. Revisa la consola para más detalles.");
        }
    } else {
        alert("Por favor, complete todos los campos.");
    }
}

async function mostrarClientes() {
    const ClientContainer = document.getElementById("clientes-container");
    ClientContainer.innerHTML = ""; // Clear previous content

    try {
        const querySnapshot = await getDocs(collection(db, "Clientes"));
        querySnapshot.forEach((doc) => {
            const Client = doc.data();
            const ClientDiv = document.createElement("div");
            ClientDiv.textContent = `${Client.nombre} ${Client.apellido} - ${Client.telefono} - ${Client.correo}`;
            ClientContainer.appendChild(ClientDiv);
        });
    } catch (error) {
        console.error("Error al obtener Client:", error);
        alert("Error al obtener Client. Por favor, inténtelo de nuevo.");
    }
}

// ========================================================================================================
document.addEventListener("DOMContentLoaded", function () {
    showSection('dashboard');
    obtenerNumeroClientes();
});

async function obtenerNumeroClientes() {
    try {
        const querySnapshot = await getDocs(collection(db, "Clientes"));
        const numeroClientes = querySnapshot.size; // Contar la cantidad de documentos
        console.log("Número de clientes en la base de datos:", numeroClientes);
        // Mostrar el número de clientes en el HTML
        document.getElementById("numero-clientes").textContent = `${numeroClientes}`;
    } catch (error) {
        console.error("Error al obtener el número de clientes:", error);
    }
}

function openNav() {
    document.getElementById("sidebar").style.width = "250px";
    document.body.classList.add("darkened"); // Add darkened background
}

function closeNav() {
    document.getElementById("sidebar").style.width = "0";
    document.body.classList.remove("darkened"); // Remove darkened background
}

function showSection(sectionId) {

    document.querySelectorAll(".home-section").forEach(section => {
        section.style.display = "none";
    });

    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.style.display = "block";
    }

    closeNav();
}

// Asignar las funciones al objeto global para que funcionen en el HTML
window.openNav = openNav;
window.closeNav = closeNav;
window.showSection = showSection;
window.agregarTecnico = agregarTecnico;
window.mostrarTecnicos = mostrarTecnicos;
window.agregarCliente = agregarCliente;
window.mostrarClientes = mostrarClientes;



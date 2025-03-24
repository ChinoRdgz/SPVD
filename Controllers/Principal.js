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

async function enviarDatos() {
    let valor = document.getElementById("nombre").value;
    if (valor.trim() !== "") {
        try {
            console.log("Valor a guardar:", valor);
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

// Función para abrir el menú lateral
function openNav() {
    document.getElementById("sidebar").style.width = "250px";
    document.body.classList.add("darkened"); // Add darkened background
}

// Función para cerrar el menú lateral
function closeNav() {
    document.getElementById("sidebar").style.width = "0";
    document.body.classList.remove("darkened"); // Remove darkened background
}

// Función para cambiar entre secciones
function showSection(sectionId) {
    // Ocultar todas las secciones
    document.querySelectorAll(".home-section").forEach(section => {
        section.style.display = "none";
    });

    // Mostrar la sección activa
    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.style.display = "block";
    }

    // Cerrar el sidebar automáticamente
    closeNav();
}


// Mostrar la sección "dashboard" al cargar la página
document.addEventListener("DOMContentLoaded", function () {
    showSection('dashboard');
});

// Asignar las funciones al objeto global para que funcionen en el HTML
window.openNav = openNav;
window.closeNav = closeNav;
window.showSection = showSection;
window.agregarTecnico = agregarTecnico;
window.mostrarTecnicos = mostrarTecnicos;



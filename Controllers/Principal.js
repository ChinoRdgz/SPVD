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
// Mostrar el formulario
function mostrarFormulario() {
    document.getElementById("formularioTecnico").style.display = "block";
}

// Ocultar el formulario y limpiar campos
function ocultarFormulario() {
    document.getElementById("formularioTecnico").style.display = "none";
    limpiarCampos();
}

// Agregar técnico a Firestore
function agregarTecnico() {
    let nombre = document.getElementById("txtNombreTec").value;
    let correo = document.getElementById("txtCorreoTec").value;
    let telefono = document.getElementById("txtTelefonoTec").value;
    let direccion = document.getElementById("txtDireccionTec").value;
    let especialidad = document.getElementById("txtEspecialidadTec").value;

    if (!nombre || !correo || !telefono || !direccion || !especialidad) {
        alert("Por favor, llena todos los campos.");
        return;
    }

    db.collection("tecnicos").add({
        nombre: nombre,
        correo: correo,
        telefono: telefono,
        direccion: direccion,
        especialidad: especialidad
    }).then(() => {
        console.log("Técnico agregado correctamente.");
        mostrarTecnicos(); 
        ocultarFormulario();
    }).catch(error => {
        console.error("Error al agregar técnico: ", error);
    });
}

// Mostrar técnicos desde Firestore
function mostrarTecnicos() {
    let tbody = document.getElementById("tecnicos-container");
    tbody.innerHTML = "";

    db.collection("Tecnicos").get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
            let tec = doc.data();
            let fila = `<tr>
                <td>${doc.id}</td>
                <td>${tec.nombre}</td>
                <td><a href="mailto:${tec.correo}">${tec.correo}</a></td>
                <td>${tec.telefono}</td>
                <td>${tec.direccion}</td>
                <td>${tec.especialidad}</td>
                <td class="tecnicos-actions">
                    <button class="tecnicos-edit-btn" onclick="editarTecnico('${doc.id}')"><i class="fas fa-edit"></i></button>
                    <button class="tecnicos-delete-btn" onclick="eliminarTecnico('${doc.id}')"><i class="fas fa-trash"></i></button>
                </td>
            </tr>`;
            tbody.innerHTML += fila;
        });
    }).catch(error => {
        console.error("Error al obtener técnicos: ", error);
    });
}

// Eliminar técnico de Firestore
function eliminarTecnico(id) {
    db.collection("Tecnicos").doc(id).delete().then(() => {
        console.log("Técnico eliminado correctamente.");
        mostrarTecnicos();
    }).catch(error => {
        console.error("Error al eliminar técnico: ", error);
    });
}

// Editar técnico (muestra los datos en los inputs)
function editarTecnico(id) {
    let docRef = db.collection("tecnicos").doc(id);

    docRef.get().then(doc => {
        if (doc.exists) {
            let tec = doc.data();
            document.getElementById("txtNombreTec").value = tec.nombre;
            document.getElementById("txtCorreoTec").value = tec.correo;
            document.getElementById("txtTelefonoTec").value = tec.telefono;
            document.getElementById("txtDireccionTec").value = tec.direccion;
            document.getElementById("txtEspecialidadTec").value = tec.especialidad;

            mostrarFormulario();

            document.querySelector(".tecnicos-btn").setAttribute("onclick", `actualizarTecnico('${id}')`);
        } else {
            console.log("No se encontró el técnico.");
        }
    }).catch(error => {
        console.error("Error al obtener técnico: ", error);
    });
}

// Actualizar técnico en Firestore
function actualizarTecnico(id) {
    let nombre = document.getElementById("txtNombreTec").value;
    let correo = document.getElementById("txtCorreoTec").value;
    let telefono = document.getElementById("txtTelefonoTec").value;
    let direccion = document.getElementById("txtDireccionTec").value;
    let especialidad = document.getElementById("txtEspecialidadTec").value;

    db.collection("Tecnicos").doc(id).update({
        nombre: nombre,
        correo: correo,
        telefono: telefono,
        direccion: direccion,
        especialidad: especialidad
    }).then(() => {
        console.log("Técnico actualizado correctamente.");
        mostrarTecnicos();
        ocultarFormulario();
    }).catch(error => {
        console.error("Error al actualizar técnico: ", error);
    });
}

// Limpiar campos del formulario
function limpiarCampos() {
    document.getElementById("txtNombreTec").value = "";
    document.getElementById("txtCorreoTec").value = "";
    document.getElementById("txtTelefonoTec").value = "";
    document.getElementById("txtDireccionTec").value = "";
    document.getElementById("txtEspecialidadTec").value = "";

    document.querySelector(".tecnicos-btn").setAttribute("onclick", "agregarTecnico()");
}

// Cargar la lista de técnicos al cargar la página
document.addEventListener("DOMContentLoaded", mostrarTecnicos);

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
window.mostrarClientes = mostrarFormulario;




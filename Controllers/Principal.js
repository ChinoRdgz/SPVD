import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { addDoc, getFirestore, doc, setDoc, getDoc, collection, getDocs, deleteDoc, updateDoc, query, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

// Mostrar el formulario de Técnicos como ventana flotante
function mostrarFormulario() {
    document.getElementById("formularioTecnico").style.display = "block";
    document.getElementById("formOverlay").style.display = "block";
}

// Ocultar el formulario flotante y limpiar campos
function ocultarFormulario() {
    document.getElementById("formularioTecnico").style.display = "none";
    document.getElementById("formOverlay").style.display = "none";
    limpiarCampos();
}

// Agregar técnico a Firestore
async function agregarTecnico() {
    let nombre = document.getElementById("txtNombreTec").value;
    let correo = document.getElementById("txtCorreoTec").value;
    let telefono = document.getElementById("txtTelefonoTec").value;
    let direccion = document.getElementById("txtDireccionTec").value;
    let especialidad = document.getElementById("txtEspecialidadTec").value;

    if (!nombre || !correo || !telefono || !direccion || !especialidad) {
        alert("Por favor, llena todos los campos.");
        return;
    }

    try {
        await addDoc(collection(db, "Tecnicos"), {
            nombre,
            correo,
            telefono,
            direccion,
            especialidad
        });

        console.log("Técnico agregado correctamente.");
        mostrarTecnicos();
        ocultarFormulario();
        registrarTecnico();
    } catch (error) {
        console.error("Error al agregar técnico:", error);
        alert("Ocurrió un error al agregar el técnico. Inténtalo de nuevo.");
    }
}

// Display technicians from Firebase
async function mostrarTecnicos() {
    const tbody = document.getElementById("tecnicos-container");
    tbody.innerHTML = ""; // Clear the table content before appending rows

    try {
        const querySnapshot = await getDocs(collection(db, "Tecnicos"));
        const uniqueIds = new Set(); // Track unique IDs to prevent duplicates

        querySnapshot.forEach((doc) => {
            if (!uniqueIds.has(doc.id)) { // Only add rows for unique IDs
                uniqueIds.add(doc.id);
                const tecnico = doc.data();
                const fila = `<tr>
                    <td>${doc.id}</td>
                    <td>${tecnico.nombre}</td>
                    <td><a href="mailto:${tecnico.correo}">${tecnico.correo}</a></td>
                    <td>${tecnico.telefono}</td>
                    <td>${tecnico.direccion}</td>
                    <td>${tecnico.especialidad}</td>
                    <td class="tecnicos-actions">
                        <i class='bx bx-edit-alt tecnicos-edit-btn' onclick="abrirModalEditar('${doc.id}')"></i>
                        <i class='bx bxs-user-x tecnicos-delete-btn' onclick="eliminarTecnico('${doc.id}')"></i>
                    </td>
                </tr>`;
                tbody.innerHTML += fila;
            }
        });
    } catch (error) {
        console.error("Error al obtener técnicos:", error);
        alert("Ocurrió un error al cargar la lista de técnicos.");
    }
}

// Eliminar técnico de Firestore
async function eliminarTecnico(id) {
    const confirmDelete = confirm("¿Estás seguro de que deseas eliminar este técnico?");
    if (!confirmDelete) return;

    try {
        await deleteDoc(doc(db, "Tecnicos", id));
        console.log("Técnico eliminado correctamente.");
        mostrarTecnicos();
    } catch (error) {
        console.error("Error al eliminar técnico:", error);
    }
}

// Editar técnico (muestra los datos en los inputs)
async function editarTecnico(id) {
    try {
        const docRef = doc(db, "Tecnicos", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            let tec = docSnap.data();
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
    } catch (error) {
        console.error("Error al obtener técnico:", error);
    }
}

// Actualizar técnico en Firestore
async function actualizarTecnico(id) {
    let nombre = document.getElementById("txtNombreTec").value;
    let correo = document.getElementById("txtCorreoTec").value;
    let telefono = document.getElementById("txtTelefonoTec").value;
    let direccion = document.getElementById("txtDireccionTec").value;
    let especialidad = document.getElementById("txtEspecialidadTec").value;

    try {
        await updateDoc(doc(db, "Tecnicos", id), {
            nombre,
            correo,
            telefono,
            direccion,
            especialidad
        });

        console.log("Técnico actualizado correctamente.");
        mostrarTecnicos();
        ocultarFormulario();
        registrarTecnico();
    } catch (error) {
        console.error("Error al actualizar técnico:", error);
    }
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

// Filtrar técnicos por nombre exacto
// Filtrar técnicos por nombre
async function filtrarTecnicos() {
    const searchValue = document.getElementById("searchTecnico").value.toLowerCase().trim();
    const tbody = document.getElementById("tecnicos-container");
    tbody.innerHTML = ""; // Limpiar el contenido de la tabla antes de mostrar los resultados

    try {
        let querySnapshot;

        // Si el campo de búsqueda está vacío, mostrar todos los técnicos
        if (searchValue === "") {
            mostrarTecnicos(); // Llamar a la función para mostrar todos los técnicos
            return;
        } else {
            // Realizar la consulta en la colección "Tecnicos"
            querySnapshot = await getDocs(query(collection(db, "Tecnicos"), 
                where("nombre", ">=", searchValue), 
                where("nombre", "<=", searchValue + "\uf8ff")
            ));
        }

        // Si no se encuentran resultados
        if (querySnapshot.empty) {
            tbody.innerHTML = `<tr><td colspan="7">No se encontraron resultados.</td></tr>`;
        } else {
            // Mostrar los técnicos encontrados
            querySnapshot.forEach((doc) => {
                const tecnico = doc.data();
                const fila = `<tr>
                    <td>${doc.id}</td>
                    <td>${tecnico.nombre}</td>
                    <td>${tecnico.correo}</td>
                    <td>${tecnico.telefono}</td>
                    <td>${tecnico.direccion}</td>
                    <td>${tecnico.especialidad}</td>
                    <td class="tecnicos-actions">
                        <i class='bx bx-edit-alt tecnicos-edit-btn' onclick="abrirModalEditar('${doc.id}')"></i>
                        <i class='bx bxs-user-x tecnicos-delete-btn' onclick="eliminarTecnico('${doc.id}')"></i>
                    </td>
                </tr>`;
                tbody.innerHTML += fila;
            });
        }
    } catch (error) {
        console.error("Error al filtrar técnicos:", error);
        alert("Ocurrió un error al filtrar los técnicos.");
    }
}

// Asignar la función de filtrar técnicos al alcance global
window.filtrarTecnicos = filtrarTecnicos;

// Asegurarse de que la función no se llame de forma redundante
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("searchTecnico").addEventListener("input", () => {
        tbody.innerHTML = ""; // Limpiar tabla antes de cada búsqueda
        filtrarTecnicos();  // Llamar la función para filtrar los técnicos
    });
});


// Open the edit modal and populate it with the technician's data
async function abrirModalEditar(id) {
    try {
        const docRef = doc(db, "Tecnicos", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const tec = docSnap.data();
            document.getElementById("editNombreTec").value = tec.nombre;
            document.getElementById("editCorreoTec").value = tec.correo;
            document.getElementById("editTelefonoTec").value = tec.telefono;
            document.getElementById("editDireccionTec").value = tec.direccion;
            document.getElementById("editEspecialidadTec").value = tec.especialidad;

            document.getElementById("btnGuardarEdicion").setAttribute("onclick", `guardarEdicionTecnico('${id}')`);
            document.getElementById("modalEditarTecnico").style.display = "block";
        } else {
            console.error("No se encontró el técnico.");
        }
    } catch (error) {
        console.error("Error al obtener técnico:", error);
    }
}

// Close the edit modal
function cerrarModalEditar() {
    document.getElementById("modalEditarTecnico").style.display = "none";
    document.getElementById("btnGuardarEdicion").setAttribute("onclick", "");
}

async function guardarEdicionTecnico(id) {
    const nombre = document.getElementById("editNombreTec").value;
    const correo = document.getElementById("editCorreoTec").value;
    const telefono = document.getElementById("editTelefonoTec").value;
    const direccion = document.getElementById("editDireccionTec").value;
    const especialidad = document.getElementById("editEspecialidadTec").value;

    if (!nombre || !correo || !telefono || !direccion || !especialidad) {
        alert("Por favor, llena todos los campos.");
        return;
    }

    try {
        await updateDoc(doc(db, "Tecnicos", id), {
            nombre,
            correo,
            telefono,
            direccion,
            especialidad
        });

        console.log("Técnico actualizado correctamente.");
        mostrarTecnicos();
        cerrarModalEditar();
    } catch (error) {
        console.error("Error al actualizar técnico:", error);
    }
}

// Assign the edit modal functions to the global scope
window.abrirModalEditar = abrirModalEditar;
window.cerrarModalEditar = cerrarModalEditar;
window.guardarEdicionTecnico = guardarEdicionTecnico;

// Asignar el evento de búsqueda
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("searchTecnico").addEventListener("input", filtrarTecnicos);
    mostrarTecnicos(); // Mostrar los técnicos inicialmente
});

// ==================================== CLIENTES ====================================

function toggleOpenButton() {
    const openButton = document.querySelector(".openbtn");
    const sidebar = document.getElementById("sidebar");

    if (sidebar.style.width === "250px") {
        openButton.style.display = "none"; // Hide the button when the sidebar is open
    } else {
        openButton.style.display = "block"; // Show the button when the sidebar is closed
    }
}

// Open the sidebar
function openNav() {
    document.getElementById("sidebar").style.width = "250px";
    document.body.classList.add("darkened"); // Add darkened background
    toggleOpenButton(); // Update button visibility
}

// Close the sidebar
function closeNav() {
    document.getElementById("sidebar").style.width = "0";
    document.body.classList.remove("darkened"); // Remove darkened background
    toggleOpenButton(); // Update button visibility
}

// Ensure the functions are assigned to the global scope
window.openNav = openNav;
window.closeNav = closeNav;

// Show a specific section and hide others
function showSection(sectionId) {
    document.querySelectorAll(".home-section").forEach(section => {
        section.style.display = "none";
    });

    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.style.display = "block";

        // Call specific functions when certain sections are displayed
        if (sectionId === "clientes") {
            mostrarClientes();
        } else if (sectionId === "Tecnicos") {
            mostrarTecnicos();
        } else if (sectionId === "Reportes") {
            mostrarReportes();
        }
    }

    closeNav();
}

// Ensure the function is assigned to the global scope
window.showSection = showSection;

function abrirModal() {
    document.getElementById("modalTecnico").style.display = "block";
}

function cerrarModal() {
    document.getElementById("modalTecnico").style.display = "none";
    limpiarCampos();

    // Restablecer el evento onclick del botón "Guardar" al estado inicial
    document.querySelector(".tecnicos-btn").setAttribute("onclick", "agregarTecnico()");
}

// Open the modal for adding a new client
function abrirModalCliente() {
    document.getElementById("modalCliente").style.display = "block";
}

// Close the modal for adding a new client
function cerrarModalCliente() {
    document.getElementById("modalCliente").style.display = "none";
    limpiarCamposCliente();
}

// Add a new client to Firebase
async function agregarCliente() {
    // Ensure these IDs match the input fields in the HTML
    const nombre = document.getElementById("txtNombreCliente")?.value || "";
    const telefono = document.getElementById("txtTelefonoCliente")?.value || "";
    const correo = document.getElementById("txtCorreoCliente")?.value || "";
    const direccion = document.getElementById("txtDireccionCliente")?.value || "";

    if (!nombre || !telefono || !correo || !direccion) {
        alert("Por favor, llena todos los campos.");
        return;
    }

    try {
        await addDoc(collection(db, "Clientes"), {
            nombre,
            telefono,
            correo,
            direccion
        });

        console.log("Cliente agregado correctamente.");
        mostrarClientes();
        cerrarModalCliente();
        registrarCliente();
    } catch (error) {
        console.error("Error al agregar cliente:", error);
        alert("Ocurrió un error al agregar el cliente. Inténtalo de nuevo.");
    }
}

// Display clients from Firebase
async function mostrarClientes() {
    const tbody = document.getElementById("clientes-container");
    tbody.innerHTML = ""; // Clear the table content before appending rows

    try {
        const querySnapshot = await getDocs(collection(db, "Clientes"));
        querySnapshot.forEach((doc) => {
            const cliente = doc.data();
            const fila = `<tr>  
                <td>${doc.id}</td>
                <td>${cliente.nombre}</td>
                <td>${cliente.apellido}</td>
                <td>${cliente.telefono}</td>
                <td>${cliente.correo}</td>
                <td class="clientes-actions">
                    <i class='bx bx-edit-alt clientes-edit-btn' onclick="abrirModalEditarCliente('${doc.id}')"></i>
                    <i class='bx bxs-user-x clientes-delete-btn' onclick="eliminarCliente('${doc.id}')"></i>
                </td>
            </tr>`;
            tbody.innerHTML += fila;
        });
    } catch (error) {
        console.error("Error al obtener clientes:", error);
        alert("Ocurrió un error al cargar la lista de clientes.");
    }
}

// Delete a client from Firebase
async function eliminarCliente(id) {
    const confirmDelete = confirm("¿Estás seguro de que deseas eliminar este cliente?");
    if (!confirmDelete) return;

    try {
        await deleteDoc(doc(db, "Clientes", id));
        console.log("Cliente eliminado correctamente.");
        mostrarClientes();
    } catch (error) {
        console.error("Error al eliminar cliente:", error);
    }
}

// Edit a client (populate the modal with data)


// Update a client in Firebase
async function actualizarCliente(id) {
    // Ensure these IDs match the input fields in the "Editar Cliente" modal
    const nombre = document.getElementById("editNombreCliente")?.value || "";
    const telefono = document.getElementById("editTelefonoCliente")?.value || "";
    const correo = document.getElementById("editCorreoCliente")?.value || "";
    const direccion = document.getElementById("editDireccionCliente")?.value || "";

    if (!nombre || !telefono || !correo || !direccion) {
        alert("Por favor, llena todos los campos.");
        return;
    }

    try {
        await updateDoc(doc(db, "Clientes", id), {
            nombre,
            telefono,
            correo,
            direccion
        });

        console.log("Cliente actualizado correctamente.");
        mostrarClientes();
        cerrarModalEditarCliente();
    } catch (error) {
        console.error("Error al actualizar cliente:", error);
    }
}

// Clear the client form fields
function limpiarCamposCliente() {
    // Ensure these IDs match the input fields in the HTML
    document.getElementById("txtNombreCliente").value = "";
    document.getElementById("txtTelefonoCliente").value = "";
    document.getElementById("txtCorreoCliente").value = "";
    document.getElementById("txtDireccionCliente").value = "";

    // Reset the "Guardar" button to call agregarCliente
    document.querySelector(".clientes-btn").setAttribute("onclick", "agregarCliente()");
}



// Open the edit modal and populate it with the client's data
async function abrirModalEditarCliente(id) {
    try {
        const docRef = doc(db, "Clientes", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const cliente = docSnap.data();

            // Llenamos los campos del modal con los datos del cliente
            document.getElementById("editNombreCliente").value = cliente.nombre || "";
            document.getElementById("editTelefonoCliente").value = cliente.telefono || "";
            document.getElementById("editCorreoCliente").value = cliente.correo || "";
            document.getElementById("editDireccionCliente").value = cliente.direccion || "";

            // Cambiamos el evento del botón "Guardar" para llamar a guardarEdicionCliente con el id
            document.getElementById("btnGuardarEdicionCliente").setAttribute("onclick", `guardarEdicionCliente('${id}')`);

            // Abrir el modal de edición
            document.getElementById("modalEditarCliente").style.display = "block";
        } else {
            console.error("No se encontró el cliente.");
            alert("No se encontró el cliente.");
        }
    } catch (error) {
        console.error("Error al obtener cliente:", error);
        alert("Ocurrió un error al obtener los datos del cliente.");
    }
}


// Close the edit modal
function cerrarModalEditarCliente() {
    document.getElementById("modalEditarCliente").style.display = "none";
    document.getElementById("btnGuardarEdicionCliente").setAttribute("onclick", "");
}

// Save the edited client data to Firebase
async function guardarEdicionCliente(id) {
    const nombre = document.getElementById("editNombreCliente").value;
    const telefono = document.getElementById("editTelefonoCliente").value;
    const correo = document.getElementById("editCorreoCliente").value;
    const direccion = document.getElementById("editDireccionCliente").value;

    if (!nombre || !telefono || !correo || !direccion) {
        alert("Por favor, llena todos los campos.");
        return;
    }

    try {
        await updateDoc(doc(db, "Clientes", id), {
            nombre,
            telefono,
            correo,
            direccion
        });

        console.log("Cliente actualizado correctamente.");
        mostrarClientes();
        cerrarModalEditarCliente();
        registrarCliente();
    } catch (error) {
        console.error("Error al actualizar cliente:", error);
    }
}

// Filter clients by name
async function filtrarClientes() {
    const searchValue = document.getElementById("searchCliente").value.toLowerCase().trim();
    const tbody = document.getElementById("clientes-container");
    tbody.innerHTML = ""; // Clear the table content before showing results

    try {
        let querySnapshot;

        // If the search input is empty, show all clients
        if (searchValue === "") {
            mostrarClientes(); // Call the function to display all clients
            return;
        } else {
            querySnapshot = await getDocs(query(collection(db, "Clientes"), where("nombre", ">=", searchValue), where("nombre", "<=", searchValue + "\uf8ff")));
        }

        if (querySnapshot.empty) {
            tbody.innerHTML = `<tr><td colspan="6">No se encontraron resultados.</td></tr>`;
        } else {
            querySnapshot.forEach((doc) => {
                const cliente = doc.data();
                const fila = `<tr>
                    <td>${doc.id}</td>
                    <td>${cliente.nombre}</td>
                    <td>${cliente.telefono}</td>
                    <td>${cliente.correo}</td>
                    <td>${cliente.direccion}</td>
                    <td class="clientes-actions">
                        <i class='bx bx-edit-alt clientes-edit-btn' onclick="abrirModalEditarCliente('${doc.id}')"></i>
                        <i class='bx bxs-user-x clientes-delete-btn' onclick="eliminarCliente('${doc.id}')"></i>
                    </td>
                </tr>`;
                tbody.innerHTML += fila;
            });
        }
    } catch (error) {
        console.error("Error al filtrar clientes:", error);
        alert("Ocurrió un error al filtrar los clientes.");
    }
}

// Assign the filter function to the global scope
window.filtrarClientes = filtrarClientes;

// Add event listener for the search input
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("searchCliente").addEventListener("input", filtrarClientes);
    mostrarClientes(); // Display all clients initially
});

// Assign the edit modal functions to the global scope
window.abrirModalEditarCliente = abrirModalEditarCliente;
window.cerrarModalEditarCliente = cerrarModalEditarCliente;
window.guardarEdicionCliente = guardarEdicionCliente;

// // Open the modal for adding a new report
// Open the modal for adding a new report
async function mostrarReportes() {
    const tbody = document.getElementById("reportes-container");
    
    // Verifica si el contenedor existe
    if (!tbody) {
        console.error("No se encontró el contenedor de los reportes.");
        return;
    }

    tbody.innerHTML = ""; // Limpiar el contenido de la tabla antes de agregar filas

    try {
        // Obtiene todos los reportes de la colección 'Reportes'
        const querySnapshot = await getDocs(collection(db, "Reportes"));
        console.log(querySnapshot.docs.length);  // Verifica si hay documentos

        if (querySnapshot.empty) {
            console.log("No hay reportes en la base de datos.");
            return; // Salir si no hay reportes
        }

        // Iterar sobre cada documento de reporte
        for (const docSnapshot of querySnapshot.docs) {
            const reporte = docSnapshot.data();
            console.log(reporte); // Verifica los datos del reporte

            // Obtener datos del cliente (corrección aquí)
            const clienteDoc = await getDoc(doc(db, "Clientes", reporte.clienteId));
            const cliente = clienteDoc.exists() 
                ? clienteDoc.data() 
                : { nombre: "N/A", telefono: "N/A", direccion: "N/A" };

            // Obtener datos del técnico (corrección aquí)
            const tecnicoDoc = await getDoc(doc(db, "Tecnicos", reporte.tecnicoId));
            const tecnico = tecnicoDoc.exists() 
                ? tecnicoDoc.data() 
                : { nombre: "N/A" };

            // Crear la fila de la tabla
            const fila = `
                <tr>
                    <td>${docSnapshot.id}</td>
                    <td>${reporte.tipoInstalacion}</td>
                    <td>${cliente.nombre}</td>
                    <td>${cliente.telefono}</td>
                    <td>${cliente.direccion}</td>
                    <td>${tecnico.nombre}</td>
                    <td>${reporte.fechaInicio}</td>
                    <td>${reporte.fechaTermino}</td>
                    <td>${reporte.estado}</td>
                    <td class="reportes-actions">
                        <i class='bx bx-edit-alt reportes-edit-btn' onclick="abrirModalEditarReporte('${docSnapshot.id}')"></i>
                        <i class='bx bxs-trash-alt reportes-delete-btn' onclick="eliminarReporte('${docSnapshot.id}')"></i>
                    </td>
                </tr>
            `;
            // Añadir la fila al contenedor
            tbody.innerHTML += fila;
        }
    } catch (error) {
        console.error("Error al obtener reportes:", error);
        alert("Ocurrió un error al cargar la lista de reportes.");
    }
}
// Guardar un nuevo reporte en Firestore
async function guardarReporte() {
    const clienteId = document.getElementById("selectCliente").value;
    const tecnicoId = document.getElementById("selectTecnico").value;
    const tipoInstalacion = document.getElementById("selectTipoInstalacion").value;
    const fechaInicio = document.getElementById("txtFechaInicio").value;
    const fechaTermino = document.getElementById("txtFechaTermino").value;
    const observaciones = document.getElementById("txtObservaciones").value;

    if (!clienteId || !tecnicoId || !tipoInstalacion || !fechaInicio || !fechaTermino) {
        alert("Por favor, llena todos los campos obligatorios.");
        return;
    }

    try {
        const nuevoReporte = {
            clienteId,
            tecnicoId,
            tipoInstalacion,
            fechaInicio,
            fechaTermino,
            observaciones,
            estado: "Pendiente"
        };

        // Añadir un nuevo documento en la colección "Reportes"
        await addDoc(collection(db, "Reportes"), nuevoReporte);
        alert("Reporte guardado exitosamente.");
        mostrarReportes();  // Refrescar la lista de reportes
        limpiarCamposReporte();  // Limpiar los campos del formulario
        cerrarModalReporte();  // Cerrar el modal
    } catch (error) {
        console.error("Error al guardar el reporte:", error);
        alert("Ocurrió un error al guardar el reporte.");
    }
}

// Guardar edición de un reporte existente
async function guardarEdicionReporte() {
    const reporteId = document.getElementById("modalEditarReporte").dataset.reportId; // Use dataset.reportId
    if (!reporteId) {
        alert("Error: No se encontró el ID del reporte.");
        return;
    }

    const clienteId = document.getElementById("editSelectCliente").value;
    const tecnicoId = document.getElementById("editSelectTecnico").value;
    const tipoInstalacion = document.getElementById("editSelectTipoInstalacion").value;
    const fechaInicio = document.getElementById("editTxtFechaInicio").value;
    const fechaTermino = document.getElementById("editTxtFechaTermino").value;
    const observaciones = document.getElementById("editTxtObservaciones").value;

    if (!clienteId || !tecnicoId || !tipoInstalacion || !fechaInicio || !fechaTermino) {
        alert("Por favor, llena todos los campos obligatorios.");
        return;
    }

    try {
        const reporteRef = doc(db, "Reportes", reporteId);
        await updateDoc(reporteRef, {
            clienteId,
            tecnicoId,
            tipoInstalacion,
            fechaInicio,
            fechaTermino,
            observaciones
        });

        alert("Reporte editado exitosamente.");
        mostrarReportes();  // Refrescar la lista de reportes
        cerrarModalEditarReporte();  // Cerrar el modal de edición
    } catch (error) {
        console.error("Error al editar el reporte:", error);
        alert("Ocurrió un error al editar el reporte.");
    }
}


// Función para eliminar un reporte
async function eliminarReporte(reporteId) {
    const confirmacion = confirm("¿Estás seguro de que deseas eliminar este reporte?");
    if (!confirmacion) return;

    try {
        await deleteDoc(doc(db, "Reportes", reporteId));
        alert("Reporte eliminado exitosamente.");
        mostrarReportes();  // Refrescar la lista de reportes
    } catch (error) {
        console.error("Error al eliminar el reporte:", error);
        alert("Ocurrió un error al eliminar el reporte.");
    }
}

async function abrirModalEditarReporte(id) {
    try {
        const docRef = doc(db, "Reportes", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const reporte = docSnap.data();

            // Populate the modal fields with the report's data
            document.getElementById("editSelectCliente").value = reporte.clienteId || "";
            document.getElementById("editTxtTelefonoCliente").value = reporte.telefono || "";
            document.getElementById("editTxtDireccionCliente").value = reporte.direccion || "";
            document.getElementById("editSelectTecnico").value = reporte.tecnicoId || "";
            document.getElementById("editSelectTipoInstalacion").value = reporte.tipoInstalacion || "Instalación";
            document.getElementById("editTxtFechaInicio").value = reporte.fechaInicio || "";
            document.getElementById("editTxtFechaTermino").value = reporte.fechaTermino || "";
            document.getElementById("editTxtObservaciones").value = reporte.observaciones || "";

            // Load client and technician dropdowns with the correct data
            await cargarClientesReportes(reporte.clienteId);
            await cargarTecnicosReportes(reporte.tecnicoId);

            // Store the report ID for saving changes
            document.getElementById("modalEditarReporte").dataset.reportId = id;

            // Show the modal
            document.getElementById("modalEditarReporte").style.display = "block";
        } else {
            console.error("No se encontró el reporte.");
        }
    } catch (error) {
        console.error("Error al obtener el reporte:", error);
    }
}

// Load clients into the dropdown for editing reports
// Close the edit modal
function cerrarModalEditarReporte() {
    document.getElementById("modalEditarReporte").style.display = "none";
    document.getElementById("modalEditarReporte").dataset.reportId = "";
}

// Assign the edit modal functions to the global scope
window.abrirModalEditarReporte = abrirModalEditarReporte;
window.cerrarModalEditarReporte = cerrarModalEditarReporte;

// Llama la función para mostrar los reportes cuando la página cargue
document.addEventListener("DOMContentLoaded", () => {
    mostrarReportes();
});



// Close the modal for adding a new report
function cerrarModalReporte() {
    document.getElementById("modalReporte").style.display = "none";
    limpiarCamposReporte(); // Clear form fields when modal is closed
}

// Clear the report form fields
function limpiarCamposReporte() {
    document.getElementById("selectCliente").value = "";
    document.getElementById("txtTelefonoCliente").value = "";
    document.getElementById("txtDireccionCliente").value = "";
    document.getElementById("selectTecnico").value = "";
    document.getElementById("selectTipoInstalacion").value = "Instalación";
    document.getElementById("txtFechaInicio").value = "";
    document.getElementById("txtFechaTermino").value = "";
    document.getElementById("txtObservaciones").value = "";
}

// Load clients into the dropdown for reports
async function cargarClientesReportes() {
    const selectCliente = document.getElementById("selectCliente"); 
    const selectCliente2 = document.getElementById("editSelectCliente");
// Make sure this is the correct ID for the dropdown
    selectCliente.innerHTML = ""; // Clear the dropdown options before adding new ones
    selectCliente2.innerHTML = ""; // Clear the dropdown options before adding new ones

    try {
        const querySnapshot = await getDocs(collection(db, "Clientes"));
        querySnapshot.forEach((doc) => {
            const cliente = doc.data();
            const option = document.createElement("option");
            option.value = doc.id; // Client ID as the value
            option.textContent = cliente.nombre; // Client name as the display text
            selectCliente.appendChild(option); // Add option to the dropdown
            selectCliente2.appendChild(option); // Add option to the dropdown

        });
    } catch (error) {
        console.error("Error loading clients:", error);
    }

    // If editing a report, ensure the client is selected based on the report's clientId
    const reportId = document.getElementById("modalEditarReporte").dataset.reportId;
    if (reportId) {
        const reportDoc = await getDoc(doc(db, "Reportes", reportId));
        const reporte = reportDoc.data();
        selectCliente.value = reporte.clienteId || ""; // Select the client in the dropdown
    }
}

// Load technicians into the dropdown for reports
async function cargarTecnicosReportes() {
    const selectTecnico = document.getElementById("selectTecnico"); 
    const selectTecnico2 = document.getElementById("editSelectTecnico");
    // Make sure this is the correct ID for the dropdown
    selectTecnico.innerHTML = ""; 
    selectTecnico2.innerHTML = ""; // Clear the dropdown options before adding new ones

    try {
        const querySnapshot = await getDocs(collection(db, "Tecnicos"));
        querySnapshot.forEach((doc) => {
            const tecnico = doc.data();
            const option = document.createElement("option");
            option.value = doc.id; // Technician ID as the value
            option.textContent = tecnico.nombre; // Technician name as the display text
            selectTecnico.appendChild(option); // Add option to the dropdown
            selectTecnico2.appendChild(option); // Add option to the dropdown

        });
    } catch (error) {
        console.error("Error loading technicians:", error);
    }

    // If editing a report, ensure the technician is selected based on the report's tecnicoId
    const reportId = document.getElementById("modalEditarReporte").dataset.reportId;
    if (reportId) {
        const reportDoc = await getDoc(doc(db, "Reportes", reportId));
        const reporte = reportDoc.data();
        selectTecnico.value = reporte.tecnicoId || ""; // Select the technician in the dropdown
    }
}

// Assign the report modal functions to the global scope
window.abrirModalReporte = abrirModalReporte;
window.cerrarModalReporte = cerrarModalReporte;
window.guardarReporte = guardarReporte;
window.guardarEdicionReporte = guardarEdicionReporte;
window.cargarClientesReportes = cargarClientesReportes;
window.cargarTecnicosReportes = cargarTecnicosReportes;
window.limpiarCamposReporte = limpiarCamposReporte;
window.mostrarReportes = mostrarReportes;
window.eliminarReporte = eliminarReporte;
window.abrirModalEditarReporte = abrirModalEditarReporte;
window.cerrarModalEditarReporte = cerrarModalEditarReporte;
window.guardarEdicionReporte = guardarEdicionReporte;
window.mostrarReportes = mostrarReportes;
window.eliminarReporte = eliminarReporte;

// Open the modal for adding a new report
function abrirModalReporte() {
    document.getElementById("modalReporte").style.display = "block";
    limpiarCamposReporte(); // Clear the form fields when opening the modal
    cargarClientesReportes(); // Load clients into the dropdown
    cargarTecnicosReportes(); // Load technicians into the dropdown
}

// Ensure the function is assigned to the global scope
window.abrirModalReporte = abrirModalReporte;

// Asignar funciones al objeto global
window.openNav = openNav;
window.closeNav = closeNav;
window.showSection = showSection;
window.mostrarFormulario = mostrarFormulario;
window.agregarTecnico = agregarTecnico;
window.mostrarTecnicos = mostrarTecnicos;
window.agregarCliente = agregarCliente;
window.mostrarClientes = mostrarClientes;
window.ocultarFormulario = ocultarFormulario;
window.limpiarCampos = limpiarCampos;
window.eliminarTecnico = eliminarTecnico;
window.editarTecnico = editarTecnico;
window.actualizarTecnico = actualizarTecnico;
window.abrirModal = abrirModal;
window.cerrarModal = cerrarModal;
window.abrirModalEditar = abrirModalEditar;
window.cerrarModalEditar = cerrarModalEditar;
window.guardarEdicionTecnico = guardarEdicionTecnico;
window.abrirModalCliente = abrirModalCliente;
window.cerrarModalCliente = cerrarModalCliente;
window.limpiarCamposCliente = limpiarCamposCliente;
window.eliminarCliente = eliminarCliente;
window.actualizarCliente = actualizarCliente;
window.abrirModalEditarCliente = abrirModalEditarCliente;
window.cerrarModalEditarCliente = cerrarModalEditarCliente;
window.guardarEdicionCliente = guardarEdicionCliente;
window.guardarEdicionReporte = guardarEdicionReporte;


async function agregarRegistroBitacoraTecnico() {
    try {
        const accion = "Se registró un nuevo técnico";
        const nuevoRegistro = {
            accion: accion,  // Descripción de la acción realizada
            fecha: new Date().toISOString()  // Fecha en formato ISO (compatible con Firestore)
        };

        await addDoc(collection(db, "Bitacora"), nuevoRegistro);
        console.log("Registro agregado a la bitácora.");
    } catch (error) {
        console.error("Error al agregar registro a la bitácora:", error);
    }
}
window.agregarRegistroBitacoraTecnico = agregarRegistroBitacoraTecnico;

async function mostrarBitacora() {
    try {
        const bitacoraContainer = document.getElementById("bitacora-container");
        if (!bitacoraContainer) {
            console.warn("⚠️ No se encontró el elemento 'bitacora-container' en el DOM.");
            return;
        }

        bitacoraContainer.innerHTML = ""; // Limpiar la tabla antes de llenarla

        const querySnapshot = await getDocs(collection(db, "Bitacora"));

        querySnapshot.forEach((doc) => {
            const evento = doc.data();

            // Manejar la fecha como string directamente (sin .toDate())
            let fechaFormateada = evento.fecha || "Fecha no disponible"; // Si es string, lo usa directamente

            const fila = `
                <tr>
                    <td>${evento.Accion || "Acción no especificada"}</td>
                    <td>${fechaFormateada}</td>
                </tr>
            `;
            bitacoraContainer.innerHTML += fila;
        });

    } catch (error) {
        console.error("❌ Error al obtener la bitácora:", error);
    }
}

// Llamar a la función al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    mostrarBitacora();
});

// Function to count documents in a collection
async function contarDocumentos(coleccion) {
    try {
        const querySnapshot = await getDocs(collection(db, coleccion));
        return querySnapshot.size; // Return the number of documents
    } catch (error) {
        console.error(`Error al contar documentos en la colección ${coleccion}:`, error);
        return 0;
    }
}

// Function to count reports with "Pendiente" status
async function contarReportesPendientes() {
    try {
        const querySnapshot = await getDocs(query(collection(db, "Reportes"), where("estado", "==", "Pendiente")));
        return querySnapshot.size; // Return the number of pending reports
    } catch (error) {
        console.error("Error al contar reportes pendientes:", error);
        return 0;
    }
}

// Update the dashboard counts, including pending reports
async function actualizarDashboard() {
    try {
        const numeroTecnicos = await contarDocumentos("Tecnicos");
        const numeroClientes = await contarDocumentos("Clientes");
        const numeroReportes = await contarDocumentos("Reportes");
        const numeroPendientes = await contarReportesPendientes();

        document.getElementById("numero-tecnicos").textContent = numeroTecnicos;
        document.getElementById("numero-clientes").textContent = numeroClientes;
        document.getElementById("numero-reportes").textContent = numeroReportes;
        document.getElementById("numero-pendientes").textContent = numeroPendientes;
    } catch (error) {
        console.error("Error al actualizar el dashboard:", error);
    }
}

// Call actualizarDashboard when the page loads
document.addEventListener("DOMContentLoaded", () => {
    actualizarDashboard();
});


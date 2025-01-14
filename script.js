// Seleccionar elementos del DOM
const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const getFilesButton = document.getElementById('getFilesButton');
const fileListDiv = document.getElementById('fileList');
const logoutButton = document.createElement('button'); // Botón para cerrar sesión
logoutButton.textContent = 'Cerrar Sesión';
logoutButton.style.display = 'none'; // Ocultarlo al inicio
document.body.appendChild(logoutButton);

const uploadForm = document.createElement('form'); // Formulario para subir archivos
uploadForm.style.display = 'none'; // Ocultarlo al inicio
uploadForm.innerHTML = `
    <h2>Subir Archivo</h2>
    <input type="file" id="fileInput" required>
    <button type="submit">Subir</button>
`;
document.body.appendChild(uploadForm);

let token = null; // Almacenar el token JWT
let currentUsername = ''; // Guardar el nombre de usuario

// Función para manejar la interfaz de usuario según el estado del usuario
const updateUI = () => {
    if (token) {
        // Usuario autenticado
        loginForm.style.display = 'none';
        registerForm.style.display = 'none';
        logoutButton.style.display = 'block';
        uploadForm.style.display = 'block';
        getFilesButton.style.display = 'block';
        alert(`Bienvenido, ${currentUsername}`);
    } else {
        // Usuario no autenticado
        loginForm.style.display = 'block';
        registerForm.style.display = 'block';
        logoutButton.style.display = 'none';
        uploadForm.style.display = 'none';
        getFilesButton.style.display = 'none';
        fileListDiv.innerHTML = '';
    }
};

// Manejar el registro de usuarios
registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('https://mi-backend-83cc.onrender.com/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            alert('Usuario registrado correctamente. Ahora puedes iniciar sesión.');
        } else {
            alert('Hubo un error al registrar el usuario. Intenta con otro nombre.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al conectar con el servidor.');
    }
});

// Manejar el inicio de sesión
loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('https://mi-backend-83cc.onrender.com/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const data = await response.json();
            token = data.token; // Guardar el token
            currentUsername = username; // Guardar el nombre del usuario
            updateUI(); // Actualizar la interfaz
        } else {
            alert('Credenciales inválidas. Verifica tu nombre de usuario y contraseña.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al conectar con el servidor.');
    }
});

// Manejar el cierre de sesión
logoutButton.addEventListener('click', () => {
    token = null; // Eliminar el token
    currentUsername = ''; // Limpiar el nombre de usuario
    updateUI(); // Actualizar la interfaz
    alert('Sesión cerrada correctamente.');
});

// Manejar la obtención de archivos protegidos
getFilesButton.addEventListener('click', async () => {
    if (!token) {
        alert('Por favor, inicia sesión primero.');
        return;
    }

    try {
        const response = await fetch('https://mi-backend-83cc.onrender.com/protected/files', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
        });

        if (response.ok) {
            const files = await response.json();
            fileListDiv.innerHTML = '<h3>Archivos:</h3>';
            files.forEach(file => {
                fileListDiv.innerHTML += `<p>${file}</p>`;
            });
        } else {
            alert('No tienes acceso o hubo un problema al obtener los archivos.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al conectar con el servidor.');
    }
});

// Manejar la subida de archivos
uploadForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file) {
        alert('Selecciona un archivo para subir.');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('https://mi-backend-83cc.onrender.com/upload', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData,
        });

        if (response.ok) {
            const data = await response.json();
            alert(`Archivo subido con éxito. ID: ${data.fileId}`);
            fileInput.value = ''; // Limpiar el campo de archivo
        } else {
            alert('Hubo un error al subir el archivo.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al conectar con el servidor.');
    }
});

// Inicializar la interfaz al cargar la página
updateUI();

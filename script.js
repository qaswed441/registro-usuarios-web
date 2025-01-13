// Seleccionar formularios
const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const getFilesButton = document.getElementById('getFilesButton');
const fileListDiv = document.getElementById('fileList');

let token = null; // Para almacenar el token JWT

// Manejar el envío del formulario de registro
registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Obtener valores del formulario
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Enviar los datos al servidor
    try {
        const response = await fetch('https://mi-backend-83cc.onrender.com/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            alert('Usuario registrado correctamente');
        } else {
            alert('Hubo un error al registrar el usuario');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('No se pudo conectar con el servidor');
    }
});

// Manejar el envío del formulario de inicio de sesión
loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Obtener valores del formulario
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    // Enviar los datos al servidor
    try {
        const response = await fetch('https://mi-backend-83cc.onrender.com/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const data = await response.json();
            token = data.token; // Guardar el token JWT
            alert('Inicio de sesión exitoso');
        } else {
            alert('Credenciales inválidas');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('No se pudo conectar con el servidor');
    }
});

// Manejar la obtención de archivos protegidos
getFilesButton.addEventListener('click', async () => {
    if (!token) {
        alert('Por favor, inicia sesión primero');
        return;
    }

    try {
        const response = await fetch('https://mi-backend-83cc.onrender.com/protected/files', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.ok) {
            const files = await response.json();
            fileListDiv.innerHTML = '<h3>Archivos:</h3>';
            files.forEach(file => {
                fileListDiv.innerHTML += `<p>${file}</p>`;
            });
        } else {
            alert('No tienes acceso o hubo un problema');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('No se pudo conectar con el servidor');
    }
});

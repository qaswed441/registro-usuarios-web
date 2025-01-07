// Seleccionar el formulario
const registerForm = document.getElementById('registerForm');

// Manejar el envío del formulario
registerForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevenir el comportamiento predeterminado (recarga de página)

    // Obtener los valores ingresados
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Enviar los datos al servidor
    try {
        const response = await fetch('https://mi-backend-83cc.onrender.com', {
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

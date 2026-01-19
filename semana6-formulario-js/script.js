document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formulario');
    const inputs = document.querySelectorAll('input');
    const btnSubmit = document.getElementById('btn-submit');

    // Expresiones regulares para validación
    const patterns = {
        nombre: /^.{3,}$/, // Mínimo 3 caracteres
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // Formato email estándar
        password: /^(?=.*\d)(?=.*[\W_]).{8,}$/, // Mín 8 chars, 1 número, 1 caracter especial
        edad: (value) => value >= 18 // Función personalizada para edad numérico
    };

    // Objeto para rastrear el estado de validez de cada campo
    const fieldsState = {
        nombre: false,
        email: false,
        edad: false,
        password: false,
        'confirm-password': false
    };

    // Función principal de validación
    const validateField = (input) => {
        const fieldName = input.name;
        const value = input.value.trim();
        const errorSpan = document.getElementById(`error-${input.id}`);
        let isValid = false;

        // Lógica específica por campo
        if (fieldName === 'confirm-password') {
            const passwordValue = document.getElementById('password').value;
            isValid = value === passwordValue && value !== '';
            errorSpan.textContent = isValid ? '' : 'Las contraseñas no coinciden.';
        } else if (fieldName === 'edad') {
            isValid = patterns.edad(value);
            errorSpan.textContent = isValid ? '' : 'Debes tener al menos 18 años.';
        } else {
            // Validación con Regex para nombre, email y password
            isValid = patterns[fieldName].test(value);
            
            // Mensajes personalizados
            if (!isValid) {
                if (fieldName === 'nombre') errorSpan.textContent = 'Mínimo 3 caracteres.';
                if (fieldName === 'email') errorSpan.textContent = 'Formato de correo inválido.';
                if (fieldName === 'password') errorSpan.textContent = 'Mín. 8 caracteres, 1 número y 1 símbolo.';
            } else {
                errorSpan.textContent = '';
            }
        }

        // Actualizar estado visual
        if (isValid) {
            input.classList.remove('invalid');
            input.classList.add('valid');
        } else {
            input.classList.remove('valid');
            input.classList.add('invalid');
        }

        // Guardar estado y verificar formulario completo
        fieldsState[fieldName] = isValid;
        checkFormValidity();
    };

    // Habilitar/Deshabilitar botón de envío
    const checkFormValidity = () => {
        const allValid = Object.values(fieldsState).every(status => status === true);
        btnSubmit.disabled = !allValid;
    };

    // Listeners para validación en tiempo real
    inputs.forEach(input => {
        input.addEventListener('keyup', () => validateField(input));
        input.addEventListener('blur', () => validateField(input));
    });

    // Reset del formulario (limpia clases y estados)
    form.addEventListener('reset', () => {
        inputs.forEach(input => {
            input.classList.remove('valid', 'invalid');
            document.getElementById(`error-${input.id}`).textContent = '';
        });
        Object.keys(fieldsState).forEach(key => fieldsState[key] = false);
        btnSubmit.disabled = true;
    });

    // Envío del formulario
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('¡Formulario enviado con éxito!');
        form.reset();
    });
});
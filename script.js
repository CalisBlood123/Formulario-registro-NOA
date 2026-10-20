const nombrePersonal = document.getElementById("nombre");
const edad = document.getElementById("edad");
const email = document.getElementById("emailPersonal");
const contraseña = document.getElementById("password");
const confirmar = document.getElementById("confirmPassword");

const edadPermitida = 18

const registrar = async (event) => {

    event.preventDefault();

    const nombreValor = nombrePersonal.value.trim();
    const edadValor = Number(edad.value);
    const emailValor = email.value.trim();
    const contraseñaValor = contraseña.value;
    const confirmarValor = confirmar.value;

    if (!nombreValor || !emailValor || !contraseñaValor || !confirmarValor || !edad.value.trim()) {
        alert("Completá todos los campos antes de registrarte.");
        return;
    }

    if (edadValor < edadPermitida) {
        console.error(edadValor, "años no es edad suficiente para registrarse");
        alert("Debes tener al menos 18 años para registrarte.");
        return;
    }

    if (contraseñaValor !== confirmarValor) {
        alert("Las contraseñas son distintas.");
        return;
    }

    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const json = await response.json();

    const emailUsers = json.map((users) => users.email);
    const emailFilter = emailUsers.filter((emaiB) => emaiB === emailValor);

    if (emailFilter.length > 0) {
        alert("Ese correo ya está registrado.");
        return;
    }

    localStorage.setItem("emailUsuario", emailValor);
    localStorage.setItem("password", contraseñaValor);
    window.location.href = "bienvenida.html";
}

const validarRegistro = () => {
    const userRegistrado = localStorage.getItem("emailUsuario");

    if (userRegistrado) {
        window.location.href = "bienvenida.html";
    }
};

const rutaActual = window.location.pathname.split("/").pop().toLowerCase();
const userRegistrado = localStorage.getItem("emailUsuario");

if (rutaActual === "bienvenida.html" && !userRegistrado) {
    window.location.href = "index.html";
}

if ((rutaActual === "index.html" || rutaActual === "") && userRegistrado) {
    window.location.href = "bienvenida.html";
}

const logout = () => {
    localStorage.clear();
    window.location.href = "index.html";
};
const nombrePersonal = document.getElementById("nombre");
const edad = document.getElementById("edad");
const email = document.getElementById("emailPersonal");
const contraseña = document.getElementById("password");
const confirmar = document.getElementById("confirmPassword");

const edadPermitida = 18

const registrar = async (event) => {

    event.preventDefault();

    const nombreValor = nombrePersonal.value;
    console.log(nombreValor);

    const edadValor = edad.value;
    console.log(edadValor);

    const emailValor = email.value;
    console.log(emailValor);

    const contraseñaValor = contraseña.value;
    console.log(contraseñaValor);

    const confirmarValor = confirmar.value;
    console.log(confirmarValor);


    const url = "https://jsonplaceholder.typicode.com/users";
    const response = await fetch(url);
    const json = await response.json();
    console.log(json);


    const emailUsers = json.map(
        function (user) {
            return user.email
        }
    )

    console.log(emailUsers)

    const emailFilter = emailUsers.filter(
        function (emailDB) {
            return emailDB === emailValor
        }
    )

    if (emailFilter.length > 0) {
        alert("No puedes registrarte ese mail esta en uso");
        return;
    }

    console.log(emailFilter)

    if (contraseñaValor !== confirmarValor){
        alert("Las contraseñas son distintas");
        console.log("Las contraseñas son distintas");
        return;
    }

    if (edadValor < edadPermitida) {
        alert("Tienes que ser mayor de 18 años para poder registrarte")
        console.error(edadValor, "Años no es edad sufficiente para registrarse");
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
# Guía para defender oralmente `script.js`

Esta guía corresponde a la versión actual de [`script.js`](script.js). El formulario que lo utiliza está en [`index.html`](index.html), y el botón para cerrar sesión está en [`bienvenida.html`](bienvenida.html).

## Resumen del propósito

El archivo JavaScript controla el recorrido básico del registro:

1. Obtiene los campos del formulario desde el HTML.
2. Al enviar el formulario, evita la recarga normal de la página.
3. Consulta una API de demostración, compara contraseñas y revisa la edad.
4. Guarda el correo y la contraseña en `localStorage` y navega a la bienvenida.
5. Según la página actual y los datos guardados, redirige al formulario o a la bienvenida.
6. Permite cerrar sesión limpiando el almacenamiento local.

## Guion breve para exponer

> “Este archivo conecta el formulario con el comportamiento de registro. Al principio obtiene los campos del HTML mediante `document.getElementById`. La función `registrar` recibe el evento de envío y llama a `preventDefault` para que el navegador no recargue la página automáticamente. Luego lee los datos ingresados, consulta JSONPlaceholder, compara las contraseñas y verifica que la edad sea de al menos 18 años. Si pasa esas condiciones, guarda el correo y la contraseña en `localStorage` y redirige a `bienvenida.html`. Al cargar una página, el script también revisa la ruta y si hay un correo guardado para decidir si se debe mostrar el formulario o la bienvenida. Por último, `logout` elimina los datos locales y vuelve al formulario. Hay dos detalles importantes de esta versión: la comparación de correo está escrita con un error y la contraseña se guarda en texto plano, así que no es un sistema seguro ni una validación de cuentas real.”

## Explicación por bloques

### 1. Obtener campos del HTML

```js
const nombrePersonal = document.getElementById("nombre");
const edad = document.getElementById("edad");
const email = document.getElementById("emailPersonal");
const contraseña = document.getElementById("password");
const confirmar = document.getElementById("confirmPassword");
```

Cada constante guarda la referencia al elemento que tiene ese `id` en `index.html`. Más adelante el script lee los valores con `.value`. Es importante que estos identificadores coincidan entre HTML y JavaScript; si uno no existe, la referencia será `null`.

### 2. Edad mínima

```js
const edadPermitida = 18
```

La constante representa la edad mínima para registrarse. Centralizar este número permite reutilizarlo en la condición de validación.

### 3. Función de registro y evento

```js
const registrar = async (event) => {
    event.preventDefault();
    // ...
}
```

En `index.html`, el formulario llama a esta función con `onsubmit="registrar(event)"`.

- `event` es el evento de envío del formulario.
- `event.preventDefault()` cancela el envío tradicional del navegador, que normalmente recargaría la página.
- `async` permite usar `await` para esperar la respuesta de la petición a la API.

Los campos también tienen el atributo HTML `required`. El navegador aplica su propia validación antes de enviar el formulario; la función JavaScript agrega las comprobaciones de edad y de coincidencia de las contraseñas.

### 4. Leer valores

```js
const nombreValor = nombrePersonal.value;
const edadValor = edad.value;
const emailValor = email.value;
const contraseñaValor = contraseña.value;
const confirmarValor = confirmar.value;
```

Se copian los valores de los campos a constantes locales para utilizarlos durante el registro. En esta versión, `edadValor` sigue siendo texto porque no se convierte con `Number()`. Al compararlo con `18`, JavaScript convierte el texto a número para hacer una comparación numérica.

Los `console.log()` que aparecen a continuación muestran estos valores en la consola del navegador. Eso facilita la depuración, pero no es adecuado para producción: especialmente, nunca conviene registrar contraseñas.

### 5. Consultar la API de demostración

```js
const url = "https://jsonplaceholder.typicode.com/users";
const response = await fetch(url);
const json = await response.json();
```

`fetch` realiza una petición HTTP a JSONPlaceholder. `await` espera primero la respuesta y luego su contenido convertido a formato JSON.

JSONPlaceholder es un servicio de demostración con datos de ejemplo. No crea una cuenta ni consulta una base de datos real de esta aplicación.

### 6. Crear y filtrar la lista de correos

```js
const emailUsers = json.map(
    function (user) {
        return user.email
    }
)
```

`map()` recorre la lista recibida y construye otra lista que contiene solamente los valores `email` de cada usuario.

Después se intenta buscar el correo ingresado:

```js
const emailFilter = emailUsers.filter(
    function (emailDB) {
        return emailDB === email
    }
)
```

`filter()` debería conservar los correos que coinciden con el que escribió la persona. **En el código actual hay un error:** se compara cada cadena `emailDB` con `email`, que es el elemento HTML, en lugar de compararla con `emailValor`, que es el texto ingresado. Por eso la búsqueda no detecta correctamente los correos repetidos.

Además, si se encuentra un correo, el código ejecuta `alert.error(...)`. `alert` es una función del navegador y normalmente no tiene un método `error`; esa línea puede provocar un error. La intención parece ser mostrar un aviso y detener la función con `return`.

### 7. Comparar las contraseñas

```js
if (contraseñaValor !== confirmarValor){
    alert("las contraseñas son distintas");
    console.log("las contraseñas son distintas");
    return;
}
```

El operador `!==` compara los dos valores. Si no coinciden, se muestra un aviso y `return` termina la función para que no continúe el registro.

### 8. Comprobar la edad

```js
if (edadValor < edadPermitida) {
    alert("Tienes que ser mayor de 18 años para poder registrarte")
    console.error(edadValor, "años no es edad sufficiente para registrarse");
    return;
}
```

Si la edad es menor que 18, se informa el motivo y se detiene la función. El texto del aviso dice “mayor de 18”, aunque la condición solo rechaza edades menores a 18; con la lógica actual, alguien de exactamente 18 años sí puede continuar.

### 9. Guardar y navegar

```js
localStorage.setItem("emailUsuario", emailValor);
localStorage.setItem("password", contraseñaValor);
window.location.href = "bienvenida.html";
```

`localStorage.setItem()` guarda cada dato en el navegador. `window.location.href` cambia la página actual y abre la bienvenida.

**Limitación de seguridad:** en esta versión la contraseña se almacena como texto plano en `localStorage`. Cualquier persona que use el navegador puede inspeccionar ese almacenamiento. Para una aplicación real, no se debe guardar la contraseña de esta manera: la autenticación debe realizarse en un servidor con HTTPS y la contraseña debe protegerse con técnicas adecuadas del lado del servidor.

### 10. Función `validarRegistro`

```js
const validarRegistro = () => {
    const userRegistrado = localStorage.getItem("emailUsuario");

    if (userRegistrado) {
        window.location.href = "bienvenida.html";
    }
};
```

La función consulta si existe un correo guardado y, si lo hay, redirige a la bienvenida. Sin embargo, en esta versión está declarada pero no se llama. Las redirecciones que sí se ejecutan al cargar el archivo están en las dos condiciones siguientes.

### 11. Control de la página actual

```js
const rutaActual = window.location.pathname.split("/").pop().toLowerCase();
const userRegistrado = localStorage.getItem("emailUsuario");
```

`window.location.pathname` contiene la ruta actual. `split("/").pop()` toma su último segmento —normalmente, el nombre del archivo— y `toLowerCase()` lo pasa a minúsculas para compararlo.

```js
if (rutaActual === "bienvenida.html" && !userRegistrado) {
    window.location.href = "index.html";
}

if ((rutaActual === "index.html" || rutaActual === "") && userRegistrado) {
    window.location.href = "bienvenida.html";
}
```

- Si la persona intenta abrir la bienvenida sin un correo guardado, vuelve al formulario.
- Si abre el formulario y ya existe un correo guardado, va a la bienvenida.
- Si no hay registro y está en el formulario, permanece allí.

Separar las condiciones por página evita que ambas reglas envíen al usuario continuamente de una página a la otra.

### 12. Cierre de sesión

```js
const logout = () => {
    localStorage.clear();
    window.location.href = "index.html";
};
```

El botón “Cerrar sesión” de `bienvenida.html` ejecuta `logout()`. `localStorage.clear()` elimina todos los datos locales guardados para el sitio y luego se vuelve al formulario.

## Preguntas posibles del examen

| Pregunta | Respuesta |
|---|---|
| ¿Qué hace `getElementById`? | Busca un elemento HTML por su atributo `id` y devuelve una referencia a ese elemento. |
| ¿Para qué sirve `preventDefault()`? | Evita el comportamiento de envío normal del formulario para que el flujo lo controle JavaScript. |
| ¿Qué hacen `async` y `await`? | Permiten esperar operaciones asíncronas, como una petición HTTP, sin bloquear la interfaz mientras se completa. |
| ¿Qué diferencia hay entre `map()` y `filter()`? | `map()` transforma cada elemento y crea una lista nueva; `filter()` selecciona los elementos que cumplen una condición. |
| ¿La API valida cuentas reales? | No. JSONPlaceholder entrega datos ficticios para practicar peticiones. |
| ¿Qué hace `return` dentro de una validación? | Detiene la ejecución de `registrar` para evitar que siga el proceso cuando hay un problema. |
| ¿Se ejecuta `validarRegistro` automáticamente? | No. Está definida, pero no se invoca en esta versión. |
| ¿Es seguro guardar la contraseña en `localStorage`? | No. Aquí queda en texto plano en el navegador, por lo que es solo una implementación de práctica y no debe usarse así en producción. |

## Detalles y limitaciones para mencionar con honestidad

- La comparación de correo usa `email` en vez de `emailValor`, por lo que la comprobación de duplicados no funciona como se espera.
- `alert.error(...)` no es una llamada válida al `alert` estándar del navegador.
- Se consulta la API antes de validar si las contraseñas coinciden o si la edad es suficiente; eso puede hacer una petición innecesaria.
- El código no comprueba `response.ok` ni maneja errores de conexión, así que una falla de red puede interrumpir el registro.
- La API de prueba no crea cuentas ni valida usuarios reales.
- La contraseña se guarda en texto plano en `localStorage` y también se escribe en la consola mediante `console.log`.
- `validarRegistro` no se utiliza; la lógica activa de redirección está en las condiciones que revisan `rutaActual`.

## Resumen para memorizar

**Obtener valores → consultar datos de prueba → comparar contraseña y edad → guardar en `localStorage` → ir a bienvenida.**

Al cargar la página, el script revisa la ruta y si hay un correo guardado. Al cerrar sesión, borra el almacenamiento y vuelve al formulario. La versión actual tiene limitaciones y errores en la comparación del correo y el manejo de `alert.error`, que es importante reconocer si se pregunta por ellos.

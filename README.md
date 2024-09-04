**Collin Gonzalez - A00382429**

**Juan Felipe Ramirez - A00382637**

# Comentario API

Nuestra aplicacion permite gestionar usuarios y comentarios en una plataforma, incluyendo la creación, modificiacion, eliminación, y la capacidad de agregar o eliminar reacciones a los comentarios.

## Requisitos

Para utilizar esta API, se necesita tener un usuario con rol de **superadmin**. Aqui tienes un ejemplo(aunque en el archivo pruebas.json estan todas las posibilidades, se prueba con superadmin porque puede hacer todo, pero las restricciones se pueden probar con usuarios regulares) para iniciar sesión con el siguiente endpoint:

### Inicio de Sesión

**POST** `/api/users/login`

**Request Body:**
```json
{
    "email": "superadmin@example.com",
    "password": "prueba1234567"
}
```

**Respuesta Exitosa:**
```json
{
    "token(ejemplo)": "3VwZXJhbWluIiwiaWF0IjoxNjg4NjEyMzQ5LCJleHBpIjoxNjg4NjEyMzU5fQ.SNZX8U7o9RM6K3Mbxp8MCN9g4Hhw4b8G8-M8pADUHzU"
}
```

Se guarda el token que recibe, ya que es necesario para autenticarte en los siguientes endpoints.

## Endpoints

### Crear Comentario

**POST** `/api/comments/create`

**Request Body:**
```json
{
    "content": "Este es otro comentario de prueba user regular.",
    "parentId": null
}
```

**Respuesta Exitosa:**
```
{
    "userId": "66d6296e8891334545332",
    "content": "Este es otro comentario de prueba user regular.",
    "parentId": null,
    "replies": [],
    "reactions": [],
    "_id": "66d62be78af01345533",
    "__v": 0
}
```

### Obtener Todos los Comentarios

**GET** `/api/comments`

**Respuesta Exitosa:**
```
{
        "_id": "comentario_id",
        "userId": "66d611d54345433e0613f",
        "content": "Este es un comentario.",
        "parentId": "66d624222329afffd961",
        "replies": [],
        "reactions": []
    }
```

### Obtener Comentario por ID

**GET** `/api/comments/:id`

**Respuesta Exitosa:**
```
{
    "_id": "66d62323432344e8c0e",
    "userId": "66d611d52343213f",
    "content": "Este es otro comentario de prueba.",
    "parentId": null,
    "replies": [],
    "reactions": [],
    "__v": 0
}
```

### Actualizar Usuario

**PUT** `/api/user/:id`

**Request Body:**
```
{
  "name": "NuevoNombre2",
  "email": "nuevoemail2@example.com",
  "password": "nuevacontraseña2"
}

```

**Respuesta con usuario no autorizado:**
```
{
    "message": "Only superadmin can update users"
}
```

Esas son algunas de las maneras en las que se puede probar.

## Notas

1. **Reacciones**: Para eliminar reacciones, usamos el tipo de datos `Mixed` en el esquema de mongoose para manejar la flexibilidad en los datos. Esto fue necesario porque teniamos problemas con la definición estricta del esquema para arreglos de objetos.
2. **Autorización**: Los endpoints necesitan siempre estar logeado y que tenga el rol adecuado para realizar estas acciones.
3. **pruebas.json**: En este archivo estan todas las pruebas en postman, lo unico que cambiaria seria el token, por lo que si o si se debe iniciar sesion como superadmin tal como se indica en el primer paso para poder seguir con todas las funcionalidades, el token puede que expire despues de un tiempo, se tiene que volver a iniciar sesion y cambiarlo.

---

### Despliegue en Vercel

El proyecto está desplegado en Vercel y está disponible en el siguiente enlace: [https://node-leh54q5cy-collins-projects-45b819a1.vercel.app](https://node-leh54q5cy-collins-projects-45b819a1.vercel.app). Debido a que el proyecto no incluye una interfaz de usuario (frontend) y está configurado solo para el backend, el enlace muestra el mensaje "Hello World". 

Para verificar la funcionalidad del backend, puedes usar herramientas como Postman para interactuar con las rutas API descritas en este README.
**Collin Gonzalez - A00382429**

**Juan Felipe Ramirez - A00382637**

# API GraphQL de Comentarios

Esta aplicación es una traducción de una API REST a GraphQL para gestionar usuarios y comentarios en una plataforma, incluyendo la creación, modificación, eliminación, y la capacidad de agregar o eliminar reacciones a los comentarios.

## Configuración Inicial

1. **Script de Superadmin**: 
   - Se incluye un script `createFirstAdmin.ts` que crea el primer superadmin
   - Ejecutar: `npx ts-node src/scripts/createFirstAdmin.ts`
   - Credenciales por defecto:
     ```
     email: superadmin@admin.com
     password: admin123
     ```

2. **Variables de Entorno**:
   ```env
   MONGO_URL=tu_url_mongodb
   JWT_SECRET=tu_secret_key
   PORT=8000
   ```

## Requisitos

Para utilizar esta API GraphQL, necesitas tener un usuario registrado. Aquí tienes las operaciones principales (las pruebas completas están en el archivo `GRAPHQL.postman_collection.json`):

### Registro e Inicio de Sesión

```graphql
# Registro
mutation Register {
  register(
    name: "Test User"
    email: "test@test.com"
    password: "password123"
  ) {
    id
    name
    email
    role
  }
}

# Inicio de Sesión
mutation Login {
  login(
    email: "test@test.com"
    password: "password123"
  ) {
    email
    name
    token
  }
}
```

El token recibido debe ser incluido en los headers de las siguientes operaciones como:
```
Authorization: Bearer <token>
```

## Operaciones Principales

### Fragments Reutilizables
```graphql
fragment UserFields on User {
  id
  name
  email
  role
  createdAt
  updatedAt
}

fragment CommentFields on Comment {
  id
  content
  userId
  createdAt
  reactions {
    userId
    type
  }
}
```

### Gestión de Usuarios

```graphql
# Crear Admin (solo superadmin)
mutation CreateAdmin {
  createAdmin(
    name: "New Admin"
    email: "admin@test.com"
    password: "admin456"
  ) {
    ...UserFields
  }
}

# Obtener Usuarios
query GetAllUsers {
  users {
    ...UserFields
  }
}
```

### Gestión de Comentarios

```graphql
# Crear Comentario
mutation CreateComment {
  createComment(
    content: "Este es un comentario de prueba"
    parentId: null
  ) {
    ...CommentFields
    replies {
      ...CommentFields
    }
  }
}
```

## Notas Técnicas

1. **GraphQL Playground**: La API incluye un playground accesible en `/graphql` para probar las operaciones interactivamente.
2. **Autenticación**: Todas las operaciones (excepto registro y login) requieren autenticación mediante JWT.
3. **Autorización**: Ciertas operaciones están restringidas según el rol del usuario:
   - `superadmin`: Puede realizar todas las operaciones
   - `user`: Limitado a operaciones sobre sus propios recursos

## Despliegue

El proyecto está desplegado en Railway y está disponible en:
[https://nodeapp-production.up.railway.app/graphql](https://nodeapp-production.up.railway.app/graphql)

Puedes probar la API usando:
1. El GraphQL Playground en la URL de despliegue
2. Postman (colección incluida en el repositorio)
3. Cualquier cliente GraphQL que soporte JWT en headers

## Dificultades y Limitaciones

1. **Migración a GraphQL**:
   - La reestructuración del código para manejar resolvers y tipos fue compleja
   - Implementación de fragments para optimizar queries requirió planificación adicional

2. **Despliegue**:
   - Inicialmente se intentó desplegar en Vercel pero hubo problemas con el manejo de GraphQL
   - Se migró a Railway donde el despliegue fue más directo para aplicaciones GraphQL
   - Los problemas con Vercel incluían:
     - Dificultades con el manejo de rutas
     - Problemas con el playground de GraphQL
     - Incompatibilidades con el middleware de autenticación

3. **Autenticación y Autorización**:
   - El manejo de contexto en GraphQL para autenticación fue diferente al REST
   - Implementar directivas de autorización personalizadas fue un reto

4. **Fragments y Optimización**:
   - La implementación de fragments requirió un enfoque diferente al pensado inicialmente
   - Se tuvo que balancear entre reutilización de código y flexibilidad

## Pruebas

Las pruebas completas están disponibles en el archivo `GRAPHQL.postman_collection.json`. Para usarlas:
1. Importa la colección en Postman
2. Configura la variable de entorno `baseUrl`
3. Ejecuta el login primero para obtener el token
4. El token se guardará automáticamente para las siguientes requests

## Estructura del Proyecto

```
/src
  /graphql
    /resolvers      # Resolvers de GraphQL
    /types         # Definiciones de tipos
  /middleware     # Middleware de autenticación
  /models        # Modelos de MongoDB
```

---
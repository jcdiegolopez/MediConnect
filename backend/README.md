```markdown
# MediConnect Global - Backend

**MediConnect Global** es una aplicación web para la gestión de clínicas médicas, diseñada como parte del **Proyecto 4 de CC3088 - Bases de Datos 1**, ciclo 1, 2025, de la Universidad del Valle de Guatemala. Este repositorio contiene el backend, implementado con **Node.js**, **Express**, **PostgreSQL**, y **Prisma**, que proporciona una API REST para gestionar pacientes, citas, consultas, facturas, y más.

El backend soporta 16 tablas, vistas, funciones, triggers, y restricciones, con ~1170 registros de datos de prueba generados usando **Faker.js**. Incluye operaciones CRUD, reportes con filtros, y validaciones.

## Estructura del Proyecto

```
medi-connect-global/
├── prisma/
│   ├── migrations/             # Migraciones de Prisma para la base de datos
│   ├── seed/
│   │   └── seed.js             # Script para poblar la base de datos con datos de prueba
│   └── schema.prisma           # Esquema de la base de datos (modelos)
├── sql/
│   ├── schema.sql              # Triggers, funciones y views en un solo script
│   ├── functions.sql           # Funciones SQL (calcular_edad, contar_consultas_doctor)
│   ├── triggers.sql            # Triggers SQL (verificar_disponibilidad_doctor, etc.)
│   ├── views.sql               # Vistas SQL (vista_pacientes, vista_citas, vista_facturas)
├── src/
│   ├── controllers/            # Controladores para las rutas
│   ├── generated/              # Cliente de prisma generado
│   ├── routes/                # Rutas de la API 
│   ├── services/              # Lógica de negocio
│   └── middleware/            # Middleware para validaciones 
├── .env                       # Variables de entorno 
├── .gitignore                 # Archivos y carpetas ignorados por Git
├── package.json               # Dependencias y scripts
├── README.md                  # Este archivo
└── server.js                  # Punto de entrada del servidor Express
```

## Requisitos Previos

- **Node.js** v22.11.0 o superior
- **PostgreSQL** v14 o superior
- **npm** v10 o superior
- Acceso a una base de datos PostgreSQL (local o remota)
- Git (opcional, para clonar el repositorio)

## Instalación y Configuración

### 1. Clonar el Repositorio
```bash
git clone https://github.com/jcdiegolopez/MediConnect
cd MediConnect/backend
```

### 2. Instalar Dependencias
Instala las dependencias del proyecto:
```bash
npm install
```

Dependencias principales:
- `@prisma/client`: Cliente para interactuar con la base de datos
- `@faker-js/faker`: Generación de datos de prueba
- `express`: Framework para la API
- `cors`: Soporte para CORS
- `dotenv`: Carga de variables de entorno

Dependencias de desarrollo:
- `prisma`: CLI para migraciones y generación del cliente
- `nodemon`: Reinicio automático del servidor

### 3. Configurar la Base de Datos
1. **Crear la Base de Datos**:
   Conéctate a PostgreSQL y crea una base de datos llamada `mediconnect`:
   ```sql
   CREATE DATABASE mediconnect;
   ```

2. **Configurar Variables de Entorno**:
   Crea un archivo `.env` en la raíz del proyecto con la URL de conexión a PostgreSQL:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/mediconnect?schema=public"
   ```
   Reemplaza `username` y `password` con tus credenciales de PostgreSQL.

3. **Aplicar Migraciones**:
   Ejecuta las migraciones de Prisma para crear las tablas:
   ```bash
   npx prisma migrate dev
   ```

4. **Aplicar Scripts SQL**:
   Ejecuta los scripts SQL para crear funciones, triggers, y vistas:
   ```bash
   psql -h localhost -U username -d mediconnect -f sql/functions.sql
   psql -h localhost -U username -d mediconnect -f sql/triggers.sql
   psql -h localhost -U username -d mediconnect -f sql/views.sql
   ```

### 4. Poblar la Base de Datos
El script de seeding (`prisma/seed/seed.js`) genera ~1170 registros de prueba usando Faker.js. Para ejecutarlo:
```bash
npm run prisma:seed
```

Esto poblará las 16 tablas:
- `Pacientes` (~300), `Doctores` (~100), `Clinicas` (~50), `Especialidades` (~20)
- `Citas` (~200), `Consultas` (~150), `Historiales_Medicos` (~100)
- `Medicamentos` (~50), `Recetas` (~100), `Alergias` (~50), `Pacientes_Alergias` (~100)
- `Tipos_Examenes` (~10), `Examenes_Medicos` (~50), `Doctores_Clinicas` (~100)
- `Facturas` (~50), `Facturas_Items` (~200)

**Nota**: Si necesitas limpiar la base de datos antes de seeding:
```sql
TRUNCATE TABLE public."Pacientes", public."Doctores", public."Clinicas", public."Especialidades",
    public."Citas", public."Consultas", public."Historiales_Medicos", public."Medicamentos",
    public."Recetas", public."Alergias", public."Pacientes_Alergias", public."Tipos_Examenes",
    public."Examenes_Medicos", public."Doctores_Clinicas", public."Facturas", public."Facturas_Items"
    RESTART IDENTITY CASCADE;
```

### 5. Ejecutar el Servidor
Inicia el servidor Express:
```bash
npm start
```
O usa `nodemon` para desarrollo (reinicio automático):
```bash
npm run dev
```

El servidor se ejecutará en `http://localhost:3000` (o el puerto especificado en `.env`).

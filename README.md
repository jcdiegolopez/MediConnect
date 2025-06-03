# 🩺 MediConnect Global

**MediConnect Global** es una aplicación web integral para la gestión de clínicas médicas, desarrollada como parte del **Proyecto 4 de CC3088 - Bases de Datos 1** (Ciclo 1, 2025) en la Universidad del Valle de Guatemala.  
Incluye un **backend** (Node.js, Express, PostgreSQL, Prisma) y un **frontend** (React + Vite), permitiendo la administración de pacientes, citas, consultas, facturación, reportes y mucho más.

---

## 📁 Estructura del Proyecto

```
medi-connect-global/
├── backend/
│   ├── prisma/
│   │   ├── migrations/             # Migraciones de Prisma para la base de datos
│   │   ├── seed/
│   │   │   └── seed.js             # Script para poblar la base de datos con datos de prueba
│   │   └── schema.prisma           # Esquema de la base de datos (modelos)
│   ├── sql/
│   │   ├── schema.sql              # Triggers, funciones y vistas en un solo script
│   │   ├── functions.sql           # Funciones SQL (calcular_edad, contar_consultas_doctor)
│   │   ├── triggers.sql            # Triggers SQL (verificar_disponibilidad_doctor, etc.)
│   │   ├── views.sql               # Vistas SQL (vista_pacientes, vista_citas, vista_consultas)
│   ├── src/
│   │   ├── controllers/            # Controladores para las rutas
│   │   ├── routes/                 # Rutas de la API 
│   │   ├── services/               # Lógica de negocio
│   │   └── middleware/             # Middleware para validaciones 
│   ├── .env                        # Variables de entorno 
│   ├── api.postman_collection.json # Endpoints de prueba para Postman
│   ├── package.json                # Dependencias y scripts
│   ├── README.md                   # Documentación backend
│   └── server.js                   # Punto de entrada del servidor Express
├── frontend/
│   ├── public/                     # Archivos estáticos
│   ├── src/                        # Código fuente React
│   ├── package.json                # Dependencias y scripts
│   ├── README.md                   # Documentación frontend
│   └── index.html                  # HTML principal
└── README.md                       # Este archivo (documentación general)
```

---

## ⚙️ Requisitos Previos

| Herramienta    | Versión mínima |
| -------------- | -------------- |
| [Node.js](https://nodejs.org/)   | ![Node.js](https://img.shields.io/badge/Node.js-22.11.0+-green) |
| [npm](https://www.npmjs.com/)    | ![npm](https://img.shields.io/badge/npm-10+-blue) |
| [PostgreSQL](https://www.postgresql.org/) | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blueviolet) |
| [Git](https://git-scm.com/)      | Opcional      |

---

## 🚀 Instalación y Configuración

### 1️⃣ Clonar el Repositorio

```bash
git clone https://github.com/jcdiegolopez/MediConnect
cd MediConnect
```

### 2️⃣ Configurar la Base de Datos

1. **Crear la Base de Datos**  
   Conéctate a PostgreSQL y crea la base de datos:
   ```sql
   CREATE DATABASE mediconnect;
   ```

2. **Configurar Variables de Entorno**  
   Crea un archivo `.env` en `backend/` con la URL de conexión:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/mediconnect?schema=public"
   ```
   Reemplaza `username` y `password` por tus credenciales.

### 3️⃣ Instalar Dependencias

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd ../frontend
npm install
```

### 4️⃣ Aplicar Migraciones y Generar Cliente Prisma

Desde la carpeta `backend`:

```bash
npx prisma migrate deploy
npm run prisma:generate
```

### 5️⃣ Aplicar Scripts SQL (Funciones, Triggers y Vistas)

Desde la carpeta `backend`:

```bash
psql -h localhost -U username -d mediconnect -f sql/functions.sql
psql -h localhost -U username -d mediconnect -f sql/triggers.sql
psql -h localhost -U username -d mediconnect -f sql/views.sql
```
Reemplaza `username` por tu usuario de PostgreSQL.

### 6️⃣ Poblar la Base de Datos (Opcional)

El script de seeding (`prisma/seed/seed.js`) genera ~1170 registros de prueba usando Faker.js.  
Desde la carpeta `backend`:

```bash
npm run prisma:seed
```

Esto poblará las 16 tablas principales:
- `Pacientes` (~300), `Doctores` (~100), `Clinicas` (~50), `Especialidades` (~20)
- `Citas` (~200), `Consultas` (~150), `Historiales_Medicos` (~100)
- `Medicamentos` (~50), `Recetas` (~100), `Alergias` (~50), `Pacientes_Alergias` (~100)
- `Tipos_Examenes` (~10), `Examenes_Medicos` (~50), `Doctores_Clinicas` (~100)
- `Facturas` (~50), `Facturas_Items` (~200)

> ℹ️ **Nota:** Si necesitas limpiar la base de datos antes de seeding:
> ```sql
> TRUNCATE TABLE public."Pacientes", public."Doctores", public."Clinicas", public."Especialidades",
>     public."Citas", public."Consultas", public."Historiales_Medicos", public."Medicamentos",
>     public."Recetas", public."Alergias", public."Pacientes_Alergias", public."Tipos_Examenes",
>     public."Examenes_Medicos", public."Doctores_Clinicas", public."Facturas", public."Facturas_Items"
>     RESTART IDENTITY CASCADE;
> ```

---

## ▶️ Ejecución

### 🖥️ Backend

Desde la carpeta `backend`:

```bash
npm start
```
O para desarrollo (con reinicio automático):

```bash
npm run dev
```

El servidor se ejecutará en [http://localhost:3000](http://localhost:3000) (o el puerto especificado en `.env`).

### 💻 Frontend

Desde la carpeta `frontend`:

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:5173](http://localhost:5173) (o el puerto configurado por Vite).

---

## ✨ Funcionalidades Principales

- 👨‍⚕️ Gestión de pacientes, doctores, clínicas, citas, consultas, recetas, exámenes, facturación y reportes.
- 📝 CRUD completo para todas las entidades principales.
- 📊 Reportes con filtros avanzados y exportación a CSV.
- ✅ Validaciones y manejo de errores robusto.
- 🧪 Datos de prueba realistas generados con Faker.js.

---

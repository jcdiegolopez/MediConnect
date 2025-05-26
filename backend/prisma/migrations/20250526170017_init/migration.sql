-- CreateEnum
CREATE TYPE "CitasEstado" AS ENUM ('Programada', 'Completada', 'Cancelada');

-- CreateEnum
CREATE TYPE "AlergiasGravedad" AS ENUM ('Leve', 'Moderada', 'Severa');

-- CreateEnum
CREATE TYPE "FacturasItemsTipo" AS ENUM ('Consulta', 'Examen');

-- CreateTable
CREATE TABLE "Pacientes" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "fecha_nacimiento" TIMESTAMP(3) NOT NULL,
    "genero" TEXT,
    "correo" TEXT NOT NULL,
    "telefono" TEXT,
    "ultima_consulta" TIMESTAMP(3),

    CONSTRAINT "Pacientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Doctores" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "especialidad_id" INTEGER NOT NULL,
    "numero_colegiado" TEXT NOT NULL,

    CONSTRAINT "Doctores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Especialidades" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "Especialidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Clinicas" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "pais" TEXT,
    "ciudad" TEXT,
    "telefono" TEXT,

    CONSTRAINT "Clinicas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consultas" (
    "id" SERIAL NOT NULL,
    "paciente_id" INTEGER NOT NULL,
    "doctor_id" INTEGER NOT NULL,
    "clinica_id" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "diagnostico" TEXT,
    "notas" JSONB NOT NULL,

    CONSTRAINT "Consultas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Historiales_Medicos" (
    "id" SERIAL NOT NULL,
    "paciente_id" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3),
    "diagnostico" TEXT,
    "tratamientos" TEXT,

    CONSTRAINT "Historiales_Medicos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Citas" (
    "id" SERIAL NOT NULL,
    "paciente_id" INTEGER NOT NULL,
    "doctor_id" INTEGER NOT NULL,
    "clinica_id" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "estado" "CitasEstado" NOT NULL DEFAULT 'Programada',

    CONSTRAINT "Citas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medicamentos" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "fabricante" TEXT,

    CONSTRAINT "Medicamentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recetas" (
    "id" SERIAL NOT NULL,
    "consulta_id" INTEGER NOT NULL,
    "medicamento_id" INTEGER NOT NULL,
    "dosis" TEXT,

    CONSTRAINT "Recetas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alergias" (
    "id" SERIAL NOT NULL,
    "nombre_alergia" TEXT NOT NULL,
    "gravedad" "AlergiasGravedad" NOT NULL,

    CONSTRAINT "Alergias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Examenes_Medicos" (
    "id" SERIAL NOT NULL,
    "paciente_id" INTEGER NOT NULL,
    "tipo_examen_id" INTEGER NOT NULL,
    "consulta_id" INTEGER,
    "fecha" TIMESTAMP(3) NOT NULL,
    "resultado" TEXT,

    CONSTRAINT "Examenes_Medicos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tipos_Examenes" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "costo" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Tipos_Examenes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Doctores_Clinicas" (
    "doctor_id" INTEGER NOT NULL,
    "clinica_id" INTEGER NOT NULL,

    CONSTRAINT "Doctores_Clinicas_pkey" PRIMARY KEY ("doctor_id","clinica_id")
);

-- CreateTable
CREATE TABLE "Pacientes_Alergias" (
    "paciente_id" INTEGER NOT NULL,
    "alergia_id" INTEGER NOT NULL,

    CONSTRAINT "Pacientes_Alergias_pkey" PRIMARY KEY ("paciente_id","alergia_id")
);

-- CreateTable
CREATE TABLE "Facturas" (
    "id" SERIAL NOT NULL,
    "paciente_id" INTEGER NOT NULL,
    "monto" DECIMAL(65,30) NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Facturas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Facturas_Items" (
    "id" SERIAL NOT NULL,
    "factura_id" INTEGER NOT NULL,
    "tipo_item" "FacturasItemsTipo" NOT NULL,
    "consulta_id" INTEGER,
    "examen_id" INTEGER,
    "costo" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Facturas_Items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pacientes_correo_key" ON "Pacientes"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "Doctores_numero_colegiado_key" ON "Doctores"("numero_colegiado");

-- AddForeignKey
ALTER TABLE "Doctores" ADD CONSTRAINT "Doctores_especialidad_id_fkey" FOREIGN KEY ("especialidad_id") REFERENCES "Especialidades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consultas" ADD CONSTRAINT "Consultas_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "Pacientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consultas" ADD CONSTRAINT "Consultas_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "Doctores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consultas" ADD CONSTRAINT "Consultas_clinica_id_fkey" FOREIGN KEY ("clinica_id") REFERENCES "Clinicas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Historiales_Medicos" ADD CONSTRAINT "Historiales_Medicos_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "Pacientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Citas" ADD CONSTRAINT "Citas_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "Pacientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Citas" ADD CONSTRAINT "Citas_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "Doctores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Citas" ADD CONSTRAINT "Citas_clinica_id_fkey" FOREIGN KEY ("clinica_id") REFERENCES "Clinicas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recetas" ADD CONSTRAINT "Recetas_consulta_id_fkey" FOREIGN KEY ("consulta_id") REFERENCES "Consultas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recetas" ADD CONSTRAINT "Recetas_medicamento_id_fkey" FOREIGN KEY ("medicamento_id") REFERENCES "Medicamentos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Examenes_Medicos" ADD CONSTRAINT "Examenes_Medicos_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "Pacientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Examenes_Medicos" ADD CONSTRAINT "Examenes_Medicos_tipo_examen_id_fkey" FOREIGN KEY ("tipo_examen_id") REFERENCES "Tipos_Examenes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Examenes_Medicos" ADD CONSTRAINT "Examenes_Medicos_consulta_id_fkey" FOREIGN KEY ("consulta_id") REFERENCES "Consultas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Doctores_Clinicas" ADD CONSTRAINT "Doctores_Clinicas_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "Doctores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Doctores_Clinicas" ADD CONSTRAINT "Doctores_Clinicas_clinica_id_fkey" FOREIGN KEY ("clinica_id") REFERENCES "Clinicas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pacientes_Alergias" ADD CONSTRAINT "Pacientes_Alergias_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "Pacientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pacientes_Alergias" ADD CONSTRAINT "Pacientes_Alergias_alergia_id_fkey" FOREIGN KEY ("alergia_id") REFERENCES "Alergias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Facturas" ADD CONSTRAINT "Facturas_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "Pacientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Facturas_Items" ADD CONSTRAINT "Facturas_Items_factura_id_fkey" FOREIGN KEY ("factura_id") REFERENCES "Facturas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Facturas_Items" ADD CONSTRAINT "Facturas_Items_consulta_id_fkey" FOREIGN KEY ("consulta_id") REFERENCES "Consultas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Facturas_Items" ADD CONSTRAINT "Facturas_Items_examen_id_fkey" FOREIGN KEY ("examen_id") REFERENCES "Examenes_Medicos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

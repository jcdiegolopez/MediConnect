-- DropForeignKey
ALTER TABLE "Citas" DROP CONSTRAINT "Citas_paciente_id_fkey";

-- DropForeignKey
ALTER TABLE "Consultas" DROP CONSTRAINT "Consultas_paciente_id_fkey";

-- DropForeignKey
ALTER TABLE "Examenes_Medicos" DROP CONSTRAINT "Examenes_Medicos_paciente_id_fkey";

-- DropForeignKey
ALTER TABLE "Facturas" DROP CONSTRAINT "Facturas_paciente_id_fkey";

-- DropForeignKey
ALTER TABLE "Historiales_Medicos" DROP CONSTRAINT "Historiales_Medicos_paciente_id_fkey";

-- DropForeignKey
ALTER TABLE "Pacientes_Alergias" DROP CONSTRAINT "Pacientes_Alergias_paciente_id_fkey";


-- AddForeignKey
ALTER TABLE "Consultas" ADD CONSTRAINT "Consultas_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "Pacientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Historiales_Medicos" ADD CONSTRAINT "Historiales_Medicos_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "Pacientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Citas" ADD CONSTRAINT "Citas_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "Pacientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Examenes_Medicos" ADD CONSTRAINT "Examenes_Medicos_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "Pacientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pacientes_Alergias" ADD CONSTRAINT "Pacientes_Alergias_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "Pacientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Facturas" ADD CONSTRAINT "Facturas_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "Pacientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

const { PrismaClient } = require('../../src/generated/prisma');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

async function seedEspecialidades() {
    const especialidades = Array.from({ length: 20 }, () => ({
        nombre: faker.helpers.arrayElement([
            'Cardiología', 'Pediatría', 'Neurología', 'Dermatología', 'Ginecología',
            'Ortopedia', 'Oftalmología', 'Psiquiatría', 'Oncología', 'Endocrinología',
            'Gastroenterología', 'Urología', 'Nefrología', 'Reumatología', 'Hematología',
            'Neumología', 'Cirugía General', 'Anestesiología', 'Medicina Interna', 'Radiología'
        ]),
        descripcion: faker.lorem.sentence()
    }));
    await prisma.especialidades.createMany({ data: especialidades, skipDuplicates: true });
    console.log('Especialidades creadas');
}

async function seedClinicas() {
    const clinicas = Array.from({ length: 50 }, () => ({
        nombre: `${faker.company.name()} Clínica`,
        pais: faker.location.country(),
        ciudad: faker.location.city(),
        telefono: faker.phone.number()
    }));
    await prisma.clinicas.createMany({ data: clinicas });
    console.log('Clínicas creadas');
}

async function seedDoctores() {
    const especialidades = await prisma.especialidades.findMany();
    const doctores = Array.from({ length: 100 }, () => ({
        nombre: faker.person.firstName(),
        apellido: faker.person.lastName(),
        especialidad_id: faker.helpers.arrayElement(especialidades).id,
        numero_colegiado: `COL${faker.string.alphanumeric(6).toUpperCase()}`
    }));
    await prisma.doctores.createMany({ data: doctores, skipDuplicates: true });
    console.log('Doctores creados');
}

async function seedPacientes() {
    const pacientes = Array.from({ length: 300 }, () => ({
        nombre: faker.person.firstName(),
        apellido: faker.person.lastName(),
        fecha_nacimiento: faker.date.birthdate({ min: 18, max: 90, mode: 'age' }),
        genero: faker.helpers.arrayElement(['M', 'F', 'Otro']),
        correo: faker.internet.email({ firstName: faker.person.firstName(), lastName: faker.person.lastName() }),
        telefono: faker.phone.number()
    }));
    await prisma.pacientes.createMany({ data: pacientes, skipDuplicates: true });
    console.log('Pacientes creados');
}

async function seedDoctoresClinicas() {
    const doctores = await prisma.doctores.findMany();
    const clinicas = await prisma.clinicas.findMany();
    const doctoresClinicas = Array.from({ length: 100 }, () => ({
        doctor_id: faker.helpers.arrayElement(doctores).id,
        clinica_id: faker.helpers.arrayElement(clinicas).id
    }));
    await prisma.doctores_Clinicas.createMany({ data: doctoresClinicas, skipDuplicates: true });
    console.log('Doctores_Clinicas creadas');
}

async function seedCitas() {
    const pacientes = await prisma.pacientes.findMany();
    const doctores = await prisma.doctores.findMany();
    const clinicas = await prisma.clinicas.findMany();
    const citas = Array.from({ length: 200 }, () => ({
        paciente_id: faker.helpers.arrayElement(pacientes).id,
        doctor_id: faker.helpers.arrayElement(doctores).id,
        clinica_id: faker.helpers.arrayElement(clinicas).id,
        fecha: faker.date.between({ from: '2025-01-01', to: '2025-12-31' }),
        estado: faker.helpers.arrayElement(['Programada', 'Completada', 'Cancelada'])
    }));
    for (const cita of citas) {
        try {
            await prisma.citas.create({ data: cita });
        } catch (error) {
            console.warn(`Cita omitida por conflicto: ${error.message}`);
        }
    }
    console.log('Citas creadas');
}

async function seedConsultas() {
    const pacientes = await prisma.pacientes.findMany();
    const doctores = await prisma.doctores.findMany();
    const clinicas = await prisma.clinicas.findMany();
    const consultas = Array.from({ length: 150 }, () => ({
        paciente_id: faker.helpers.arrayElement(pacientes).id,
        doctor_id: faker.helpers.arrayElement(doctores).id,
        clinica_id: faker.helpers.arrayElement(clinicas).id,
        fecha: faker.date.between({ from: '2025-01-01', to: '2025-12-31' }),
        diagnostico: faker.lorem.sentence(),
        notas: {
            observaciones: faker.lorem.sentence(),
            sintomas: [faker.lorem.word(), faker.lorem.word()],
            recomendaciones: faker.lorem.sentence()
        }
    }));
    await prisma.consultas.createMany({ data: consultas });
    console.log('Consultas creadas');
}

async function seedHistorialesMedicos() {
    const pacientes = await prisma.pacientes.findMany();
    const historiales = Array.from({ length: 100 }, () => ({
        paciente_id: faker.helpers.arrayElement(pacientes).id,
        fecha: faker.date.past({ years: 5 }),
        diagnostico: faker.lorem.sentence(),
        tratamientos: faker.lorem.sentence()
    }));
    await prisma.historiales_Medicos.createMany({ data: historiales });
    console.log('Historiales_Medicos creados');
}

async function seedMedicamentos() {
    const medicamentos = Array.from({ length: 50 }, () => ({
        nombre: faker.commerce.productName(),
        fabricante: faker.company.name()
    }));
    await prisma.medicamentos.createMany({ data: medicamentos });
    console.log('Medicamentos creados');
}

async function seedRecetas() {
    const consultas = await prisma.consultas.findMany();
    const medicamentos = await prisma.medicamentos.findMany();
    const recetas = Array.from({ length: 100 }, () => ({
        consulta_id: faker.helpers.arrayElement(consultas).id,
        medicamento_id: faker.helpers.arrayElement(medicamentos).id,
        dosis: `${faker.number.int({ min: 1, max: 3 })} comprimido(s) al día`
    }));
    await prisma.recetas.createMany({ data: recetas });
    console.log('Recetas creadas');
}

async function seedAlergias() {
    const alergias = Array.from({ length: 50 }, () => ({
        nombre_alergia: faker.helpers.arrayElement([
            'Penicilina', 'Polen', 'Ácaros', 'Látex', 'Mariscos',
            'Nueces', 'Aspirina', 'Ibuprofeno', 'Gluten', 'Lactosa'
        ]),
        gravedad: faker.helpers.arrayElement(['Leve', 'Moderada', 'Severa'])
    }));
    await prisma.alergias.createMany({ data: alergias, skipDuplicates: true });
    console.log('Alergias creadas');
}

async function seedPacientesAlergias() {
    const pacientes = await prisma.pacientes.findMany();
    const alergias = await prisma.alergias.findMany();
    const pacientesAlergias = Array.from({ length: 100 }, () => ({
        paciente_id: faker.helpers.arrayElement(pacientes).id,
        alergia_id: faker.helpers.arrayElement(alergias).id
    }));
    await prisma.pacientes_Alergias.createMany({ data: pacientesAlergias, skipDuplicates: true });
    console.log('Pacientes_Alergias creadas');
}

async function seedTiposExamenes() {
    const tiposExamenes = Array.from({ length: 10 }, () => ({
        nombre: faker.helpers.arrayElement([
            'Análisis de sangre', 'Rayos X', 'Ecografía', 'Resonancia magnética',
            'Electrocardiograma', 'Tomografía', 'Análisis de orina', 'Colonoscopia',
            'Mamografía', 'Prueba de esfuerzo'
        ]),
        costo: faker.number.float({ min: 50, max: 500, precision: 0.01 })
    }));
    await prisma.tipos_Examenes.createMany({ data: tiposExamenes, skipDuplicates: true });
    console.log('Tipos_Examenes creados');
}

async function seedExamenesMedicos() {
    const pacientes = await prisma.pacientes.findMany();
    const tiposExamenes = await prisma.tipos_Examenes.findMany();
    const consultas = await prisma.consultas.findMany();
    const examenes = Array.from({ length: 50 }, () => ({
        paciente_id: faker.helpers.arrayElement(pacientes).id,
        tipo_examen_id: faker.helpers.arrayElement(tiposExamenes).id,
        consulta_id: faker.helpers.arrayElement([null, ...consultas.map(c => c.id)]),
        fecha: faker.date.between({ from: '2025-01-01', to: '2025-12-31' }),
        resultado: faker.lorem.sentence()
    }));
    await prisma.examenes_Medicos.createMany({ data: examenes });
    console.log('Examenes_Medicos creados');
}

async function seedFacturas() {
    const pacientes = await prisma.pacientes.findMany();
    const facturas = Array.from({ length: 50 }, () => ({
        paciente_id: faker.helpers.arrayElement(pacientes).id,
        monto: 0, // Se actualizará con el trigger
        fecha: faker.date.between({ from: '2025-01-01', to: '2025-12-31' })
    }));
    await prisma.facturas.createMany({ data: facturas });
    console.log('Facturas creadas');
}

async function seedFacturasItems() {
    const facturas = await prisma.facturas.findMany();
    const consultas = await prisma.consultas.findMany();
    const examenes = await prisma.examenes_Medicos.findMany();
    const facturasItems = Array.from({ length: 200 }, () => {
        const isConsulta = faker.datatype.boolean();
        return {
            factura_id: faker.helpers.arrayElement(facturas).id,
            tipo_item: isConsulta ? 'Consulta' : 'Examen',
            consulta_id: isConsulta ? faker.helpers.arrayElement(consultas).id : null,
            examen_id: isConsulta ? null : faker.helpers.arrayElement(examenes).id,
            costo: faker.number.float({ min: 50, max: 500, precision: 0.01 })
        };
    });
    await prisma.facturas_Items.createMany({ data: facturasItems });
    console.log('Facturas_Items creados');
}

async function main() {
    try {
        await seedEspecialidades();
        await seedClinicas();
        await seedDoctores();
        await seedPacientes();
        await seedDoctoresClinicas();
        await seedCitas();
        await seedConsultas();
        await seedHistorialesMedicos();
        await seedMedicamentos();
        await seedRecetas();
        await seedAlergias();
        await seedPacientesAlergias();
        await seedTiposExamenes();
        await seedExamenesMedicos();
        await seedFacturas();
        await seedFacturasItems();
        console.log('Seeding completado exitosamente.');
    } catch (error) {
        console.error('Error durante el seeding:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();

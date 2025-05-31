-- Vista: Vista_Pacientes
CREATE OR REPLACE VIEW public.vista_pacientes AS
SELECT 
    p.id,
    p.nombre,
    p.apellido,
    p.fecha_nacimiento,
    public.calcular_edad(p.fecha_nacimiento::DATE) AS edad,
    COUNT(h.id) AS total_historiales,
    STRING_AGG(a.nombre_alergia, ', ') AS alergias
FROM public."Pacientes" p
LEFT JOIN public."Historiales_Medicos" h ON p.id = h.paciente_id
LEFT JOIN public."Pacientes_Alergias" pa ON p.id = pa.paciente_id
LEFT JOIN public."Alergias" a ON pa.alergia_id = a.id
GROUP BY p.id;

-- Vista: Vista_Citas
CREATE OR REPLACE VIEW public.vista_citas AS
SELECT 
    c.id,
    c.fecha,
    c.estado,
    p.nombre || ' ' || p.apellido AS paciente,
    p.id AS paciente_id,
    d.nombre || ' ' || d.apellido AS doctor,
    d.id AS doctor_id,
    cl.nombre AS clinica
FROM public."Citas" c
INNER JOIN public."Pacientes" p ON c.paciente_id = p.id
INNER JOIN public."Doctores" d ON c.doctor_id = d.id
INNER JOIN public."Clinicas" cl ON c.clinica_id = cl.id;

-- Vista: Vista_Consultas
CREATE OR REPLACE VIEW public.vista_consultas AS
SELECT 
    c.id,
    c.fecha,
    p.nombre || ' ' || p.apellido AS paciente,
    p.id AS paciente_id,
    d.nombre || ' ' || d.apellido AS doctor,
    d.id AS doctor_id,
    cl.nombre AS clinica,
    c.diagnostico,
    STRING_AGG(m.nombre || ': ' || COALESCE(r.dosis, 'Sin dosis'), '; ') AS recetas
FROM public."Consultas" c
INNER JOIN public."Pacientes" p ON c.paciente_id = p.id
INNER JOIN public."Doctores" d ON c.doctor_id = d.id
INNER JOIN public."Clinicas" cl ON c.clinica_id = cl.id
LEFT JOIN public."Recetas" r ON c.id = r.consulta_id
LEFT JOIN public."Medicamentos" m ON r.medicamento_id = m.id
GROUP BY c.id, c.fecha, p.nombre, p.apellido, p.id, d.nombre, d.apellido, d.id, cl.nombre, c.diagnostico;
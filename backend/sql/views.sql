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
    d.nombre || ' ' || d.apellido AS doctor,
    cl.nombre AS clinica
FROM public."Citas" c
INNER JOIN public."Pacientes" p ON c.paciente_id = p.id
INNER JOIN public."Doctores" d ON c.doctor_id = d.id
INNER JOIN public."Clinicas" cl ON c.clinica_id = cl.id;

-- Vista: Vista_Facturas
CREATE OR REPLACE VIEW public.vista_facturas AS
SELECT 
    f.id,
    f.fecha,
    f.monto,
    p.nombre || ' ' || p.apellido AS paciente,
    STRING_AGG(
        fi.tipo_item || ': $' || fi.costo || 
        CASE 
            WHEN fi.consulta_id IS NOT NULL THEN ' (Consulta #' || fi.consulta_id || ')'
            WHEN fi.examen_id IS NOT NULL THEN ' (Examen #' || fi.examen_id || ')'
            ELSE ''
        END, 
        '; '
    ) AS items
FROM public."Facturas" f
INNER JOIN public."Pacientes" p ON f.paciente_id = p.id
LEFT JOIN public."Facturas_Items" fi ON f.id = fi.factura_id
GROUP BY f.id, p.nombre, p.apellido;
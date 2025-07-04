-- Trigger: VerificarDisponibilidadDoctor
CREATE OR REPLACE FUNCTION public.verificar_disponibilidad_doctor()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM public."Citas"
        WHERE doctor_id = NEW.doctor_id
        AND fecha BETWEEN NEW.fecha - INTERVAL '30 minutes' AND NEW.fecha + INTERVAL '30 minutes'
        AND id != NEW.id
    ) THEN
        RAISE EXCEPTION 'El doctor ya tiene una cita en ese horario.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_verificar_disponibilidad
    BEFORE INSERT ON public."Citas"
    FOR EACH ROW EXECUTE FUNCTION public.verificar_disponibilidad_doctor();

-- Trigger: ActualizarUltimaConsulta
CREATE OR REPLACE FUNCTION public.actualizar_ultima_consulta()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public."Pacientes"
    SET ultima_consulta = NEW.fecha::date
    WHERE id = NEW.paciente_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_ultima_consulta
    AFTER INSERT ON public."Consultas"
    FOR EACH ROW EXECUTE FUNCTION public.actualizar_ultima_consulta();

-- Trigger: CalcularMontoFactura
CREATE OR REPLACE FUNCTION public.calcular_monto_factura()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public."Facturas"
    SET monto = (
        SELECT COALESCE(SUM(costo), 0)
        FROM public."Facturas_Items"
        WHERE factura_id = NEW.factura_id
    )
    WHERE id = NEW.factura_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_calcular_monto
    AFTER INSERT OR UPDATE OR DELETE ON public."Facturas_Items"
    FOR EACH ROW EXECUTE FUNCTION public.calcular_monto_factura();

-- Función: CalcularEdad
CREATE OR REPLACE FUNCTION public.calcular_edad(fecha_nacimiento TIMESTAMP WITHOUT TIME ZONE)
RETURNS INTEGER AS $$
BEGIN
    RETURN DATE_PART('year', AGE(CURRENT_DATE, fecha_nacimiento::DATE));
END;
$$ LANGUAGE plpgsql;


-- Función: ContarConsultasDoctor
CREATE OR REPLACE FUNCTION public.contar_consultas_doctor(p_doctor_id INT, fecha_inicio DATE, fecha_fin DATE)
RETURNS INTEGER AS $$
    SELECT COUNT(*)
    FROM public."Consultas"
    WHERE doctor_id = p_doctor_id
    AND fecha::date BETWEEN fecha_inicio AND fecha_fin;
$$ LANGUAGE sql;


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
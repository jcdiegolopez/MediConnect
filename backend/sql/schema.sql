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
CREATE OR REPLACE FUNCTION public.calcular_edad(fecha_nacimiento DATE)
RETURNS INTEGER AS $$
BEGIN
    RETURN DATE_PART('year', AGE(CURRENT_DATE, fecha_nacimiento));
END;
$$ LANGUAGE plpgsql;

-- Función: ContarConsultasDoctor
CREATE OR REPLACE FUNCTION public.contar_consultas_doctor(doctor_id INT, fecha_inicio DATE, fecha_fin DATE)
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(*)
        FROM public."Consultas"
        WHERE doctor_id = doctor_id
        AND fecha::date BETWEEN fecha_inicio AND fecha_fin
    );
END;
$$ LANGUAGE plpgsql;

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
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

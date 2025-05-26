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
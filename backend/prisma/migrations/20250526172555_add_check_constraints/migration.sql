-- This is an empty migration.-- prisma/migrations/YYYYMMDD_add_check_constraints/migration.sql
ALTER TABLE public."Tipos_Examenes" ADD CONSTRAINT costo_positive CHECK (costo > 0);
ALTER TABLE public."Facturas" ADD CONSTRAINT monto_positive CHECK (monto > 0);
ALTER TABLE public."Facturas_Items" ADD CONSTRAINT costo_positive CHECK (costo > 0);
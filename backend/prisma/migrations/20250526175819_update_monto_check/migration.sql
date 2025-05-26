-- This is an empty migration.-- prisma/migrations/YYYYMMDD_update_monto_check/migration.sql
ALTER TABLE public."Facturas" DROP CONSTRAINT monto_positive;
ALTER TABLE public."Facturas" ADD CONSTRAINT monto_positive CHECK (monto >= 0);
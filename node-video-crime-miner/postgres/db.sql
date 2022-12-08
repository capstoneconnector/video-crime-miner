-- Database: video-crime-miner

-- DROP DATABASE IF EXISTS "video-crime-miner";

CREATE DATABASE "video-crime-miner"
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

-- SCHEMA: public

-- DROP SCHEMA IF EXISTS public ;

CREATE SCHEMA IF NOT EXISTS public
    AUTHORIZATION postgres;

COMMENT ON SCHEMA public
    IS 'standard public schema';

GRANT ALL ON SCHEMA public TO PUBLIC;

GRANT ALL ON SCHEMA public TO postgres;

-- Table: public.case

-- DROP TABLE IF EXISTS public."case";

CREATE TABLE IF NOT EXISTS public."case"
(
    case_id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    name text COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default",
    tags text[] COLLATE pg_catalog."default",
    notes text[] COLLATE pg_catalog."default",
    CONSTRAINT case_pkey PRIMARY KEY (case_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."case"
    OWNER to postgres;




-- Table: public.file

-- DROP TABLE IF EXISTS public.file;

CREATE TABLE IF NOT EXISTS public.file
(
    s3_name text COLLATE pg_catalog."default" NOT NULL,
    title text COLLATE pg_catalog."default" NOT NULL,
    notes text COLLATE pg_catalog."default",
    case_id integer NOT NULL,
    CONSTRAINT file_pkey PRIMARY KEY (s3_name),
    CONSTRAINT file_case_id_fkey FOREIGN KEY (case_id)
        REFERENCES public."case" (case_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.file
    OWNER to postgres;
-- Table: public.awsoutput

-- DROP TABLE IF EXISTS public.awsoutput;

CREATE TABLE IF NOT EXISTS public.awsoutput
(
    job_id text COLLATE pg_catalog."default" NOT NULL,
    result json,
    file_id text COLLATE pg_catalog."default" NOT NULL,
    tags text[] COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "aws-output_pkey" PRIMARY KEY (job_id),
    CONSTRAINT "aws-output_file_id_fkey" FOREIGN KEY (file_id)
        REFERENCES public.file (s3_name) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.awsoutput
    OWNER to postgres;
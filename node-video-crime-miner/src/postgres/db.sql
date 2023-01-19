-- Database: video-crime-miner
DROP SCHEMA IF EXISTS public CASCADE;
DROP DATABASE IF EXISTS "video-crime-miner";

CREATE DATABASE "video-crime-miner"
    WITH
    OWNER = postgres
    ENCODING = 'UTF8';

-- SCHEMA: public

\c video-crime-miner

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

-- insert case rows
INSERT INTO public."case"(
    name, description, tags, notes) 
    VALUES ('Gas Station Robbery', 'The gas station on University Ave was robbed', ARRAY ['car', 'truck', 'red shirt'], ARRAY ['Suspect is Jacob']);
INSERT INTO public."case"(
    name, description, tags, notes) 
    VALUES ('Tire Thief On Campus', 'Somebody is stealing spare tires off cars!', ARRAY ['car', 'truck', 'tire'], ARRAY ['Suspect is Isaac']);
INSERT INTO public."case"(
    name, description, tags, notes) 
    VALUES ('Fraud in BSU', 'Someone has been cashing fraudulent checks', ARRAY ['checks', 'money', 'suit'], ARRAY ['Witness is Eric']);

-- insert file rows
INSERT INTO public.file(
    s3_name, title, notes, case_id) 
    VALUES ('robbery.mp4', 'gas station robbery security camera footage', 'no notes', 1);
INSERT INTO public.file(
    s3_name, title, notes, case_id) 
    VALUES ('tires.mp4', 'BSU security footage', 'no notes', 2);
INSERT INTO public.file(
    s3_name, title, notes, case_id) 
    VALUES ('fraudulentCheck.png', 'Copy of signed fraudulent check', 'Used fake name on signature', 3);

-- Insert awsoutput rows
INSERT INTO public.awsoutput(
    job_id, result, file_id, tags) 
    VALUES ('ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb', JSON '{"result": null}', 'robbery.mp4', ARRAY ['car', 'truck', 'red shirt']);
INSERT INTO public.awsoutput(
    job_id, result, file_id, tags) 
    VALUES ('8537a6780e0a037fd3bbf076471382ee0c6a1547ba2d39837b9a8bb9160f6ee4', JSON '{"result": null}', 'tires.mp4', ARRAY ['tire']);
INSERT INTO public.awsoutput(
    job_id, result, file_id, tags) 
    VALUES ('9a151fd743707783e4a27aee180e1992fa86c317558ac414bc74dd60801ca54a', JSON '{"result": null}', 'fraudulentCheck.png', ARRAY ['checks', 'money', 'suit']);

\q
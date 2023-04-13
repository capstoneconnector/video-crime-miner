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

-- Table: public.chuqlabuser

DROP TABLE IF EXISTS public."chuqlabuser" CASCADE;

CREATE TABLE IF NOT EXISTS public."chuqlabuser"
(
    
    user_id text NOT NULL COLLATE pg_catalog."default",
    CONSTRAINT chuqlabuser_pkey PRIMARY KEY (user_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."chuqlabuser"
    OWNER to postgres;


-- Table: public.case

DROP TABLE IF EXISTS public."case" CASCADE;

CREATE TABLE IF NOT EXISTS public."case"
(
    case_id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    name text COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default",
    tags text[] COLLATE pg_catalog."default",
    notes text[] COLLATE pg_catalog."default",
    user_id text NOT NULL,
    CONSTRAINT case_pkey PRIMARY KEY (case_id),
    CONSTRAINT case_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public."chuqlabuser" (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION

)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."case"
    OWNER to postgres;




-- Table: public.file

DROP TABLE IF EXISTS public.file CASCADE;

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

DROP TABLE IF EXISTS public.awsoutput CASCADE;

CREATE TABLE IF NOT EXISTS public.awsoutput
(
    job_id text COLLATE pg_catalog."default" NOT NULL,
    result json,
    file_id text COLLATE pg_catalog."default" NOT NULL,
    tags text[] COLLATE pg_catalog."default" NOT NULL,
    queueUrl text COLLATE pg_catalog."default",
    topicArn text COLLATE pg_catalog."default",
    CONSTRAINT "aws-output_pkey" PRIMARY KEY (job_id),
    CONSTRAINT "aws-output_file_id_fkey" FOREIGN KEY (file_id)
        REFERENCES public.file (s3_name) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.awsoutput
    OWNER to postgres;

-- insert user rows
INSERT INTO public."chuqlabuser"(
    user_id)
    VALUES ('d6fefc77-df88-4529-9699-8b03a7eb0da0');


-- insert case rows
INSERT INTO public."case"(
    name, description, tags, notes, user_id)
    VALUES ('Gas Station Robbery', 'The gas station on University Ave was robbed', ARRAY ['Gun', 'Person', 'Truck'], ARRAY ['Suspect is Jacob'], 'd6fefc77-df88-4529-9699-8b03a7eb0da0');
INSERT INTO public."case"(
    name, description, tags, notes, user_id) 
    VALUES ('Fish Poacher', 'Somebody is killing endangered fish', ARRAY ['Fish'], ARRAY ['Suspect is Isaac'], 'd6fefc77-df88-4529-9699-8b03a7eb0da0');
INSERT INTO public."case"(
    name, description, tags, notes, user_id) 
    VALUES ('Hit and Run on the street', 'Someone hit and run in 2 seconds', ARRAY ['Person', 'Sunglasses'], ARRAY ['Witness is Eric'], 'd6fefc77-df88-4529-9699-8b03a7eb0da0');

-- insert file rows
INSERT INTO public.file(
    s3_name, title, notes, case_id) 
    VALUES ('[DEMO] Real Crime Video.mp4', 'gas station robbery security camera footage', 'no notes', 1);
INSERT INTO public.file(
    s3_name, title, notes, case_id) 
    VALUES ('[DEMO] Fish Video.mp4', 'Fish Poaching Video', 'no notes', 2);
INSERT INTO public.file(
    s3_name, title, notes, case_id) 
    VALUES ('[DEMO] Crowd of People.mp4', 'Video for hit and run', 'The perp was wearing sunglasses in this video', 3);

-- Insert awsoutput rows
INSERT INTO public.awsoutput(
    job_id, result, file_id, tags, queueUrl, topicArn) 
    VALUES ('EMPTY JSON EXAMPLE 1', JSON '{}', '[DEMO] Real Crime Video.mp4', ARRAY ['car', 'truck', 'red shirt'], 'example', 'example');
INSERT INTO public.awsoutput(
    job_id, result, file_id, tags, queueUrl, topicArn) 
    VALUES ('EMPTY JSON EXAMPLE 2', JSON '{}', '[DEMO] Fish Video.mp4', ARRAY ['tire'], 'example', 'example');
INSERT INTO public.awsoutput(
    job_id, result, file_id, tags, queueUrl, topicArn) 
    VALUES ('EMPTY JSON EXAMPLE 3', JSON '{}', '[DEMO] Crowd of People.mp4', ARRAY ['checks', 'money', 'suit'], 'example', 'example');

\q
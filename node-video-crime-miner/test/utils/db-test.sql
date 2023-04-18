-- Database: test-video-crime-miner
DROP SCHEMA IF EXISTS public CASCADE;
DROP DATABASE IF EXISTS "test-video-crime-miner";

CREATE DATABASE "test-video-crime-miner"
    WITH
    OWNER = postgres
    ENCODING = 'UTF8';

-- SCHEMA: public

\c test-video-crime-miner

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
    VALUES ('Test Case 1', 'Test Case 1 Description', ARRAY ['Test', 'Case', 'Tags'], ARRAY ['Test Case 1 Notes'], 'd6fefc77-df88-4529-9699-8b03a7eb0da0');


-- insert file rows
INSERT INTO public.file(
    s3_name, title, notes, case_id) 
    VALUES ('[DEMO] Real Crime Video.mp4', 'Test File Description', 'Test File Notes', 1);


-- Insert awsoutput rows
INSERT INTO public.awsoutput(
    job_id, result, file_id, tags, queueUrl, topicArn) 
    VALUES ('testoutput1', JSON '{"Labels": [{"Label": {"Aliases": [],"Categories": [{"Name": "Test Category 1"}],"Confidence": 50.0,"Instances": [{"BoundingBox": {"Height": 0.5,"Left": 0.3,"Top": 0.15,"Width": 0.2},"Confidence": 90.0}],"Name": "Test","Parents": [{"Name": "Test Parent 1"},{"Name": "Test Parent 2"}]},"Timestamp": 0},{"Label": {"Aliases": [],"Categories": [{"Name": "Test Category 2"}],"Confidence": 50.0,"Instances": [{"BoundingBox": {"Height": 0.15,"Left": 0.3,"Top": 0.5,"Width": 0.2},"Confidence": 90.0}],"Name": "Case","Parents": [{"Name": "Case Parent 1"},{"Name": "Case Parent 2"}]},"Timestamp": 0},{"Label": {"Aliases": [],"Categories": [{"Name": "Test Category 3"}],"Confidence": 50.0,"Instances": [{"BoundingBox": {"Height": 0.15,"Left": 0.2,"Top": 0.5,"Width": 0.3},"Confidence": 90.0}],"Name": "Tags","Parents": [{"Name": "Tags Parent 1"},{"Name": "Tags Parent 2"}]},"Timestamp": 0}],"VideoMetadata": {"Codec": "h264","ColorRange": "LIMITED","DurationMillis": 11450,"Format": "QuickTime / MOV","FrameHeight": 1080,"FrameRate": 60,"FrameWidth": 1920}}', '[DEMO] Real Crime Video.mp4', ARRAY ['Test', 'Case', 'Tags'], '', '');


\q
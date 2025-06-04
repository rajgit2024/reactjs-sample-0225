-- Modified for Neon import

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

-- Create tables
CREATE TABLE public.users (
    id SERIAL PRIMARY KEY,
    name character varying(100),
    email character varying(100) NOT NULL UNIQUE,
    password character varying(255) NOT NULL
);

CREATE TABLE public.tasks (
    id SERIAL PRIMARY KEY,
    title text NOT NULL,
    description text,
    status character varying(20) DEFAULT 'To Do'::character varying,
    priority character varying(10) DEFAULT 'Medium'::character varying,
    user_id integer REFERENCES public.users(id),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.tasks 
    ADD CONSTRAINT fk_tasks_user_id 
    FOREIGN KEY (user_id) REFERENCES public.users(id);
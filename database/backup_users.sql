--
-- PostgreSQL database dump
--

\restrict An5lQRgC7lfzG8rXTOvW30oVEZFLPiODFM0aA8Jg29GnwlberlqLDKkLRhp625C

-- Dumped from database version 15.18
-- Dumped by pg_dump version 15.18

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: users; Type: TABLE; Schema: public; Owner: users_user
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    role character varying DEFAULT 'client'::character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO users_user;

--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: users_user
--

COPY public.users (id, email, password, role, "createdAt") FROM stdin;
fb7d4acf-0a5a-4dc1-8957-c4b921b34416	oscar@smartlogix.com	$2b$10$wWu4HRdOfGxfP5aEhta54ucJu4OQRGA2HdUnKL3sTgr40LUVROOYu	admin	2026-06-03 21:39:37.38107
f1d27308-36b2-427d-ac89-f501b656a878	usuario@smartlogix.com	$2b$10$1b8QGz8TGrM6Pr/xSdJEf.OCMDHMW2jBbpKNVEKJOgAllIw0Vk31u	client	2026-06-05 02:04:44.414058
\.


--
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: users_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: users_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- PostgreSQL database dump complete
--

\unrestrict An5lQRgC7lfzG8rXTOvW30oVEZFLPiODFM0aA8Jg29GnwlberlqLDKkLRhp625C


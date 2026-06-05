--
-- PostgreSQL database dump
--

\restrict VLk7EftoO08jXxqQgLtSVzmwqvLyr58VJ2ceQo39qTeLedaSAC6Sia1amyu0OWL

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
-- Name: inventory; Type: TABLE; Schema: public; Owner: inventory_user
--

CREATE TABLE public.inventory (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    description character varying NOT NULL,
    price integer NOT NULL,
    quantity integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.inventory OWNER TO inventory_user;

--
-- Data for Name: inventory; Type: TABLE DATA; Schema: public; Owner: inventory_user
--

COPY public.inventory (id, name, description, price, quantity, "createdAt") FROM stdin;
12e16f45-2309-463b-b6d9-d2cd9f85b69c	Teclado Mecánico RGB	Teclado switch blue para desarrollo rápido	45000	15	2026-06-04 21:59:21.733606
5ea3526a-8c97-4793-b9d5-29958bf06283	Notebook Acer Aspire	Notebook gama media para trabajar y estudiar	545990	10	2026-06-04 22:00:01.198939
\.


--
-- Name: inventory PK_82aa5da437c5bbfb80703b08309; Type: CONSTRAINT; Schema: public; Owner: inventory_user
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT "PK_82aa5da437c5bbfb80703b08309" PRIMARY KEY (id);


--
-- Name: inventory UQ_fb3b5167049bd49cb7be3e37045; Type: CONSTRAINT; Schema: public; Owner: inventory_user
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT "UQ_fb3b5167049bd49cb7be3e37045" UNIQUE (name);


--
-- PostgreSQL database dump complete
--

\unrestrict VLk7EftoO08jXxqQgLtSVzmwqvLyr58VJ2ceQo39qTeLedaSAC6Sia1amyu0OWL


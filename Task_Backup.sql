--
-- PostgreSQL database dump
--

-- Dumped from database version 17rc1
-- Dumped by pg_dump version 17rc1

-- Started on 2025-06-04 22:20:12

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4853 (class 0 OID 33251)
-- Dependencies: 218
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tasks (id, title, description, status, priority, user_id, created_at, updated_at) FROM stdin;
5	Home Work	You will have to complete home work	To Do	High	3	2025-06-03 18:51:28.92082	2025-06-03 18:51:28.92082
9	Crack the opportunity	Overcoming the challenges and successfully sizing a chance	To Do	High	2	2025-06-04 14:19:22.257539	2025-06-04 14:19:51.879535
\.


--
-- TOC entry 4855 (class 0 OID 33261)
-- Dependencies: 220
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password) FROM stdin;
2	Raj Dubey	rajdu590@gmail.com	$2b$10$NpfKk3szuVCmqnSIB2V3ouEFvX1RJXRLqKzF02PuV2Wjy.caZK9eG
3	Rohan Singh	rohan@gmail.com	$2b$10$VyZ32hcfZf1sQhYV3fsmZeW3mBzrRln9NAkHDtAFswACPXK3tXAnG
\.


--
-- TOC entry 4861 (class 0 OID 0)
-- Dependencies: 217
-- Name: tasks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tasks_id_seq', 9, true);


--
-- TOC entry 4862 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


-- Completed on 2025-06-04 22:20:12

--
-- PostgreSQL database dump complete
--


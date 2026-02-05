--
-- PostgreSQL database dump
--

\restrict OFP1ieXYUaGatHk068RsQHAeSUlkgkHoAU5bFdyIPyDIS7Jt4lrFdcLWGQpYnOF

-- Dumped from database version 17.6 (Debian 17.6-1.pgdg13+1)
-- Dumped by pg_dump version 17.7 (Homebrew)

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: asset; Type: TABLE; Schema: public; Owner: pg
--

CREATE TABLE public.asset (
    tags text[],
    video_id integer NOT NULL,
    id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.asset OWNER TO pg;

--
-- Name: asset_id_seq; Type: SEQUENCE; Schema: public; Owner: pg
--

CREATE SEQUENCE public.asset_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.asset_id_seq OWNER TO pg;

--
-- Name: asset_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pg
--

ALTER SEQUENCE public.asset_id_seq OWNED BY public.asset.id;


--
-- Name: video; Type: TABLE; Schema: public; Owner: pg
--

CREATE TABLE public.video (
    url text NOT NULL,
    platform text NOT NULL,
    id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.video OWNER TO pg;

--
-- Name: video_id_seq; Type: SEQUENCE; Schema: public; Owner: pg
--

CREATE SEQUENCE public.video_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.video_id_seq OWNER TO pg;

--
-- Name: video_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pg
--

ALTER SEQUENCE public.video_id_seq OWNED BY public.video.id;


--
-- Name: asset id; Type: DEFAULT; Schema: public; Owner: pg
--

ALTER TABLE ONLY public.asset ALTER COLUMN id SET DEFAULT nextval('public.asset_id_seq'::regclass);


--
-- Name: video id; Type: DEFAULT; Schema: public; Owner: pg
--

ALTER TABLE ONLY public.video ALTER COLUMN id SET DEFAULT nextval('public.video_id_seq'::regclass);


--
-- Name: video video_pk; Type: CONSTRAINT; Schema: public; Owner: pg
--

ALTER TABLE ONLY public.video
    ADD CONSTRAINT video_pk PRIMARY KEY (id);


--
-- Name: video video_url_key; Type: CONSTRAINT; Schema: public; Owner: pg
--

ALTER TABLE ONLY public.video
    ADD CONSTRAINT video_url_key UNIQUE (url);


--
-- Name: asset asset_video_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: pg
--

ALTER TABLE ONLY public.asset
    ADD CONSTRAINT asset_video_id_fk FOREIGN KEY (video_id) REFERENCES public.video(id);


--
-- PostgreSQL database dump complete
--

\unrestrict OFP1ieXYUaGatHk068RsQHAeSUlkgkHoAU5bFdyIPyDIS7Jt4lrFdcLWGQpYnOF


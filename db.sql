--
-- PostgreSQL database dump
--

-- Dumped from database version 13.1
-- Dumped by pg_dump version 13.1

-- Started on 2021-01-25 19:26:46

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 204 (class 1259 OID 16410)
-- Name: posts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.posts (
    type character varying(8) NOT NULL,
    id integer NOT NULL,
    content character varying(256),
    media text,
    user_id integer NOT NULL,
    created_at bigint NOT NULL
);


ALTER TABLE public.posts OWNER TO postgres;

--
-- TOC entry 202 (class 1259 OID 16406)
-- Name: Posts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Posts_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Posts_id_seq" OWNER TO postgres;

--
-- TOC entry 3083 (class 0 OID 0)
-- Dependencies: 202
-- Name: Posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Posts_id_seq" OWNED BY public.posts.id;


--
-- TOC entry 203 (class 1259 OID 16408)
-- Name: Posts_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Posts_user_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Posts_user_id_seq" OWNER TO postgres;

--
-- TOC entry 3084 (class 0 OID 0)
-- Dependencies: 203
-- Name: Posts_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Posts_user_id_seq" OWNED BY public.posts.user_id;


--
-- TOC entry 201 (class 1259 OID 16397)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    last_name character varying(100) NOT NULL,
    id integer NOT NULL,
    first_name character varying(100) NOT NULL,
    email character varying(200) NOT NULL,
    image text,
    password text NOT NULL,
    created_at bigint
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 200 (class 1259 OID 16395)
-- Name: Users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Users_id_seq" OWNER TO postgres;

--
-- TOC entry 3085 (class 0 OID 0)
-- Dependencies: 200
-- Name: Users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Users_id_seq" OWNED BY public.users.id;


--
-- TOC entry 216 (class 1259 OID 24610)
-- Name: comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comments (
    id integer NOT NULL,
    content character varying(256) NOT NULL,
    user_id integer NOT NULL,
    post_id integer NOT NULL,
    created_at bigint
);


ALTER TABLE public.comments OWNER TO postgres;

--
-- TOC entry 213 (class 1259 OID 24604)
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.comments_id_seq OWNER TO postgres;

--
-- TOC entry 3086 (class 0 OID 0)
-- Dependencies: 213
-- Name: comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.comments_id_seq OWNED BY public.comments.id;


--
-- TOC entry 215 (class 1259 OID 24608)
-- Name: comments_post_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.comments_post_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.comments_post_id_seq OWNER TO postgres;

--
-- TOC entry 3087 (class 0 OID 0)
-- Dependencies: 215
-- Name: comments_post_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.comments_post_id_seq OWNED BY public.comments.post_id;


--
-- TOC entry 214 (class 1259 OID 24606)
-- Name: comments_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.comments_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.comments_user_id_seq OWNER TO postgres;

--
-- TOC entry 3088 (class 0 OID 0)
-- Dependencies: 214
-- Name: comments_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.comments_user_id_seq OWNED BY public.comments.user_id;


--
-- TOC entry 208 (class 1259 OID 24582)
-- Name: follow_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.follow_requests (
    id integer NOT NULL,
    requested_by integer NOT NULL,
    target integer NOT NULL,
    created_at bigint NOT NULL
);


ALTER TABLE public.follow_requests OWNER TO postgres;

--
-- TOC entry 205 (class 1259 OID 24576)
-- Name: follow_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.follow_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.follow_requests_id_seq OWNER TO postgres;

--
-- TOC entry 3089 (class 0 OID 0)
-- Dependencies: 205
-- Name: follow_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.follow_requests_id_seq OWNED BY public.follow_requests.id;


--
-- TOC entry 206 (class 1259 OID 24578)
-- Name: follow_requests_requested_by_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.follow_requests_requested_by_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.follow_requests_requested_by_seq OWNER TO postgres;

--
-- TOC entry 3090 (class 0 OID 0)
-- Dependencies: 206
-- Name: follow_requests_requested_by_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.follow_requests_requested_by_seq OWNED BY public.follow_requests.requested_by;


--
-- TOC entry 207 (class 1259 OID 24580)
-- Name: follow_requests_target_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.follow_requests_target_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.follow_requests_target_seq OWNER TO postgres;

--
-- TOC entry 3091 (class 0 OID 0)
-- Dependencies: 207
-- Name: follow_requests_target_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.follow_requests_target_seq OWNED BY public.follow_requests.target;


--
-- TOC entry 212 (class 1259 OID 24596)
-- Name: following; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.following (
    id integer NOT NULL,
    user_id integer NOT NULL,
    target integer NOT NULL,
    created_at bigint NOT NULL
);


ALTER TABLE public.following OWNER TO postgres;

--
-- TOC entry 209 (class 1259 OID 24590)
-- Name: following_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.following_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.following_id_seq OWNER TO postgres;

--
-- TOC entry 3092 (class 0 OID 0)
-- Dependencies: 209
-- Name: following_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.following_id_seq OWNED BY public.following.id;


--
-- TOC entry 211 (class 1259 OID 24594)
-- Name: following_target_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.following_target_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.following_target_seq OWNER TO postgres;

--
-- TOC entry 3093 (class 0 OID 0)
-- Dependencies: 211
-- Name: following_target_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.following_target_seq OWNED BY public.following.target;


--
-- TOC entry 210 (class 1259 OID 24592)
-- Name: following_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.following_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.following_user_id_seq OWNER TO postgres;

--
-- TOC entry 3094 (class 0 OID 0)
-- Dependencies: 210
-- Name: following_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.following_user_id_seq OWNED BY public.following.user_id;


--
-- TOC entry 220 (class 1259 OID 24624)
-- Name: likes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.likes (
    id integer NOT NULL,
    user_id integer NOT NULL,
    post_id integer NOT NULL,
    created_at bigint NOT NULL
);


ALTER TABLE public.likes OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 24618)
-- Name: likes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.likes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.likes_id_seq OWNER TO postgres;

--
-- TOC entry 3095 (class 0 OID 0)
-- Dependencies: 217
-- Name: likes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.likes_id_seq OWNED BY public.likes.id;


--
-- TOC entry 219 (class 1259 OID 24622)
-- Name: likes_post_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.likes_post_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.likes_post_id_seq OWNER TO postgres;

--
-- TOC entry 3096 (class 0 OID 0)
-- Dependencies: 219
-- Name: likes_post_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.likes_post_id_seq OWNED BY public.likes.post_id;


--
-- TOC entry 218 (class 1259 OID 24620)
-- Name: likes_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.likes_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.likes_user_id_seq OWNER TO postgres;

--
-- TOC entry 3097 (class 0 OID 0)
-- Dependencies: 218
-- Name: likes_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.likes_user_id_seq OWNED BY public.likes.user_id;


--
-- TOC entry 2909 (class 2604 OID 24613)
-- Name: comments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments ALTER COLUMN id SET DEFAULT nextval('public.comments_id_seq'::regclass);


--
-- TOC entry 2910 (class 2604 OID 24614)
-- Name: comments user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments ALTER COLUMN user_id SET DEFAULT nextval('public.comments_user_id_seq'::regclass);


--
-- TOC entry 2911 (class 2604 OID 24615)
-- Name: comments post_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments ALTER COLUMN post_id SET DEFAULT nextval('public.comments_post_id_seq'::regclass);


--
-- TOC entry 2903 (class 2604 OID 24585)
-- Name: follow_requests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.follow_requests ALTER COLUMN id SET DEFAULT nextval('public.follow_requests_id_seq'::regclass);


--
-- TOC entry 2904 (class 2604 OID 24586)
-- Name: follow_requests requested_by; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.follow_requests ALTER COLUMN requested_by SET DEFAULT nextval('public.follow_requests_requested_by_seq'::regclass);


--
-- TOC entry 2905 (class 2604 OID 24587)
-- Name: follow_requests target; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.follow_requests ALTER COLUMN target SET DEFAULT nextval('public.follow_requests_target_seq'::regclass);


--
-- TOC entry 2906 (class 2604 OID 24599)
-- Name: following id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.following ALTER COLUMN id SET DEFAULT nextval('public.following_id_seq'::regclass);


--
-- TOC entry 2907 (class 2604 OID 24600)
-- Name: following user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.following ALTER COLUMN user_id SET DEFAULT nextval('public.following_user_id_seq'::regclass);


--
-- TOC entry 2908 (class 2604 OID 24601)
-- Name: following target; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.following ALTER COLUMN target SET DEFAULT nextval('public.following_target_seq'::regclass);


--
-- TOC entry 2912 (class 2604 OID 24627)
-- Name: likes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.likes ALTER COLUMN id SET DEFAULT nextval('public.likes_id_seq'::regclass);


--
-- TOC entry 2913 (class 2604 OID 24628)
-- Name: likes user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.likes ALTER COLUMN user_id SET DEFAULT nextval('public.likes_user_id_seq'::regclass);


--
-- TOC entry 2914 (class 2604 OID 24629)
-- Name: likes post_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.likes ALTER COLUMN post_id SET DEFAULT nextval('public.likes_post_id_seq'::regclass);


--
-- TOC entry 2901 (class 2604 OID 16413)
-- Name: posts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts ALTER COLUMN id SET DEFAULT nextval('public."Posts_id_seq"'::regclass);


--
-- TOC entry 2902 (class 2604 OID 16414)
-- Name: posts user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts ALTER COLUMN user_id SET DEFAULT nextval('public."Posts_user_id_seq"'::regclass);


--
-- TOC entry 2900 (class 2604 OID 16400)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public."Users_id_seq"'::regclass);


--
-- TOC entry 3073 (class 0 OID 24610)
-- Dependencies: 216
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.comments (id, content, user_id, post_id, created_at) VALUES (4, 'awesome!', 12, 14, 1611499370414);
INSERT INTO public.comments (id, content, user_id, post_id, created_at) VALUES (5, 'Another one!', 12, 14, 1611499439462);
INSERT INTO public.comments (id, content, user_id, post_id, created_at) VALUES (6, 'a commment', 12, 16, 1611499681606);
INSERT INTO public.comments (id, content, user_id, post_id, created_at) VALUES (7, 'another comment', 12, 16, 1611499755645);
INSERT INTO public.comments (id, content, user_id, post_id, created_at) VALUES (8, 'a third comment', 12, 16, 1611499790398);
INSERT INTO public.comments (id, content, user_id, post_id, created_at) VALUES (9, 'comment', 12, 16, 1611499878473);
INSERT INTO public.comments (id, content, user_id, post_id, created_at) VALUES (10, 'another comment', 12, 14, 1611504231633);
INSERT INTO public.comments (id, content, user_id, post_id, created_at) VALUES (11, 'comment', 12, 18, 1611507594814);
INSERT INTO public.comments (id, content, user_id, post_id, created_at) VALUES (17, 'com', 14, 8, 1611520376963);
INSERT INTO public.comments (id, content, user_id, post_id, created_at) VALUES (22, 'new comment', 12, 20, 1611523200390);


--
-- TOC entry 3065 (class 0 OID 24582)
-- Dependencies: 208
-- Data for Name: follow_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.follow_requests (id, requested_by, target, created_at) VALUES (68, 15, 12, 1611566753353);


--
-- TOC entry 3069 (class 0 OID 24596)
-- Dependencies: 212
-- Data for Name: following; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.following (id, user_id, target, created_at) VALUES (3, 11, 10, 1611247021908);
INSERT INTO public.following (id, user_id, target, created_at) VALUES (8, 14, 13, 1611444498390);
INSERT INTO public.following (id, user_id, target, created_at) VALUES (9, 13, 12, 1611509454475);
INSERT INTO public.following (id, user_id, target, created_at) VALUES (11, 12, 14, 1611518424683);
INSERT INTO public.following (id, user_id, target, created_at) VALUES (12, 12, 13, 1611526755453);


--
-- TOC entry 3077 (class 0 OID 24624)
-- Dependencies: 220
-- Data for Name: likes; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.likes (id, user_id, post_id, created_at) VALUES (2, 11, 6, 1611264630095);
INSERT INTO public.likes (id, user_id, post_id, created_at) VALUES (74, 12, 11, 1611523118267);
INSERT INTO public.likes (id, user_id, post_id, created_at) VALUES (75, 12, 9, 1611523119669);
INSERT INTO public.likes (id, user_id, post_id, created_at) VALUES (76, 12, 8, 1611526706218);
INSERT INTO public.likes (id, user_id, post_id, created_at) VALUES (14, 14, 10, 1611491208043);
INSERT INTO public.likes (id, user_id, post_id, created_at) VALUES (77, 12, 7, 1611526708856);
INSERT INTO public.likes (id, user_id, post_id, created_at) VALUES (78, 13, 7, 1611526775961);
INSERT INTO public.likes (id, user_id, post_id, created_at) VALUES (79, 13, 26, 1611530098386);
INSERT INTO public.likes (id, user_id, post_id, created_at) VALUES (18, 14, 7, 1611491521106);
INSERT INTO public.likes (id, user_id, post_id, created_at) VALUES (19, 14, 9, 1611491523058);
INSERT INTO public.likes (id, user_id, post_id, created_at) VALUES (81, 12, 27, 1611533242383);
INSERT INTO public.likes (id, user_id, post_id, created_at) VALUES (41, 12, 16, 1611505288070);
INSERT INTO public.likes (id, user_id, post_id, created_at) VALUES (42, 12, 13, 1611505315962);
INSERT INTO public.likes (id, user_id, post_id, created_at) VALUES (44, 12, 17, 1611507298651);
INSERT INTO public.likes (id, user_id, post_id, created_at) VALUES (46, 12, 15, 1611507474687);
INSERT INTO public.likes (id, user_id, post_id, created_at) VALUES (47, 12, 18, 1611507598541);
INSERT INTO public.likes (id, user_id, post_id, created_at) VALUES (56, 12, 12, 1611510665421);


--
-- TOC entry 3061 (class 0 OID 16410)
-- Dependencies: 204
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.posts (type, id, content, media, user_id, created_at) VALUES ('text', 37, 'first!', NULL, 15, 1611566573898);
INSERT INTO public.posts (type, id, content, media, user_id, created_at) VALUES ('text', 10, 'oli first post', NULL, 13, 1611445035373);
INSERT INTO public.posts (type, id, content, media, user_id, created_at) VALUES ('text', 8, 'alyssa first', NULL, 14, 1611443343637);
INSERT INTO public.posts (type, id, content, media, user_id, created_at) VALUES ('text', 9, 'alyssa second post', NULL, 14, 1611443574662);
INSERT INTO public.posts (type, id, content, media, user_id, created_at) VALUES ('text', 7, 'First!', NULL, 12, 1611442793306);
INSERT INTO public.posts (type, id, content, media, user_id, created_at) VALUES ('image', 33, '', 'https://social-guild.s3.fr-par.scw.cloud/12/9a457a18-2b88-45f0-81f6-7cdcafbd5ab5.jpg', 12, 1611536890182);
INSERT INTO public.posts (type, id, content, media, user_id, created_at) VALUES ('video', 34, 'timelapse...', 'http://social-guild.s3.fr-par.scw.cloud/12/c2998f6a-f801-4f00-9eb9-02832106646d.mp4', 12, 1611537025700);


--
-- TOC entry 3058 (class 0 OID 16397)
-- Dependencies: 201
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users (last_name, id, first_name, email, image, password, created_at) VALUES ('Harte', 12, 'Kieran', 'kieranharte177@gmail.com', 'https://social-guild.s3.fr-par.scw.cloud/12/6dd49167-91a3-439e-bacc-7612cd1c1675.jfif', '$2b$12$VYX/yJJbwV3nsVhqVSTFB.IbAUOtZVDJaQiLBMwf9oH8./pjmxqzy', 1611354767646);
INSERT INTO public.users (last_name, id, first_name, email, image, password, created_at) VALUES ('Harte', 15, 'Kieran', 'kieran@kieran.io', NULL, '$2b$12$BNNOXbw30EiUtnM/bX6.tOKmmP1Y/35sWQEBYAJw8D2ry69GHU/pm', 1611566385094);


--
-- TOC entry 3098 (class 0 OID 0)
-- Dependencies: 202
-- Name: Posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Posts_id_seq"', 37, true);


--
-- TOC entry 3099 (class 0 OID 0)
-- Dependencies: 203
-- Name: Posts_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Posts_user_id_seq"', 1, false);


--
-- TOC entry 3100 (class 0 OID 0)
-- Dependencies: 200
-- Name: Users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Users_id_seq"', 15, true);


--
-- TOC entry 3101 (class 0 OID 0)
-- Dependencies: 213
-- Name: comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.comments_id_seq', 28, true);


--
-- TOC entry 3102 (class 0 OID 0)
-- Dependencies: 215
-- Name: comments_post_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.comments_post_id_seq', 1, false);


--
-- TOC entry 3103 (class 0 OID 0)
-- Dependencies: 214
-- Name: comments_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.comments_user_id_seq', 1, false);


--
-- TOC entry 3104 (class 0 OID 0)
-- Dependencies: 205
-- Name: follow_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.follow_requests_id_seq', 68, true);


--
-- TOC entry 3105 (class 0 OID 0)
-- Dependencies: 206
-- Name: follow_requests_requested_by_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.follow_requests_requested_by_seq', 1, false);


--
-- TOC entry 3106 (class 0 OID 0)
-- Dependencies: 207
-- Name: follow_requests_target_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.follow_requests_target_seq', 1, false);


--
-- TOC entry 3107 (class 0 OID 0)
-- Dependencies: 209
-- Name: following_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.following_id_seq', 12, true);


--
-- TOC entry 3108 (class 0 OID 0)
-- Dependencies: 211
-- Name: following_target_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.following_target_seq', 1, false);


--
-- TOC entry 3109 (class 0 OID 0)
-- Dependencies: 210
-- Name: following_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.following_user_id_seq', 1, false);


--
-- TOC entry 3110 (class 0 OID 0)
-- Dependencies: 217
-- Name: likes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.likes_id_seq', 81, true);


--
-- TOC entry 3111 (class 0 OID 0)
-- Dependencies: 219
-- Name: likes_post_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.likes_post_id_seq', 1, false);


--
-- TOC entry 3112 (class 0 OID 0)
-- Dependencies: 218
-- Name: likes_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.likes_user_id_seq', 1, false);


--
-- TOC entry 2918 (class 2606 OID 16419)
-- Name: posts Posts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT "Posts_pkey" PRIMARY KEY (id);


--
-- TOC entry 2916 (class 2606 OID 16405)
-- Name: users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);


--
-- TOC entry 2924 (class 2606 OID 24617)
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- TOC entry 2920 (class 2606 OID 24589)
-- Name: follow_requests follow_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.follow_requests
    ADD CONSTRAINT follow_requests_pkey PRIMARY KEY (id);


--
-- TOC entry 2922 (class 2606 OID 24603)
-- Name: following following_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.following
    ADD CONSTRAINT following_pkey PRIMARY KEY (id);


--
-- TOC entry 2926 (class 2606 OID 24631)
-- Name: likes likes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_pkey PRIMARY KEY (id);


-- Completed on 2021-01-25 19:26:46

--
-- PostgreSQL database dump complete
--


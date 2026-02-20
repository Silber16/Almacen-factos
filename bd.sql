--
-- PostgreSQL database dump
--

\restrict asxm6stDNsjIhKl5Nexw39wHiAPJ0VvRZzRdxwBeUawkPbeMKgCdqd6XRTOPdvy

-- Dumped from database version 18.1 (Debian 18.1-1.pgdg12+2)
-- Dumped by pg_dump version 18.0

-- Started on 2026-02-19 00:46:44

SET statement_timeout = 0;
SET lock_timeout = 0;
-- SET idle_in_transaction_session_timeout = 0;
-- SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: almacenfactssql_xa93_user
--

-- *not* creating schema, since initdb creates it


-- ALTER SCHEMA public OWNER TO almacenfactssql_xa93_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 227 (class 1259 OID 16432)
-- Name: facts; Type: TABLE; Schema: public; Owner: almacenfactssql_xa93_user
--

CREATE TABLE public.facts (
    id integer NOT NULL,
    title character varying(120),
    content character varying(500),
    font character varying(250),
    ia_response character varying(500),
    ia_responseverdict character varying(120),
    created_by integer,
    category integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


-- ALTER TABLE public.facts OWNER TO almacenfactssql_xa93_user;

--
-- TOC entry 221 (class 1259 OID 16398)
-- Name: facts_id_seq; Type: SEQUENCE; Schema: public; Owner: almacenfactssql_xa93_user
--

CREATE SEQUENCE public.facts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


-- ALTER SEQUENCE public.facts_id_seq OWNER TO almacenfactssql_xa93_user;

--
-- TOC entry 3477 (class 0 OID 0)
-- Dependencies: 221
-- Name: facts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: almacenfactssql_xa93_user
--

ALTER SEQUENCE public.facts_id_seq OWNED BY public.facts.id;


--
-- TOC entry 231 (class 1259 OID 16501)
-- Name: facts_repository; Type: TABLE; Schema: public; Owner: almacenfactssql_xa93_user
--

CREATE TABLE public.facts_repository (
    factid integer NOT NULL,
    userid integer NOT NULL
);


-- ALTER TABLE public.facts_repository OWNER TO almacenfactssql_xa93_user;

--
-- TOC entry 232 (class 1259 OID 16518)
-- Name: quiz_attempts; Type: TABLE; Schema: public; Owner: almacenfactssql_xa93_user
--

CREATE TABLE public.quiz_attempts (
    id integer NOT NULL,
    user_id integer NOT NULL,
    question_id integer,
    is_correct boolean,
    points_awarded integer DEFAULT 0,
    played_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    score integer DEFAULT 0,
    game_mode character varying(20) DEFAULT 'survival'::character varying,
    user_answer character varying(255)
);


-- ALTER TABLE public.quiz_attempts OWNER TO almacenfactssql_xa93_user;

--
-- TOC entry 224 (class 1259 OID 16401)
-- Name: quiz_attempts_id_seq; Type: SEQUENCE; Schema: public; Owner: almacenfactssql_xa93_user
--

CREATE SEQUENCE public.quiz_attempts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


-- ALTER SEQUENCE public.quiz_attempts_id_seq OWNER TO almacenfactssql_xa93_user;

--
-- TOC entry 3478 (class 0 OID 0)
-- Dependencies: 224
-- Name: quiz_attempts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: almacenfactssql_xa93_user
--

ALTER SEQUENCE public.quiz_attempts_id_seq OWNED BY public.quiz_attempts.id;


--
-- TOC entry 230 (class 1259 OID 16483)
-- Name: quiz_questions; Type: TABLE; Schema: public; Owner: almacenfactssql_xa93_user
--

CREATE TABLE public.quiz_questions (
    id integer NOT NULL,
    fact_id integer,
    question_text character varying(600) NOT NULL,
    correct_answer boolean NOT NULL,
    explanation character varying(600),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    difficulty character varying(20) DEFAULT 'medium'::character varying
);


-- ALTER TABLE public.quiz_questions OWNER TO almacenfactssql_xa93_user;

--
-- TOC entry 223 (class 1259 OID 16400)
-- Name: quiz_questions_id_seq; Type: SEQUENCE; Schema: public; Owner: almacenfactssql_xa93_user
--

CREATE SEQUENCE public.quiz_questions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


-- ALTER SEQUENCE public.quiz_questions_id_seq OWNER TO almacenfactssql_xa93_user;

--
-- TOC entry 3479 (class 0 OID 0)
-- Dependencies: 223
-- Name: quiz_questions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: almacenfactssql_xa93_user
--

ALTER SEQUENCE public.quiz_questions_id_seq OWNED BY public.quiz_questions.id;


--
-- TOC entry 229 (class 1259 OID 16466)
-- Name: saved_facts; Type: TABLE; Schema: public; Owner: almacenfactssql_xa93_user
--

CREATE TABLE public.saved_facts (
    user_id integer NOT NULL,
    fact_id integer NOT NULL
);


-- ALTER TABLE public.saved_facts OWNER TO almacenfactssql_xa93_user;

--
-- TOC entry 226 (class 1259 OID 16422)
-- Name: trophies; Type: TABLE; Schema: public; Owner: almacenfactssql_xa93_user
--

CREATE TABLE public.trophies (
    id integer NOT NULL,
    title character varying(25),
    points integer DEFAULT 0,
    iconurl character varying(250),
    description text
);


-- ALTER TABLE public.trophies OWNER TO almacenfactssql_xa93_user;

--
-- TOC entry 220 (class 1259 OID 16397)
-- Name: trophies_id_seq; Type: SEQUENCE; Schema: public; Owner: almacenfactssql_xa93_user
--

CREATE SEQUENCE public.trophies_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


-- ALTER SEQUENCE public.trophies_id_seq OWNER TO almacenfactssql_xa93_user;

--
-- TOC entry 3480 (class 0 OID 0)
-- Dependencies: 220
-- Name: trophies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: almacenfactssql_xa93_user
--

ALTER SEQUENCE public.trophies_id_seq OWNED BY public.trophies.id;


--
-- TOC entry 228 (class 1259 OID 16448)
-- Name: user_trophies; Type: TABLE; Schema: public; Owner: almacenfactssql_xa93_user
--

CREATE TABLE public.user_trophies (
    id integer NOT NULL,
    user_id integer,
    trophy_id integer,
    achieved_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


-- ALTER TABLE public.user_trophies OWNER TO almacenfactssql_xa93_user;

--
-- TOC entry 222 (class 1259 OID 16399)
-- Name: user_trophies_id_seq; Type: SEQUENCE; Schema: public; Owner: almacenfactssql_xa93_user
--

CREATE SEQUENCE public.user_trophies_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


-- ALTER SEQUENCE public.user_trophies_id_seq OWNER TO almacenfactssql_xa93_user;

--
-- TOC entry 3481 (class 0 OID 0)
-- Dependencies: 222
-- Name: user_trophies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: almacenfactssql_xa93_user
--

ALTER SEQUENCE public.user_trophies_id_seq OWNED BY public.user_trophies.id;


--
-- TOC entry 225 (class 1259 OID 16402)
-- Name: users; Type: TABLE; Schema: public; Owner: almacenfactssql_xa93_user
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    score integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    name character varying(50),
    bio character varying(180),
    profile_picture character varying(300) DEFAULT './frontend/default-user.png'::character varying,
    max_survival_record integer DEFAULT 0
);


-- ALTER TABLE public.users OWNER TO almacenfactssql_xa93_user;

--
-- TOC entry 219 (class 1259 OID 16396)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: almacenfactssql_xa93_user
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


-- ALTER SEQUENCE public.users_id_seq OWNER TO almacenfactssql_xa93_user;

--
-- TOC entry 3482 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: almacenfactssql_xa93_user
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 3269 (class 2604 OID 16435)
-- Name: facts id; Type: DEFAULT; Schema: public; Owner: almacenfactssql_xa93_user
--

ALTER TABLE ONLY public.facts ALTER COLUMN id SET DEFAULT nextval('public.facts_id_seq'::regclass);


--
-- TOC entry 3276 (class 2604 OID 16521)
-- Name: quiz_attempts id; Type: DEFAULT; Schema: public; Owner: almacenfactssql_xa93_user
--

ALTER TABLE ONLY public.quiz_attempts ALTER COLUMN id SET DEFAULT nextval('public.quiz_attempts_id_seq'::regclass);


--
-- TOC entry 3273 (class 2604 OID 16486)
-- Name: quiz_questions id; Type: DEFAULT; Schema: public; Owner: almacenfactssql_xa93_user
--

ALTER TABLE ONLY public.quiz_questions ALTER COLUMN id SET DEFAULT nextval('public.quiz_questions_id_seq'::regclass);


--
-- TOC entry 3267 (class 2604 OID 16425)
-- Name: trophies id; Type: DEFAULT; Schema: public; Owner: almacenfactssql_xa93_user
--

ALTER TABLE ONLY public.trophies ALTER COLUMN id SET DEFAULT nextval('public.trophies_id_seq'::regclass);


--
-- TOC entry 3271 (class 2604 OID 16451)
-- Name: user_trophies id; Type: DEFAULT; Schema: public; Owner: almacenfactssql_xa93_user
--

ALTER TABLE ONLY public.user_trophies ALTER COLUMN id SET DEFAULT nextval('public.user_trophies_id_seq'::regclass);


--
-- TOC entry 3262 (class 2604 OID 16405)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: almacenfactssql_xa93_user
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 3466 (class 0 OID 16432)
-- Dependencies: 227
-- Data for Name: facts; Type: TABLE DATA; Schema: public; Owner: almacenfactssql_xa93_user
--

COPY public.facts (id, title, content, font, ia_response, ia_responseverdict, created_by, category, created_at) FROM stdin;
1	Tiburones existieron antes que los árboles	Los tiburones son uno de los vertebrados más antiguos de la Tierra, con registros fósiles que indican que evolucionaron hace más de 400 millones de años, antes de que aparecieran los primeros árboles hace aproximadamente 350–385 millones de años.	https://www.popularmechanics.com/science/animals/a65775651/sharks-are-old/	La información es verdadera. Los tiburones datan de hace más de 400 MA, mientras que los primeros árboles complejos aparecieron hace 350-385 MA, confirmando que los tiburones son geológicamente más antiguos.	V	1	2	2026-02-17 04:26:42.66926
2	Humanos y bananas comparten similitud genética	 Aunque parezca increíble, los seres humanos y las bananas comparten similitudes en ciertos genes debido al origen común de toda la vida en la Tierra. Se estima que alrededor del 60 % de nuestros genes tienen una correspondencia con los de una banana, aunque esto no significa que nuestro ADN sea idéntico.	https://www.iflscience.com/do-we-really-share-60-percent-of-our-dna-with-a-banana-79391	La información es verdadera. La similitud genética del 60% entre humanos y bananas es un dato científico ampliamente aceptado, reflejando el origen evolutivo común de toda la vida. El texto aclara correctamente que no implica ADN idéntico.	V	1	2	2026-02-17 04:27:34.201585
3	El primer “bug” informático fue un insecto real	En 1947, mientras trabajaban con la computadora Harvard Mark II, los ingenieros encontraron que el sistema fallaba por culpa de una polilla real atrapada en uno de los relés.\nLa científica Grace Hopper documentó el incidente pegando el insecto en el cuaderno de registros y escribiendo: “First actual case of bug being found” (“Primer caso real de un bug encontrado”).\nDesde entonces, el término “bug” se popularizó para referirse a errores en sistemas informáticos	https://en.wikipedia.org/wiki/Software_bug#History	La historia del primer 'bug' informático, causado por una polilla real en 1947 en la Harvard Mark II y documentado por Grace Hopper, es un hecho histórico ampliamente verificado y reconocido en la informática.	V	1	3	2026-02-17 04:28:07.847167
4	Un día en Venus dura más que un año terrestre	En el planeta Venus, el tiempo funciona de forma muy extraña: tarda alrededor de 243 días terrestres en rotar completamente sobre su eje (un día venusiano), pero solo 225 días terrestres en completar una órbita alrededor del Sol (un año venusiano). Por eso, un solo día en Venus efectivamente dura más que su año	https://www.sciencenewstoday.org/15-weird-science-facts-that-sound-fake-but-are-true	La información es verdadera. Venus rota sobre su eje en aproximadamente 243 días terrestres, mientras que tarda unos 225 días terrestres en orbitar el Sol. Esto significa que un día venusiano es, efectivamente, más largo que un año venusiano, un hecho astronómico único.	V	1	2	2026-02-17 04:28:50.315646
5	En la Antigua Roma se usaba orina como detergente	 Los romanos utilizaban orina fermentada para lavar ropa porque contiene amoníaco, un potente agente limpiador. Era tan valiosa que el emperador Vespasiano llegó a cobrar impuestos por su recolección en baños públicos.	https://historia.nationalgeographic.com.es/a/lavar-ropa-orina-clave-romanos-para-eliminar-manchas_22057	La información es verdadera. Históricamente, los romanos usaban orina fermentada por su amoníaco como detergente. Vespasiano impuso impuestos a su recolección ('vectigal urinae'), demostrando su valor.	V	1	3	2026-02-17 04:31:41.403276
12	 El origen de la banda roja de River Plate	En 1905, durante un carnaval en Buenos Aires, un grupo de socios de River robó una cinta de seda roja de un carro y la sujetó con alfileres en forma diagonal sobre sus camisetas blancas para diferenciarse. Antes de este evento, el equipo vestía completamente de blanco	https://lapaginamillonaria.com/riverplate/El-nacimiento-de-la-banda-roja-20110525-0008.html	La historia es una de las leyendas fundacionales más conocidas y aceptadas del club, relatada en diversas fuentes históricas y periodísticas sobre el origen de la indumentaria de River Plate, coincidiendo en los detalles clave como el año, el evento y la improvisación.	V	2	4	2026-02-17 15:01:42.189289
15	El origen de los colores de Boca Juniors	Los colores azul y oro de Boca Juniors se eligieron en 1907 basándose en la bandera de un barco sueco que llegaba al puerto de Buenos Aires en ese momento.	https://www.historiadeboca.com.ar/origen-colores-camiseta-de-boca.html	La elección de los colores azul y oro de Boca Juniors en 1907, inspirada en la bandera de un barco sueco que llegaba al puerto de La Boca, es una de las historias fundacionales más conocidas y aceptadas del club, ampliamente respaldada por la tradición y diversas fuentes históricas.	V	2	4	2026-02-17 15:12:20.13244
17	El desierto más seco del mundo está en la Antártida	Aunque asociamos desierto con calor, los "Valles Secos" de la Antártida no han visto lluvia en casi 2 millones de años. Es el lugar de la Tierra con las condiciones más parecidas a Marte.	https://www.nationalgeographic.com.es/medio-ambiente/desierto-mas-grande-planeta-es-mundo-hielo_19441	La Antártida, específicamente los Valles Secos, es reconocida científicamente como el lugar más árido de la Tierra, con precipitaciones virtualmente nulas en millones de años y condiciones análogas a Marte, lo cual es ampliamente aceptado por la comunidad científica.	V	2	1	2026-02-17 15:15:10.815497
19	 El primer partido de fútbol televisado	El primer partido de fútbol transmitido en vivo por televisión fue un amistoso entre el Arsenal y su equipo de reserva en el estadio Highbury, Londres, el 16 de septiembre de 1937. La transmisión fue realizada por la BBC utilizando un sistema experimental.	https://www.kodromagazine.com/primer-partido-televisado-historia/	La información es consistentemente verificable en múltiples fuentes históricas. El partido entre el Arsenal y su reserva, la fecha (16/09/1937) y la BBC son datos correctos sobre el primer partido televisado en vivo.	V	2	4	2026-02-17 15:21:16.080736
20	El primer "Easter Egg" de la historia de los videojuegos	En 1979, el programador Warren Robinett ocultó su nombre en una habitación secreta del juego Adventure para la consola Atari 2600. Lo hizo porque en esa época Atari no incluía los nombres de los desarrolladores en los créditos de los juegos	https://www.xataka.com/videojuegos/historia-primer-easter-egg-videojuego-adventure-atari-desarrollador-que-queria-ser-reconocido	La información es verídica. Warren Robinett ocultó su nombre en el juego Adventure (Atari 2600, 1979) como el primer "Easter Egg" reconocido en la historia de los videojuegos, debido a la política de Atari de no acreditar a sus desarrolladores. Este hecho está ampliamente documentado.	V	2	3	2026-02-17 15:22:20.425724
23	Las huellas dactilares de los koalas son casi humanas	 Los koalas tienen crestas de fricción en sus dedos que forman patrones de remolinos y lazos prácticamente idénticos a las huellas dactilares humanas. Incluso bajo un microscopio electrónico, es muy difícil distinguirlas de las nuestras.	https://www.infobae.com/espana/2024/12/12/cual-es-el-animal-cuyas-huellas-dactilares-podrian-confundirse-con-las-de-un-humano/	Es un hecho científico ampliamente documentado que los koalas poseen huellas dactilares con patrones de crestas y surcos prácticamente indistinguibles de las humanas, incluso a nivel microscópico, siendo un caso fascinante de evolución convergente.	V	2	2	2026-02-17 16:08:29.05467
22	El ejército que regresó con un amigo de más	En 1866, durante la Guerra Austro-Prusiana, el ejército de Liechtenstein envió a 80 hombres a custodiar un paso de montaña. Al finalizar el conflicto, regresaron 81 hombres: no sufrieron bajas y trajeron consigo a un oficial de enlace italiano que se había hecho amigo de ellos.	https://www.vaterland.li/liechtenstein/gesellschaft/vermischtes/als-die-armee-mit-81-mann-zurueckkehrte-art-314707	La historia del ejército de Liechtenstein regresando con un soldado más de la Guerra Austro-Prusiana en 1866 es una anécdota histórica muy conocida y ampliamente citada en diversas fuentes como un hecho real que resalta la neutralidad y particularidad del país.	V	2	3	2026-02-17 15:23:49.412152
24	El agua tiene un cuarto estado	En condiciones extremas, además de sólido, líquido y gaseoso, el agua puede convertirse en "hielo superiónico". En este estado, que ocurre a presiones y temperaturas altísimas como las de los núcleos de Urano y Neptuno, el agua es simultáneamente sólida y líquida.	https://www.xataka.com/investigacion/el-hielo-superionico-liquido-y-solido-a-la-vez-puede-existir-pero-a-5-000oc-y-una-presion-extremadamente-alta	La existencia del hielo superiónico como un cuarto estado del agua bajo condiciones extremas de presión y temperatura, como las de los núcleos de Urano y Neptuno, es un concepto científicamente reconocido y estudiado en astrofísica y física de materiales.	V	2	2	2026-02-17 16:11:07.368373
29	El Everest crece un poco cada año	El monte Monte Everest aumenta su altura aproximadamente 4 milímetros por año. Esto ocurre debido al movimiento continuo de las placas tectónicas: la placa india sigue empujando contra la placa euroasiática, elevando gradualmente la cordillera del Himalaya.	https://www.nationalgeographic.com.es/ciencia/everest-sigue-creciendo-y-hace-mas-previsto_23346	La información es verdadera. El crecimiento anual del Everest es un hecho científico bien documentado, causado por la colisión continua de las placas tectónicas india y euroasiática que eleva la cordillera del Himalaya. La cifra de 4mm/año está dentro de los rangos aceptados.	V	2	2	2026-02-17 16:30:53.999715
33	Un rayo es cinco veces más caliente que la superficie del Sol	Mientras que la superficie del Sol está a unos 5,500 grados celsius, la descarga de un rayo puede calentar el aire a su alrededor hasta los 30,000 grados celsius en una fracción de segundo.	https://www.forbes.com/sites/scotttravers/2024/12/08/sharks-are-50-million-years-older-than-trees-a-biologist-explains/	Los datos de temperatura para la superficie del Sol (aprox. 5,500°C) y la descarga de un rayo (hasta 30,000°C) son científicamente precisos. La proporción de 30,000/5,500 es aproximadamente 5.45, lo que justifica la afirmación de 'cinco veces más caliente'.	V	2	2	2026-02-17 16:46:45.241164
34	El color que "pertenece" a un solo artista	 En 2016, el artista Anish Kapoor compró los derechos exclusivos del Vantablack, el pigmento más oscuro del mundo (absorbe el 99.96% de la luz). Esto significa que es la única persona en el mundo autorizada para usarlo con fines artísticos, lo que generó una famosa disputa en la comunidad del arte	https://www.ultimahora.com/ventablack-el-material-mas-oscuro-despues-un-agujero-negro-n812242	La información es verdadera. Anish Kapoor adquirió en 2016 los derechos exclusivos de Surrey Nanosystems para el uso artístico del Vantablack, el pigmento más oscuro conocido, absorbiendo el 99.96% de la luz. Este hecho generó una famosa y prolongada disputa en la comunidad artística global.	V	2	5	2026-02-17 16:48:01.698166
35	Tu cerebro genera electricidad suficiente para encender un foco	Un cerebro humano despierto genera entre 12 y 25 vatios de electricidad, lo suficiente para alimentar una bombilla LED de bajo consumo.	https://www.nationalgeographic.com.es/ciencia/todo-que-podrias-encender-electricidad-generada-por-tu-cerebro_24285	La información es generalmente verdadera. El cerebro humano en estado de vigilia consume aproximadamente 20 vatios de energía, lo que entra en el rango de 12 a 25 vatios. Esta cantidad es equiparable a la potencia requerida por una bombilla LED de bajo consumo.	V	2	2	2026-02-17 16:48:46.148035
36	La estatua de la Libertad fue un "regalo" con condiciones	Francia regaló la estatua a EE.UU., pero el pedestal tuvo que ser financiado por los propios estadounidenses. Casi no se construye hasta que Joseph Pulitzer inició una campaña de donaciones masivas.	https://www.infobae.com/america/fotos/2016/10/28/la-estatua-de-la-libertad-cumple-130-anos/	La información es verdadera. Históricamente, Francia regaló la Estatua de la Libertad a EE.UU., pero el pedestal debió ser financiado por los estadounidenses. Joseph Pulitzer lanzó una campaña de donaciones masivas, clave para su construcción.	V	2	3	2026-02-17 16:49:18.619073
38	Hay más lagos en Canadá que en el resto del mundo junto	Canadá posee aproximadamente el 60% de los lagos de todo el planeta. Se estima que hay más de 2 millones de lagos dentro de sus fronteras.	https://www.infobae.com/espana/viajes/2024/10/09/tiene-mas-de-2-millones-este-es-el-pais-en-el-que-hay-mas-lagos-que-en-el-resto-del-mundo/	Canadá es ampliamente reconocido por tener la mayor cantidad de lagos del mundo, superando los 2 millones y concentrando aproximadamente el 60% del total global. La afirmación concuerda con datos geográficos y estadísticas aceptadas internacionalmente.	V	2	1	2026-02-17 16:51:20.168364
39	Existe un animal inmortal	Se trata de la Turritopsis dohrnii. A diferencia de la mayoría de los seres vivos que nacen, crecen y mueren, esta pequeña criatura tiene un "botón de reinicio". Cuando se siente amenazada, enferma o simplemente llega a la vejez, activa un proceso celular llamado transdiferenciación, donde sus células adultas se transforman de nuevo en células jóvenes, permitiéndole regresar a su estado de pólipo (su etapa infantil) y volver a empezar su ciclo de vida desde cero.	https://www.nationalgeographic.com.es/ciencia/descubren-secreto-medusa-inmortal-para-frenar-envejecimiento_18763	La información es verdadera. La medusa Turritopsis dohrnii es conocida científicamente como un ser biológicamente inmortal. Es capaz de revertir su proceso de envejecimiento mediante transdiferenciación celular, transformando sus células adultas en jóvenes y volviendo a su etapa de pólipo para reiniciar su ciclo de vida.	V	2	2	2026-02-17 16:54:11.280481
40	Una universidad más antigua que el imperio Azteca	Aunque solemos pensar en los Aztecas como una civilización de la "antigüedad", su imperio (la Triple Alianza) se fundó en 1325 con la creación de Tenochtitlán. Para ese entonces, la Universidad de Oxford ya llevaba funcionando al menos desde 1096. Es decir, Oxford ya tenía más de 200 años de clases cuando los aztecas apenas se estaban asentando.	https://www.smithsonianmag.com/smart-news/university-oxford-older-than-aztec-empire-other-facts-will-change-your-perspective-history-1529607/	La información es verdadera. La Universidad de Oxford inició sus actividades alrededor de 1096, mientras que el Imperio Azteca (Triple Alianza) se fundó en 1325. Esto significa que Oxford ya existía más de dos siglos antes del asentamiento azteca, tal como se afirma.	V	2	3	2026-02-17 16:56:52.107928
41	Las abejas son expertas en optimización matemática	¿Por qué hexágonos y no círculos o cuadrados? En 1999, se demostró formalmente la Conjetura del Panal: el hexágono regular es la forma geométrica que permite teselar (cubrir) un plano usando el menor perímetro posible. Para las abejas, esto significa usar la mínima cantidad de cera —que es muy costosa de producir energéticamente— para almacenar la mayor cantidad de miel posible. Básicamente, resolvieron un problema de cálculo de optimización millones de años antes que nosotros.	https://es.wikipedia.org/wiki/Conjetura_del_panal_de_abeja	La información es verdadera. La Conjetura del Panal fue formalmente demostrada por Thomas C. Hales en 1999, confirmando que el hexágono regular es la forma más eficiente para teselar un plano, minimizando el perímetro y, por ende, el material (cera) para las abejas.	V	2	2	2026-02-17 16:59:01.674124
42	Los humanos solo utilizamos el 10% de nuestro cerebro	Se dice que la gran mayoría de nuestras neuronas están en un estado "latente" o de reserva. Esta teoría sugiere que tenemos un potencial oculto inmenso y que, si lográramos "desbloquear" el 90% restante, podríamos desarrollar capacidades sobrehumanas, memoria fotográfica perfecta o incluso facultades extrasensoriales. Muchos psicólogos de principios de siglo, sugieren que solo aprovechamos una pequeña fracción de nuestros recursos mentales.	https://www.educationalneuroscience.org.uk/resources/neuromyth-or-neurofact/we-only-use-10-of-our-brains/	La afirmación de que los humanos usamos solo el 10% del cerebro es un mito muy difundido. Estudios de neuroimagen y casos de daño cerebral demuestran que utilizamos casi todas las áreas de nuestro cerebro para diversas funciones, aunque no simultáneamente. No existe un 90% "latente" o inactivo.	F	2	2	2026-02-17 17:02:54.131173
44	La Luna huele a pólvora quemada	Aunque en el vacío del espacio no hay aire para transportar olores, los astronautas de las misiones Apolo descubrieron algo curioso al regresar a sus módulos: la Luna tiene un aroma propio. Según relataron Buzz Aldrin y otros compañeros, el polvo lunar que quedaba adherido a sus trajes después de las caminatas espaciales desprendía un olor metálico y acre, muy parecido al de la pólvora quemada.	https://www.bbc.com/mundo/noticias-48883049	Múltiples astronautas de las misiones Apolo, como Buzz Aldrin, documentaron el olor distintivo del polvo lunar, describiéndolo consistentemente como metálico y acre, parecido a la pólvora quemada, al regresar a la nave.	V	2	2	2026-02-18 02:30:10.394538
45	El encendedor es más antiguo que los fósforos	El primer encendedor mecánico fue inventado en 1823 por el químico alemán Johann Wolfgang Döbereiner. Se conocía como la "lámpara de Döbereiner" y generaba fuego mediante una reacción química de hidrógeno y platino.\nPor el contrario, los fósforos de fricción (los que se encienden al rasparlos) no fueron inventados hasta 1826 por John Walker.	https://www.cope.es/actualidad/sociedad/noticias/que-invento-primero-cerilla-mechero-20211102_1593536	La información es precisa; Johann Wolfgang Döbereiner inventó el encendedor químico en 1823, conocido como la "lámpara de Döbereiner", tres años antes de que John Walker creara los fósforos de fricción en 1826, confirmando la primacía del encendedor.	V	2	3	2026-02-18 02:37:19.76995
46	El cuerpo humano brilla en la oscuridad	El cuerpo humano emite una luz muy débil llamada bioluminiscencia humana, causada por reacciones químicas en las células donde compuestos producen fotones. No podemos verla porque es extremadamente tenue y nuestros ojos no son lo suficientemente sensibles, pero cámaras especiales sí pueden detectarla.	https://www.nationalgeographic.com.es/ciencia/tu-cuerpo-brilla-oscuridad-solo-que-no-puedes-verlo_25307	El cuerpo humano emite luz extremadamente débil (bioluminiscencia) por reacciones químicas en las células. Este fenómeno es científicamente reconocido, aunque no es visible al ojo, sí lo es con cámaras especiales de alta sensibilidad.	V	1	2	2026-02-18 03:01:58.992826
47	En Argentina hay solo un obelisco	En Argentina solo hay un obelisco y se encuentra en la Ciudad Autonoma de Buenos Aires	wikipedia	La afirmación es falsa. Aunque el Obelisco de Buenos Aires es el más icónico y reconocido, Argentina cuenta con varios obeliscos distribuidos en diferentes ciudades y provincias del país (por ejemplo, el de San Justo o el de los Constituyentes en La Plata), no siendo el único.	F	1	7	2026-02-18 03:09:48.314517
48	Napoleón no era bajo	Existe el mito de que Napoleón Bonaparte era muy bajo, pero en realidad medía alrededor de 1,69 m, una estatura promedio para su época. La confusión surgió por diferencias entre las unidades de medida francesas e inglesas, y por la propaganda británica que lo caricaturizaba como pequeño.	https://historia.nationalgeographic.com.es/a/emperador-no-era-tan-bajo-mito-estatura-napoleon_18906	La afirmación de que Napoleón medía 1,69 m y que esta era una estatura promedio para su época es correcta y un hecho histórico ampliamente aceptado. La confusión sobre su altura se atribuye efectivamente a diferencias en unidades de medida y a la propaganda británica.	V	3	3	2026-02-18 03:16:32.889507
49	 El dinero no siempre estuvo hecho de metal o papel	A lo largo de la historia se usaron objetos muy variados como dinero: sal, conchas, piedras gigantes (Rai) y hasta ganado. Estos sistemas funcionaban porque la sociedad les atribuía valor, demostrando que el dinero es principalmente un acuerdo social, no solo un objeto físico.	https://www.investopedia.com/articles/07/roots_of_money.asp	La información es históricamente precisa. La sal, conchas, ganado y las piedras Rai son ejemplos documentados de dinero primitivo o mercancía. La idea del dinero como 'acuerdo social' es una perspectiva económica y antropológica ampliamente aceptada.	V	3	7	2026-02-18 03:19:16.538064
50	Los árboles pueden comunicarse entre sí	Los árboles no son organismos aislados: pueden intercambiar nutrientes y señales de alerta a través de una red subterránea de hongos llamada red micorrícica o “wood wide web”. Gracias a ella, un árbol puede advertir a otros sobre plagas o compartir recursos con árboles jóvenes o enfermos.	https://www.nationalgeographic.com.es/ciencia/arboles-escuchan-y-hablan-entre-ellos_21481	La información es científicamente precisa. El concepto de la 'wood wide web' o red micorrícica, que permite a los árboles intercambiar nutrientes y señales de alerta, es un hallazgo ampliamente aceptado y respaldado por décadas de investigación en ecología forestal, siendo un pilar en la comprensión de la inteligencia vegetal.	V	3	2	2026-02-18 03:20:36.199229
51	La inflación también depende de expectativas	La inflación no solo responde a costos o a la cantidad de dinero: las expectativas de las personas importan. Si empresas y consumidores creen que los precios subirán, tienden a adelantar compras y a subir salarios y precios hoy, lo que termina provocando inflación real. Por eso los bancos centrales cuidan tanto su credibilidad y comunicación.	https://eleconomista.com.ar/economia/la-inflacion-rol-expectativas-n12296	El texto expone un concepto económico fundamental y ampliamente aceptado: las expectativas inflacionarias son cruciales para la formación de precios. La interacción entre las creencias de consumidores y empresas y la inflación real, así como el rol de los bancos centrales, es un pilar de la política monetaria moderna.	V	3	7	2026-02-18 03:22:46.991877
52	Volcanes frios	No todos los volcanes expulsan lava incandescente. Algunos liberan barro, agua, gas o incluso hielo. Un ejemplo son los volcanes de lodo, que expulsan sedimentos fríos desde el subsuelo, o los criovolcanes, presentes en lunas como Encélado, que expulsan agua y hielo en lugar de magma.	https://www.nationalgeographic.com.es/ciencia/volcanes-que-son-como-se-forman_18140	La información es verdadera. Los volcanes no solo expulsan lava incandescente; existen volcanes de lodo que liberan sedimentos fríos y criovolcanes, como los observados en lunas como Encélado, que expulsan agua y hielo en lugar de magma, lo cual está respaldado por la ciencia.	V	3	1	2026-02-18 03:26:59.569962
53	Argentina consume millones de alfajores por día	El alfajor es uno de los dulces más típicos de Argentina, y no es exagerado decir que se consumen alrededor de 6 millones de alfajores por día en el país. Estas golosinas, normalmente rellenas de dulce de leche y cubiertas de chocolate o azúcar, son parte esencial de meriendas, viajes y encuentros sociales.	https://en.wikipedia.org/wiki/Alfajor	La cifra de 6 millones de alfajores diarios es ampliamente citada y reconocida en medios y por la industria en Argentina, reflejando su profunda integración cultural y popularidad. El texto la presenta como un hecho no exagerado, lo cual es consistente con la realidad percibida.	V	3	7	2026-02-18 03:28:29.029233
54	Pato,deporte nacional	Aunque el fútbol es el deporte más popular, el deporte nacional oficial es el pato, un juego ecuestre que combina elementos de polo y baloncesto. Originalmente se jugaba con una pato vivo dentro de una bolsa, y con el tiempo se reguló para convertirse en una disciplina formal con reglas oficiales.	https://es.wikipedia.org/wiki/Pato_(deporte)	El Pato es, en efecto, el deporte nacional de Argentina. Es un juego ecuestre que combina polo y baloncesto, y su origen histórico con el uso de un pato vivo, así como su evolución a una disciplina regulada, son hechos históricamente verídicos.	V	3	4	2026-02-18 03:31:14.068483
55	 La miel no vence	¿Sabías que la miel nunca se echa a perder? Arqueólogos han encontrado vasijas de miel en tumbas egipcias de más de 3 000 años que aún son comestibles. Esto se debe a su bajo contenido de agua, alta acidez y producción natural de peróxido de hidrógeno, lo que crea un ambiente donde prácticamente ninguna bacteria puede sobrevivir.	https://www.verdemiel.es/blog/2024/09/04/la-miel-dura-para-siempre/?srsltid=AfmBOoo9BXx4MS60He86vz1NSwijqYR4cLQlj49k4fiBhwyGyHT1W52f	La información es verdadera. La miel es un alimento único que no se deteriora gracias a su bajo contenido de agua, alta acidez y la presencia de peróxido de hidrógeno, factores que inhiben el crecimiento bacteriano. Los hallazgos arqueológicos de miel comestible milenaria lo confirman.	V	3	7	2026-02-18 03:32:07.424295
56	Los pulpos tienen 3 corazones	 Los pulpos, animales marinos fascinantes, no tienen un solo corazón como los humanos, sino tres corazones: dos de ellos, llamados corazones branquiales, bombean sangre sin oxígeno hacia las branquias para que se oxigene; el tercero, llamado corazón sistémico, recibe la sangre oxigenada y la distribuye por todo el cuerpo. Tener varios corazones ayuda a compensar la menor eficiencia de su sangre para transportar oxígeno.	https://www.livescience.com/how-many-hearts-does-an-octopus-have	El texto es verdadero. Los pulpos, en efecto, poseen tres corazones: dos branquiales que impulsan la sangre sin oxígeno hacia las branquias, y un corazón sistémico que recibe la sangre oxigenada para distribuirla al resto del cuerpo. Esta adaptación es crucial para compensar la menor eficiencia de su sangre para transportar oxígeno.	V	3	1	2026-02-18 03:36:02.682985
57	El aroma de la lluvia tiene nombre	Ese olor tan particular que sentimos cuando empieza a llover sobre tierra seca se llama petricor. Es el resultado de una mezcla de aceites vegetales y un compuesto llamado geosmina producido por bacterias en el suelo.	https://www.nationalgeographic.com.es/ciencia/ciencia-explica-por-que-nos-gusta-tanto-olor-lluvia_20423	La información proporcionada es científicamente precisa y ampliamente aceptada. El 'petricor' es, en efecto, el nombre del olor característico que se produce al llover sobre tierra seca, y su origen se atribuye correctamente a la mezcla de aceites vegetales y geosmina, un compuesto generado por bacterias en el suelo.	V	3	7	2026-02-18 03:37:04.362971
58	Las vacas tienen "mejores amigas"	Estudios demuestran que las vacas son animales sociales que forman vínculos estrechos. Cuando se las separa de su compañera favorita, sus niveles de estrés aumentan considerablemente y su ritmo cardíaco se acelera.	https://www.lavanguardia.com/cribeo/fauna/20191019/471005881402/vacas-necesitan-amigas-felices.html	Es ampliamente aceptado en la etología que las vacas son animales sociales que forman lazos. La respuesta de estrés, incluyendo el aumento del ritmo cardíaco al ser separadas de sus compañeras favoritas, es un hallazgo consistente y bien documentado en estudios científicos sobre el comportamiento bovino.	V	3	2	2026-02-18 03:37:43.842787
59	El tiempo de las pirámides y los mamuts	Cuando se terminó de construir la Gran Pirámide de Giza, todavía quedaban mamuts lanudos vivos en la isla de Wrangel, en el Ártico. No se extinguieron hasta unos mil años después de que las pirámides estuvieran en pie.	https://wroken.com/cuando-se-construyeron-las-piramides-todavia-habia-mamuts-vivos-en-la-tierra/	La información es verdadera. Los últimos mamuts lanudos de la Isla de Wrangel se extinguieron alrededor del 1700 a.C., mientras que la Gran Pirámide de Giza fue completada aproximadamente en el 2560 a.C. Esto confirma un solapamiento de casi 900 años entre ambos eventos.	V	3	3	2026-02-18 03:38:26.281455
60	El país con más husos horarios no es el más grande	Aunque Rusia es el país con mayor superficie, Francia es el país que más husos horarios utiliza (12 en total). Esto se debe a sus numerosos territorios de ultramar repartidos por todo el mundo.	https://www.elmundo.es/como/2023/05/03/6452323421efa0c7408b459f.html	La información es correcta. Rusia es el país con mayor superficie, y Francia, gracias a sus numerosos territorios de ultramar, ostenta el récord de más husos horarios (12 o 13, dependiendo de la cuenta, pero 12 es comúnmente aceptado y citado).	V	3	1	2026-02-18 03:39:24.28405
61	El nombre "Google" fue un error ortográfico	 Los fundadores querían llamar al buscador "Googol", que es el término matemático para un 1 seguido de 100 ceros. Al registrar el dominio, cometieron un error y escribieron "Google".	 https://www.data-label.co.uk/blog/from-googol-to-google-the-story-behind-a-misspelling-that-changed-the-world/	La anécdota de que el nombre 'Google' provino de un error ortográfico al intentar registrar 'Googol' es una historia ampliamente documentada y confirmada por los cofundadores de la empresa y fuentes históricas confiables.	V	3	3	2026-02-18 03:40:29.468194
62	Los flamencos no nacen rosas	 Los flamencos nacen con plumaje gris o blanco. Su característico color rosa proviene de los carotenoides (pigmentos) presentes en los organismos que comen, como algas y crustáceos.	https://www.elmundo.es/como/2023/05/26/647093d6fdddffb71c8b457a.html	Científicamente, es cierto que los flamencos nacen con plumaje gris o blanco y adquieren su color rosa distintivo de los carotenoides en su dieta de algas y crustáceos. Este hecho biológico es ampliamente conocido y verificado.	V	3	2	2026-02-18 03:41:39.693643
63	El monte Everest no es el punto más cercano al espacio	Debido a que la Tierra no es una esfera perfecta sino que está ensanchada en el ecuador, la cima del volcán Chimborazo en Ecuador está más lejos del centro del planeta que el Everest.	https://www.infobae.com/tendencias/2026/02/03/el-punto-mas-cercano-a-las-estrellas-no-es-el-everest-por-que-es-una-montana-de-sudamerica/	La Tierra es un esferoide oblato, ensanchado en el ecuador. El Chimborazo está mucho más cerca del ecuador que el Everest, lo que lo sitúa más lejos del centro del planeta, aunque su altitud sobre el nivel del mar sea menor.	V	3	1	2026-02-18 03:43:14.791252
64	El corazón de las ballenas azules es gigantesco	El corazón de una ballena azul es del tamaño de un auto pequeño (como un Fiat 600) y sus arterias son tan anchas que un ser humano podría nadar a través de ellas.	https://www.bbc.com/mundo/media-40851758	La información es ampliamente aceptada en la divulgación científica. El corazón de una ballena azul es comparable al tamaño de un coche pequeño, y sus arterias principales (especialmente la aorta) son lo suficientemente grandes como para que un humano pueda pasar, o incluso nadar, a través de ellas.	V	3	2	2026-02-18 03:44:05.163164
65	La guerra más corta de la historia duró 38 minutos	Fue la guerra anglo-zanzibariana en 1896. Comenzó a las 9:02 AM y terminó a las 9:40 AM tras la rendición del sultán de Zanzíbar ante el Reino Unido.	https://es.wikipedia.org/wiki/Guerra_anglo-zanzibariana	La Guerra Anglo-Zanzibariana de 1896 es históricamente reconocida como la más corta, con una duración comúnmente citada de 38 a 45 minutos. Los datos sobre los contendientes (Reino Unido y Zanzíbar), el año y el resultado (rendición) son consistentes con los registros históricos.	V	3	3	2026-02-18 03:44:47.723157
66	Leonardo da Vinci podía escribir y dibujar al mismo tiempo	El genio del Renacimiento tenía una capacidad ambidiestra excepcional: podía escribir una frase con la mano derecha mientras dibujaba un boceto con la izquierda simultáneamente.	https://www.biobiochile.cl/noticias/ciencia-y-tecnologia/inventos-y-descubrimientos/2019/04/09/descubren-habilidad-desconocida-de-leonardo-da-vinci-podia-dibujar-y-escribir-con-ambas-manos.shtml	Aunque Leonardo da Vinci era ambidiestro y usaba ambas manos, la capacidad de escribir una frase con una mano y dibujar un boceto con la otra *simultáneamente* no está respaldada por evidencia histórica sólida. Es una exageración común de sus múltiples talentos.	F	3	3	2026-02-18 03:45:35.606692
67	BOCA JUNIORS EL MAS GRANDE DE AMERICA	Históricamente el club atlético Boca Juniors es el equipo con mas copas internacionales en América y no solo con eso que también le gana en el historial de partidos ganados a casi todos los clubes argentinos del país incluido su rival de toda la vida el club atlético River Plate.	https://historiadeboca.com.ar/	La afirmación de que Boca Juniors es el equipo con más copas internacionales en América es falsa, ya que comparte ese récord con Independiente (ambos con 18 títulos). Sin embargo, sí lidera el historial de partidos ganados contra River Plate y la mayoría de los clubes argentinos.	F	3	4	2026-02-18 04:15:52.591997
68	La Torre Eiffel crece en verano	La Torre Eiffel puede aumentar su altura hasta aproximadamente 15 centímetros durante el verano. Esto ocurre por un fenómeno llamado dilatación térmica, en el que el hierro con el que está construida se expande cuando aumenta la temperatura. En invierno, cuando el metal se enfría, la torre vuelve a contraerse y recuperar su tamaño habitual.	https://theconversation.com/the-eiffel-tower-gets-bigger-every-summer-heres-why-261904	La dilatación térmica del hierro, el material principal de la Torre Eiffel, es un fenómeno físico real y documentado. Es cierto que la torre puede aumentar su altura varios centímetros (hasta aproximadamente 15 cm) en verano debido al calor y contraerse en invierno.	V	2	2	2026-02-19 03:13:21.041585
69	El grafeno es uno de los materiales más fuertes conocidos	El grafeno es una lámina de carbono de un solo átomo de grosor dispuesta en forma de panal hexagonal. Es considerado uno de los materiales más resistentes jamás medidos, siendo aproximadamente 200 veces más fuerte que el acero en términos de resistencia a la tracción. Además, es extremadamente ligero y excelente conductor de electricidad y calor.	https://www.conicet.gov.ar/el-grafeno-el-material-del-futuro/	El texto describe con precisión las características clave del grafeno: su estructura atómica, su excepcional resistencia a la tracción (200 veces la del acero), su ligereza y su alta conductividad eléctrica y térmica. Toda la información es científicamente correcta y ampliamente verificada.	V	2	2	2026-02-19 03:14:12.606127
\.


--
-- TOC entry 3470 (class 0 OID 16501)
-- Dependencies: 231
-- Data for Name: facts_repository; Type: TABLE DATA; Schema: public; Owner: almacenfactssql_xa93_user
--

COPY public.facts_repository (factid, userid) FROM stdin;
\.


--
-- TOC entry 3471 (class 0 OID 16518)
-- Dependencies: 232
-- Data for Name: quiz_attempts; Type: TABLE DATA; Schema: public; Owner: almacenfactssql_xa93_user
--

COPY public.quiz_attempts (id, user_id, question_id, is_correct, points_awarded, played_at, score, game_mode, user_answer) FROM stdin;
1	2	\N	\N	0	2026-02-17 17:05:15.880548	3	survival	\N
2	2	\N	\N	0	2026-02-17 17:10:24.699041	21	survival	\N
3	2	\N	\N	0	2026-02-18 02:54:51.368167	3	survival	\N
4	3	\N	\N	0	2026-02-18 04:19:37.21298	0	survival	\N
5	3	\N	\N	0	2026-02-18 04:20:04.724643	2	survival	\N
6	3	\N	\N	0	2026-02-18 04:20:27.966795	3	survival	\N
7	3	\N	\N	0	2026-02-18 04:20:50.207126	3	survival	\N
8	3	\N	\N	0	2026-02-18 04:21:09.337416	1	survival	\N
9	2	\N	\N	0	2026-02-18 15:54:02.718077	1	survival	\N
10	2	\N	\N	0	2026-02-18 15:54:23.375861	2	survival	\N
11	2	\N	\N	0	2026-02-18 15:54:34.753087	1	survival	\N
12	2	\N	\N	0	2026-02-18 15:55:02.711351	4	survival	\N
13	2	\N	\N	0	2026-02-19 03:14:34.551509	2	survival	\N
14	2	\N	\N	0	2026-02-19 03:14:40.680668	0	survival	\N
15	2	\N	\N	0	2026-02-19 03:15:28.896065	0	survival	\N
16	2	\N	\N	0	2026-02-19 03:15:47.622502	0	survival	\N
17	2	\N	\N	0	2026-02-19 03:28:27.064282	0	survival	\N
18	2	\N	\N	0	2026-02-19 03:43:29.698006	1	survival	\N
\.


--
-- TOC entry 3469 (class 0 OID 16483)
-- Dependencies: 230
-- Data for Name: quiz_questions; Type: TABLE DATA; Schema: public; Owner: almacenfactssql_xa93_user
--

COPY public.quiz_questions (id, fact_id, question_text, correct_answer, explanation, created_at, difficulty) FROM stdin;
1	1	Los tiburones ya habitaban los océanos de la Tierra antes de que aparecieran los primeros árboles terrestres.	t	Los tiburones evolucionaron hace más de 400 millones de años, mientras que los primeros árboles aparecieron hace aproximadamente 350-385 millones de años.	2026-02-17 04:26:42.861902	medium
2	2	Los seres humanos y las bananas comparten aproximadamente el 60% de sus genes.	t	Debido a un ancestro común en la evolución de la vida en la Tierra, humanos y bananas comparten una cantidad significativa de genes, cercana al 60%.	2026-02-17 04:27:34.470484	medium
4	4	En Venus, un solo día dura más tiempo que un año.	t	El día venusiano es de aproximadamente 243 días terrestres, mientras que su año es de unos 225 días terrestres, haciendo que el día sea más largo que el año.	2026-02-17 04:28:50.511644	medium
5	5	El emperador Vespasiano implementó un impuesto sobre la recolección de orina en la Antigua Roma.	t	Los romanos valoraban la orina por su amoníaco como detergente. Vespasiano impuso el 'vectigal urinae' sobre su recolección.	2026-02-17 04:31:41.639631	medium
12	12	La banda roja de River Plate se originó en 1905 cuando sus socios pintaron diagonalmente sus camisetas blancas con pintura roja encontrada en un astillero.	f	Según la leyenda más difundida, la banda roja se incorporó al robar una cinta de seda de un carro de carnaval y sujetarla con alfileres a las camisetas blancas, no pintándolas con pintura de un astillero.	2026-02-17 15:01:42.396497	medium
15	15	Los colores azul y oro de Boca Juniors se eligieron en 1905 inspirándose en la bandera de un barco sueco que llegaba al puerto de Buenos Aires.	f	Aunque la inspiración en la bandera sueca es correcta, los colores azul y oro de Boca Juniors fueron adoptados en 1907, no en 1905.	2026-02-17 15:12:20.350268	medium
17	17	Los Valles Secos de la Antártida son el lugar de la Tierra donde no ha llovido en casi 2 millones de años.	t	Los Valles Secos de la Antártida son, de hecho, la región más seca de nuestro planeta. Se estima que no han recibido precipitaciones en forma de lluvia líquida durante casi 2 millones de años, debido a la extrema sequedad y las bajas temperaturas.	2026-02-17 15:15:11.053499	medium
19	19	El primer partido de fútbol transmitido en vivo por televisión fue un amistoso entre el Arsenal y su equipo de reserva en Highbury en 1937.	t	El 16 de septiembre de 1937, el Arsenal y su equipo de reserva protagonizaron el primer partido de fútbol retransmitido en directo por la BBC, desde el estadio Highbury.	2026-02-17 15:21:16.282361	medium
20	20	El primer "Easter Egg" reconocido en la historia de los videojuegos fue creado por Warren Robinett en el juego Adventure para la Atari 2600.	t	Warren Robinett, programador de Atari, ocultó su nombre en una habitación secreta del juego Adventure de 1979, convirtiéndose en el primer "Easter Egg" documentado. Lo hizo para asegurarse el reconocimiento, ya que Atari no acreditaba a los desarrolladores.	2026-02-17 15:22:20.61621	medium
22	23	Las huellas dactilares de los koalas tienen patrones tan parecidos a los humanos que son difíciles de distinguir incluso con un microscopio electrónico.	t	Los koalas tienen crestas de fricción en sus dedos que forman patrones de remolinos y lazos prácticamente idénticos a las huellas dactilares humanas, lo que hace muy difícil distinguirlas.	2026-02-17 16:08:29.261868	medium
23	24	El agua puede transformarse en hielo superiónico, un cuarto estado de la materia, en los núcleos de Júpiter y Saturno, donde coexiste como sólido y líquido.	f	El hielo superiónico, que es un estado exótico del agua, se predice que existe en los núcleos de los planetas gigantes de hielo como Urano y Neptuno, no en los de los gigantes gaseosos Júpiter y Saturno.	2026-02-17 16:11:07.573181	medium
28	29	El Monte Everest aumenta su altura algunos milímetros cada año.	t	El movimiento de la placa tectónica india contra la euroasiática provoca la elevación continua de la cordillera del Himalaya, incluyendo el Everest.	2026-02-17 16:30:54.20121	medium
32	33	Un rayo genera una temperatura máxima de 3,000 grados Celsius, siendo significativamente más frío que la superficie del Sol.	f	Un rayo puede alcanzar temperaturas de hasta 30,000 grados Celsius en una fracción de segundo, lo que lo hace mucho más caliente que la superficie del Sol, que está a unos 5,500 grados Celsius.	2026-02-17 16:46:45.511313	medium
33	34	El artista Anish Kapoor posee los derechos exclusivos para el uso artístico del pigmento Vantablack, el más oscuro del mundo.	t	Es cierto. Anish Kapoor es la única persona autorizada para usar Vantablack con fines artísticos, una adquisición que data de 2016 y que ha sido muy polémica en el mundo del arte.	2026-02-17 16:48:01.902473	medium
34	35	Un cerebro humano despierto genera suficiente electricidad como para encender una bombilla LED de bajo consumo.	t	El cerebro humano activo consume entre 12 y 25 vatios de energía, lo cual es comparable a la potencia necesaria para alimentar una bombilla LED pequeña.	2026-02-17 16:48:46.345056	medium
35	36	La financiación del pedestal de la Estatua de la Libertad fue lograda gracias a una campaña de donaciones masivas organizada principalmente por el expresidente Theodore Roosevelt.	f	Fue el editor de periódicos Joseph Pulitzer quien lanzó y lideró la exitosa campaña de recaudación de fondos para financiar el pedestal de la Estatua de la Libertad.	2026-02-17 16:49:18.795748	medium
37	38	Finlandia es el país que alberga más del 60% de los lagos de todo el planeta, superando los dos millones.	f	Canadá, no Finlandia, es el país con la mayor cantidad de lagos en el mundo, albergando aproximadamente el 60% del total global y superando los 2 millones de cuerpos de agua.	2026-02-17 16:51:20.387215	medium
38	39	Existe una especie de medusa capaz de revertir su envejecimiento y volver a su etapa juvenil para reiniciar su ciclo vital.	t	La Turritopsis dohrnii, una pequeña medusa, puede transformar sus células adultas en jóvenes (transdiferenciación) y regresar a su estado de pólipo, reiniciando su vida y evitando la muerte natural por vejez o enfermedad.	2026-02-17 16:54:11.479956	medium
39	40	El Imperio Azteca ya llevaba más de dos siglos de existencia cuando la Universidad de Oxford comenzó sus primeras enseñanzas.	f	Falso. La Universidad de Oxford inició sus actividades alrededor del año 1096. El Imperio Azteca, por su parte, se fundó en 1325, por lo que Oxford es, de hecho, más de dos siglos anterior a la formación del imperio.	2026-02-17 16:56:52.357493	medium
40	41	El hexágono regular es la forma geométrica más eficiente para cubrir un plano usando el menor perímetro posible.	t	Esta afirmación es verdadera. El hexágono regular ha sido matemáticamente probado como la forma más eficiente para teselar (cubrir sin huecos) un plano, minimizando el perímetro para un área dada, un principio clave para las construcciones de las abejas.	2026-02-17 16:59:01.852175	medium
41	42	Se ha confirmado científicamente que el cerebro humano usa únicamente el 10% de su capacidad total para realizar todas sus funciones vitales.	f	Es un mito. La neurociencia moderna desmiente que solo utilicemos una pequeña porción del cerebro. Las técnicas de imagen cerebral muestran que todas las áreas tienen una función conocida y se activan según la tarea, usando casi el 100% a lo largo del día, no solo el 10%.	2026-02-17 17:02:54.332759	medium
42	22	Durante la Guerra Austro-Prusiana de 1866, el ejército de Liechtenstein envió 80 soldados a una misión y regresó con 81, sin sufrir bajas.	t	El ejército de Liechtenstein, que se mantuvo neutral, regresó con un oficial de enlace italiano que se había hecho amigo de ellos durante la misión de custodiar un paso de montaña.	2026-02-17 18:00:11.822375	medium
44	44	Los astronautas de las misiones Gemini reportaron que el polvo lunar que se adhería a sus trajes al regresar a la nave olía a menta fresca.	f	Los astronautas de las misiones Apolo (no Gemini) fueron quienes pisaron la Luna y describieron el polvo lunar con un olor metálico y acre, similar a la pólvora quemada, no a menta fresca.	2026-02-18 02:30:10.569973	medium
45	45	El primer encendedor mecánico fue inventado antes que los fósforos de fricción.	t	El encendedor mecánico (la lámpara de Döbereiner) fue inventado en 1823 por Johann Wolfgang Döbereiner, mientras que los fósforos de fricción fueron inventados en 1826 por John Walker.	2026-02-18 02:37:19.952639	medium
46	46	El cuerpo humano produce una luz muy tenue que es invisible a simple vista, pero detectable con cámaras especiales.	t	El fenómeno es real, conocido como bio-quimioluminiscencia humana, causado por reacciones químicas celulares que liberan fotones, pero es tan débil que no es perceptible por el ojo humano.	2026-02-18 03:01:59.181266	medium
47	47	El Obelisco de Buenos Aires es el único que existe en todo el territorio argentino.	f	Argentina posee varios obeliscos en distintas ciudades y provincias, no solo el de Buenos Aires. Este último es el más famoso, pero existen otros como el de San Justo o el de los Constituyentes en La Plata.	2026-02-18 03:09:48.50096	medium
48	48	Napoleón Bonaparte medía aproximadamente 1,69 metros, una estatura considerada promedio en su época.	t	La creencia popular de que Napoleón era muy bajo es un mito. Su estatura real de 1,69 m era promedio para el siglo XIX. La confusión surgió por unidades de medida distintas y la propaganda británica.	2026-02-18 03:16:33.130828	medium
49	49	En la historia, algunas sociedades llegaron a utilizar piedras gigantes como forma de dinero.	t	Las piedras Rai, grandes discos de caliza, fueron usadas como moneda en las Islas Yap, en Micronesia, destacando el dinero como un acuerdo social.	2026-02-18 03:19:16.724917	medium
50	50	Los árboles pueden advertir a otros sobre plagas o compartir recursos con árboles jóvenes o enfermos a través de una red subterránea de hongos.	t	Los árboles forman asociaciones simbióticas con hongos para crear redes micorrícicas, a través de las cuales intercambian nutrientes y señales, permitiendo la comunicación y el apoyo mutuo en el ecosistema forestal.	2026-02-18 03:20:36.389989	medium
51	51	Las expectativas de la gente sobre el aumento de precios pueden provocar una inflación real por sí mismas.	t	Si consumidores y empresas creen que los precios subirán, tienden a adelantar compras y subir salarios y precios, lo que termina generando inflación en la economía real.	2026-02-18 03:22:47.226553	medium
52	52	Los criovolcanes son volcanes que expulsan agua y hielo en lugar de magma.	t	Los criovolcanes, presentes en cuerpos celestes como la luna Encélado, expulsan materiales volátiles como agua líquida, amoníaco o metano, que se congelan en el espacio, en lugar de roca fundida (magma).	2026-02-18 03:26:59.747496	medium
53	53	En Argentina, se consumen aproximadamente 6 millones de alfajores cada día.	t	Los alfajores son una golosina icónica y muy popular en Argentina, con un consumo diario estimado que ronda los 6 millones de unidades.	2026-02-18 03:28:29.212674	medium
54	54	El deporte nacional de Argentina, el Pato, recibe su nombre porque originalmente se jugaba con un pato vivo.	t	El Pato, deporte nacional argentino, se llamaba así porque en sus orígenes se usaba un pato vivo como objeto central del juego, dentro de una bolsa, antes de ser regulado.	2026-02-18 03:31:14.319644	medium
55	55	Miel encontrada en vasijas de tumbas egipcias de hace más de 3000 años aún es comestible.	t	La combinación de bajo contenido de agua, alta acidez y la producción natural de peróxido de hidrógeno en la miel crea un ambiente hostil para las bacterias, permitiéndole conservarse por milenios.	2026-02-18 03:32:07.607125	medium
56	56	Los pulpos tienen tres corazones: dos para bombear sangre a sus branquias y uno para distribuirla al resto del cuerpo.	t	Correcto. Los pulpos poseen dos corazones branquiales para oxigenar la sangre y un corazón sistémico para bombear la sangre oxigenada por todo el cuerpo, una adaptación clave de su biología.	2026-02-18 03:36:02.880241	medium
57	57	La geosmina, uno de los principales componentes del olor a lluvia sobre tierra seca, es un compuesto producido por ciertos tipos de hongos.	f	La geosmina es un compuesto orgánico volátil producido principalmente por bacterias del género Streptomyces que habitan en el suelo, no por hongos.	2026-02-18 03:37:04.537894	medium
58	58	Las vacas son animales sociales que pueden formar vínculos estrechos con otras vacas, estresándose si se las separa de su "mejor amiga".	t	Estudios científicos demuestran que las vacas son capaces de formar lazos de amistad, y su separación de compañeras preferidas genera estrés y acelera su ritmo cardíaco.	2026-02-18 03:37:44.056378	medium
59	59	Los últimos mamuts lanudos se extinguieron casi un milenio después de la construcción de la Gran Pirámide de Giza.	t	La Gran Pirámide de Giza fue terminada alrededor del 2560 a.C., mientras que los últimos mamuts lanudos, en la isla de Wrangel, se extinguieron aproximadamente en el 1700 a.C.	2026-02-18 03:38:26.466239	medium
60	60	El país con mayor superficie terrestre es también el que utiliza el mayor número de husos horarios.	f	Aunque Rusia es el país con mayor superficie, Francia es el país que utiliza el mayor número de husos horarios (12 o 13), debido a sus territorios de ultramar.	2026-02-18 03:39:24.510897	medium
61	61	El nombre de la empresa Google fue el resultado de un error ortográfico al intentar registrar un término matemático.	t	Los fundadores de Google, Larry Page y Sergey Brin, querían usar el término matemático 'Googol' (un 1 seguido de 100 ceros) para su buscador. Sin embargo, al registrar el dominio, se escribió por error 'Google', y así se quedó.	2026-02-18 03:40:29.647039	medium
62	62	Los flamencos nacen con su característico plumaje de color rosa.	f	Los flamencos nacen con plumaje gris o blanco y adquieren su color rosa de los pigmentos carotenoides presentes en los alimentos que consumen, como algas y crustáceos.	2026-02-18 03:41:40.326171	medium
63	63	El volcán Chimborazo en Ecuador es el punto de la Tierra más alejado de su centro.	t	Debido al ensanchamiento ecuatorial de la Tierra, el Chimborazo está más cerca del ecuador que el Everest, lo que lo sitúa más lejos del centro del planeta.	2026-02-18 03:43:14.981029	medium
64	64	Las arterias de una ballena azul son tan anchas que un ser humano podría nadar a través de ellas.	t	Es correcto. La aorta de la ballena azul es increíblemente ancha, lo suficiente para que un ser humano adulto quepa dentro y, teóricamente, pueda nadar por ella.	2026-02-18 03:44:05.361908	medium
65	65	La guerra más corta registrada en la historia duró menos de una hora.	t	La Guerra Anglo-Zanzibariana de 1896, entre el Reino Unido y el Sultanato de Zanzíbar, es el conflicto armado más breve documentado, con una duración de tan solo 38 minutos.	2026-02-18 03:44:47.931467	medium
66	66	Leonardo da Vinci podía escribir una frase compleja con una mano y dibujar un boceto detallado con la otra de forma simultánea.	f	Aunque Leonardo da Vinci era ambidiestro y realizaba escritura en espejo con la mano izquierda, no hay evidencia histórica sólida que confirme que pudiera ejecutar dos tareas cognitivamente complejas (escribir una frase y dibujar un boceto) de forma simultánea con diferentes manos.	2026-02-18 03:45:35.781363	medium
67	67	El Club Atlético Boca Juniors tiene un historial favorable de partidos ganados contra su clásico rival, River Plate.	t	En el historial de partidos oficiales entre ambos, Boca Juniors tiene más victorias que River Plate.	2026-02-18 04:15:52.774387	medium
68	68	La Torre Eiffel puede aumentar su altura hasta 15 centímetros en verano debido a la dilatación térmica del metal.	t	El calor del verano provoca que el hierro de la Torre Eiffel se expanda, un fenómeno conocido como dilatación térmica, lo que puede hacer que su altura se incremente hasta en 15 cm.	2026-02-19 03:13:21.244985	medium
69	69	El grafeno es un material aproximadamente 200 veces más fuerte que el acero en términos de resistencia a la tracción.	t	El grafeno es reconocido como uno de los materiales más resistentes jamás medidos, con una resistencia a la tracción que es unas 200 veces superior a la del acero.	2026-02-19 03:14:12.777173	medium
\.


--
-- TOC entry 3468 (class 0 OID 16466)
-- Dependencies: 229
-- Data for Name: saved_facts; Type: TABLE DATA; Schema: public; Owner: almacenfactssql_xa93_user
--

COPY public.saved_facts (user_id, fact_id) FROM stdin;
1	47
1	44
3	67
2	46
2	69
\.


--
-- TOC entry 3465 (class 0 OID 16422)
-- Dependencies: 226
-- Data for Name: trophies; Type: TABLE DATA; Schema: public; Owner: almacenfactssql_xa93_user
--

COPY public.trophies (id, title, points, iconurl, description) FROM stdin;
1	Primeros Factos	15	https://res.cloudinary.com/dmwdnfexz/image/upload/v1768489835/bronze_dgsrnh.svg	1
2	Aficionado del Facto	25	https://res.cloudinary.com/dmwdnfexz/image/upload/v1768489835/silver_n31zcp.svg	2
3	Profesional del Facto	40	https://res.cloudinary.com/dmwdnfexz/image/upload/v1768489835/gold_zzz5bb.svg	3
5	Verdad Absoluta	100	https://res.cloudinary.com/dmwdnfexz/image/upload/v1768489835/trophy1_hln19w.svg	5
4	Maestro del Facto	75	https://res.cloudinary.com/dmwdnfexz/image/upload/v1768489835/trophy2_uvxqts.svg	4
\.


--
-- TOC entry 3467 (class 0 OID 16448)
-- Dependencies: 228
-- Data for Name: user_trophies; Type: TABLE DATA; Schema: public; Owner: almacenfactssql_xa93_user
--

COPY public.user_trophies (id, user_id, trophy_id, achieved_at) FROM stdin;
\.


--
-- TOC entry 3464 (class 0 OID 16402)
-- Dependencies: 225
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: almacenfactssql_xa93_user
--

COPY public.users (id, username, email, password, score, created_at, name, bio, profile_picture, max_survival_record) FROM stdin;
2	nacho.exe	nachomorenov04@gmail.com	$2b$10$WLAmTpe.e15boUF.3gqVfOgOVHRBcRK1d3hAI7ryly7Vv/UyIOfiy	700	2026-02-17 14:17:50.427983	Nacho	Esta locura, no la traten de entender\r\nNo tiene cura, se lleva en la piel	https://res.cloudinary.com/dmwdnfexz/image/upload/v1771471403/perfiles_usuarios/lucqyly0jfflsdrtc5pr.jpg	21
4	peruzzi2003	gasparchab29@gmail.com	$2b$10$OZICbi/u5A5FeKY9Ybqt/ud135kHek3sgrIUMjQYtradjZjGT3PfG	0	2026-02-19 03:44:40.976079	\N	\N	./frontend/default-user.png	0
3	Jorgesito231	jchab@fi.uba.ar	$2b$10$Fg.iNH7//g9LZvu3lDAAV.hoEAzZI1CNZOpQbw8nKiZ5QMEMINRQ2	267	2026-02-18 02:18:16.157167	Gaspar	"El Futbol es el deporte mas lindo y mas sano del mundo que eso no le quepa la menor duda a nadie , yo me equivoque y pague pero LA PELOTA NO SE MANCHA"Diego Armando Maradona	https://res.cloudinary.com/dmwdnfexz/image/upload/v1771381224/perfiles_usuarios/abztq3uc9nscfl16snma.jpg	3
1	fran1	fran@gmail.com	$2b$10$hnvjhR2zwjW3aiVonfUtKeqNqaNsqMt.kfxp3bySykoCus4f6904S	102	2026-02-17 04:16:50.160587	Frann		https://res.cloudinary.com/dmwdnfexz/image/upload/v1771382479/perfiles_usuarios/phfomu8aoaru2ksya7kn.jpg	0
\.


--
-- TOC entry 3483 (class 0 OID 0)
-- Dependencies: 221
-- Name: facts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: almacenfactssql_xa93_user
--

SELECT pg_catalog.setval('public.facts_id_seq', 69, true);


--
-- TOC entry 3484 (class 0 OID 0)
-- Dependencies: 224
-- Name: quiz_attempts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: almacenfactssql_xa93_user
--

SELECT pg_catalog.setval('public.quiz_attempts_id_seq', 18, true);


--
-- TOC entry 3485 (class 0 OID 0)
-- Dependencies: 223
-- Name: quiz_questions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: almacenfactssql_xa93_user
--

SELECT pg_catalog.setval('public.quiz_questions_id_seq', 69, true);


--
-- TOC entry 3486 (class 0 OID 0)
-- Dependencies: 220
-- Name: trophies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: almacenfactssql_xa93_user
--

SELECT pg_catalog.setval('public.trophies_id_seq', 5, true);


--
-- TOC entry 3487 (class 0 OID 0)
-- Dependencies: 222
-- Name: user_trophies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: almacenfactssql_xa93_user
--

SELECT pg_catalog.setval('public.user_trophies_id_seq', 1, false);


--
-- TOC entry 3488 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: almacenfactssql_xa93_user
--

SELECT pg_catalog.setval('public.users_id_seq', 4, true);


--
-- TOC entry 3290 (class 2606 OID 16442)
-- Name: facts facts_pkey; Type: CONSTRAINT; Schema: public; Owner: almacenfactssql_xa93_user
--

ALTER TABLE ONLY public.facts
    ADD CONSTRAINT facts_pkey PRIMARY KEY (id);


--
-- TOC entry 3298 (class 2606 OID 16507)
-- Name: facts_repository facts_repository_pkey; Type: CONSTRAINT; Schema: public; Owner: almacenfactssql_xa93_user
--

ALTER TABLE ONLY public.facts_repository
    ADD CONSTRAINT facts_repository_pkey PRIMARY KEY (factid, userid);


--
-- TOC entry 3300 (class 2606 OID 16529)
-- Name: quiz_attempts quiz_attempts_pkey; Type: CONSTRAINT; Schema: public; Owner: almacenfactssql_xa93_user
--

ALTER TABLE ONLY public.quiz_attempts
    ADD CONSTRAINT quiz_attempts_pkey PRIMARY KEY (id);


--
-- TOC entry 3296 (class 2606 OID 16495)
-- Name: quiz_questions quiz_questions_pkey; Type: CONSTRAINT; Schema: public; Owner: almacenfactssql_xa93_user
--

ALTER TABLE ONLY public.quiz_questions
    ADD CONSTRAINT quiz_questions_pkey PRIMARY KEY (id);


--
-- TOC entry 3294 (class 2606 OID 16472)
-- Name: saved_facts saved_facts_pkey; Type: CONSTRAINT; Schema: public; Owner: almacenfactssql_xa93_user
--

ALTER TABLE ONLY public.saved_facts
    ADD CONSTRAINT saved_facts_pkey PRIMARY KEY (user_id, fact_id);


--
-- TOC entry 3288 (class 2606 OID 16431)
-- Name: trophies trophies_pkey; Type: CONSTRAINT; Schema: public; Owner: almacenfactssql_xa93_user
--

ALTER TABLE ONLY public.trophies
    ADD CONSTRAINT trophies_pkey PRIMARY KEY (id);


--
-- TOC entry 3292 (class 2606 OID 16455)
-- Name: user_trophies user_trophies_pkey; Type: CONSTRAINT; Schema: public; Owner: almacenfactssql_xa93_user
--

ALTER TABLE ONLY public.user_trophies
    ADD CONSTRAINT user_trophies_pkey PRIMARY KEY (id);


--
-- TOC entry 3282 (class 2606 OID 16419)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: almacenfactssql_xa93_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 3284 (class 2606 OID 16417)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: almacenfactssql_xa93_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3286 (class 2606 OID 16421)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: almacenfactssql_xa93_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 3307 (class 2606 OID 16508)
-- Name: facts_repository facts_repository_factid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: almacenfactssql_xa93_user
--

ALTER TABLE ONLY public.facts_repository
    ADD CONSTRAINT facts_repository_factid_fkey FOREIGN KEY (factid) REFERENCES public.facts(id);


--
-- TOC entry 3308 (class 2606 OID 16513)
-- Name: facts_repository facts_repository_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: almacenfactssql_xa93_user
--

ALTER TABLE ONLY public.facts_repository
    ADD CONSTRAINT facts_repository_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(id);


--
-- TOC entry 3301 (class 2606 OID 16443)
-- Name: facts fk_userid; Type: FK CONSTRAINT; Schema: public; Owner: almacenfactssql_xa93_user
--

ALTER TABLE ONLY public.facts
    ADD CONSTRAINT fk_userid FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- TOC entry 3309 (class 2606 OID 16530)
-- Name: quiz_attempts quiz_attempts_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: almacenfactssql_xa93_user
--

ALTER TABLE ONLY public.quiz_attempts
    ADD CONSTRAINT quiz_attempts_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.quiz_questions(id) ON DELETE CASCADE;


--
-- TOC entry 3310 (class 2606 OID 16535)
-- Name: quiz_attempts quiz_attempts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: almacenfactssql_xa93_user
--

ALTER TABLE ONLY public.quiz_attempts
    ADD CONSTRAINT quiz_attempts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3306 (class 2606 OID 16496)
-- Name: quiz_questions quiz_questions_fact_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: almacenfactssql_xa93_user
--

ALTER TABLE ONLY public.quiz_questions
    ADD CONSTRAINT quiz_questions_fact_id_fkey FOREIGN KEY (fact_id) REFERENCES public.facts(id) ON DELETE CASCADE;


--
-- TOC entry 3304 (class 2606 OID 16473)
-- Name: saved_facts saved_facts_fact_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: almacenfactssql_xa93_user
--

ALTER TABLE ONLY public.saved_facts
    ADD CONSTRAINT saved_facts_fact_id_fkey FOREIGN KEY (fact_id) REFERENCES public.facts(id) ON DELETE CASCADE;


--
-- TOC entry 3305 (class 2606 OID 16478)
-- Name: saved_facts saved_facts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: almacenfactssql_xa93_user
--

ALTER TABLE ONLY public.saved_facts
    ADD CONSTRAINT saved_facts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3302 (class 2606 OID 16456)
-- Name: user_trophies user_trophies_trophy_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: almacenfactssql_xa93_user
--

ALTER TABLE ONLY public.user_trophies
    ADD CONSTRAINT user_trophies_trophy_id_fkey FOREIGN KEY (trophy_id) REFERENCES public.trophies(id) ON DELETE CASCADE;


--
-- TOC entry 3303 (class 2606 OID 16461)
-- Name: user_trophies user_trophies_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: almacenfactssql_xa93_user
--

ALTER TABLE ONLY public.user_trophies
    ADD CONSTRAINT user_trophies_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 2086 (class 826 OID 16391)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

-- ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON SEQUENCES TO almacenfactssql_xa93_user;


--
-- TOC entry 2088 (class 826 OID 16393)
-- Name: DEFAULT PRIVILEGES FOR TYPES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

-- ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TYPES TO almacenfactssql_xa93_user;


--
-- TOC entry 2087 (class 826 OID 16392)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

-- ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON FUNCTIONS TO almacenfactssql_xa93_user;


--
-- TOC entry 2085 (class 826 OID 16390)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

-- ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TABLES TO almacenfactssql_xa93_user;


-- Completed on 2026-02-19 00:47:02

--
-- PostgreSQL database dump complete
--

\unrestrict asxm6stDNsjIhKl5Nexw39wHiAPJ0VvRZzRdxwBeUawkPbeMKgCdqd6XRTOPdvy


CREATE TABLE "streamers" (
  "id" SERIAL PRIMARY KEY,
  "user_name" varchar,
  "display_name" varchar,
  "streamer_name" varchar,
  "is_partner" boolean,
  "is_fulltime" boolean,
  "uses_cam" boolean,
  "mature_stream" boolean,
  "dob_year" int,
  "logo" varchar,
  "description" varchar
);

CREATE TABLE "streamers_categories" (
  "id" SERIAL PRIMARY KEY,
  "streamer_id" int,
  "category_id" int
);

CREATE TABLE "streamers_collabs" (
  "id" SERIAL PRIMARY KEY,
  "streamer_id" int,
  "date" date,
  "collab_with" int,
  "collab_summary" varchar
);

CREATE TABLE "streamers_languages" (
  "id" SERIAL PRIMARY KEY,
  "streamer_id" int,
  "language_id" int,
  "native" boolean
);

CREATE TABLE "streamers_locations" (
  "id" SERIAL PRIMARY KEY,
  "streamer_id" int,
  "location_id" int
);

CREATE TABLE "streamers_nationalities" (
  "id" SERIAL PRIMARY KEY,
  "streamer_id" int,
  "nationality_id" int
);

CREATE TABLE "streamers_stats" (
  "id" SERIAL PRIMARY KEY,
  "streamer_id" int,
  "followers" int,
  "voice" int,
  "avg_viewers" int,
  "avg_stream_duration" int,
  "viewer_participation" int,
  "start_stream" time with time zone null
);

CREATE TABLE "streamers_tags" (
  "id" SERIAL PRIMARY KEY,
  "streamer_id" int,
  "tag_id" int
);

CREATE TABLE "streamers_vibes" (
  "id" SERIAL PRIMARY KEY,
  "streamer_id" int,
  "vibe_id" int
);

CREATE TABLE "categories" (
  "id" SERIAL PRIMARY KEY,
  "category" varchar
);

CREATE TABLE "languages" (
  "id" SERIAL PRIMARY KEY,
  "language" varchar
);

CREATE TABLE "locations" (
  "id" SERIAL PRIMARY KEY,
  "location" varchar
);

CREATE TABLE "tags" (
  "id" SERIAL PRIMARY KEY,
  "tag" varchar
);

CREATE TABLE "nationalities" (
  "id" SERIAL PRIMARY KEY,
  "nationality" varchar
);

CREATE TABLE "vibes" (
  "id" SERIAL PRIMARY KEY,
  "vibe" varchar
);

ALTER TABLE "streamers_categories" ADD FOREIGN KEY ("streamer_id") REFERENCES "streamers" ("id");

ALTER TABLE "streamers_categories" ADD FOREIGN KEY ("category_id") REFERENCES "categories" ("id");

ALTER TABLE "streamers_collabs" ADD FOREIGN KEY ("streamer_id") REFERENCES "streamers" ("id");

ALTER TABLE "streamers_languages" ADD FOREIGN KEY ("streamer_id") REFERENCES "streamers" ("id");

ALTER TABLE "streamers_languages" ADD FOREIGN KEY ("language_id") REFERENCES "languages" ("id");

ALTER TABLE "streamers_locations" ADD FOREIGN KEY ("streamer_id") REFERENCES "streamers" ("id");

ALTER TABLE "streamers_locations" ADD FOREIGN KEY ("location_id") REFERENCES "locations" ("id");

ALTER TABLE "streamers_nationalities" ADD FOREIGN KEY ("streamer_id") REFERENCES "streamers" ("id");

ALTER TABLE "streamers_nationalities" ADD FOREIGN KEY ("nationality_id") REFERENCES "nationalities" ("id");

ALTER TABLE "streamers_stats" ADD FOREIGN KEY ("streamer_id") REFERENCES "streamers" ("id");

ALTER TABLE "streamers_tags" ADD FOREIGN KEY ("streamer_id") REFERENCES "streamers" ("id");

ALTER TABLE "streamers_tags" ADD FOREIGN KEY ("tag_id") REFERENCES "tags" ("id");

ALTER TABLE "streamers_vibes" ADD FOREIGN KEY ("streamer_id") REFERENCES "streamers" ("id");

ALTER TABLE "streamers_vibes" ADD FOREIGN KEY ("vibe_id") REFERENCES "vibes" ("id");

ALTER TABLE streamers_stats ADD COLUMN chat_mode INT NULL;

CREATE TABLE "chat_vibes" (
  "id" serial NOT NULL,
  "vibe" character varying NOT NULL
);

ALTER TABLE "chat_vibes" ADD CONSTRAINT "chat_vibes_pk" PRIMARY KEY (id);

CREATE TABLE "streamers_chat_vibes" (
  "streamer_id" integer NOT NULL,
  "chat_vibe_id" integer NOT NULL
);

ALTER TABLE "streamers_chat_vibes" ADD CONSTRAINT "streamers_chat_vibes_pk" PRIMARY KEY (streamer_id, chat_vibe_id);
ALTER TABLE "streamers_chat_vibes" ADD FOREIGN KEY("streamer_id") REFERENCES "streamers" ("id");
ALTER TABLE "streamers_chat_vibes" ADD FOREIGN KEY("chat_vibe_id") REFERENCES "chat_vibes" ("id");

INSERT INTO "chat_vibes" ("id", "vibe") VALUES
(1,	'Chatty'),
(2,	'Chill'),
(3,	'Serious'),
(4,	'Smart'),
(5,	'Funny'),
(6,	'Friendly'),
(7,	'Moody'),
(8,	'Weird'),
(9,	'Geeky'),
(10,	'Shy'),
(11,	'Silly'),
(12,	'Rude'),
(13,	'Dorky'),
(14,	'Angry'),
(15,	'Loud'),
(16,	'Quiet'),
(17,	'Troll'),
(18,	'Drunk'),
(20,	'Fast'),
(21,	'Slow'),
(22,	'Wholesome'),
(23,	'Toxic'),
(19,	'Spam-emotes');

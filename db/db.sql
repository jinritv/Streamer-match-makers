SET datestyle = MDY; -- setting date format as month/day/year
CREATE TABLE "streamers" (
  "id" SERIAL PRIMARY KEY,
  "user_name" varchar,
  "nickname" varchar,
  "is_partner" boolean,
  "uses_cam" boolean,
  "mature_stream" boolean,
  "logo" varchar,
  "description" varchar
);

CREATE TABLE "categories" (
  "id" SERIAL PRIMARY KEY,
  "category" varchar
);

CREATE TABLE "languages" (
  "id" SERIAL PRIMARY KEY,
  "language" varchar
);

CREATE TABLE "chatvibes" (
  "id" SERIAL PRIMARY KEY,
  "chatvibe" varchar
);

CREATE TABLE "vibes" (
  "id" SERIAL PRIMARY KEY,
  "vibe" varchar
);

-- link tables --

CREATE TABLE "streamers_categories" (
  "id" SERIAL PRIMARY KEY,
  "streamer_id" int,
  "category_id" int
);

CREATE TABLE "streamers_languages" (
  "id" SERIAL PRIMARY KEY,
  "streamer_id" int,
  "language_id" int,
  "native" boolean
);

CREATE TABLE "streamers_stats" (
  "id" SERIAL PRIMARY KEY,
  "streamer_id" int,
  "followers" int,
  "avg_viewers" int,
  "avg_start_time" time,
  "avg_stream_duration" int,
  "streams_per_week" int,
  "stream_start_date" date,
  "chat_mode" varchar
);

CREATE TABLE "streamers_chatvibes" (
  "id" SERIAL PRIMARY KEY,
  "streamer_id" int,
  "chatvibe_id" int
);

CREATE TABLE "streamers_vibes" (
  "id" SERIAL PRIMARY KEY,
  "streamer_id" int,
  "vibe_id" int
);

ALTER TABLE "streamers_stats" ADD FOREIGN KEY ("streamer_id") REFERENCES "streamers" ("id");

ALTER TABLE "streamers_categories" ADD FOREIGN KEY ("streamer_id") REFERENCES "streamers" ("id");
ALTER TABLE "streamers_categories" ADD FOREIGN KEY ("category_id") REFERENCES "categories" ("id");

ALTER TABLE "streamers_languages" ADD FOREIGN KEY ("streamer_id") REFERENCES "streamers" ("id");
ALTER TABLE "streamers_languages" ADD FOREIGN KEY ("language_id") REFERENCES "languages" ("id");

ALTER TABLE "streamers_vibes" ADD FOREIGN KEY ("streamer_id") REFERENCES "streamers" ("id");
ALTER TABLE "streamers_vibes" ADD FOREIGN KEY ("vibe_id") REFERENCES "vibes" ("id");

ALTER TABLE "streamers_chatvibes" ADD FOREIGN KEY ("streamer_id") REFERENCES "streamers" ("id");
ALTER TABLE "streamers_chatvibes" ADD FOREIGN KEY ("chatvibe_id") REFERENCES "chatvibes" ("id");

INSERT INTO "chatvibes" ("id", "chatvibe") VALUES
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
(19,	'Spam emotes'),
(20,	'Fast'),
(21,	'Slow'),
(22,	'Wholesome'),
(23,	'Toxic'),
(24,	'Nonswearing'),
(25,	'Comfy');

INSERT INTO "vibes" ("id", "vibe") VALUES
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
(19,	'Spam emotes'),
(20,	'Fast'),
(21,	'Slow'),
(22,	'Wholesome'),
(23,	'Toxic'),
(24,	'Nonswearing'),
(25,	'Engaging'),
(26,	'Informative'),
(27,	'Raging'),
(28,	'Blunt'),
(29,	'Comfy'),
(30,	'Artistic'),
(31,	'Goofy'),
(32,	'Outgoing'),
(33,	'Adorable');
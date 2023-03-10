CREATE TABLE "user"(
  "id" SERIAL PRIMARY KEY,
  "username" TEXT NOT NULL,
  "hashedPassword" TEXT,
  "profilePicture" TEXT,
  "currentLocation" TEXT,
  "tagline" TEXT,
  "bio" TEXT,
  "linkedin" TEXT,
  "github" TEXT,
  "dribbble" TEXT,
  "behance" TEXT,
  "medium" TEXT,
  "twitter" TEXT,
  "youtube" TEXT,
  "instagram" TEXT
);

CREATE TABLE "nowwww-entry"(
  "id" SERIAL, 
  "content" TEXT,
  "user_id" INT,
  "category_id" INT,
  CONSTRAINT "fk_user"
  FOREIGN KEY("user_id")
  REFERENCES "user"("id"),
  CONSTRAINT "fk_category"
  FOREIGN KEY("category_id")
  REFERENCES "nowww-category"("id")
);

CREATE TABLE "nowww-category"(
  "id" SERIAL PRIMARY KEY,
  "categoryName" TEXT
);

CREATE TABLE "profile-picture"(
  "id" SERIAL PRIMARY KEY,
  "image_url" TEXT,
  "user_id" INT,
  CONSTRAINT "fk_user"
  FOREIGN KEY("user_id")
  REFERENCES "user"("id")
);

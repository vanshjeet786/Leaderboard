CREATE TABLE "Game_ID" (
    "Game_ID" TEXT
);

CREATE TABLE "Leaderboard_records" (
    "UUID" UUID,
    "Player_ID" TEXT,
    "Game_ID" TEXT,
    "Display name" TEXT,
    "Score" BIGINT,
    "Created at" TIMESTAMP,
    "Edited_At" TIMESTAMP,
    UNIQUE ("Player_ID", "Game_ID")
);

CREATE OR REPLACE FUNCTION create_game_id("GAME_ID" TEXT, "LIMIT" INTEGER)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO "Game_ID" ("Game_ID")
    VALUES ("GAME_ID");
    RETURN "GAME_ID";
END;
$$;

CREATE OR REPLACE FUNCTION edit_scores(
    "In_Game_ID" TEXT,
    "In_Score" BIGINT,
    "In_Player_ID" TEXT
)
RETURNS TABLE (
    "Updated Score" BIGINT,
    "Game_ID" TEXT,
    "Player_ID" TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
    current_score BIGINT;
BEGIN
    SELECT "Score" INTO current_score
    FROM "Leaderboard_records"
    WHERE "Leaderboard_records"."Player_ID" = "In_Player_ID"
      AND "Leaderboard_records"."Game_ID" = "In_Game_ID";

    IF NOT FOUND THEN
        INSERT INTO "Leaderboard_records" ("Game_ID", "Player_ID", "Score")
        VALUES ("In_Game_ID", "In_Player_ID", "In_Score");
    ELSIF "In_Score" > current_score THEN
        UPDATE "Leaderboard_records"
        SET "Score" = "In_Score"
        WHERE "Leaderboard_records"."Player_ID" = "In_Player_ID"
          AND "Leaderboard_records"."Game_ID" = "In_Game_ID";
    END IF;

    RETURN QUERY
    SELECT
        lr."Score",
        lr."Game_ID",
        lr."Player_ID"
    FROM "Leaderboard_records" lr
    WHERE lr."Game_ID" = "In_Game_ID"
      AND lr."Player_ID" = "In_Player_ID";
END;
$$;

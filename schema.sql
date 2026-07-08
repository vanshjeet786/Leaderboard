-- ============================================================
-- Gaming Leaderboard — Full Schema
-- ============================================================

-- 1. Tables
-- ------------------------------------------------------------

CREATE TABLE games (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    game_code   TEXT        UNIQUE NOT NULL,
    game_name   TEXT        NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE players (
    id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    player_code  TEXT        UNIQUE NOT NULL,
    display_name TEXT        NOT NULL,
    created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE leaderboard_entries (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id     UUID        NOT NULL REFERENCES games(id),
    player_id   UUID        NOT NULL REFERENCES players(id),
    score       BIGINT      NOT NULL DEFAULT 0,
    saved_at    TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (game_id, player_id)
);

-- 2. Indexes
-- ------------------------------------------------------------

CREATE INDEX idx_leaderboard_game_score
    ON leaderboard_entries (game_id, score DESC);

-- 3. RPCs (Optimized — Phase 5)
-- ------------------------------------------------------------

-- submit_score_by_code
-- Upserts a score for a player in a game using their codes.
-- Returns 'inserted', 'updated', or 'ignored'.
CREATE OR REPLACE FUNCTION submit_score_by_code(
    in_game_code   TEXT,
    in_player_code TEXT,
    in_score       BIGINT
)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    v_game_id   UUID;
    v_player_id UUID;
    v_result    leaderboard_entries;
BEGIN
    -- Look up game
    SELECT id INTO v_game_id
    FROM games
    WHERE game_code = in_game_code;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Game not found: %', in_game_code;
    END IF;

    -- Look up player
    SELECT id INTO v_player_id
    FROM players
    WHERE player_code = in_player_code;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Player not found: %', in_player_code;
    END IF;

    -- Upsert with GREATEST to keep the highest score
    INSERT INTO leaderboard_entries (game_id, player_id, score)
    VALUES (v_game_id, v_player_id, in_score)
    ON CONFLICT (game_id, player_id)
    DO UPDATE SET
        score      = GREATEST(leaderboard_entries.score, EXCLUDED.score),
        updated_at = CASE
                        WHEN EXCLUDED.score > leaderboard_entries.score THEN NOW()
                        ELSE leaderboard_entries.updated_at
                     END
    RETURNING * INTO v_result;

    -- Determine what happened
    IF v_result.xmax = 0 THEN
        RETURN 'inserted';
    ELSIF v_result.score = in_score THEN
        RETURN 'updated';
    ELSE
        RETURN 'ignored';
    END IF;
END;
$$;

-- get_game_leaderboard_by_code
-- Returns the top N players for a game, ranked by score descending.
-- Uses LANGUAGE sql STABLE for better optimizer inlining.
CREATE OR REPLACE FUNCTION get_game_leaderboard_by_code(
    in_game_code TEXT,
    in_limit     INTEGER DEFAULT 10
)
RETURNS TABLE (
    rank         BIGINT,
    player_id    TEXT,
    display_name TEXT,
    score        BIGINT,
    updated_at   TIMESTAMPTZ
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT
        ROW_NUMBER() OVER (ORDER BY le.score DESC) AS rank,
        p.player_code  AS player_id,
        p.display_name,
        le.score,
        le.updated_at
    FROM leaderboard_entries le
    JOIN players p ON p.id = le.player_id
    JOIN games   g ON g.id = le.game_id
    WHERE g.game_code = in_game_code
    ORDER BY le.score DESC
    LIMIT in_limit;
$$;

-- 4. Seed Data
-- ------------------------------------------------------------

-- Games (G001–G010)
INSERT INTO games (game_code, game_name) VALUES
    ('G001', 'Space Invaders Redux'),
    ('G002', 'Cyber Runner'),
    ('G003', 'Dungeon Master'),
    ('G004', 'Pixel Warriors'),
    ('G005', 'Neon Drift'),
    ('G006', 'Shadow Realm'),
    ('G007', 'Quantum Break'),
    ('G008', 'Storm Chaser'),
    ('G009', 'Rogue Planet'),
    ('G010', 'Final Frontier');

-- Players (P001–P030)
INSERT INTO players (player_code, display_name) VALUES
    ('P001', 'AcePilot'),
    ('P002', 'BladeRunner'),
    ('P003', 'CyberGhost'),
    ('P004', 'DarkMatter'),
    ('P005', 'EchoStrike'),
    ('P006', 'FrostByte'),
    ('P007', 'GhostRider'),
    ('P008', 'HyperNova'),
    ('P009', 'IronClad'),
    ('P010', 'JetStream'),
    ('P011', 'KnightFall'),
    ('P012', 'LaserWolf'),
    ('P013', 'MoonWalker'),
    ('P014', 'NightHawk'),
    ('P015', 'OmegaForce'),
    ('P016', 'PhantomX'),
    ('P017', 'QuantumLeap'),
    ('P018', 'RazorEdge'),
    ('P019', 'ShadowFox'),
    ('P020', 'ThunderBolt'),
    ('P021', 'UltraViolet'),
    ('P022', 'VortexKing'),
    ('P023', 'WarpDrive'),
    ('P024', 'XenonBlade'),
    ('P025', 'YellowFlash'),
    ('P026', 'ZeroGravity'),
    ('P027', 'Alpha'),
    ('P028', 'Bravo'),
    ('P029', 'Charlie'),
    ('P030', 'Delta');

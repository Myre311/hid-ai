-- ============================================================
-- MIGRATION 0010_inscriptions_talents_unique_email.sql
-- ============================================================
-- Empêcher les inscriptions en doublon par email.
--
-- Contexte (audit 2026-06) :
--   3 emails avaient des duplicates en base (Merveilli x4, Benadrick x3,
--   Nancy x2) parce qu'aucune contrainte UNIQUE n'existait. Le cleanup
--   data a déjà été fait (gardé la plus récente). Cette migration empêche
--   que ça se reproduise.
--
-- Stratégie : index UNIQUE sur LOWER(email) pour normaliser
-- (les inscriptions arrivaient parfois avec des variations de casse).
-- ============================================================

BEGIN;

-- Vérifie qu'il ne reste pas de doublons avant de créer l'index UNIQUE
DO $$
DECLARE
    dup_count int;
BEGIN
    SELECT count(*) INTO dup_count
    FROM (
        SELECT LOWER(email) AS e
        FROM inscriptions_talents
        GROUP BY LOWER(email)
        HAVING count(*) > 1
    ) sub;

    IF dup_count > 0 THEN
        RAISE EXCEPTION 'Cannot apply UNIQUE constraint: % duplicate email(s) found. Run cleanup first.', dup_count;
    END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS inscriptions_talents_email_unique_idx
    ON inscriptions_talents (LOWER(email));

COMMENT ON INDEX inscriptions_talents_email_unique_idx IS
    $$ Empêche les inscriptions en doublon (case-insensitive). Audit 2026-06. $$;

COMMIT;

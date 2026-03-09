CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- GIN trigram indexes for fast ILIKE text search on forms
CREATE INDEX IF NOT EXISTS idx_forms_title_trgm
  ON forms USING GIN (title gin_trgm_ops)
  WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS idx_forms_description_trgm
  ON forms USING GIN (description gin_trgm_ops)
  WHERE is_deleted = false;


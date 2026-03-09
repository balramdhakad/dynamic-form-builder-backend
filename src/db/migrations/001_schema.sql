
-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
    username VARCHAR(50) NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    is_blocked BOOLEAN NOT NULL DEFAULT false,
    role VARCHAR(20) NOT NULL DEFAULT 'USER' CHECK (role IN ('USER','ADMIN')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- FORMS TABLE 
CREATE TABLE IF NOT EXISTS forms (
    id UUID PRIMARY KEY DEFAULT uuidv7(),

    form_id UUID NOT NULL,

    title VARCHAR(255) NOT NULL,
    description TEXT,

    schema JSONB NOT NULL,

    version INTEGER NOT NULL DEFAULT 1 CHECK (version > 0),

    is_active BOOLEAN NOT NULL DEFAULT true,
    is_deleted BOOLEAN NOT NULL DEFAULT false,

    created_by UUID NOT NULL REFERENCES users(id),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- Only one active version per form
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_active_form
ON forms (form_id)
WHERE (is_active = true AND is_deleted = false);

-- Prevent duplicate version numbers
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_form_version
ON forms (form_id, version);

-- Query optimization
CREATE INDEX IF NOT EXISTS idx_forms_created_at
ON forms (form_id, created_at DESC)
WHERE (is_active = true AND is_deleted = false);

CREATE INDEX IF NOT EXISTS idx_forms_form_id
ON forms(form_id);


-- SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS submissions (
    id UUID PRIMARY KEY DEFAULT uuidv7(),

    form_version_id UUID NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
    form_id UUID NOT NULL,

    data JSONB NOT NULL,

    submitted_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- for query all record submitted to one form
CREATE INDEX IF NOT EXISTS idx_submissions_form_id_and_created_at
ON submissions (form_id,created_at DESC);

-- all records of that (x) version
CREATE INDEX IF NOT EXISTS idx_submissions_form_version
ON submissions (form_version_id,created_at DESC);

-- all record of a user
CREATE INDEX IF NOT EXISTS idx_submissions_user_by_order
ON submissions (submitted_by,created_at DESC);


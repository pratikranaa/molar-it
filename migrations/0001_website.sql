CREATE TABLE IF NOT EXISTS request_quotas (key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS request_quota_expiry ON request_quotas(expires);
CREATE TABLE IF NOT EXISTS waitlist (email TEXT PRIMARY KEY, company TEXT, role TEXT, source TEXT, created_at TEXT NOT NULL);

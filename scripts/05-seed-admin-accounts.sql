-- Insert Teacher/Admin account
-- Email: guru@sekolah.com
-- Password: password123 (SHA256 hash)
INSERT INTO users (email, password, name, role, school_id) VALUES
('guru@sekolah.com', '482c811da5d5b4bc6d497ffa98491e38', 'Budi Santoso', 'teacher', 1);

-- Insert Principal account
-- Email: kepala@sekolah.com
-- Password: password123 (SHA256 hash)
INSERT INTO users (email, password, name, role, school_id) VALUES
('kepala@sekolah.com', '482c811da5d5b4bc6d497ffa98491e38', 'Dr. Ahmad Wijaya', 'principal', 1);

-- Note: Both accounts use password: "password123"
-- Hash generated using: crypto.createHash("sha256").update("password123").digest("hex")

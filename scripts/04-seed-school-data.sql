-- Insert sample school
INSERT INTO schools (name, npsn, address, city, province, phone, email, principal_name) VALUES
('SMA Negeri 1 Jakarta', '20101234', 'Jl. Merdeka No. 123', 'Jakarta', 'DKI Jakarta', '021-1234567', 'info@sman1jkt.sch.id', 'Dr. Budi Santoso, M.Pd');

-- Insert academic years
INSERT INTO academic_years (school_id, year_start, year_end, is_active) VALUES
(1, 2023, 2024, FALSE),
(1, 2024, 2025, TRUE);

-- Insert classes
INSERT INTO classes (school_id, academic_year_id, name, grade_level, major_track) VALUES
(1, 2, 'XII IPA 1', 12, 'IPA'),
(1, 2, 'XII IPA 2', 12, 'IPA'),
(1, 2, 'XII IPS 1', 12, 'IPS'),
(1, 2, 'XII IPS 2', 12, 'IPS'),
(1, 2, 'XII IBB', 12, 'IBB');

-- Update existing users with school data
UPDATE users SET 
  nisn = '0012345678901',
  nis = '12001',
  class_id = 1,
  gender = 'Laki-laki',
  date_of_birth = '2006-05-15',
  phone = '081234567890',
  address = 'Jl. Sudirman No. 45, Jakarta'
WHERE id = 1;

-- Insert sample guardians
INSERT INTO guardians (student_id, guardian_type, name, phone, email, occupation, address) VALUES
(1, 'father', 'Bapak Ahmad Wijaya', '081234567890', 'ahmad.wijaya@email.com', 'Insinyur', 'Jl. Sudirman No. 45, Jakarta'),
(1, 'mother', 'Ibu Siti Nurhaliza', '081234567891', 'siti.nurhaliza@email.com', 'Guru', 'Jl. Sudirman No. 45, Jakarta');

-- Insert student academic records
INSERT INTO student_academic_records (student_id, academic_year_id, class_id, gpa, total_score, rank) VALUES
(1, 2, 1, 3.85, 92.5, 5);

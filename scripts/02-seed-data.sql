-- Insert sample majors
INSERT INTO majors (name, description, requirements, career_prospects) VALUES
('Teknik Informatika', 'Program studi yang fokus pada pengembangan perangkat lunak dan sistem komputer', 'Kemampuan logika, matematika, dan pemrograman', 'Software Developer, System Analyst, IT Consultant'),
('Teknik Mesin', 'Program studi yang mempelajari desain dan manufaktur mesin', 'Kemampuan fisika, matematika, dan desain', 'Mechanical Engineer, Manufacturing Engineer, Design Engineer'),
('Akuntansi', 'Program studi yang mempelajari sistem keuangan dan akuntansi', 'Kemampuan analisis, perhatian detail, dan matematika', 'Accountant, Financial Analyst, Auditor'),
('Psikologi', 'Program studi yang mempelajari perilaku manusia dan kesehatan mental', 'Kemampuan komunikasi, empati, dan analisis', 'Psychologist, HR Specialist, Counselor'),
('Desain Grafis', 'Program studi yang fokus pada seni visual dan desain digital', 'Kreativitas, estetika, dan kemampuan teknis', 'Graphic Designer, UI/UX Designer, Creative Director');

-- Insert criteria
INSERT INTO criteria (name, description, weight, type) VALUES
('Logika Pemrograman', 'Kemampuan berpikir logis dan algoritma', 0.20, 'talent'),
('Kreativitas', 'Kemampuan berpikir kreatif dan inovatif', 0.15, 'interest'),
('Analisis Data', 'Kemampuan menganalisis dan menginterpretasi data', 0.18, 'talent'),
('Komunikasi', 'Kemampuan berkomunikasi dengan baik', 0.12, 'interest'),
('Kepemimpinan', 'Kemampuan memimpin dan mengorganisir', 0.10, 'interest'),
('Perhatian Detail', 'Kemampuan fokus pada detail', 0.15, 'talent'),
('Empati', 'Kemampuan memahami perasaan orang lain', 0.10, 'interest');

-- Insert major-criteria relationships with scores
INSERT INTO major_criteria (major_id, criteria_id, score) VALUES
-- Teknik Informatika
(1, 1, 95), (1, 3, 90), (1, 6, 85), (1, 2, 70),
-- Teknik Mesin
(2, 1, 80), (2, 3, 85), (2, 6, 90), (2, 2, 75),
-- Akuntansi
(3, 3, 95), (3, 6, 95), (3, 4, 75), (3, 5, 70),
-- Psikologi
(4, 7, 95), (4, 4, 90), (4, 5, 85), (4, 2, 75),
-- Desain Grafis
(5, 2, 95), (5, 4, 80), (5, 1, 70), (5, 6, 85);

-- Insert test questions
INSERT INTO test_questions (criteria_id, question, question_type) VALUES
(1, 'Seberapa mudah Anda memahami konsep pemrograman?', 'scale'),
(1, 'Apakah Anda suka memecahkan masalah dengan logika?', 'scale'),
(2, 'Seberapa kreatif Anda dalam menghasilkan ide baru?', 'scale'),
(2, 'Apakah Anda suka bereksperimen dengan hal-hal baru?', 'scale'),
(3, 'Seberapa baik Anda dalam menganalisis data?', 'scale'),
(3, 'Apakah Anda suka mencari pola dalam informasi?', 'scale'),
(4, 'Seberapa baik Anda berkomunikasi dengan orang lain?', 'scale'),
(4, 'Apakah Anda nyaman berbicara di depan umum?', 'scale'),
(5, 'Seberapa baik Anda dalam memimpin tim?', 'scale'),
(5, 'Apakah Anda suka mengorganisir kegiatan?', 'scale'),
(6, 'Seberapa teliti Anda dalam pekerjaan?', 'scale'),
(6, 'Apakah Anda memperhatikan detail kecil?', 'scale'),
(7, 'Seberapa baik Anda memahami perasaan orang lain?', 'scale'),
(7, 'Apakah Anda suka membantu orang lain?', 'scale');

-- Insert question options (scale 1-5)
INSERT INTO question_options (question_id, option_text, option_value, display_order) VALUES
(1, 'Sangat Sulit', 1, 1), (1, 'Sulit', 2, 2), (1, 'Cukup', 3, 3), (1, 'Mudah', 4, 4), (1, 'Sangat Mudah', 5, 5),
(2, 'Sangat Tidak Suka', 1, 1), (2, 'Tidak Suka', 2, 2), (2, 'Netral', 3, 3), (2, 'Suka', 4, 4), (2, 'Sangat Suka', 5, 5),
(3, 'Sangat Tidak Kreatif', 1, 1), (3, 'Tidak Kreatif', 2, 2), (3, 'Cukup Kreatif', 3, 3), (3, 'Kreatif', 4, 4), (3, 'Sangat Kreatif', 5, 5),
(4, 'Sangat Tidak Suka', 1, 1), (4, 'Tidak Suka', 2, 2), (4, 'Netral', 3, 3), (4, 'Suka', 4, 4), (4, 'Sangat Suka', 5, 5),
(5, 'Sangat Buruk', 1, 1), (5, 'Buruk', 2, 2), (5, 'Cukup', 3, 3), (5, 'Baik', 4, 4), (5, 'Sangat Baik', 5, 5),
(6, 'Sangat Tidak Suka', 1, 1), (6, 'Tidak Suka', 2, 2), (6, 'Netral', 3, 3), (6, 'Suka', 4, 4), (6, 'Sangat Suka', 5, 5),
(7, 'Sangat Buruk', 1, 1), (7, 'Buruk', 2, 2), (7, 'Cukup', 3, 3), (7, 'Baik', 4, 4), (7, 'Sangat Baik', 5, 5),
(8, 'Sangat Tidak Nyaman', 1, 1), (8, 'Tidak Nyaman', 2, 2), (8, 'Netral', 3, 3), (8, 'Nyaman', 4, 4), (8, 'Sangat Nyaman', 5, 5),
(9, 'Sangat Buruk', 1, 1), (9, 'Buruk', 2, 2), (9, 'Cukup', 3, 3), (9, 'Baik', 4, 4), (9, 'Sangat Baik', 5, 5),
(10, 'Sangat Tidak Suka', 1, 1), (10, 'Tidak Suka', 2, 2), (10, 'Netral', 3, 3), (10, 'Suka', 4, 4), (10, 'Sangat Suka', 5, 5),
(11, 'Sangat Tidak Teliti', 1, 1), (11, 'Tidak Teliti', 2, 2), (11, 'Cukup Teliti', 3, 3), (11, 'Teliti', 4, 4), (11, 'Sangat Teliti', 5, 5),
(12, 'Sangat Tidak Memperhatikan', 1, 1), (12, 'Tidak Memperhatikan', 2, 2), (12, 'Cukup Memperhatikan', 3, 3), (12, 'Memperhatikan', 4, 4), (12, 'Sangat Memperhatikan', 5, 5),
(13, 'Sangat Buruk', 1, 1), (13, 'Buruk', 2, 2), (13, 'Cukup', 3, 3), (13, 'Baik', 4, 4), (13, 'Sangat Baik', 5, 5),
(14, 'Sangat Tidak Suka', 1, 1), (14, 'Tidak Suka', 2, 2), (14, 'Netral', 3, 3), (14, 'Suka', 4, 4), (14, 'Sangat Suka', 5, 5);

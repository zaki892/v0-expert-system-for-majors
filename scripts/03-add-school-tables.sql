-- Schools table
CREATE TABLE schools (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  npsn VARCHAR(20) UNIQUE, -- Nomor Pokok Sekolah Nasional
  address TEXT,
  city VARCHAR(100),
  province VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(255),
  principal_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Academic years table
CREATE TABLE academic_years (
  id SERIAL PRIMARY KEY,
  school_id INT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  year_start INT NOT NULL,
  year_end INT NOT NULL,
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Classes table
CREATE TABLE classes (
  id SERIAL PRIMARY KEY,
  school_id INT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  academic_year_id INT NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL, -- e.g., "XII IPA 1", "XII IPS 2"
  grade_level INT NOT NULL, -- 10, 11, 12
  major_track VARCHAR(50), -- IPA, IPS, IBB, etc.
  homeroom_teacher_id INT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(school_id, academic_year_id, name)
);

-- Update users table to include school-specific fields
ALTER TABLE users ADD COLUMN IF NOT EXISTS nisn VARCHAR(20) UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS nis VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS class_id INT REFERENCES classes(id) ON DELETE SET NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS gender VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT;

-- Guardians table
CREATE TABLE guardians (
  id SERIAL PRIMARY KEY,
  student_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  guardian_type VARCHAR(50) NOT NULL, -- 'father', 'mother', 'other'
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),
  occupation VARCHAR(100),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student academic records
CREATE TABLE student_academic_records (
  id SERIAL PRIMARY KEY,
  student_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  academic_year_id INT NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
  class_id INT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  gpa DECIMAL(4, 2),
  total_score DECIMAL(5, 2),
  rank INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Update test_results to include academic context
ALTER TABLE test_results ADD COLUMN IF NOT EXISTS academic_year_id INT REFERENCES academic_years(id) ON DELETE SET NULL;
ALTER TABLE test_results ADD COLUMN IF NOT EXISTS class_id INT REFERENCES classes(id) ON DELETE SET NULL;

-- Create indexes for better performance
CREATE INDEX idx_schools_npsn ON schools(npsn);
CREATE INDEX idx_classes_school_id ON classes(school_id);
CREATE INDEX idx_classes_academic_year_id ON classes(academic_year_id);
CREATE INDEX idx_users_nisn ON users(nisn);
CREATE INDEX idx_users_nis ON users(nis);
CREATE INDEX idx_users_class_id ON users(class_id);
CREATE INDEX idx_guardians_student_id ON guardians(student_id);
CREATE INDEX idx_student_academic_records_student_id ON student_academic_records(student_id);
CREATE INDEX idx_student_academic_records_academic_year_id ON student_academic_records(academic_year_id);
CREATE INDEX idx_test_results_academic_year_id ON test_results(academic_year_id);
CREATE INDEX idx_test_results_class_id ON test_results(class_id);

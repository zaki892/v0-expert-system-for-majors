-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'student', -- student, admin, teacher
  school_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Majors table
CREATE TABLE majors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  requirements TEXT,
  career_prospects TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criteria for SAW method
CREATE TABLE criteria (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  weight DECIMAL(5, 2) NOT NULL, -- Weight for SAW calculation
  type VARCHAR(50) NOT NULL, -- 'interest' or 'talent'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Major-Criteria relationship
CREATE TABLE major_criteria (
  id SERIAL PRIMARY KEY,
  major_id INT NOT NULL REFERENCES majors(id) ON DELETE CASCADE,
  criteria_id INT NOT NULL REFERENCES criteria(id) ON DELETE CASCADE,
  score DECIMAL(5, 2) NOT NULL, -- Score for this major-criteria combination
  UNIQUE(major_id, criteria_id)
);

-- Test questions
CREATE TABLE test_questions (
  id SERIAL PRIMARY KEY,
  criteria_id INT NOT NULL REFERENCES criteria(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  question_type VARCHAR(50) NOT NULL, -- 'multiple_choice', 'scale'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Test question options
CREATE TABLE question_options (
  id SERIAL PRIMARY KEY,
  question_id INT NOT NULL REFERENCES test_questions(id) ON DELETE CASCADE,
  option_text VARCHAR(255) NOT NULL,
  option_value DECIMAL(5, 2) NOT NULL,
  display_order INT
);

-- Student test results
CREATE TABLE test_results (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student test answers
CREATE TABLE test_answers (
  id SERIAL PRIMARY KEY,
  test_result_id INT NOT NULL REFERENCES test_results(id) ON DELETE CASCADE,
  question_id INT NOT NULL REFERENCES test_questions(id) ON DELETE CASCADE,
  answer_value DECIMAL(5, 2) NOT NULL
);

-- Major recommendations
CREATE TABLE recommendations (
  id SERIAL PRIMARY KEY,
  test_result_id INT NOT NULL REFERENCES test_results(id) ON DELETE CASCADE,
  major_id INT NOT NULL REFERENCES majors(id) ON DELETE CASCADE,
  score DECIMAL(5, 2) NOT NULL,
  rank INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_test_results_user_id ON test_results(user_id);
CREATE INDEX idx_recommendations_test_result_id ON recommendations(test_result_id);
CREATE INDEX idx_major_criteria_major_id ON major_criteria(major_id);

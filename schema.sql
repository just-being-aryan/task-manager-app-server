-- Modify existing users table to make username nullable
ALTER TABLE users MODIFY COLUMN username VARCHAR(100) NULL;

-- Add name column if it doesn't exist (safe to run multiple times)
ALTER TABLE users ADD COLUMN IF NOT EXISTS name VARCHAR(100);

-- Create tasks table if it doesn't exist
CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date DATE,
  priority ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
  is_complete TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

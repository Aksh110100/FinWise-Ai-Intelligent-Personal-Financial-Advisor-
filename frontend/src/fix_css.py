import re
file_path = r'd:\Aksh College Material\Charusat\SEM 5\SGP\FinWise-AI\frontend\src\styles\goals.css'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

new_css = """
/* Buttons */
.goals-primary-btn {
  background: var(--text-primary);
  color: #050505;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-family: var(--font-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.goals-primary-btn:hover {
  background: #fff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);
}

.goals-secondary-btn {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px 24px;
  border-radius: 12px;
  font-family: var(--font-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.goals-secondary-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}
"""

with open(file_path, 'a', encoding='utf-8') as f:
    f.write(new_css)

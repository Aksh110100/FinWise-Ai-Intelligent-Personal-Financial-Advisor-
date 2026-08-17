import re
file_path = r'd:\Aksh College Material\Charusat\SEM 5\SGP\FinWise-AI\frontend\src\pages\dashboard\Goals.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(r'"primary-btn"', '"goals-primary-btn"', content)
content = re.sub(r'"secondary-btn"', '"goals-secondary-btn"', content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

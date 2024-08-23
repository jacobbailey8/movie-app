import pandas as pd

df = pd.read_csv('csv/combined_movie_files.csv')

# Convert `date_added` to datetime format
df['date_added'] = pd.to_datetime(df['date_added'], errors='coerce')

# Standardize categorical columns `type`, `rating`, `streaming_service`
df['type'] = df['type'].str.strip().str.capitalize()
df['rating'] = df['rating'].str.strip().str.upper()
df['streaming_service'] = df['streaming_service'].str.strip().str.capitalize()

# Ensure `release_year` and `show_id` are integers
df['release_year'] = pd.to_numeric(
    df['release_year'], errors='coerce').fillna(0).astype(int)
df['show_id'] = pd.to_numeric(
    df['show_id'], errors='coerce').fillna(0).astype(int)

# Remove duplicates
df = df.drop_duplicates()

# Process the `duration` column and create `num_seasons` column
df['duration'] = df['duration'].fillna('').astype(str)
df['num_seasons'] = df['duration'].apply(
    lambda x: int(x.split()[0]) if 'Season' in x else None)
df['duration'] = df['duration'].apply(
    lambda x: int(x.split()[0]) if 'min' in x else None)

# save to new csv
df.to_csv('csv/cleaned_data.csv', index=False)

# import movie files as pandas dataframes, combine them, and save the combined dataframe as a csv file
import pandas as pd

# import movie files as pandas dataframes
df_netfilx = pd.read_csv('netflix_titles.csv')
df_prime = pd.read_csv('amazon_prime_titles.csv')
df_hulu = pd.read_csv('hulu_titles.csv')
df_disney = pd.read_csv('disney_plus_titles.csv')

# add a new column called 'streaming_service' to each dataframe
df_netfilx['streaming_service'] = 'Netflix'
df_prime['streaming_service'] = 'Amazon Prime'
df_hulu['streaming_service'] = 'Hulu'
df_disney['streaming_service'] = 'Disney Plus'

# combine dataframes
df_combined = pd.concat([df_netfilx, df_prime, df_hulu, df_disney])

# rename show_id rows to a unique identifier
df_combined['show_id'] = range(1, len(df_combined) + 1)

# save the combined dataframe as a csv file
df_combined.to_csv('combined_movie_files.csv', index=False)
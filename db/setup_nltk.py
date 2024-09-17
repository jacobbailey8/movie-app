import nltk
import ssl

# Bypass SSL certificate verification
try:
    _create_default_https_context = ssl._create_default_https_context
    ssl._create_default_https_context = ssl._create_unverified_context
except AttributeError:
    pass

# Download necessary NLTK resources
nltk.download('punkt')
nltk.download('punkt_tab')
nltk.download('averaged_perceptron_tagger_eng')
nltk.download('stopwords')

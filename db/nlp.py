import spacy
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import re

# Load spaCy's English language model once
nlp = spacy.load("en_core_web_sm")

# Initialize VADER sentiment analyzer once
sentiment_analyzer = SentimentIntensityAnalyzer()


def get_sentiment(review: str) -> float:
    """
    Get sentiment score using VADER.
    Returns the compound score which indicates overall sentiment.
    """
    sentiment = sentiment_analyzer.polarity_scores(review)
    return sentiment['compound']  # Return compound score for overall sentiment


def extract_phrases(review: str):
    """
    Extract meaningful noun-adjective phrases from a review using spaCy.
    """
    doc = nlp(review)
    phrases = []
    for token in doc:
        if token.pos_ == 'ADJ' and token.head.pos_ == 'NOUN':
            # Adjective-Noun pair
            phrases.append(f"{token.text} {token.head.text}")
    return phrases

# Preprocess function to clean the text


def clean_review_text(text):
    # Convert to lowercase
    text = text.lower()

    # Remove URLs
    text = re.sub(r"http\S+|www\S+|https\S+", '', text, flags=re.MULTILINE)

    # Remove special characters, numbers, and punctuation except common sentence structure symbols
    text = re.sub(r"[^a-zA-Z\s]", '', text)

    return text

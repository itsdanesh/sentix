import joblib
import sqlite3
from sklearn.model_selection import StratifiedKFold
import pandas as pd
import re
from sklearn.metrics import accuracy_score
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import LogisticRegression
from pathlib import Path
from ..db import get_db_connection



PATH_TO_MODEL = Path("trained_model")
def preprocess_text(text):
        if not isinstance(text, str):
            return ""
        # Convert text to lowercase
        text = text.lower()
        # Remove punctuation
        text = re.sub(r"[^\w\s]", "", text)
        # Remove numbers
        text = re.sub(r"\d+", "", text)
        # Remove stopwords
        stop_words = set(stopwords.words("english"))
        text = " ".join(word for word in text.split() if word not in stop_words)
        # Lemmatization
        lemmatizer = WordNetLemmatizer()
        text = " ".join(lemmatizer.lemmatize(word) for word in text.split())
        return text


def train_model():
    db_conn = get_db_connection()
    train_df = pd.read_sql_query("SELECT * FROM twitter_sentiment", db_conn)
    

    print("Preprocessing data set")
    train_df["ProcessedTweet"] = train_df["text"].apply(preprocess_text)

    print("Vectorizing data set")
    vectorizer = CountVectorizer()
    X = vectorizer.fit_transform(train_df['ProcessedTweet'])
    y = train_df['sentiment']

    print("Training final model on the entire dataset")
    final_model = LogisticRegression(max_iter=1000, C=6.0)
    final_model.fit(X, y)

    models = {"model": final_model, "vectorizer": vectorizer}
    joblib.dump(models, PATH_TO_MODEL)


def preprocess_and_predict(text):
    # Load the model
    try:
        models = joblib.load(PATH_TO_MODEL)
    except FileNotFoundError:
        return "Error: Model not found"

    vectorizer = models["vectorizer"]
    model = models["model"]

    # Preprocess the text
    preprocessed_text = preprocess_text(text)
    vectorized_text = vectorizer.transform([preprocessed_text])

    lr_prediction = model.predict(vectorized_text)[0]
    print(f'Predicting sentiment of "{lr_prediction}" for text "{text}"')

    return lr_prediction

def test_model():
    db_conn = get_db_connection()
    test_df = pd.read_sql_query("SELECT * FROM twitter_sentiment_test", db_conn)
    test_df = test_df.dropna()
    test_df = test_df[['sentiment', 'text']]
    test_df['ProcessedTweet'] = test_df['text'].apply(preprocess_text)

    # Load the model and vectorizer
    try:
        models = joblib.load(PATH_TO_MODEL)
    except FileNotFoundError:
        return "Error: Model not found"

    vectorizer = models["vectorizer"]
    model = models["model"]

    # Vectorize the test data
    X_test = vectorizer.transform(test_df['ProcessedTweet'])
    y_test = test_df['sentiment']

    # Make predictions
    predictions_test = model.predict(X_test)

    # Calculate and return accuracy
    accuracy = accuracy_score(y_test, predictions_test)
    return accuracy

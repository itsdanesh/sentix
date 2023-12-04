import joblib
import sqlite3
import pandas as pd
import re
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import LogisticRegression
from pathlib import Path

PATH_TO_MODEL = Path("trained_model")
PATH_TO_DB = Path("db.sqlite3")


def train_model():
    db_conn = sqlite3.connect(PATH_TO_DB)
    train_df = pd.read_sql_query("SELECT * FROM twitter_training", db_conn)

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

    print("Preprocessing data set")
    train_df["ProcessedTweet"] = train_df["TweetContent"].apply(preprocess_text)

    print("Vectorizing data set")
    vectorizer = CountVectorizer()
    X_train = vectorizer.fit_transform(train_df["ProcessedTweet"])
    y_train = train_df["Sentiment"]

    print("Training model")
    log_reg_model = LogisticRegression(max_iter=1000)
    log_reg_model.fit(X_train, y_train)

    models = {"logistic_regression": log_reg_model, "vectorizer": vectorizer}

    joblib.dump(models, PATH_TO_MODEL)


def preprocess_and_predict(text):
    # Load the model
    try:
        models = joblib.load(PATH_TO_MODEL)
    except FileNotFoundError:
         return "Error: Model not found"
    
    vectorizer = models["vectorizer"]
    log_reg_model = models["logistic_regression"]

    vectorized_text = vectorizer.transform([text])

    lr_prediction = log_reg_model.predict(vectorized_text)[0]
    print(f'Predicting sentiment of "{lr_prediction}" for text "{text}"')

    return lr_prediction

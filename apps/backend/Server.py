from flask import Flask, request, jsonify
import joblib

app = Flask(__name__)

# Load the saved models and vectorizer
models = joblib.load('trained_model')
vectorizer = models['vectorizer']
nb_model = models['naive_bayes']
log_reg_model = models['logistic_regression']

def preprocess_and_predict(text):
    
    # Vectorize the text
    vectorized_text = vectorizer.transform([text])
    
    # Make predictions using both models
    nb_prediction = nb_model.predict(vectorized_text)[0]
    lr_prediction = log_reg_model.predict(vectorized_text)[0]
    
   
    return {
        'naive_bayes_sentiment': nb_prediction,
        'logistic_regression_sentiment': lr_prediction
    }

@app.route('/ping', methods=['POST'])
def ping():
    data = request.json
    tweet_text = data.get('tweet', '')

    # Predict sentiment
    result = preprocess_and_predict(tweet_text)
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)

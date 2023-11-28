# Backend

The Sentix backend exposes a simple API for administrating a ML model and its data set, in particular it allows for:

- Getting a sentiment prediction from the model
- Adding and removing data points to the data set
- Triggering a re-training of the model

## Setup guide (with Anaconda)

This guide assumes you already have:

- `python3`
- `pip`
- `Anaconda`

1. Setup your virtual environment  
1.1 If you do not have a virtual environment, create one by running  
```conda create --name $ENV_NAME```, where `$ENV_NAME` is an unused environment name 

1.2 If you already have a virtual environment, activate it by running  

```bash
# Unix
source activate $ENV_NAME

# Windows
activate $ENV_NAME
```

1.3 Install necessary dependencies 

2. Once your environment is set up, run the following command:

```bash
python manage.py runserver
```


## Step 03

Run the following command in the terminal where you activated your virtual environment to start the server
- python manage.py runserver

## Step 04 

Visit http://127.0.0.1:8000/api/ping/ in your web browser and you should see the JSON response {"message": "pong"}.

## Step 05 (Optional)

- Deactivate the virtual environment 
  - $ source deactivate (Linux or MacOS)
  - $ deactivate (Windows)


**The ML model**

In the provided machine learning model for Sentix, we use two different algorithms: Naive Bayes (NB) and Logistic Regression (LR), and we evaluate their performance using confusion matrix. Here's a simple breakdown of how each part works:

**Preprocessing:**
The first step is text preprocessing which involves lowercasing, removing punctuation and numbers, filtering out stopwords, and lemmatizing the words. This cleansed text is then vectorized using CountVectorizer from scikit-learn, converting the text data into a format suitable for the algorithms.

**Naive Bayes (NB):**
How it works: Naive Bayes is a classification algorithm based on Bayes' Theorem. It assumes that the presence of a particular feature in a class is unrelated to the presence of any other feature. For text data like tweets, it works well because it considers each word's contribution towards the sentiment expressed in the tweet, without worrying about the word order or sentence structure.
Function used: We use the MultinomialNB class from the scikit-learn library. It's implemented as nb_model = MultinomialNB() followed by nb_model.fit(X_train, y_train) to train the model with the training data.

**Logistic Regression (LR):**
How it works: Logistic Regression is used for classification problems. It predicts the probability that a given data point belongs to a certain class. It tries to calculate the probability of a tweet being positive, negative, or neutral.
Function used: The LogisticRegression class from scikit-learn is used. It's set up with log_reg_model = LogisticRegression() and then trained with log_reg_model.fit(X_train, y_train).

**Confusion Matrix:**
How it works: A confusion matrix is a table used to evaluate the performance of a classification model. It shows the actual vs. predicted values. This helps in understanding how many predictions were correct and how many were incorrect, including the types of errors made.
Function used: We use confusion_matrix from scikit-learn to create the matrix. It's used like this: cm = confusion_matrix(y_val, predictions), where y_val is the actual sentiments and predictions are what the model predicted. This is done for both the Naive Bayes and Logistic Regression models.

**Save the model:**

Then the model is saved using joblib library

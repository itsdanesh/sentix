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
Then the model is saved using joblib library.

**Running Server.py**:

 
- Activate your Anaconda environment:
``` 
conda activate your_env_name 
```


- Install Required Libraries:
```
conda install pandas scikit-learn matplotlib seaborn 
```
Note: you might need to install additional libraries.


- Navigate to the Script's Directory:
```
cd path/to/your/script
```
- Run the Script:

```
python Server.py
```
=======
Then the model is saved using joblib library
>>>>>>> apps/backend/README.md

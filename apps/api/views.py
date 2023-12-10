from django.http.response import JsonResponse
from django.views.decorators.http import require_http_methods
import json
import threading
from .sentiment.model import preprocess_and_predict, train_model as train_model_logic,test_model
from .db import get_db_connection
import pandas as pd

model_status = "good"

@require_http_methods(["GET"])
def get_model_status(request):
    return JsonResponse({"status": model_status})


@require_http_methods(["POST"])
def train(request):
    global model_status
    if model_status == "train":
        body = json.loads(request.body)
        if not body.get("force", False):
            return JsonResponse({"error": "Model is already being trained"}, status=400)
    model_status = "train"
    training_thread = threading.Thread(target=thread_safe_train_model)
    training_thread.start()
    return JsonResponse({"message": "Model training initiated"}, status=202)


@require_http_methods(["POST"])
def get_sentiment(request):
    try:
        analyzable_text = json.loads(request.body).get("text", "")
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    if not analyzable_text:
        return JsonResponse({"error": "No text provided"}, status=400)

    sentiment = preprocess_and_predict(analyzable_text)

    return JsonResponse({"sentiment": sentiment})

@require_http_methods(["POST", "DELETE", "GET"])
def manipulate_data(request):
    if(request.method == "POST"):
        body = json.loads(request.body)

        text = body.get("text")
        if(text is None):
            return JsonResponse({ "error": "Expected property 'text' in request body."})
        
        sentiment = body.get("sentiment")
        if not sentiment in ["Neutral", "Positive", "Negative", "Irrelevant"]:
            return JsonResponse({ "error": "Expected property 'sentiment' in request body to be one of 'Neutral', 'Positive', 'Negative', or 'Irrelevant'"})

        data = { "text": text, "sentiment": sentiment }
        df = pd.DataFrame(data)
        print(df)
        conn = get_db_connection()
        df.to_sql("twitter_sentiment", conn, index=True)
        # pd.read_sql_query(f'''INSERT INTO twitter_sentiment(id, name, sentiment, text) VALUES (1337, "Fortnite", "{sentiment}", "{text}")''', conn)

        return JsonResponse(data)

    if(request.method == "DELETE"):
        pass

    if(request.method == "GET"):
        matcher = request.GET.get("text")
        if(matcher is None):
            return JsonResponse({ "error": "Expected query parameter 'text' for matching data." }, status=400)

        
        conn = get_db_connection()
        
        train_df = pd.read_sql_query(f"SELECT * FROM twitter_sentiment WHERE text LIKE '%{matcher}%'", conn)
        data = train_df.to_dict(orient="records")
        print(data)
        return JsonResponse(data)
        print(train_df)
        pass

    return JsonResponse({ "test": "ok"})

def thread_safe_train_model():
    global model_status
    try:
        train_model_logic()
        model_status = "good"
        print("Model successfully retrained")
    except Exception as e:
        model_status = "stale"
        print(f"Error during training: {e}")

@require_http_methods(["GET"])
def get_accuracy_score(request):
    # Call the test_model function
    accuracy = test_model()

    # Check if the function returned an error message (in case the model wasn't found)
    if isinstance(accuracy, str):
        return JsonResponse({'error': accuracy}, status=500)

    # Return the accuracy in the response
    return JsonResponse({'accuracy score': accuracy})
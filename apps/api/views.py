from django.http.response import JsonResponse
from django.views.decorators.http import require_http_methods
import json
import threading
from .sentiment.model import preprocess_and_predict, train_model as train_model_logic

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


def thread_safe_train_model():
    global model_status
    try:
        train_model_logic()
        model_status = "good"
        print("Model successfully retrained")
    except Exception as e:
        model_status = "stale"
        print(f"Error during training: {e}")

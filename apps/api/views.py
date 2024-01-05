import os
import joblib
import json
import threading
import pandas as pd
import traceback
from lime.lime_text import LimeTextExplainer
from django.http.response import JsonResponse
from django.views.decorators.http import require_http_methods
from django.core.serializers import serialize
from django.http import HttpResponse
from .models import UserReport, SentimentEntry
from .sentiment.model import (
    PATH_TO_MODEL,
    PATH_TO_OLD_MODEL,
    preprocess_and_predict,
    train_model as train_model_logic,
    test_model,
    predict_proba,
)
from django.forms.models import model_to_dict

model_status = "good"


# Retrieves the status of the model, which is stored in memory.
# The possible statuses are:
# 'good' - The model is up to date
# 'stale' - The model is out of date (data set has been modified) and needs to be re-trained
# 'train' - The model is currently being trained
@require_http_methods(["GET"])
def get_model_status(request):
    return JsonResponse({"status": model_status})


# Initiates an (asynchronous) re-training of the model based on the newest data set
# If the model is currently training, the request body must include `"force": true` in order to interrupt the training.
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


# Calculates the sentiment of the specified text and outputs it.
# Possible sentiment values are 'Positive', 'Negative', 'Neutral', 'Irrelevant'
@require_http_methods(["POST"])
def get_sentiment(request):
    print(request)
    try:
        analyzable_text = json.loads(request.body).get("text", "")
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    if not analyzable_text:
        return JsonResponse({"error": "No text provided"}, status=400)

    sentiment = preprocess_and_predict(analyzable_text)

    return JsonResponse({"sentiment": sentiment})


# Interface for creating, listing and deleting data points.
# GET - Lists data points according to filter in query parameter
# POST - Creates data point
# DELETE - Deletes data point
@require_http_methods(["POST", "DELETE", "GET"])
def manipulate_data(request):
    global model_status

    if request.method == "POST":
        body = json.loads(request.body)
        text = body.get("text")
        if text is None:
            return JsonResponse(
                {"error": "Expected property 'text' in request body."}, status=400
            )

        sentiment = body.get("sentiment")
        print(sentiment)
        if not sentiment in ["Neutral", "Positive", "Negative", "Irrelevant"]:
            return JsonResponse(
                {
                    "error": "Expected property 'sentiment' in request body to be one of 'Neutral', 'Positive', 'Negative', or 'Irrelevant'"
                },
                status=400,
            )

        created = SentimentEntry.objects.create(text=text, sentiment=sentiment)
        created.save()
        model_status = "stale"

        return JsonResponse(model_to_dict(created), safe=False)

    if request.method == "DELETE":
        body = json.loads(request.body)

        text = body.get("text")
        if text is None:
            return JsonResponse({"error": "Expected property 'text' in request body."})

        sentiment = body.get("sentiment")
        if not sentiment in ["Neutral", "Positive", "Negative", "Irrelevant"]:
            return JsonResponse(
                {
                    "error": "Expected property 'sentiment' in request body to be one of 'Neutral', 'Positive', 'Negative', or 'Irrelevant'"
                }
            )

        output = SentimentEntry.objects.filter(text=text, sentiment=sentiment).delete()

        if output[0] == 0:
            return JsonResponse({}, status=404)

        model_status = "stale"

        return JsonResponse({"message": "Data successfully deleted."}, status=200)

    if request.method == "GET":
        print(request.GET)
        matcher = request.GET.get("text")
        if matcher is None:
            return JsonResponse(
                {"error": "Expected query parameter 'text' for matching data."},
                status=400,
            )

        matching_entries = list(
            SentimentEntry.objects.filter(text__contains=matcher).values()
        )
        return JsonResponse(matching_entries, safe=False)


# Reverts the model back to its old version by switching the two model binaries around.
# While this is happening, the model's status is 'train'.
@require_http_methods(["GET"])
def switch_models(request):
    global model_status

    model_status = "train"

    intermediate_name = "abcdefghijklmnopqrstuwx"
    os.rename(PATH_TO_MODEL, intermediate_name)
    os.rename(PATH_TO_OLD_MODEL, PATH_TO_MODEL)
    os.rename(intermediate_name, PATH_TO_OLD_MODEL)

    model_status = "good"
    return JsonResponse({"message": "Model successfully reverted."})


# Computes the accuracy of the old and new models (0-1) and returns them.
@require_http_methods(["GET"])
def get_accuracy_score(request):
    # Call the test_model function
    old_model_accuracy = test_model(True)
    new_model_accuracy = test_model(False)

    # Return the accuracy in the response
    return JsonResponse(list([old_model_accuracy, new_model_accuracy]), safe=False)


# Allows users of the extension to create User reports, which flag sentiments as incorrect.
# User Reports are listed in the Admin UI and acted upon by the administrators, who either accept
# or deny the user report (PUT). If a data point is modified, the model becomes stale.
@require_http_methods(["GET", "POST", "PUT"])
def handle_user_reports(request):
    global model_status
    # Handle get all case
    if request.method == "GET":

        def user_report_mapper(report_entry):
            return {
                "id": report_entry["pk"],
                "text": report_entry["fields"]["text"],
                "sentiment": report_entry["fields"]["sentiment"],
            }

        user_reports = serialize("python", UserReport.objects.all())
        user_reports = list(map(user_report_mapper, user_reports))

        return JsonResponse(user_reports, status=200, safe=False)
    # Non-GET request. Parse body
    try:
        body = json.loads(request.body)
        text = body.get("text", None)
        sentiment = body.get("sentiment", None)
        accept = body.get("accept", None)

        # Handle the approval and denial of user reports
        if request.method == "PUT":
            if text is None:
                return JsonResponse({"error": '"text" is required.'}, status=400)
            if accept is None:
                return JsonResponse({"error": '"accept" is required.'}, status=400)
            if sentiment is None and accept:
                return JsonResponse(
                    {"message": '"sentiment" is required when "accept" is "true".'}
                )

            report = UserReport.objects.get(text=text)

            # Remove from reports and add to entries
            if accept:
                existing_report = SentimentEntry.objects.all().filter(text=text).first()
                model_status = "stale"

                if existing_report is None:
                    SentimentEntry.objects.create(text=text, sentiment=sentiment).save()
                else:
                    existing_report.sentiment = sentiment
                    existing_report.save()

            report.delete()

            return JsonResponse(
                {"message": f'Report "{text}" {"accepted" if accept else "denied"}.'}
            )

        if request.method == "POST":
            if text is None:
                return JsonResponse({"error": '"text" is required.'}, status=400)

            if sentiment is None:
                return JsonResponse({"error": '"sentiment" is required'}, status=400)

            if len(list(UserReport.objects.filter(text=text))) == 1:
                return JsonResponse(
                    {"error": f'Unable to create "{text}" as it already exists.'},
                    status=400,
                )

            UserReport.objects.create(text=text, sentiment=sentiment).save()

            return JsonResponse({"message": f'Report created for "{text}".'})

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON."}, status=400)
    except UserReport.DoesNotExist:
        return JsonResponse(
            {
                "error": f'Unable to modify "{text}" as it has not been registered as a report.'
            },
            status=404,
        )


# Uses LIME's Explainable AI API to explain the impact of words on each possible sentiment.
# The response contains an HTML document representing the report
@require_http_methods(["POST"])
def explain_text(request):
    try:
        models = joblib.load(PATH_TO_MODEL)
        model = models["model"]
        request_data = json.loads(request.body)
        text_instance = request_data["text"]

        # classes are the sentiments
        class_names = model.classes_.tolist()
        explainer = LimeTextExplainer(class_names=class_names)

        # Explanation with 5 feature(words)
        exp = explainer.explain_instance(text_instance, predict_proba, num_features=5)

        # Convert the explanation to HTML
        explanation_html = exp.as_html()

        return HttpResponse(explanation_html, content_type="text/html")

    except Exception as e:
        traceback.print_exc()
        return HttpResponse("Error occurred: " + str(e), status=500)


def thread_safe_train_model():
    global model_status
    try:
        train_model_logic()
        model_status = "good"
        print("Model successfully retrained")
    except Exception as e:
        model_status = "stale"
        print(f"Error during training: {e}")

from .sentiment.model import preprocess_and_predict
from django.http.response import JsonResponse


def get_sentiment(request):
    if request.method != "POST":
        return JsonResponse(
            {"error": "Only POST requests are supported for this endpoint"},
            status_code=405,
        )

    analyzable_text = request.body

    sentiment = preprocess_and_predict(analyzable_text)

    return JsonResponse({"sentiment": sentiment})

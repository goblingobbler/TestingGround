import django
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse, HttpResponseForbidden
from django.views.decorators.clickjacking import xframe_options_exempt


def CSRFMiddlewareToken(request):
    # Gather context and send it to React
    csrfmiddlewaretoken = django.middleware.csrf.get_token(request)

    context = {
        "csrfmiddlewaretoken": csrfmiddlewaretoken,
    }

    return JsonResponse(context, status=200)


@xframe_options_exempt
def Index(request):
    if "HTTP_HOST" not in request.META:
        return HttpResponseForbidden()

    if request.META["HTTP_HOST"] == "localhost:8000":
        return HttpResponse("You are on development.  Please use localhost:3000")

    return render(request, "index.html", {})

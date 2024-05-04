import logging


def handle_get_or_set_request(request, model, id=None, list_query=None):
    if request.method == "GET":
        if id:
            object = model.objects.get(id=id)
            json_response = object.to_json()
        else:
            objects = list_query.filter(active=True)

            json_response = []
            for object in objects.all():
                json_response.append(object.to_json())

    elif request.method == "POST":
        json_data = request.data
        json_data["active"] = True

        logging.debug(json_data)

        if id:
            object = model.objects.get(id=id)
            for key in json_data:
                setattr(object, key, json_data[key])
            object.save()

        else:
            object = model.objects.create(**json_data)

        json_response = object.to_json()

    elif request.method == "DELETE":
        object = model.objects.get(id=id)
        object.active = False
        object.save()

        json_response = {}

    return json_response

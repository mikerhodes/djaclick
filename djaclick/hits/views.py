from django.shortcuts import render
from django.http import JsonResponse

import clickhouse_connect


def index(request):
    context = {
        "latest_question_list": "foo",
    }
    return render(request, "hits/index.html", context)

def timeseries(request):
    client = clickhouse_connect.get_client(
        host="localhost", port=8123)

    QUERY = """
    SELECT
        toStartOfInterval(ts, toIntervalMinute(1)) AS h,
        count(status)
    FROM hits
    GROUP BY h
    ORDER BY h ASC
    LIMIT 100
    """

    result = client.query(QUERY)

    return JsonResponse({"data": [{"ts": x[0], "count": x[1]} for x in result.result_rows]})
    
   

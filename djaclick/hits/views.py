from django.shortcuts import render
from django.http import JsonResponse

import clickhouse_connect

LABEL_COL = 2
TS_COL = 0
COUNT_COL = 1


def index(request):
    context = {}
    return render(request, "hits/index.html", context)


def timeseries(request):
    # Check for groupby in the query string and check it is valid
    group_by = request.GET.get("groupby")
    if group_by is not None:
        if group_by not in ["'all'", "method", "status", "path"]:
            return JsonResponse({"ok": False, "reason": "bad groupby"}, status=400)
    else:
        # use a static string for grouping, to allow query to return the
        # same result shape for simpler processing
        group_by = "'all'"

    # Group hits into 5s boundaries. Only get upto now-10s to avoid the
    # last point being incompletely counted
    client = clickhouse_connect.get_client(host="localhost", port=8123)
    QUERY = """
        SELECT
            toStartOfInterval(ts, toIntervalSecond(5)) AS h,
            count(*), {0}
        FROM hits
        WHERE h > subtractMinutes(now(), 5) AND h < subtractSeconds(now(), 10)
        GROUP BY h, {0}
        ORDER BY h DESC
    """.format(  # Not great, but we check for valid values above, so safe.
        group_by
    )
    result = client.query(QUERY)

    # The rows are interleaved for the groupby due to the order by;
    # create a series for each value of groupby before returning
    series = {}
    for row in result.result_rows:
        points = series.setdefault(row[LABEL_COL], [])
        points.append({"ts": row[TS_COL], "count": row[COUNT_COL]})
    return JsonResponse(
        {"ok": True, "series": [{"label": k, "data": v} for k, v in series.items()]}
    )

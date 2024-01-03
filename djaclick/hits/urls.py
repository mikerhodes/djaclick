from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("timeseries", views.timeseries, name="timeseries"),
]

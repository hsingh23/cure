from django.db import models

class Website(models.Model):
    url = models.CharField(max_length=1000)
    json_url = models.CharField(max_length=1000)
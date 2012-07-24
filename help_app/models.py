from django.db import models

class Website_JSON(models.Model):
    key_word = models.CharField(max_length=1000, db_index=True)
    initial_json = models.TextField()

class Website_URL(models.Model):
    key_word = models.CharField(max_length=1000, db_index=True)
    initial_url = models.CharField(max_length=2000)
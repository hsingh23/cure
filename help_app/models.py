from django.db import models

class Website(models.Model):
    key_word = models.CharField(max_length=1000, db_index=True)
    initial_json = models.TextField()
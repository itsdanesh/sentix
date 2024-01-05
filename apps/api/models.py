from django.db import models


# Our data set
class SentimentEntry(models.Model):
    text = models.CharField(max_length=1000)
    sentiment = models.CharField(max_length=20)


# Test data has same schema, but it is hard-coded
class SentimentEntryTest(models.Model):
    text = models.CharField(max_length=1000)
    sentiment = models.CharField(max_length=20)


# User reports (submitted through from extension) referencing faulty sentiment entry
class UserReport(models.Model):
    text = models.CharField(max_length=1000)
    sentiment = models.CharField(max_length=20)

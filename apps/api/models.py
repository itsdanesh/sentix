from django.db import models

# Our data set
class SentimentEntry(models.Model):
  text = models.CharField(max_length=1000)
  sentiment = models.CharField(max_length=20)

class SentimentEntryTest(models.Model):
  text = models.CharField(max_length=1000)
  sentiment = models.CharField(max_length=20)

# User reports (made from extension) referencing faulty sentiment entry
class UserReport(models.Model):
  text = models.CharField(max_length=1000)
  sentiment = models.CharField(max_length=20)


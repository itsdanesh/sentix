# Generated by Django 4.2.7 on 2023-12-10 12:37

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="userreport",
            name="sentiment",
            field=models.CharField(default=1, max_length=20),
            preserve_default=False,
        ),
    ]

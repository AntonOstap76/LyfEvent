# Generated by Django 5.1.4 on 2025-01-04 21:30

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='chatgroup',
            name='event',
        ),
        migrations.RemoveField(
            model_name='chatgroup',
            name='users_online',
        ),
    ]
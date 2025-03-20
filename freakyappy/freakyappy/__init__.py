from __future__ import absolute_import, unicode_literals


 # Ensures Django is initialized before Celery starts

from .celery import app as celery_app

__all__ = ('celery_app',)

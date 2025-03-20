from celery import shared_task
from django.utils import timezone
from .models import Event
import logging
from datetime import timedelta

logger = logging.getLogger(__name__)

@shared_task
def delete_expired_events():
    logger.info("Started deleting expired events.")
    
    expired_events = Event.objects.filter(date__lt=timezone.now() - timedelta(minutes=1))
    logger.info(f"Found {len(expired_events)} expired events.")
    
    if not expired_events.exists():
        logger.info("No expired events to delete.")
        return "No expired events to delete."
    
    try:
        deleted_count, _ = expired_events.delete()
        logger.info(f"Deleted {deleted_count} expired events.")
        return f"Deleted {deleted_count} expired events."
    except ValueError as e:
        logger.error(f"Error during deletion: {e}")
        return f"Error during deletion: {e}"
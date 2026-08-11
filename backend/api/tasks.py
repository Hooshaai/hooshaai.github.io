import logging
from celery import shared_task
from django.core.management import call_command

logger = logging.getLogger(__name__)


@shared_task(name="api.tasks.sync_substack_rss_task")
def sync_substack_rss_task(url='https://hoosha.substack.com/feed', limit=20, author='admin'):
    """
    Celery task to auto-fetch Substack RSS items directly into the database.
    Can be scheduled periodically using Celery Beat.
    """
    logger.info(f"Starting background Substack RSS sync for URL: {url}")
    try:
        call_command('sync_substack', url=url, limit=limit, author=author)
        logger.info("Background Substack RSS sync completed successfully.")
        return {"status": "success", "url": url, "limit": limit}
    except Exception as e:
        logger.error(f"Error in background Substack RSS sync task: {e}")
        return {"status": "error", "error": str(e)}

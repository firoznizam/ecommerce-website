#!/usr/bin/env python
"""
Diagnostic utility to verify PostgreSQL connectivity for Django.
"""
import os
import sys
from pathlib import Path

# Add backend directory and apps directory to sys.path
base_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(base_dir))
sys.path.insert(0, str(base_dir / 'apps'))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

try:
    import django
    django.setup()
    from django.db import connections
    from django.db.utils import OperationalError, ImproperlyConfigured
except ImportError as e:
    print(f"Error importing Django or dependencies: {e}")
    sys.exit(1)


def test_connection():
    db_name = os.environ.get('DB_NAME')
    db_user = os.environ.get('DB_USER')
    db_host = os.environ.get('DB_HOST')
    db_port = os.environ.get('DB_PORT')

    print("=" * 60)
    print("PostgreSQL Database Connection Diagnostic")
    print("=" * 60)
    print(f"DB_NAME     : {db_name or '(not set)'}")
    print(f"DB_USER     : {db_user or '(not set)'}")
    print(f"DB_HOST     : {db_host or '(not set)'}")
    print(f"DB_PORT     : {db_port or '(not set)'}")
    print(f"DB_PASSWORD : {'******' if os.environ.get('DB_PASSWORD') else '(not set)'}")
    print("-" * 60)

    if not db_name or not db_user:
        print("Status: FAILED - Missing required environment variables.")
        print("Please configure DB_NAME and DB_USER in your environment or backend/.env file.")
        return False

    try:
        connection = connections['default']
        with connection.cursor() as cursor:
            cursor.execute("SELECT version();")
            version = cursor.fetchone()
            print("Status: SUCCESS - Connected to PostgreSQL successfully!")
            print(f"PostgreSQL Version: {version[0]}")
            return True
    except OperationalError as err:
        print("Status: FAILED - Could not connect to PostgreSQL server.")
        print(f"Details: {err}")
        return False
    except ImproperlyConfigured as err:
        print("Status: FAILED - Database configuration error.")
        print(f"Details: {err}")
        return False
    except Exception as err:
        print(f"Status: FAILED - Unexpected error: {type(err).__name__}: {err}")
        return False


if __name__ == '__main__':
    success = test_connection()
    sys.exit(0 if success else 1)

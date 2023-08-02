import os
from os.path import join, dirname
from dotenv import load_dotenv

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)

LINKDIEN_PASSWORD = os.environ.get("LINKDIEN_PASSWORD")
HASURA_ADMIN_KEY = os.environ.get("HASURA_ADMIN_KEY")

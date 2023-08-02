import requests
import json

def getAllReservists(): 
  headers = {
      'authority': 'innocent-lemming-13.hasura.app',
      'origin': 'https://cloud.hasura.io',
      'referer': 'https://cloud.hasura.io/',
      'x-hasura-admin-secret': 'zmqjascyz7YrkFric7zip7QHF0ZQaeODUkm6N1vpLi3ckPvKfuO64j3QOM0uhPbh'
  }

  json_data = {
      'query': '''query reservists {
        reservists {
          id
          linkedin_url
          name
          linkedin_name
          }
        }''',
      'variables': None,
      'operationName': 'reservists',
  }

  response = requests.post('https://innocent-lemming-13.hasura.app/v1/graphql', headers=headers, json=json_data);
  x = json.loads(response._content)
  
  reservists = x['data']['reservists']

  return reservists
from linkedin_api import Linkedin
from apscheduler.schedulers.blocking import BlockingScheduler
import logging
import requests
import datetime
import json
from dotenv import load_dotenv
from settings import HASURA_ADMIN_KEY, LINKDIEN_PASSWORD

# Authenticate using any Linkedin account credentials

skills = [
    {"name": "Software Development"},
    {"name": "Web Development"},
    {"name": "Android Development"},
    {"name": "OOP"},
    {"name": "Android"},
    {"name": "Microsoft Azure"},
    {"name": ".NET Framework"},
    {"name": "JavaScript"},
    {"name": "SQL"},
    {"name": "MongoDB"},
    {"name": "C#"},
    {"name": "Java"},
    {"name": "Git"},
    {"name": "C++"},
    {"name": "C"},
]
# education = profile['education']
api = Linkedin("alon2.gold2022@gmail.com", LINKDIEN_PASSWORD)
uri = "https://innocent-lemming-13.hasura.app/v1/graphql"
headers = {
    "authority": "innocent-lemming-13.hasura.app",
    "origin": "https://cloud.hasura.io",
    "referer": "https://cloud.hasura.io/",
    "x-hasura-admin-secret": HASURA_ADMIN_KEY,
}


def track_experiences(reservist_id, experiences):
    experience_objects = [
        {
            "reservist_id": reservist_id,
            "start_date": json.dumps(datetime.datetime(
                exp[index]["timePeriod"]["startDate"]["year"],
                exp[index]["timePeriod"]["startDate"]["month"],
                1
            ), default=str),
            "end_date": json.dumps(datetime.datetime(
                exp[index]["timePeriod"]["endDate"]["year"],
                exp[index]["timePeriod"]["endDate"]["month"],
                1
            ), default=str)
            if hasattr(exp[index]["timePeriod"], 'endDate')
            else None,
            "company": exp[index]["companyName"],
            "role": exp[index]["title"],
        }
        for index, exp in enumerate(experiences)
    ]

    json_data = {
        "query": """mutation add_experience_for_reservist($experiences: [experiences_insert_input!]!){
        insert_experiences(objects: $experiences, on_conflict: {constraint: experiences_pkey, update_columns: []})
        {
          affected_rows
        }
      }""",
        "variables": {
            "experiences": experience_objects,
        },
        "operationName": "add_experience_for_reservist",
    }
    return requests.post(uri, headers=headers, json=json_data)


def track_skills(reservist_id, skills):
    skill_objects = [
        {
            "name": skill["name"],
            "reservist_id": reservist_id,
            "score": 30
        }
        for skill in skills
    ]

    json_data = {
        "query": """mutation add_skills_for_reservist($skills: [skills_insert_input!]!){
        insert_skills(objects: $skills, , on_conflict: {constraint: skills_pkey, update_columns: []})
        {
          affected_rows
        }
      }""",
        "variables": {
            "skills": skill_objects,
        },
        "operationName": "add_skills_for_reservist",
    }

    return requests.post(uri, headers=headers, json=json_data)

def updateLastUpdateDate(reservist_id):
  json_data = {
    "query": """mutation update_reservists($last_update_date: timestamptz!, $reservist_id: uuid!) {
    update_reservists(_set: {last_update_date: $last_update_date}, where: {id: {_eq: $reservist_id}}) {
      affected_rows
    }
  }""",
    "variables": {
        "last_update_date": json.dumps(datetime.datetime.now(), default=str),
        "reservist_id": reservist_id
    }
  }
  return requests.post(uri, headers=headers, json=json_data)

def track(reservist_linked_in_id, reservist_id):
    profile = api.get_profile(reservist_linked_in_id)
    skills = api.get_profile_skills(profile['profile_id'])
    experiences = profile['experience']
    exp_res = track_experiences(
        reservist_id, experiences
    )
    affected_exp = exp_res.json()['data']['insert_experiences']['affected_rows']
    
    skills_res = track_skills(
      reservist_id, skills
    )
    affected_skills = skills_res.json()['data']['insert_skills']['affected_rows']
    logging.info(f"skills { affected_skills }")
    logging.info(f"exp { affected_exp }")
    if affected_skills > 0 or affected_exp > 0:
      updateLastUpdateDate(reservist_id)      

experiences = [
        {
            "entityUrn": "urn:li:fs_position:(ACoAAB0wFtEBBwZNy8Q4O21DDXWAUfR3rSJTWpc, 1750879016)",
            "companyName": "Israel Defense Forces",
            "timePeriod": {
                "startDate": {
                    "month": 1,
                    "year": 2021
                }
            },
            "company": {
                "employeeCountRange": {
                    "start": 10001
                },
                "industries": [
                    "Military"
                ]
            },
            "title": "Principal Software Engineer",
            "companyUrn": "urn:li:fs_miniCompany: 11689046",
            "companyLogoUrl": "https: //media-exp1.licdn.com/dms/image/C4E0BAQEuJw0RKhm2sA/company-logo_"
        },
        {
            "entityUrn": "urn:li:fs_position:(ACoAAB0wFtEBBwZNy8Q4O21DDXWAUfR3rSJTWpc,1654682043)",
            "companyName": "Israel Defense Forces",
            "timePeriod": {
                "endDate": {
                    "month": 3,
                    "year": 2021
                },
                "startDate": {
                    "month": 3,
                    "year": 2020
                }
            },
            "company": {
                "employeeCountRange": {
                    "start": 10001
                },
                "industries": [
                    "Military"
                ]
            },
            "title": "Development Team Lead",
            "companyUrn": "urn:li:fs_miniCompany: 11689046",
            "companyLogoUrl": "https: //media-exp1.licdn.com/dms/image/C4E0BAQEuJw0RKhm2sA/company-logo_"
        },
        {
            "entityUrn": "urn:li:fs_position:(ACoAAB0wFtEBBwZNy8Q4O21DDXWAUfR3rSJTWpc,1336936562)",
            "companyName": "Israel Defense Forces",
            "timePeriod": {
                "endDate": {
                    "month": 1,
                    "year": 2021
                },
                "startDate": {
                    "month": 9,
                    "year": 2017
                }
            },
            "company": {
                "employeeCountRange": {
                    "start": 10001
                },
                "industries": [
                    "Military"
                ]
            },
            "title": "Full Stack Developer",
            "companyUrn": "urn:li:fs_miniCompany:11689046",
            "companyLogoUrl": "https://media-exp1.licdn.com/dms/image/C4E0BAQEuJw0RKhm2sA/company-logo_"
        },
        {
            "locationName": "Israel",
            "entityUrn": "urn:li:fs_position:(ACoAAB0wFtEBBwZNy8Q4O21DDXWAUfR3rSJTWpc,970233958)",
            "geoLocationName": "Israel",
            "companyName": "Holon Institute of Technology",
            "timePeriod": {
                "endDate": {
                    "month": 6,
                    "year": 2017
                },
                "startDate": {
                    "month": 12,
                    "year": 2016
                }
            },
            "description": "Programmer in research project collaborate with Tel Aviv Sourasky Medical Center,\ndevelop JAVA BackEnd with Spring, maven and PostgreSQL.",
            "company": {
                "employeeCountRange": {
                    "start": 1001,
                    "end": 5000
                },
                "industries": [
                    "Higher Education"
                ]
            },
            "title": "Web Developer",
            "companyUrn": "urn:li:fs_miniCompany:1546379",
            "companyLogoUrl": "https://media-exp1.licdn.com/dms/image/C4D0BAQFBJuk00bejQA/company-logo_"
        }
    ],
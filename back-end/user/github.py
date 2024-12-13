import requests
import json


class Github:
    def __init__(self, user_name, access_token):
        self.user_name = user_name
        self.access_token = access_token

    
    def list_repos(self):
        url = f"https://api.github.com/users/{self.user_name}/repos"
        data = {"type": "all", "sort": "full_name", "direction": "asc"}

        output = requests.get(url, data=json.dumps(data))
        output = json.loads(output.text)
        for i in output:
            print(i["name"])

        return output

from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
import os
import requests
import dotenv

dotenv.load_dotenv()

class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):
    def pre_social_login(self, request, sociallogin):
        """
        Redirect users to a custom success page after successful login.
        """
        code = request.GET.get("code")
        state = request.GET.get("state")
        print('in adapter', code, state)
        if code:
            client_id = os.environ.get('GITHUB_CLIENT_ID')
            client_secret = os.environ.get('GITHUB_CLIENT_SECRET')
            url = 'https://github.com/login/oauth/access_token'
            payload = {
                'client_id': client_id, 
                'client_secret': client_secret, 
                'code': code,
            }
            print(payload)
            headers = {'Accept': 'application/json'}
            response = requests.post(url, json=payload, headers=headers)

            print('response' , response.status_code, response.text)

            request.session['auth_code'] = response.text
            

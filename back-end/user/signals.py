# from allauth.socialaccount.signals import social_account_updated
# from django.dispatch import receiver
# from allauth.headless.tokens.base import AbstractTokenStrategy

# from dotenv import load_dotenv
# import requests
# import os

# load_dotenv()

# client_id =  str( os.environ.get('GITHUB_CLIENT_ID'))
# client_secret = str(os.environ.get('GITHUB_CLIENT_SECRET'))



# @receiver(social_account_updated)
# def fetch_github_data(sender, request, sociallogin, **kwargs):
#     social_account = sociallogin.account

#     if social_account and social_account.provider == 'github':
#         print('requesting tokens')
#         token_class = AbstractTokenStrategy()
#         access_token_payload = token_class.create_access_token_payload()
#         print(access_token_payload)
        
#         authorize = requests.get(url='https://github.com/login/oauth/authorize', params={'client_id': client_id})
#         print('resp', authorize.json())
#     else:
#         print("social account not found or not from Github")

    

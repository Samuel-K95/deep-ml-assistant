import requests


endpoint = 'http://localhost:8000/api/gemini/analyze/'

data = {
    'title' : 'Matrix times Vector (easy)',
    'problem'  : 'Write a Python function that takes the dot product of a matrix and a vector. return -1 if the matrix could not be dotted with the vector',
    'example': '''input: a = [[1,2],[2,4]], b = [1,2]
        output:[5, 10] 
        reasoning: 1*1 + 2*2 = 5;
                   1*2+ 2*4 = 10'''
}


getresponse = requests.post(endpoint, data=data)
print(getresponse.json())
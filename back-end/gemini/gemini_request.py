import google.generativeai as genai
from dotenv import load_dotenv
import os
import re

def get_json_response(data):
    pattern = r'```json\s*(\{.*\})\s*```'
    match = re.search(pattern, data, re.DOTALL)
    return match.group(1) if match else {}



load_dotenv()

api_key = os.environ.get('API_KEY')
genai.configure(api_key=api_key)
model = genai.GenerativeModel("gemini-1.5-flash")


def analyzeRequest(data):
    prompt = '''Analyze the following question ,which is displayed in the json format below, deeply and methodically using the Feynman Technique.
    Begin by clearly identifying and explaining the core concepts in simple terms, as if teaching someone with no prior knowledge of the subject. Use analogies,
    examples, or visual metaphors to reinforce understanding. Then, identify and address any gaps or uncertainties in the explanation,
    revisiting and refining the analysis until it is comprehensive. Finally, tie the explanation back to the principles of the Feynman Technique
    itself by demonstrating how breaking down and reconstructing the topic improves understanding. Deliver the insights and explanation in
    an advanced, well-structured JSON format. 
    Deliver the insights and explanation in the following structured JSON format every key should be structured in this exact way with no markup:
    {
        "core_concepts": {
            "explanation": "<Detailed explanation of core concepts>",
            "examples": ["<Example 1>", "<Example 2>"]
        },
        "gaps_identified": {
            "gaps": ["<Identified gap 1>", "<Identified gap 2>"],
            "solutions": ["<Solution to gap 1>", "<Solution to gap 2>"]
        },
        "feynman_analysis": {
            "breakdown": "<How the topic is broken down>",
            "reconstruction": "<How the understanding is reconstructed>",
            "lessons_learned": "<Key insights or lessons>"
        }
    }
    ''' + f''' the input data is: {data}'''

    response = model.generate_content(prompt)
    final_response = get_json_response(response.text)
    return final_response 

def debugRequest(data):
    prompt = '''
        Analyze the following code problem deeply and identify any potential issues or errors. Begin by understanding the core problem described in the problem field, reviewing the provided example,
        and then carefully examining the code field for logical or syntax errors. The errors field contains the errors the current code has, which resulted in  wrong answer. 
        the code is in html form so adjust it accordingly when you analyze it.
        Suggest possible solutions for fixing these issues and improving the code's overall quality, including clarifications on how the code works and its expected output.
        Provide explanations for each error found, focusing on simple and clear explanations that someone with minimal knowledge of the subject could understand.
        Suggest further improvements to prevent similar errors in the future, including best practices, error handling, or optimization techniques."
        Input Data: ''' + f'''{data}''' + '''
        the response should be in the following structure in json format with no markup
        {
            "debug_analysis": {
                "problem": "A concise description of the problem described in the 'problem' field.",
                "example": {
                "input": "Explanation of the example input provided and how it helps in debugging the issue.",
                "expected_output": "Explanation of the expected output and any discrepancies with what was actually observed."
                },
                "code": {
                "errors": [
                    {
                    "error": "Description of the error found in the code.",
                    "location": "Line number or area in the code where the issue was identified.",
                    "suggestion": "Suggestion for fixing the error."
                    }
                ],
                "possible_improvements": [
                    {
                    "improvement": "Description of any additional improvements that could be made to the code.",
                    "reason": "Explanation of why this change will improve the code."
                    }
                ]
                }
            }
            }
        '''
    response = model.generate_content(prompt)
    final_response = get_json_response(response.text)
    return final_response 
    




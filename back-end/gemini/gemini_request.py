import os
import re
from . import parser
import json
import google.generativeai as genai
from dotenv import load_dotenv
load_dotenv()

def get_json_response(data):
    pattern = r'```json\s*(\{.*\})\s*```'
    match = re.search(pattern, data, re.DOTALL)
    return match.group(1) if match else {}


api_key = os.environ.get('API')
genai.configure(api_key=api_key)
model = genai.GenerativeModel("gemini-1.5-flash")


def analyzeRequest(data):
    prompt = '''Analyze the following question (in JSON format) using the Feynman Technique. Break it down into simple terms, explaining the core
      concepts as if teaching a beginner. Use analogies, examples, or metaphors to clarify. Address uncertainties by refining the explanation until it’s complete. 
      Conclude by demonstrating how applying the Feynman Technique deepened understanding. Deliver your analysis in a clear, short, and structured JSON format.
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
        Analyze the given problem from Deep-ML, focusing on identifying and resolving issues. Review the problem field for context, the example field for clarity, 
        and the code field (in HTML format) for logical or syntax errors. The errors field lists problems that caused incorrect results.
        Provide concise solutions to fix these errors and improve code quality, explaining each issue clearly and simply. Ensure the response is 
        brief, clear, and actionable, including best practices and optimizations to prevent 
        future errors.''' + f''' The input data is: {data}''' + '''

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
    parsed_code = parser.html_parser(data['code'])
    response = model.generate_content(prompt)
    final_response = get_json_response(response.text)
    dict_final = json.loads(final_response)
    dict_final['parsed_code'] = parsed_code
    return json.dumps(dict_final)
    




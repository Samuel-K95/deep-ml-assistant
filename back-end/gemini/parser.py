from bs4 import BeautifulSoup as bs

def html_parser(html_text):
    soup = bs(html_text, "html.parser")
    mirror = soup.find('div', {"class":'CodeMirror-code'})
    ma = mirror.findChildren("div")
    lines = [m.text[1:] for m in ma]
    final  = []
    for line in lines:
        if len(line) >= 1:
            final.append(line)
    
    return final



        

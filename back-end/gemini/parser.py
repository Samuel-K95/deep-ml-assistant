from bs4 import BeautifulSoup as bs

def html_parser(html_text):
    if not html_text:
        return ""
    soup = bs(html_text, "html.parser")
    mirror = soup.find('div', {"class":'view-lines'})
    ma = mirror.findChildren("div")
    lines = [m.text[1:] for m in ma]
    final  = []
    for line in lines:
        if len(line) >= 1:
            final.append(line)
    
    fin = '\n'.join(final)
    print('fin', fin)
    
    
    return final



        

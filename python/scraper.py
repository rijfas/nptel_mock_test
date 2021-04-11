from bs4 import BeautifulSoup
from json import dumps
from time import sleep
from os import system
from sys import platform

class Question:
    def __init__(self, question_text, options, answer):
        self.question_text = question_text
        self.type = 'SINGLE' if len(answer) > 1 else 'MULTIPLE'
        self.options = options
        self.answer = answer

    def add_option(self, option):
        self.options.append(option)

    def get_dict(self):
        return {
            'text' : self.question_text,
            'type' : self.type,
            'options' : self.options,
            'answers' : self.answer,
        }

def check_clear():
    if platform == "linux" or platform == "linux2":
        system('clear')
    elif platform == "win32":
        system('cls')

check_clear()
print('''
    NPTEL SCRAPER
    v 1.2
    rijfas_
''')
sleep(2)
check_clear()
print('''
        STARTING SCRAPE FOR data/html
''')
sleep(1)
check_clear()
for file_no in range(1,13):
    print(f'file {file_no}/12 files')
    print(f'LOG: READING_FILE : data/html/week_{file_no}.html ')
    with open(f'data/html/week_{file_no}.html') as data:
        page = BeautifulSoup(data.read(), 'html.parser')
        questions = []
        for question in page.select('div.qt-mc-question'):
            for text in question.select('div.qt-question'):
                questions.append(Question('\n'.join(list(text.strings)), [option.get_text().strip() for option in question.select('div.gcb-mcq-choice label')], [answer.get_text().strip() for answer in question.select('div.faculty-answer label')]))

    print(f'LOG: READING FILE data/html/week_{file_no}.html Done.√')

    print(f'LOG: WRTING FILE week_{file_no}.json')
    with open(f'data/json/week_{file_no}.json', 'w') as output_file:
        output_file.write(dumps([question.get_dict() for question in questions], indent=5) )
    print(f'LOG: WRTING FILE : data/json/week_{file_no}.json Done.√')
    sleep(0.5)
    check_clear()
print('Scrape Completed.√')
sleep(0.5)

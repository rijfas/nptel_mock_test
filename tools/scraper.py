'''
    Author: Rijfas
    Date: 11/04/2021
    written in 30 mins, so don't expect standards(^-')
'''
from bs4 import BeautifulSoup
from json import dumps
from time import sleep
from os import system, sep
from sys import platform
from re import sub

# Change week according to course duration
WEEKS = 12
class Question:
    def __init__(self, question_text, options, answer):
        self.question_text = question_text
        self.type = 'MULTIPLE' if len(answer) > 1 else 'SINGLE'
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
print(f'''
        STARTING SCRAPE FOR data{sep}html
''')
sleep(1)
check_clear()
for file_no in range(1,WEEKS+1):
    print(f'file {file_no}/{WEEKS} files')
    print(f'LOG: READING_FILE : data{sep}html{sep}week_{file_no}.html ')
    with open(f'data{sep}html{sep}week_{file_no}.html') as data:
        page = BeautifulSoup(data.read(), 'html.parser')
        questions = []
        for question in page.select('div.qt-mc-question'):
            for text in question.select('div.qt-question'):
                questions.append(Question(sub('\s{2,}', ' ','\n'.join(list(text.strings))), [option.get_text().strip() for option in question.select('div.gcb-mcq-choice label')], [answer.get_text().strip() for answer in question.select('div.faculty-answer label')]))

    print(f'LOG: READING FILE data{sep}html{sep}week_{file_no}.html Done.√')

    print(f'LOG: WRTING FILE data{sep}json{sep}week_{file_no}.json')
    with open(f'data{sep}json{sep}week_{file_no}.json', 'w') as output_file:
        output_file.write(dumps([question.get_dict() for question in questions], indent=5) )
    print(f'LOG: WRTING FILE : data{sep}json{sep}week_{file_no}.json Done.√')
    sleep(0.5)
    check_clear()
print('Scrape Completed.√')
sleep(0.5)


from bs4 import BeautifulSoup #library to scan Web
import requests #library to make http method
import urllib3
import re #regex
import datetime
from spellchecker import SpellChecker
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
from googleapiclient.discovery import build
import json
import lxml
import random

def getAllWords():
    r = requests.get(url="https://englishmaster.icu:9000/admin")
    words_inDatabase = r.json()
    words = []
    for word in words_inDatabase:
        words.append(word["word"])
    return words

def getWrongWords():
    r = requests.get(url="https://englishmaster.icu:9000/wrongWord")
    words_inDatabase = r.json()
    words = []
    for word in words_inDatabase:
        words.append(word["word"])
    return words

def linkExplore(url):
    response = requests.get(url)
    data = response.text
    soup = BeautifulSoup(data, "html.parser")
    tags = soup.find_all('a')
    links = []
    for tag in tags:
        try:
            if('"source"' in tag.get('href')):
                continue
            if("://" in tag.get('href')):
                # print(tag.get('href'))
                links.append(tag.get('href'))
            else:
                # print(url + tag.get('href'))
                links.append(url + tag.get('href'))
        except:
            print("Nothing")
    firstLink = links[0]
    random.shuffle(links)
    links[0] = firstLink
    return links

def scanWeb(words_list, link):
    http = urllib3.PoolManager()
    response = http.request('GET', link)
    soup = BeautifulSoup(response.data, "html.parser")
    for script in soup(["script", "style"]):
        script.extract()  # rip it out
    text = soup.get_text()
    lines = (line.strip() for line in text.splitlines())
    chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
    text = '\n'.join(chunk for chunk in chunks if chunk)

    words = re.split('[^a-zA-Z]', text)

    spell = SpellChecker()

    for i in range(len(words)):
        if (len(words[i]) < 3 or len(spell.known([words[i]])) == 0 or words[1].isupper()): continue
        words_list.append(words[i].lower())

    words_list = list(set(words_list))
    new_words_list = []

    for i in range(len(words_list)):
        if(i != 0 ):
            if(words_list[i-1] + "s" == words_list[i] or words_list[i-1] + "es" == words_list[i]):
                continue
            # if( (words_list[i-1] + "s") == words_list[i]):
            #
        new_words_list.append(words_list[i])
    return new_words_list


def translate(service, word):

    translated_words = service.translations().list(
        source='en',
        target='vi',
        q= word
    ).execute()
    return translated_words['translations'][0]['translatedText']

def oxfordApi(word, app_id, app_key):
    word_id =  word
    url = 'https://od-api.oxforddictionaries.com:443/api/v1/entries/en/' + word_id.lower() + '/synonyms'
    r = requests.get(url, headers={'app_id': app_id, 'app_key': app_key})

    example1 = json.dumps(r.json()["results"][0]["lexicalEntries"][0]["entries"][0]["senses"][0]["examples"][0]["text"])
    example2 = ""

    try:
        example2 = json.dumps(r.json()["results"][0]["lexicalEntries"][0]["entries"][0]["senses"][1]["examples"][0]["text"])
    except:
        print("Cannot find emxaple 2 of the word: " + word + ". This word only have 1 example")

    synonyms_list = r.json()["results"][0]["lexicalEntries"][0]["entries"][0]["senses"][0]["synonyms"]

    synonyms = synonyms_list[0]["text"]

    return example1[1:-1], example2[1:-1], synonyms

def insert_toDatabase(word, vietnamese, synonyms, example1, example2):
    payload = {"word": word,
               "vietnamese": vietnamese,
               "similar_word": synonyms,
               "ex1": example1,
               "ex2": example2}
    headers = {'content-type': 'application/json'}

    r = requests.post(url="https://englishmaster.icu:9000/words", data=json.dumps(payload), headers=headers)

    pastebin_url = r.text
    print(pastebin_url + ": " + word)

def insertWrongWord(word):
    payload = {"word": word}
    headers = {'content-type': 'application/json'}

    r = requests.post(url="https://englishmaster.icu:9000/wrongWord", data=json.dumps(payload), headers=headers)

    pastebin_url = r.text
    print(pastebin_url + ": " + word)

def lambda_handler(event, context):
    now = datetime.datetime.now().weekday()

    webs = [
            "http://sherwoodschool.ru/vocabula/proficiency/",
            "http://www.manythings.org/voa/words.htm",
            "https://www.theguardian.com/international",
            "http://sherwoodschool.ru/vocabula/proficiency/",
            "http://frequencylists.blogspot.com/2016/01/the-2980-most-frequently-used-german.html",
            "https://www.wordfrequency.info/free.asp?s=y",
            "https://www.wsj.com/asia"
            ]

    scannedWeb = webs[now]
    print("Link: " + scannedWeb)
    links = linkExplore(scannedWeb)

    link_counts = 0
    words_list = []
    for link in links:
     try:
         words_list = scanWeb(words_list, link)
         link_counts += 1
     except:
         continue
     print(words_list)
     print(len(words_list))
     if(len(words_list) > 10000 or link_counts == 20): break

    wrongWords_inDatabase = getWrongWords()
    words_inDatabase = getAllWords()
    new_wordList = []
    for word in words_list:
        if (word not in wrongWords_inDatabase and word not in words_inDatabase):
            new_wordList.append(word)

    words_list = new_wordList

    random.shuffle(words_list)
   # **************** Translate, find example, insert to database ****************
    service = build('translate', 'v2', developerKey='AIzaSyBzIkPca4NK0KmRHPbOMeYUvbziGCxLCsE')


    nb_addedWords = 0
    # words_list = ["do", "go", "get","set","make","understand", "easy"]

    oxford_id_list = ["f7a9e99b", "480bd3f3", "0a0fd414"]
    oxford_key_list = ["4ab2b21c5873c35db309c24d04a89078", "863afd191c1828b6e2995b3dd2647155", "0a0fd414"]
    app_id = None
    app_key = None
    for i in range(len(oxford_id_list)):
        try:
            oxfordApi("cat", oxford_id_list[i], oxford_key_list[i])
            app_id = oxford_id_list[i]
            app_key = oxford_key_list[i]
        except:
            continue

    print(app_id)

    if(app_id != None):
        for word in words_list:
           print("Processing: " + word)

           ex1 = ex2 = synonyms = ""
           try:
               ex1, ex2, synonyms = oxfordApi(word, app_id, app_key)
           except:
               insertWrongWord(word)
               continue
           vietnamese = translate(service, word)
           if (vietnamese == word):
               insertWrongWord(word)
               continue

           nb_addedWords += 1
           print("added: " + str(nb_addedWords))
           insert_toDatabase(word, vietnamese, synonyms, ex1, ex2)
           print()

        print(nb_addedWords)

lambda_handler("a", "b")
# **************** Scan Web ****************


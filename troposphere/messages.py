# Small layer on top of djanog.contrib.message to store arbitrary pickleable
# data on the session to be made available for *only* the next request
import pickle
from django.contrib import messages

def add_message(request, message):
    messages.info(request, pickle.dumps(message)) 

def get_messages(request):
    for msg in messages.get_messages(request):
        yield pickle.loads(msg.message)

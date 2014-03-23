from django.http import HttpResponse
from django.shortcuts import render, redirect

def root(request):
    return redirect('application')

def application(request):
    context = {}
    return render(request, 'application.html', context)

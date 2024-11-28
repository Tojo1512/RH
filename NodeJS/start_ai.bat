@echo off
start powershell -Command "ollama serve"
timeout /t 2
node server.js

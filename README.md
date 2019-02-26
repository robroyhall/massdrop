# Massdrop Coding Test

## Setup
1. Download the repository
2. Install libcurl (ex. ```sudo apt-get install libcurl4-nss-dev```)
3. Run ```npm install``` at the top level repository folder
1. Run ```node ./src/api.js``` at the top level repository folder
2. In a separate shell, run ```node ./src/batch.js``` at the top level repository folder

## Usage
3. Visit http://localhost:8000/url/fetch?address=xxx to submit a job (ex. http://localhost:8000/url/fetch?address=http://www.google.com/)
4. Visit http://localhost:8000/url/results?id=xxx to check the status of a job using the ID returned from step 3 (ex. http://localhost:8000/url/results?id=150)

# Dependecy Analizer
Problem: 
There is a list of websites in a file (websites.csv), and we need to know the js dependencies for each website. Websites’ html content will be available from two sources, one from the local file system and the other one using http resources.
 
E.g.:
Trello, ~/trello/index.html
Clarin, ~/clarin/index.html
La Nacion, https://www.lanacion.com.ar/index.html
Facebook, https://www.facebook.com/index.html


Expected result:
1- Length
Retrieve the list of results containing the website name and the content length( in bytes)

Output example:
Trello, 20032
La Nación, 32323
...

2.1- Dependencies
Retrieve the list of results containing the website name and the dependencies

Output example:
Trello, analytics.js
Trello, bootstrap.js
La Nación, analytics.js
La Nación, d3.js
...

2.2 - Frequency
Retrieve the dependencies and the frequency occurrences:

Output example:
analytics.js, 8
d3.js, 2
bootstrap.js, 3
…


Technologies:

The solution should be implemented in NodeJS

Expected deliverables:

The code should be uploaded in a git repository (preferably GitHub).
We need instructions on how to execute the application.

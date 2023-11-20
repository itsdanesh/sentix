# Sentix

Sentix is a sentiment analysis tool in the form of a browser extension. It analyses text on web pages and highlights it, based on its sentiment rating (negative, neutral, or positive).  

The model can be re-trained and grown manually from the Admin interface, to which only a limited set of credentials is granted access to.

Future ideas:

- setting a threshold for sentiment and doing something with it based on user input
  - hide, black-out, or let user provide custom CSS
- Reporting false sentiment output, which can be reviewed from admins side
- For now only twitter supported, but add support for other platforms (like twitch, amazon etc)

## Platforms

The browser extension is supported on:

- Google Chrome
- More if portability is easy

## Tech Stack

- Frontend:
  - React (Admin UI)
  - TBD (Browser extension)
- Backend:
  - django
  - TBD (Machine Learning)
- CI/CD:
  - Docker
  - Google Cloud (?)
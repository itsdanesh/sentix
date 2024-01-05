# Sentix

Sentix is a sentiment analysis tool in the form of a browser extension. It analyses text on web pages and highlights it, based on its sentiment rating (negative, neutral, or positive).  
A demo of the core features can be found [here](/docs/demo.webm).

## Admin UI

The Admin UI project exposes 2 paths/pages:
- `/login` where unauthenticated users are automatically redirected and prompted to login
- `/` which contains the admin dashboard, where admins can respond to user feedback (if wrong sentiment calculations are reported), add data points and re-train the model

The Admin UI is split into two major parts: User reports and ML Management.

### User Reports

![img](/docs/screenshots/user_reports.png)
![img](/docs/screenshots/report_modal.png)

In this panel, admins can view user submitted reports. When browsing Twitter using the extension, texts that have been assigned a sentiment rating can be flagged as being wrong. Once a user does this, the reported text is sent to the API. Admins can choose to ignore a report (if they believe the user is wrong) or to approve a report, thus adding it to the data set and potentially increasing the accuracy of the new data set.

The Admin UI is bundled at build-time and is served by the Express.js Web server.

### ML Management

![img](/docs/screenshots/ml_management.png)

In this panel, admins can:

- View the status of the model
- Predict the sentiment of arbitrary text and view an analysis of the provided text using Explainable AI.
![img](/docs/screenshots/explainable_ai.png)
- View the accuracy of the model (based on a test data set). Admins can also re-train the model (once data goes stale), and if they are unsatisfied with the new accuracy, it can be reverted.
- Admins are also given very high control over the data set. The Data administration section allows admins to add arbitrary text to the data set. Admins can also list all sentiment entries matching a provided piece of text and delete any one that they like.


## Browser Extension

The browser extension becomes active when the user visits https://twitter.com, at which point the plugin will begin searching for tweets, extract textual content from them and send them to the backend for sentiment analysis. Once the sentiment is calculated, the plugin colors the tweet accordingly. Green for positive, red for negative, and gray for neutral and irrelevant.  
![img](/docs/screenshots/color_tag.png)
Users can also flag tweets that they think are incorrectly classified, by hitting the "Flag as incorrect" button, at which point the tweet will be sent to the backend and admins will be able to view them in the [user reports view](#user-reports).

Currently the extension is supported only on Google Chrome, however this would be a good improvement in future releases since its a relatively simple task.

## Backend API

Our backend API provides us with a simple way to interface with the database and the ML model. In particular, the following endpoints are exposed:

- `GET /report` - Retrieves *all* tweets that have been flagged as incorrect by a user. Displayed in the Admin UI.
- `POST /report` - Creates a new user report. Duplicates are not permitted. Called by the browser extension when a user tries to flag a tweet.
- `PUT /report` - Either ignores (in which case the entity is deleted) or approves (in which case it is turned into a `SentimentEntry`) a user report. Called from the Admin UI in the report view.
- `GET /status` - Retrieves the status of the model, which can be any one of `good` (or up to date), `stale` (or out of sync with data), `train` (currently training). Polled every few seconds from the Admin UI.
- `POST /train` - Initiates a re-training of the ML model. Called from the Admin UI.
- `GET /revert` - Switches the old and new model around. Called from the Admin UI.
- `POST /calc` - Classifies text into a sentiment. Called from both Admin UI and the browser extension.
- `GET /accuracy` - Returns the accuracy (relative to hard-coded test data set) of the previous and current model. Called from the Admin UI to decide when a revert is preferable.
- `POST /explain` - Uses Explainable AI to detail the influence of words of interest on the resulting sentiment. Called from the Admin UI and is returned as an HTML report.
- `POST /data` - Creates data points (`SentimentEntry`). Called from the Admin UI.
- `GET /data` - Lists data points matching a provided filter (done by checking string contains). Called from the Admin UI.
- `DELETE /data` - Deletes a data point. Called from the Admin UI.
 
Sample requests you can try out are provided in:

- [data.rest](.rest/data.rest) for API calls relating to data storage
- [model.rest](.rest/model.rest) for API calls relating to model manipulation

## Running locally

Currently our project is not deployed on a remote machine.

To run the app locally, you can either manually run the projects in their respective runtimes OR run a containerized build of the projects.

### From source

To run the projects from source, you'll need:
- `node ^18.16.0`
- `python ^3.12.0`
- `pip ^23.3.1`

To run the Admin UI, run the following script:

```bash
cd ./apps/admin && npm install && npm run build # Bundle step
cd ./apps/web && npm install && npm run build && npm run start # Starts web server
```

To run the Backend API, run the following script:

```bash
cd ./apps && pip install -r requirements.txt # Installs dependencies
cd ./apps && python manage.py runserver # Starts API server
```

This short example doesn't mention it, but feel free to also use a virtual environment of your choice.

Since the extension is not added to any extension store, to run it you'll need to:

- Navigate to [Chrome extensions](chrome://extensions/)
- Enable Developer mode
- Hit `Load unpacked` and select `/apps/extension` as the target

### Containerized

To run the projects in a container, you only need `docker ^24.0.7`. To spin up all the containers, simply run:

```bash
docker compose up
```

This will perform all of the previously listed steps in a containerized environment.

## Tech Stack

- Frontend:
  - React (Admin UI)
  - HTML/CSS/JS (Browser extension)
- Backend:
  - django (Backend API)
  - Express.js (Web Server)
  - pandas, scikit-learn, nltk (Machine Learning)
- DevOps:
  - Docker (containerization of web-based services)
  - Gitlab (collaboration and tracking)

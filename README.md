# Sentix

Sentix is a sentiment analysis tool in the form of a browser extension. It analyses text on web pages and highlights it, based on its sentiment rating (negative, neutral, or positive).  

## Admin UI

The Admin UI project exposes 2 paths/pages:
- `/login` where unauthenticated users are automatically redirected and prompted to login
- `/` which contains the admin dashboard, where admins can respond to user feedback (if wrong sentiment calculations are reported), add data points and re-train the model

The Admin UI is split into two major parts: User reports and ML Management.

### User Reports

![img](/docs/screenshots/user_reports.png)
![img](/docs/screenshots/report_modal.png)

In this panel, admins can view user submitted reports. When browsing Twitter using the extension, texts that have been assigned a sentiment rating can be flagged as being wrong. Once a user does this, the reported text is sent to the API. Admins can choose to ignore a report (if they believe the user is wrong) or to approve a report, thus adding it to the data set and potentially increasing the accuracy of the new data set.

### ML Management

![img](/docs/screenshots/ml_management.png)

In this panel, admins can:
- View the status of the model
- Predict the sentiment of arbitrary text and view an analysis of the provided text using Explainable AI.
![img](/docs/screenshots/explainable_ai.png)
- View the accuracy of the model (based on a test data set). Admins can also re-train the model (once data goes stale), and if they are unsatisfied with the new accuracy, it can be reverted.
- Admins are also given very high control over the data set. The Data administration section allows admins to add arbitrary text to the data set. Admins can also list all sentiment entries matching a provided piece of text and delete any one that they like.


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
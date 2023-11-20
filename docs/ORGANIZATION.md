# Organizational matters

## How will we work?

The team consists of 5 people and 3 roles:

- Frontend developer: works to deliver everything that is user-facing (browser extension and admin UI);
- Backend developer: works to deliver web server (for admin UI), which will also handle ML (or interfaces with other ML system);
- DevOps engineer: works to maintain a good CI/CD pipeline.

## How will we communicate?

Meetings among team members will take place remotely, except during special occasions when in-person attendance would be more beneficial.
Every Tuesday and Thursday, each team member will answer the following questions:

- What have I done since my previous report?
- What am I currently doing and plan to do?
- Do I currently have any blockers?

## Git workflow

- Issue is created/opened
  - At the beginning of the project, issues are created by anyone. As the project matures, issues will be created only after discussions during meetings.
- Branch is created and prefixed with issue number (kebab case)
  - e.g. `16-integrate-admin-ui`
- A commit is created, referencing the issue number
  - e.g. `#16 Setup build step for Admin UI`
  - Commits should be as light as possible, to allow for fast and easy code reviews
- A pull request from the active branch to `main` is created
  - To encourage familiarity with the codebase, every PR must have 2 required reviewers
- The pull request is completed and a release is automatically created
  - Merging is done with squash commits and source branches are preserved for traceability
# Admin UI

This project contains the source code of the Admin interface for Sentix.

## Features

The Admin UI exposes 2 paths/pages:
- `/login` where unauthenticated users are automatically redirected and prompted to login;
- `/` which contains the admin dashboard, where admins can respond to user feedback (if wrong sentiment calculations are reported), add data points and re-train the model.

## Development

During development, a React Vite development server is started on port 3000 (`yarn dev:react`) and a TailwindCSS server is started (`yarn dev:css`).

If you are using VS Code, you can run the `Start development servers` task to start both servers at once. Run tasks by hitting `Ctrl + Shift + P` and typing `Tasks: Run Task`, then selecting the task to run.

## Production

In production, there is no development server. As part of the build process (`yarn build` or `Build frontend` task), a single `/dist` directory is produced, which contains all the (bundled) assets required to run the frontend.

In order to run the frontend, start a server serving the `/dist` directory. Requests to `/` will fallback to `/index.html` (if not, then it needs to be manually configured on the server), the HTML document will be loaded along with all the necessary static assets and the app will be rendered.
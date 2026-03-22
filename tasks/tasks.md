# Tasks

- add option to add new projects
  - project will start with an empty task list
  - user can select the project (maybe from a dropdown?) and add tasks to it in the ui

-test projects/tasks endpoints
-setup front fetches and create UI to display projects/tasks
-add embeddings + similarity
-generally polish UI
-add more to header

3/20

- fix 'session expired' message -> fixed (variable dependency (sessioneEXPIRED) logic was backwards)
  -> had to create new .env, and JWT_SECRET
- projects should be fetched upon login -> added isAuthenticated as a prop and added to dependency array, now when users log in projects are fetched immediately

3/21
-tasksSchema is causing issues
-i think i need to clear new tasks

- reintroduce task zod validation

-more interactive and better and friendlier UI such as
-login buttin didnt actually login

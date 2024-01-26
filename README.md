# Codebase Template

## Folder Structures

- **config**

  - This folder consists of all of the configuration files such as loggers.

- **controllers**

  - This folder consists all of the APIs.
  - Naming Convention
    - user.api.js

- **database**

  - This folder must only consists all of the configurations of specific database.

- **middlewares**

  - This folder consists all of the middlewares to be used in the APIs in the controllers.

- **repository**

  - This folder consists all of the files related to persistence layer access.

- **services**

  - This folder consists all of the services or business logic of a certain API. It also includes the ability to transform data to be sent as a response.

- **test**

  - This folder consists of all the test files.

- **utils**

  - This folder consists of other miscallaneous for the system. Example is Email sender.

- **.env**

  - A file that consists of all environment variables for the app.

- **.gitignore**

  - A file that consists all of the paths that will be ignored when pushing to a remote repository.

- **app.js**

  - A starting point file. This is where you import all of your controllers.

- **package.json**

  - List of required packages for the app.

- **server.js**

  - This file is will start the server
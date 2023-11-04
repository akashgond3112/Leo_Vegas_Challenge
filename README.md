```markdown
# Leo Vegas Challenge

This repository contains [Your App Name], a brief description of your app.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Usage](#usage)
- [Docker Compose](#docker-compose)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

List the prerequisites or dependencies that need to be installed and configured for your application to work. Include software, libraries, or services.

- Node.js (version v20.3.0)
- NPM (version 9.6.7)
- Docker
- ...

## Getting Started

Provide instructions on how to get your application up and running.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/akashgond3112/Leo_Vegas_Challenge.git
   cd your-app
   ```

2. If you want to run the app and test without using Docker:

   a. Install dependencies:
      ```bash
      npm install
      ```

   b. Create a `.env` file and set the required environment variables, such as database connection details:

      ```env
      NODE_ENV=development
      DATABASE_URL="mysql://root:root_password@localhost:3306/test_database" # Change the user/password/database name accordingly
      PORT=8000
      JWT_SECRET=XbIC77xtdTOmR6ENRKdQyeUJc70UFiEK
      ```

   c. Make sure the user has the necessary privileges:

      ```sql
      GRANT ALL PRIVILEGES ON *.* TO 'test_user'@'%' WITH GRANT OPTION; -- If any other user is used.
      FLUSH PRIVILEGES;
      ```

   d. To map your data model to the database schema, use the Prisma migrate CLI commands:

      ```bash
      npx prisma migrate dev --name init
      ```

   e. To run only the application:

      ```bash
      npm run dev
      ```

   f. To run the tests:

      ```bash
      npm run test
      ```

3. If you want to run the tests using Docker:

   a. Create a `.env` file and set the required environment variables, such as database connection details:

      ```env
      NODE_ENV=development
      PORT=8000
      JWT_SECRET=XbIC77xtdTOmR6ENRKdQyeUJc70UFiEK
      DATABASE_URL="mysql://root:root_password@mysql-container:3306/test_database"
      ```

   b. Build the application image:

      ```bash
      docker build -t leo_vegas .
      ```

   c. To run the tests:

      ```bash
      docker-compose run node-app npm test # Currently having some issue; try to run the command 2 times, need more debugging.
      ```
```

This improved version maintains the readability of the content and fixes some minor formatting issues, ensuring that your instructions are clear and easy to follow.
# CabApp Engine

The CabApp Engine is the server-side component of the CabApp application. It is built using ExpressJS and Typescript.

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Usage](#usage)
- [GraphQL Schema](#graphql-schema)
- [Contributing](#contributing)
- [License](#license)

## Overview

The CabApp Engine serves as the backend for the apartment renting website. It handles requests from the client, interacts with the database, and implements the business logic of the application.

## Project Structure

The project structure of the CabApp Engine is as follows:

- **src**: Contains the source code of the NestJS application.
  - **config**: Contains the application configuration (eg. PORT, NODE_ENV, MongoDB URI etc).
  - **routes**: Contains routers and controllers for handling client requests.
  - **middlewares**: Contains middlewares for decoding user from token , handling errors etc.
  - **models**: Contains database schemas.
  - **services**: Contains business logic services.
  - **types**: Contains typescript types.
  - **utils**: Contains other app utilities.
  - **start**: Contains app and apollo server initiation logic.

## Getting Started

### Prerequisites

Before running the CabApp Engine, make sure you have the following installed:

- Node.js
- npm or Yarn
- MongoDB 

### Installation

1. Clone the repository:

`git clone https://github.com/jewtechx/cab_app_engine.git`

2. Navigate to the `engine` directory:

`cd CabApp_engine/engine`

3. Install dependencies:

`yarn install`

## Usage

To start the CabApp Engine, run the following command:

npm run dev

The engine will start running on the specified port, and you can access the GraphQL endpoint in your browser at `http://localhost:8080`.

## Documentation
Visit `https://restless-astronaut-776620.postman.co/workspace/cabify~3ef51573-0f0d-4969-8e58-acadcc3b0c9c/collection/30840589-ddb788c5-a005-4cb3-9510-cfe0966bca23?action=share&creator=30840589` for documentation of api in postman



## Contributing

Contributions to the CabApp Engine are welcome! Feel free to open issues or submit pull requests to help improve the engine.

## License

This project is licensed under the MIT License

## Author 
Jew Kofi Larbi Danquah
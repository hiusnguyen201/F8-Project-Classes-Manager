# Database Configuration (`src/models/index.js`)

This file serves as the central configuration for the Sequelize Object-Relational Mapper (ORM). It initializes Sequelize, loads all defined data models, and sets up their associations, enabling the application to interact with the database.

## Initialization

1.  **Environment**: Determines the current environment (e.g., 'development', 'production') using `process.env.NODE_ENV`.
2.  **Configuration Loading**: Retrieves database connection details from the configuration file (`../config/config.js`) based on the current environment.
3.  **Sequelize Instance**: Creates a Sequelize instance (`sequelize`) using the configuration. This instance manages the database connection pool and query execution.

## Model Loading

-   **Dynamic Discovery**: The file scans the `src/models/` directory for JavaScript files (excluding `index.js` and test files).
-   **Model Factory**: Each model file is expected to export a factory function. This function receives the `sequelize` instance and `Sequelize.DataTypes` as arguments, allowing models to define their schema and interact with the database.
-   **Model Registration**: Each loaded model is stored in the `db` object, keyed by its corresponding filename (model name).

## Association Setup

-   **Iterative Association**: After all models are loaded, the file iterates through the `db` object.
-   **`associate` Method**: If a model defines an `associate(db)` method, it is called. This method is used to define relationships between models (e.g., one-to-one, one-to-many, many-to-many) using Sequelize's association methods.

## Export

The module exports an object `db` containing:
-   All loaded Sequelize models.
-   The configured `sequelize` instance.
-   The `Sequelize` library itself.

## Dependencies

-   **Core Node.js**: `fs`, `path`, `process`
-   **ORM**: `sequelize`
-   **Configuration**: `../config/config.js`

## Usage

This file is typically required once at the application's entry point (e.g., `src/app.js`) to set up the database connection and provide access to all models throughout the application. Services and controllers then use the models exported from this file (e.g., `require('../../models/index')`).

# API Documentation for Low-Code Platform

## Overview

This document provides an overview of the API endpoints available in the Low-Code Platform. It includes details on how to interact with the platform's core functionalities, including data management, component rendering, and project configuration.

## Base URL

The base URL for all API requests is:

```
http://localhost:3000/api
```

## Endpoints

### 1. Project Management

#### Create Project

- **POST** `/projects`
- **Description**: Creates a new project.
- **Request Body**:
  ```json
  {
    "name": "string",
    "description": "string",
    "version": "string",
    "theme": "object"
  }
  ```
- **Response**:
  - **201 Created**: Returns the created project object.
  - **400 Bad Request**: If the request body is invalid.

#### Get Project

- **GET** `/projects/{id}`
- **Description**: Retrieves a project by its ID.
- **Response**:
  - **200 OK**: Returns the project object.
  - **404 Not Found**: If the project does not exist.

### 2. Dataset Management

#### Create Dataset

- **POST** `/datasets`
- **Description**: Creates a new dataset.
- **Request Body**:
  ```json
  {
    "name": "string",
    "fields": [
      {
        "name": "string",
        "type": "string",
        "required": "boolean"
      }
    ],
    "source": {
      "type": "string",
      "url": "string"
    }
  }
  ```
- **Response**:
  - **201 Created**: Returns the created dataset object.
  - **400 Bad Request**: If the request body is invalid.

#### Get Dataset

- **GET** `/datasets/{id}`
- **Description**: Retrieves a dataset by its ID.
- **Response**:
  - **200 OK**: Returns the dataset object.
  - **404 Not Found**: If the dataset does not exist.

### 3. Component Management

#### Render Component

- **POST** `/components/render`
- **Description**: Renders a component based on the provided configuration.
- **Request Body**:
  ```json
  {
    "type": "string",
    "props": "object"
  }
  ```
- **Response**:
  - **200 OK**: Returns the rendered component.
  - **400 Bad Request**: If the request body is invalid.

### 4. Error Handling

All API responses will include an error message in the following format in case of failure:

```json
{
  "error": "string"
}
```

## Conclusion

This API documentation provides a comprehensive guide to the endpoints available in the Low-Code Platform. For further details on usage and examples, please refer to the respective sections in the documentation.

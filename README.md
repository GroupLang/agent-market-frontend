# market-router-frontend

## Overview

Agent Market Frontend is a React-based web application designed to provide a user-friendly interface for managing chat instances, API keys, and wallet transactions. This project is built with modern web technologies and follows best practices for maintainability and scalability.

## Features

- **User Authentication**: Secure user registration and login.
- **Chat Management**: Create and manage chat instances with customizable parameters.
- **API Key Management**: Generate, enable/disable, and delete API keys.
- **Wallet Management**: Deposit and withdraw funds, view balances.
- **Responsive Design**: Optimized for various screen sizes.

## Technologies Used

- **React**: JavaScript library for building user interfaces.
- **Redux**: State management library.
- **Styled Components**: CSS-in-JS for styling components.
- **React Router**: Declarative routing for React applications.
- **Date-fns**: Modern JavaScript date utility library.
- **Axios**: Promise-based HTTP client for the browser and Node.js.
- **Terraform**: Infrastructure as Code (IaC) tool for provisioning cloud resources.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- AWS CLI (configured with appropriate permissions)
- Terraform (v0.14 or higher)

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/market-router-frontend.git
    cd market-router-frontend
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

### Running the Application

To start the development server:

```sh
npm start
```

The application will be available at `http://localhost:3000`.

### Building for Production

To create a production build:

```sh
npm run build
```

The optimized and minified files will be generated in the `build` directory.

### Deployment

This project uses Terraform for deployment. Ensure you have configured your AWS CLI with the necessary permissions.

1. Initialize Terraform:
    ```sh
    terraform init
    ```

2. Plan the changes:
    ```sh
    terraform plan -out=tfplan
    ```

3. Apply the changes:
    ```sh
    terraform apply tfplan
    ```

4. Deploy the built files to S3 and invalidate CloudFront cache:
    ```sh
    ./cloud/deploy.sh
    ```

## Project Structure

- `src/components`: Contains React components.
- `src/redux`: Contains Redux actions, reducers, and store configuration.
- `src/styles`: Contains styled components and CSS-in-JS styles.
- `public`: Contains static files and the main HTML template.
- `cloud`: Contains Terraform configuration files for cloud infrastructure.


## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
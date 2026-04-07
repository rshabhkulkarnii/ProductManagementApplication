# Product Management Application

A full-stack web application for managing products with a Spring Boot backend and React frontend.

## Project Structure

```
ProductManagementApplication/
├── backend/                    # Spring Boot backend server
│   ├── src/                   # Java source code
│   ├── pom.xml               # Maven configuration
│   ├── mvnw                  # Maven wrapper script
│   └── target/               # Build output
├── frontend/                  # React frontend application
│   ├── src/                  # React components and pages
│   ├── public/               # Static assets
│   └── package.json          # NPM configuration
├── demos/                     # Demo videos and documentation
├── sample_products.csv        # Sample CSV file for import testing
└── README.md                  # This file
```

## Features

- ✅ Complete CRUD operations for products
- ✅ Advanced search and filtering
- ✅ Sorting capabilities
- ✅ Bulk actions (select/delete multiple products)
- ✅ Export/Import functionality (CSV)
- ✅ Print feature
- ✅ Dark/Light theme toggle
- ✅ Statistics dashboard
- ✅ Toast notifications
- ✅ Search history
- ✅ Feature request system

## Tech Stack

- **Backend:** Spring Boot 3.x, Spring Data JPA, MySQL
- **Frontend:** React 19, Bootstrap 5, Axios
- **Build Tools:** Maven, npm

## Prerequisites

- Java 17 or higher
- MySQL 8.0 or higher
- Node.js 16 or higher
- npm or yarn

## Database Setup

1. Install MySQL and create a database:
   ```sql
   CREATE DATABASE product_management;
   ```

2. Configure your database credentials:
   - Copy `backend/src/main/resources/application-local.properties.example` to `backend/src/main/resources/application-local.properties`
   - Update the database credentials in `application-local.properties`:
     ```properties
     spring.datasource.username=your_mysql_username
     spring.datasource.password=your_mysql_password
     ```

   **OR** set environment variables:
   ```bash
   export DB_USERNAME=your_mysql_username
   export DB_PASSWORD=your_mysql_password
   ```

## Running the Application

### Backend (Spring Boot)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```

   The backend will start on `http://localhost:8080`

### Frontend (React)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

   The frontend will start on `http://localhost:3000`

## Building for Production

### Backend
```bash
cd backend
./mvnw clean package
java -jar target/ProductManagementApplication-0.0.1-SNAPSHOT.jar
```

### Frontend
```bash
cd frontend
npm run build
```


## API Endpoints

- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product
- `GET /api/categories` - Get all categories

## Sample Data

A sample CSV file with 20 products is included (`sample_products.csv`) for testing the import functionality. You can import this file through the application's import feature.

## Demo Videos

Demo videos showcasing the application features are located in the `demos/` folder:
- Place your demo videos or screen recordings in this folder
- Include a `DEMO.md` file with descriptions of each demo

## Security Notes

- Database credentials are NOT committed to version control
- Use `backend/src/main/resources/application-local.properties` for local development
- Never commit sensitive configuration files
- Use environment variables in production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
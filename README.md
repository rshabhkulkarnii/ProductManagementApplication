# Product Management Application

A full-stack web application for managing products with a Spring Boot backend and React frontend.

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
   - Copy `src/main/resources/application-local.properties.example` to `src/main/resources/application-local.properties`
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

1. Navigate to the project root:
   ```bash
   cd ProductManagementApplication
   ```

2. Run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```

   The backend will start on `http://localhost:8080`

### Frontend (React)

1. Navigate to the frontend directory:
   ```bash
   cd product-management-frontend
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
./mvnw clean package
java -jar target/ProductManagementApplication-0.0.1-SNAPSHOT.jar
```

### Frontend
```bash
npm run build
```

## API Endpoints

- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product
- `GET /api/categories` - Get all categories

## Security Notes

- Database credentials are NOT committed to version control
- Use `application-local.properties` for local development
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
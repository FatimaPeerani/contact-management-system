# Contact Management System

A full-stack web-based contact management system built with **Spring Boot** and **React.js**, allowing users to register, log in, and manage their personal contacts efficiently.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java, Spring Boot, Spring Data JPA, Hibernate |
| Frontend | React.js |
| Database | Microsoft SQL Server |
| Security | Spring Security, JWT |
| Testing | JUnit 5, Mockito |
| Logging | SLF4J + Logback |
| Code Quality | SonarQube |
| Version Control | Git |

---

## Features

### User Authentication & Authorization
- User registration using email and password
- Login with JWT-based authentication
- Change password functionality
- Secure session management

### Contact Management
- View all contacts in a paginated list
- Search/filter contacts by first name or last name
- Create new contacts
- Update existing contacts
- Delete contacts with confirmation
- Each contact includes:
  - First Name
  - Last Name
  - Title
  - Email Addresses (labeled: work, personal, etc.)
  - Phone Numbers (labeled: work, home, personal, etc.)

### Application Logging
- SLF4J with Logback for logging throughout the application
- Logs important events, errors, and user activities

### Exception Handling
- Global exception handling via `@RestControllerAdvice`
- Meaningful error messages returned to the client
- All exceptions logged using SLF4J

### Unit Testing
- JUnit 5 + Mockito for unit tests
- Tests cover controllers, services, and security components
- SonarQube code coverage: **81%+**
- SonarQube Quality Gate: **Passed**

---

## Project Structure

```
contact-management-system/
├── backend/                  # Spring Boot application
│   ├── src/main/java/com/fatima/backend/
│   │   ├── controller/       # REST Controllers
│   │   ├── service/          # Business Logic
│   │   ├── repository/       # JPA Repositories
│   │   ├── model/            # Entity Classes
│   │   ├── dto/              # Data Transfer Objects
│   │   ├── security/         # JWT & Security Config
│   │   └── exception/        # Global Exception Handler
│   └── src/test/             # Unit Tests
└── frontend/                 # React.js application
    ├── src/
    │   ├── components/       # React Components
    │   └── pages/            # Application Screens
```

---

## Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- Microsoft SQL Server
- Maven

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/FatimaPeerani/contact-management-system.git
```

2. Configure `application.properties`:
```properties
spring.datasource.url=jdbc:sqlserver://localhost\SQLEXPRESS:1433;databaseName=contact_management_db
spring.datasource.username=your_username
spring.datasource.password=your_password
jwt.secret=your_jwt_secret_key
```

3. Run the backend:
```bash
cd backend
mvn spring-boot:run
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on: `http://localhost:3000`  
Backend runs on: `http://localhost:8080`

---

## Running Tests

```bash
cd backend
mvn test
```

## SonarQube Analysis

```bash
mvn sonar:sonar
```

---

## Application Screens

- **Login & Registration** — User authentication screens
- **Contact Management** — Paginated list with create, edit, delete, and search
- **User Profile** — View profile and change password

---

## Developer

**Fatima Peerani**  
GitHub: [@FatimaPeerani](https://github.com/FatimaPeerani)

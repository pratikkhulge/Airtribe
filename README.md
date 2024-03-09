# Airtribe Application APIs

This repository contains the backend server implementation for Airtribe application APIs. Airtribe is an application-based learning platform where instructors can create courses, and learners can apply for courses.

## Features

- **Create Course API**: Instructors can create new courses with details such as instructor ID, name, maximum seats, and start date.
- **Update Course Details API**: Instructors can update course details including name, maximum seats, and start date.
- **Course Registration API**: Learners can apply for courses by providing their details such as name, email, phone number, and LinkedIn profile.
- **Lead Update API**: Instructors can change the status of leads (Accept / Reject / Waitlist).
- **Lead Search API**: Instructors can search for leads by name, phone number, or status.
- **Add Comment API**: Instructors can add comments against leads.
- **Get All Courses API**: Retrieve a list of all courses.
- **Get All Leads API**: Retrieve a list of all leads.
- **Get All Comments API**: Retrieve a list of all comments.

## Functionality and Error Handling

- **Create Course API**: Handles duplicate entry error if a course with the same name already exists for the instructor. Responds with appropriate status codes and error messages.
- **Update Course Details API**: Updates course details if the course exists, otherwise responds with a 404 status code.
- **Course Registration API**: Handles duplicate entry error if a lead with the same email already exists for the course. Responds with appropriate status codes and error messages.
- **Lead Update API**: Updates lead status if the lead exists, otherwise responds with a 404 status code.
- **Lead Search API**: Searches leads based on provided parameters. Handles errors and responds with appropriate status codes.
- **Add Comment API**: Checks if the lead exists before adding a comment. Responds with a 404 status code if the lead does not exist.
- **Get All Courses API**: Fetches all courses from the database.
- **Get All Leads API**: Fetches all leads from the database.
- **Get All Comments API**: Fetches all comments from the database.

## Database Queries

- **Create Course API**: Inserts a new course record into the database.
- **Update Course Details API**: Updates the course record in the database.
- **Course Registration API**: Inserts a new lead record into the database.
- **Lead Update API**: Updates the lead record in the database.
- **Lead Search API**: Executes dynamic SQL queries based on search parameters.
- **Add Comment API**: Inserts a new comment record into the database.
- **Get All Courses API**: Retrieves all course records from the database.
- **Get All Leads API**: Retrieves all lead records from the database.
- **Get All Comments API**: Retrieves all comment records from the database.

```bash
    `-- Create Instructors table
    CREATE TABLE Instructors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Create Courses table
    CREATE TABLE Courses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        instructor_id INT,
        name VARCHAR(255) NOT NULL,
        max_seats INT NOT NULL,
        start_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (instructor_id) REFERENCES Instructors(id),
        UNIQUE KEY (instructor_id, name) -- Ensure unique courses per instructor
    );

    -- Create Leads table
    CREATE TABLE Leads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        course_id INT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone_number VARCHAR(20) NOT NULL,
        linkedin_profile VARCHAR(255),
        status ENUM('Accepted', 'Rejected', 'Waitlist') NOT NULL DEFAULT 'Waitlist',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (course_id) REFERENCES Courses(id),
        UNIQUE KEY (course_id, email) -- Ensure unique leads per course
    );

    -- Create Comments table
    CREATE TABLE Comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        lead_id INT,
        instructor_id INT,
        comment TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (lead_id) REFERENCES Leads(id),
        FOREIGN KEY (instructor_id) REFERENCES Instructors(id)
    );
```

## Testing APIs

You can use the following `curl` commands to test each API:

```bash
# Create Course API
curl -X POST http://localhost:3001/courses -H "Content-Type: application/json" -d "{\"instructor_id\": 1, \"name\": \"Introduction to Programming Language\", \"max_seats\": 50, \"start_date\": \"2024-04-01\"}"

# Update Course Details API
curl -X PUT http://localhost:3001/courses/course_id -H "Content-Type: application/json" -d "{\"name\": \"Updated Course Name\", \"max_seats\": 60, \"start_date\": \"2024-05-01\"}"

# Course Registration API
curl -X POST http://localhost:3001/leads -H "Content-Type: application/json" -d "{\"course_id\": 1, \"name\": \"John Doe\", \"email\": \"john.doe@example.com\", \"phone_number\": \"1234567890\", \"linkedin_profile\": \"https://www.linkedin.com/in/johndoe/\"}"

# Lead Update API
curl -X PUT http://localhost:3001/leads/lead_id -H "Content-Type: application/json" -d "{\"status\": \"Accepted\"}"

# Lead Search API
curl -X GET 'http://localhost:3001/leads?name=John&phoneNumber=1234567890&status=Accepted'

# Add Comment API
curl -X POST http://localhost:3001/comments -H "Content-Type: application/json" -d "{\"lead_id\": 1, \"instructor_id\": 1, \"comment\": \"Great performance!\"}"

# Get All Courses API
curl -X GET http://localhost:3001/all-courses

# Get All Leads API
curl -X GET http://localhost:3001/all-leads

# Get All Comments API
curl -X GET http://localhost:3001/all-comments
```

Replace placeholders such as `course_id` and `lead_id` with actual IDs.

## Running the Server

1. Clone this repository.
2. Install dependencies using `npm install`.
3. Set up your MySQL database and update the connection details in `database/db.js`.
4. Run the server using `npm start`.
5. Use the provided `curl` commands or any API testing tool to test the APIs.

## Technologies Used

- Node.js
- Express.js
- MySQL

---

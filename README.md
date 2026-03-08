# SDEV 255 Final Project – Spring 2026, Ivy Tech

## Project Overview
This project is a web app for managing college courses. Right now, it has back-end logic, course creation, login and registration, and teacher course management working. Teachers can create and delete courses, and users can log in with role-based authorization (teacher vs. student). Pages have been styled and validated where it made sense.

## Project Structure Note
This started as one React project, but we had to split it into front-end and back-end towards the end. There are still some React remnants, but they do not affect how the code runs.

## Planned to have

### Stage 1
- Define course model and establish mock data
- Implement functionality to add, edit, and delete courses
- Courses include the following fields: name, description, subject, credits, course number, and instructor

### Stage 2
- Implement user login and authentication system
- Differentiate roles: student vs teacher
- Teachers can add or drop courses from the available listings
- Students can add or drop courses from their personal schedules
- Students can view all courses in which they are currently enrolled

## Team Members & Responsibilities

**Ashley Lawrence – Data + Backend Logic + Login, Registration, and Add Course Pages**
- Course and Teacher model & data structure
- Add, edit, delete logic
- Mock data setup
- Add course page, submission, and styling
- Validation (required fields, credits numeric, etc.)
- Stage 2: Login page, submission, and styling
- Stage 2: Registration page, submission, and styling
- Stage 2: Teacher vs Student login authorization
- Stage 2: Teacher course management (add/drop own courses)

**Aaron Roberts – Course Index + Navigation**
- Index page of all courses
- Layout, links to view/edit courses
- Stage 2: Students can search and view courses
- Stage 2: Display enrolled courses for students

**Andrew Smith – View Course Details + Styling + Edit Course Page**
- Course detail page
- CSS, layout, readability, UX polish
- Edit course page & submission
- Stage 2: Minor UX updates for student view
- Stage 2: Ensure required fields display correctly

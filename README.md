# Smart Queue Management System

A web-based Smart Queue Management System developed using Java, Spring Boot, MySQL, HTML, CSS and JavaScript. The application helps manage customer registration, queue token generation, real-time queue status and customer service operations.

## 🚀 Features

- **Customer Registration:** Register customers with name, phone number and email.
- **Token Generation:** Generate unique queue tokens for registered customers.
- **Department Management:** Manage departments such as Billing and Customer Support.
- **Queue Status:** View customers waiting in the queue.
- **Token Tracking:** Track token status and queue position.
- **Admin Dashboard:** Monitor customers, tokens and queue statistics.
- **Call Next Customer:** Call the next waiting customer.
- **Live Display:** Display currently serving customers.
- **QR Code Generation:** Generate a QR code for the customer's token.
- **Token Status Management:** Update tokens to SERVING, COMPLETED or CANCELLED.

## 🛠️ Technologies Used

**Backend**
- Java
- Spring Boot
- Spring Data JPA
- Maven

**Frontend**
- HTML
- CSS
- JavaScript

**Database**
- MySQL

**Tools**
- Visual Studio Code
- MySQL Workbench
- Git and GitHub
- Postman

## 📂 Project Structure

```text
Smart-Queue-Management-System/
│
├── src/
│   ├── main/
│   │   ├── java/com/smartqueue/smartqueue/
│   │   │   ├── controller/
│   │   │   ├── entity/
│   │   │   ├── repository/
│   │   │   ├── service/
│   │   │   └── SmartqueueApplication.java
│   │   │
│   │   └── resources/
│   │       ├── static/
│   │       │   ├── index.html
│   │       │   ├── style.css
│   │       │   ├── script.js
│   │       │   ├── admin.html
│   │       │   ├── admin.css
│   │       │   └── admin.js
│   │       └── application.properties
│   │
├── pom.xml
├── mvnw
├── mvnw.cmd
├── .gitignore
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/deepikacuppalad/Smart-Queue-Management-System.git
```

### 2. Open the Project

Open the cloned project in Visual Studio Code.

### 3. Create MySQL Database

```sql
CREATE DATABASE smart_queue;
```

### 4. Configure Database

Set your database details using environment variables:

```text
DB_URL=jdbc:mysql://localhost:3306/smart_queue

# 🥸 MaskMe – Ask Anything. Anonymously.

Welcome to **MaskMe**, the app where secrets are safe and curiosity rules. Ask questions. Answer freely. All behind the mask. 🕵️‍♀️

## 🚀 Overview

MaskMe is a full-stack web application that lets users ask and answer questions — completely anonymously. It’s powered by **Node.js**, **Express**, and a dash of **JavaScript** on the frontend. For user management and secure sessions, we’ve got **MongoDB** and **JWT** doing the heavy lifting.

## 🛠️ Tech Stack

| Layer         | Tech                     |
| ------------- | ------------------------ |
| 🧠 Backend     | Node.js, Express.js       |
| 🎨 Frontend    | HTML, CSS, JavaScript     |
| 🗃️ Database    | MongoDB (Mongoose)        |
| 🔐 Auth        | JWT (JSON Web Tokens)     |

## ✨ Features

- 🔐 **User Authentication** with secure JWT tokens  
- 🎭 **Anonymous Q&A** – ask or answer without revealing yourself  
- 📬 **Inbox** to view questions you've received  
- 💬 **Answering system** to reply with style 

## 📦 API Overview

Here’s a peek at the main API endpoints:

| Method | Route              | Purpose                      |
|--------|--------------------|------------------------------|
| POST   | `/register`        | Create a new user            |
| POST   | `/login`           | Authenticate user + get JWT  |
| GET    | `/questions`       | Get all received questions   |
| POST   | `/questions`       | Submit a new question        |
| POST   | `/answers/:id`     | Submit an answer to a Q      |

> Headers: `Authorization: Bearer <your_token_here>`

## 🧪 Testing the API

Use Postman or your browser dev tools to test routes. Don’t forget to include your JWT when required!

## 🧰 Getting Started

1. Clone the repo  
   ```bash
   git clone https://github.com/Mennaali1/MaskMe.git
   cd MaskMe

# 🛍️ Mini E-Commerce Website

A simple full-stack e-commerce site built using **HTML, CSS, JavaScript (frontend)** and **Node.js + Express + MongoDB (backend)**.

Live GitHub Repo: [https://github.com/abygmat/awswebpage](https://github.com/abygmat/awswebpage)

---

## ✅ Features

- User signup & login with JWT
- Contact form data saved to MongoDB
- Auth-guarded product purchase flow
- Responsive product showcase using TailwindCSS

---

## ⚙️ How to Run This Project

### 📦 Prerequisites

Make sure your system has the following installed:

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) (local or [Atlas](https://www.mongodb.com/cloud/atlas) cloud instance)

---

### 🧑‍💻 1. Clone the Repo

```bash
git clone https://github.com/abygmat/awswebpage.git
cd awswebpage
```

---

### 📁 2. Install Dependencies

```bash
npm install
```

---

### 🔐 3. Set up Environment Variables

Create a `.env` file in the root folder:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Replace:

- `your_mongodb_connection_string` with your local or cloud MongoDB URI
- `your_jwt_secret_key` with a random secure string like `mysecret123`

> ❗ Never commit `.env` files to GitHub.

---

### ▶️ 4. Start the Backend Server

```bash
node server.js
```

Or with hot-reload:

```bash
npx nodemon server.js
```

---

### 🌐 5. Access the App in Browser

```
http://localhost:5000
```

---

## 📂 Folder Structure

```
awswebpage/
├── public/            # Static HTML, CSS, JS (frontend)
├── models/            # Mongoose models (user.js, contact.js)
├── routes/            # API routes (auth.js, contact.js)
├── server.js          # Main Express app entry point
├── .env               # Secret credentials (you create this)
├── package.json       # Project metadata and scripts
```

---

## 📬 Contact Form Feature

When a user fills the contact form, their name, email, phone, subject, and message will be stored in MongoDB.

When pressing **"Buy Now"**, the app checks if contact info is present:

- ✅ If yes → Redirect to `pay.html`
- ❌ If not → Redirect to `contact.html`

---

## 🤝 Contributing

Want to collaborate?

1. Fork this repo
2. Clone your fork
3. Create a new branch
4. Make your changes
5. Push & open a pull request

---

## 📃 License

MIT License

---

If you're using ChatGPT, feel free to paste this README to get exact run/debug support from the model.


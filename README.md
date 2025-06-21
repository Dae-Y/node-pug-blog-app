# Blog Post Management Web App

This is a full-stack blog management system built for the **COMP3011 Web Application Frameworks** assignment.

Users can register, log in, create, edit, and delete blog posts. Only the author (or an admin) can modify their own posts. Blog posts are searchable by title or tags.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: Pug templating engine + Bootstrap 5
- **Database**: MongoDB with Mongoose
- **Authentication**: Passport.js (Local Strategy)
- **Validation**: Joi
- **Session Management**: express-session + connect-flash

---

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- `.env` file in root directory

### .env Example

```
MONGODB_URI=your_mongodb_connection_string
SESSION_SECRET=your_super_secret_key
PORT=3000
```

---

### Installation

```bash
git clone <repo-url>
cd <your-project-directory>
npm ci
```

Start the development server:

```bash
nodemon app.js
# Or if nodemon isn't installed globally:
npx nodemon app.js
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## Features

### Authentication

- User registration and login
- Passwords securely hashed with bcrypt
- Session managed with express-session
- Flash messages for login/register feedback
- Navbar dynamically updates based on login state

### Blog Post Management

- CRUD operations for blog posts
- Only authors (or admins) can edit/delete posts
- Public post viewing for all users

### Search Functionality

- Filter blog posts by title or tags (case-insensitive)
- Search through `GET /posts?search=your_term`

### Input Validation

- Server-side validation with Joi
- Ensures valid registration, login, and blog post data

### Admin Panel

- View all users and all blog posts
- Admins can delete any post
- `isAdmin` flag in the User model

---

## Folder Structure

```
.
├── controllers/       # Business logic
├── models/            # Mongoose schemas
├── routes/            # Express route handlers
├── views/             # Pug templates
├── public/            # Bootstrap/CSS/JS
├── app.js             # Main server file
├── package.json
└── .env
```

---

## Sample Users

These users are pre-seeded in the database:

| Username | Password |
|----------|----------|
| Zac      | wewe33   |
| Tom      | 123456   |
| Sara     | qwe123   |
| admin    | 111111   |
| Holly    | 121212   |
| Eve      | 222222   |

---

## Templates Summary

- `index.pug` – Blog post list with search and conditional action buttons
- `form.pug` – Reusable post create/edit form
- `login.pug` – Login page with Bootstrap styling
- `register.pug` – Register page with form validation
- `post.pug` – Individual blog post page
- `users.pug` – Admin-only user list view

---

## Preview

<img src="https://github.com/user-attachments/assets/a81ca5e3-c403-4d9a-a29f-9c4d81f1f0e8" alt="home" width="60%">

**Home Page:** Public view showcasing posts, with no edit or delete options.
<br>
<br>

<img src="https://github.com/user-attachments/assets/0d44adce-d1c2-40a8-b050-33b8fe0b6751" alt="login" width="40%">

**Login Page:** Standard user authentication.
<br>
<br>

<img src="https://github.com/user-attachments/assets/8b43c8b9-17ac-4639-b8aa-0131460ee514" alt="logged in" width="45%">

**Logged In View:** User's name displayed in the navigation, with the option to create a new post.
<br>
<br>

<img src="https://github.com/user-attachments/assets/eb14dc53-de4a-4aed-a99b-714f2bb3f732" alt="owners can edit" width="45%">

**Edit/Delete Access:** Logged-in users with ownership privileges see edit and delete buttons.

---

## References

- [Pug.js Documentation](https://pugjs.org/api/getting-started.html)
- [Bootstrap Components](https://getbootstrap.com/docs/5.0/components/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

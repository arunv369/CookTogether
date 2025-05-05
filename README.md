# 🍽️ Recipe Sharing Platform

A full-featured **Recipe Sharing Platform** built with the **MERN Stack** and **TailwindCSS** that allows users to share, discover, and interact with recipes. The platform includes features such as user ratings, comments, video tutorials, ingredient-based search, meal planning tools, and social features like following and favorites.

---

## 🚀 Features

### 📌 Recipe Management

- **Recipe Sharing**

  - Submit and share personal recipes with the community.
  - Add recipe title, ingredients, steps, cooking time, and servings.
  - Upload recipe photos and embed video tutorials (e.g., YouTube links).

- **Recipe Discovery**

  - Search and filter recipes by ingredients, cuisine, diet type, or user rating.
  - Browse trending or newly added recipes in a clean interface.

- **Ratings & Comments**

  - Rate recipes (1–5 stars).
  - Leave reviews and read user feedback.
  - Display average ratings and top comments on recipe pages.

- **Video Tutorials**
  - Watch step-by-step cooking instructions via embedded video tutorials.

---

### 👤 User Features

- **User Profiles**

  - Manage personal profile, bio, and profile picture.
  - Dashboard to view submitted recipes and saved favorites.

- **Ingredient Search**

  - Find recipes based on available ingredients.
  - Advanced filters for dietary needs and meal types.

- **Meal Planning**

  - Plan meals for the week by selecting recipes.
  - Auto-generate shopping lists.
  - Save and share personalized meal plans.

- **Social Features**
  - Follow other users and engage with their content.
  - Like, comment on, and share recipes.
  - Build a cooking community through interactions.

---

## 🛠️ Tech Stack

| Technology      | Purpose                                                     |
| --------------- | ----------------------------------------------------------- |
| **MongoDB**     | Database for storing user and recipe data                   |
| **Express.js**  | Backend framework to handle API requests                    |
| **React.js**    | Frontend framework for building UI components               |
| **Node.js**     | JavaScript runtime environment for the backend              |
| **TailwindCSS** | Utility-first CSS framework for responsive and clean design |

---

## 📦 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/arunv369/CookTogether.git
cd CookTogether

### 2. Backend Setup

cd server
npm install
cp .env.example .env  # Add your MongoDB URI, JWT secrets, etc.
npm run dev

### 3. Frontend Setup

cd client
npm install
npm run dev

### 4. Visit in Browser

http://localhost:5173


### 🛡️ Authentication & Authorization
JWT-based authentication (signup/login).

Protected routes (e.g., create recipe, user dashboard).

Role-based access (e.g., admin can manage recipes)
```

### 🙌 Acknowledgements

TailwindCSS

MongoDB Atlas

React Router

Lucide Icons

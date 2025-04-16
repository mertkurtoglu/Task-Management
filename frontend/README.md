# Frontend

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## 🧩 Tech Stack

This project includes the following technologies and libraries:

- **Next.js v15.2.5** – React framework for server-rendered apps
- **React v19** & **ReactDOM v19**
- **Tailwind CSS v4.1.3** – Utility-first CSS framework
- **DaisyUI v5.0.18** – Tailwind CSS component library
- **Redux Toolkit v2.6.1** – Modern Redux setup
- **React-Redux v9.2.0** – React bindings for Redux
- **Lucide React v0.488.0** – Icon set for React
- **JS Cookie v3.0.5** – Cookie handling utility
- **Theme Change v2.5.0** – Dynamic theme switching
- **@hello-pangea/dnd v18.0.1** – Drag-and-drop utilities

## 🚀 Getting Started

### Installation

````bash
cd frontend
npm install

Then, run the development server:

```bash
npm run dev

Open http://localhost:3000 in your browser to view the application.

## 🛠 Scripts

- \`npm run dev\` – Start development server
- \`npm run build\` – Create production build
- \`npm start\` – Start production server
- \`npm run lint\` – Run ESLint checks

## 🗂 Project Structure
```
frontend/
├── components/             # Reusable UI components
│   ├── Layout.js
│   ├── Loading.js
│   └── ThemeToggle.js
│
├── pages/                  # Next.js page routes
│   ├── projects/
│   │   ├── [projectId].js
│   │   └── tasks/
│   ├── users/
│   │   ├── [userId].js
│   │   └── index.js
│   ├── createProject.js
│   ├── createTask.js
│   ├── login.js
│   ├── index.js
│   ├── _app.js
│   └── _document.js
│
├── public/                 # Public assets
│
├── store/                  # Redux slices and store
│   ├── authSlice.js
│   ├── projectsSlice.js
│   └── store.js
│
├── styles/                 # Global and Tailwind styles
│
├── .env                    # Environment variables
├── .gitignore
├── eslint.config.mjs
├── jsconfig.json
└── next.config.mjs
```

## Accounts

To access the Dashboard, you need to log in. You can log in with the account and passwords created for the test below.

```Developer
Mail : mert@dev.com, Password: 123456

```Manager
Mail : mert@manager.com, Password: 123456

```Admin
Mail : mert@admin.com, Password: 123456

## ☁️ Deployment

The project was deployed to Vercel.You can access the live version of the project from this link:
(https://task-management-sage-nine.vercel.app/)
````

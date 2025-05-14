# 🔗📚 LinkStash - Organize and Save Your Favorite Items!  
`Developed by:` *Vinícius Lima*

`📄 Also available in:` **[portuguese language](README_pt.md)**

![LinkStash Banner](./BannerLinkStash.png)

**LinkStash** *is a modern web application to **organize** and **manage** all your important digital items in one place. Save **links**, **notes**, **to-do lists**, and **images** easily and **access them from any device.***

## **🌐 Live Demo**

`🔗 Access the project at:` ***https://www.linkstash.com.br***

## **✨ Main Features**

- **Storage of *favorite links*, *notes*, *to-do lists*, and *image gallery***
- **Advanced search with filters by type and name**
- **Secure authentication with Firebase Auth**
- **Responsive design with customizable themes and smooth animations**
- **Real-time synchronization with Firestore**

## **⚙️ Technologies Used**

### `Frontend`

- **⚛️ React.js**
- **🧭 React Router**
- **🎨 Tailwind CSS**
- **🎞️ Framer Motion**
- **🔔 React Icons**
- **🎯 Sonner**

### `Backend + Others`

- 🔥 **Firebase**
  - ***Firestore***
  - ***Auth***
- 📄 **Vite**
- ⚙️ **.env**
- ▲ **Vercel**

## **🚀 How to Use**

- ### `🔐 Authentication`
    - **Full registration with *email*, *phone*, and *password***
    - **Persistent login**
    - **Password recovery via *email***

- ### `📊 Dashboard`
    - **Add: *links*, *notes*, *tasks*, *images***
    - **Real-time viewing and editing**
    - **Filters, search, and organization**

- ### `👤 Profile`
    - **Custom *avatar* and *banner***
    - **Bio and badges *(future gamification)***

- ### `⚙️ Settings`
    - **Password change**
    - **Account deletion with confirmation**

## 💻 Local Installation

To run the project locally, follow the steps below:

- ### `Prerequisites`
    - **Node.js `(v16 or higher)`**
    - **npm or yarn**
    - **Firebase account**

**1. Clone the repository:**

```bash
git clone https://github.com/inkmors/LinkStash.git
cd linkstash
```

**2. Install dependencies:**

```bash
npm install
```

**3. Start the development server:**

```bash
npm run dev
```

**4. Create a `.env` file at the root with your Firebase keys:**

```bash
VITE_FIREBASE_API_KEY=your-key
VITE_FIREBASE_AUTH_DOMAIN=your-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

**5. Access the application:**

```bash
Open your browser and go to http://localhost:3000 (or the configured port).
```

## 📁 Project Structure

```bash
link-stash/
    ├── public/
    ├── src/
    │   ├── assets/         # Images, favicon, etc.
    │   ├── components/     # Reusable React components
    │   ├── contexts/       # Global contexts (e.g., AuthContext, ThemeContext)
    │   ├── hooks/          # Custom hooks (e.g., useAuth, useStorage)
    │   ├── pages/          # App pages (e.g., Home, Login, Dashboard)
    │   ├── App.jsx         # Main app component
    │   ├── firebase.js     # Firebase config and initialization
    │   ├── main.css        # Global styles and Tailwind setup
    │   └── main.jsx        # Application entry point
    ├── package.json        # Project config, scripts, and dependencies
    ├── index.html          # Base HTML file
    └── README.md           # Main project documentation
```

## 🤝 Contribution

Contributions are welcome! If you find a `bug` or have any `suggestions for improvements`, feel free to open an `issue` or submit a `pull request`.

        1. Fork the repository.

        2. Create a branch for your feature (git checkout -b my-feature).
        
        3. Commit your changes (git commit -m 'My new feature').

        4. Push the branch (git push origin my-feature).

        5. Open a Pull Request.

## 📄 License

**Distributed under the *MIT* license.**  
*See the `LICENSE` file for more information.*

## 📧 Contact

- `Instagram:` — ***[@morusu.ink](https://instagram.com/morusu.ink)***  
- `LinkedIn:` — ***[Vinícius Lima](https://www.linkedin.com/in/vin%C3%ADcius-lima-738603284/)***  
- `GitHub:` — ***[@inkmors](https://github.com/inkmors)***  
- `Email:` — ***gvlima.contato@gmail.com***  
- `Project link:` — ***[www.linkstash.com.br](https://www.linkstash.com.br)***

## Thank you 🤍

# 🛡️ Aegis — Marvel Rivals Character Companion App

**Aegis** is a fan-made mobile app built with **React Native** and **Expo**, designed to offer players of the **Marvel Rivals** game a centralized hub for exploring heroes, their abilities, and tips. The app supports authentication, user profiles, and features an engaging UI with sliders, tabs, and themed icons.

---

## 📲 App Highlights

- 🔐 Sign In / Sign Up (with Clerk or custom auth)
- 🦸 Browse heroes with abilities, stats, and visuals
- 🎯 Role-based profiles and favorites management
- 🎨 Animated UI with sliders, tabs, and icons
- ⚙️ Clean folder structure and modular components

---

## 🧰 Tech Stack

- ⚛️ **React Native**
- 🚀 **Expo**
- 💅 **Tailwind CSS**
- 🌐 **React Navigation**
- 🧪 **Clerk** (Auth)
- 🧩 **Modular Component Design**

---

## 📁 Directory Structure

```
aegis/
├── app/
│ ├── (auth)/
│ │ ├── _layout.jsx
│ │ ├── sign-in.jsx
│ │ └── sign-up.jsx
│ ├── (tabs)/
│ │ ├── _layout.jsx
│ │ ├── heroes.jsx
│ │ ├── home.jsx
│ │ └── profile.jsx
│ ├── HeroDetail/
│ │ └── [hero].jsx
│ ├── _layout.jsx
│ ├── index.jsx
│ ├── change-password.jsx
│ └── update-name.jsx
├── assets/
│ ├── fonts/
│ ├── images/
│ ├── Loader/
│ └── Svg/
├── components/
│ ├── Footer.jsx
│ ├── Heroes.jsx
│ ├── Loader.jsx
│ ├── Slider.jsx
│ ├── TabIcon.jsx
│ ├── Teams.jsx
│ └── Updates.jsx
├── constants/
│ └── Colors.ts
├── configs/
│ └── FirebaseConfig.js
├── .env
├── app.config.js
├── package.json
├── README.md
└── ...
```

---

## 🏗️ Key Components

- **`Slider.jsx`** – Carousel used on homepage
- **`TabIcon.jsx`** – Dynamic tab icons for navigation
- **`Heroes.jsx`** – Hero listing with filters
- **`Loader.jsx`** – Loader animation during async operations
- **`Updates.jsx`** – Latest Marvel updates/news
- **`Teams.jsx`** – Explore teams and affiliations
- **`HeroDetail/[hero].jsx`** – Full profile of each hero

---

## 🚀 Getting Started

```bash
git clone https://github.com/MaNaNBaTrA/aegis-app.git
cd aegis-app
npm install
npx expo start
```

> Open Expo Go and scan the QR code to view it on your device.

---



## 🙋‍♂️ Author

**Manan Batra**  
🔗 [GitHub](https://github.com/MaNaNBaTrA)

---

## 🙌 Acknowledgements

- [Marvel Rivals Game](https://marvelrivals.com/) — Character data and visuals  
- [React Native + Expo Community](https://reactnative.dev/) — Core technologies powering the app  
- [LottieFiles](https://lottiefiles.com/) — For beautiful animations used in the app


## 📄 License

This project is for educational and entertainment use only. Not affiliated with or endorsed by Marvel or its partners.

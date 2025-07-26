# 🚗 WheelHub - Mobile App




**WheelHub** is a cross-platform mobile application built with **React Native** using **Expo**, designed to streamline vehicle service management. It connects vehicle owners with mechanics, allows service bookings, profile management, and more.




## 📱 Features


- 🔐 User authentication (login, register)
  
- 🧰 Browse and book nearby mechanics
  
- 📍 View mechanics on an interactive map
  
- 📅 Book and manage service appointments
  
- 👤 Manage user profile and vehicle info
  
- 💬 In-app messaging between users and mechanics
  



## 🛠️ Tech Stack


| Layer       | Technology                   |
|-------------|-------------------------------|
| Mobile App  | React Native + Expo SDK 53    |
| UI Library  | Tailwind CSS (via `nativewind`)|
| Navigation  | React Navigation              |
| Maps        | `react-native-maps`           |
| Realtime    | Firebase or Socket.IO         |




## 🚀 Getting Started


### 1. Prerequisites


- Node.js 18+
- Expo CLI (installed via `npm install -g expo-cli`)
- Expo Go App (for physical device testing)


### 2. Clone the repo


git clone https://github.com/your-username/wheelhub-mobile.git
cd wheelhub-mobile



3. Install dependencies

npm install



4. Start the development server

npx expo start
Open the QR code in Expo Go (Android/iOS) to run the app on your phone.



📁 Project Structure



WheelHub/
├── assets/              # Images, fonts, icons
├── components/          # Reusable UI components
├── screens/             # App screens (Home, Login, etc.)
├── navigation/          # React Navigation setup
├── services/            # API and Firebase services
├── constants/           # App-wide constants & themes
├── App.tsx              # Main entry point
└── app.json             # Expo configuration



🔐 Environment Setup


Create a .env file in the root directory with the following (if using Firebase or custom API):

API_BASE_URL=https://your-api-url.com
FIREBASE_API_KEY=your_api_key
FIREBASE_PROJECT_ID=your_project_id
Use expo-constants or a package like react-native-dotenv to load these.



📦 Key Dependencies


"expo": "^53.0.0",
"react-native": "0.73.4",
"react": "18.2.0",
"react-navigation": "^6.x",
"nativewind": "^3.x",
"react-native-maps": "^1.x",
"axios": "^1.x"


✅ To-Do (Planned Features)


 Chat between users and mechanics

 In-app payment integration

 Admin panel (web)

 Reviews and ratings

 Push notifications

 Car advisor AI assistant

 

🤝 Contributing

Pull requests are welcome. For major changes, open an issue first to discuss what you would like to change.



📄 License

This project is licensed under the MIT License - see the LICENSE file for details.


📬 Contact

Mahaveer Kumar







Tools




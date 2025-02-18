# **InterLink: The Ultimate Platform for Tech & Professional Events**

🚀 **InterLink** is an innovative event publishing and booking platform that connects event organizers with participants seamlessly. Whether it's hackathons, bootcamps, workshops, or professional meetups, **InterLink** makes event discovery, registration, and management effortless.

## **🔹 Features**

### **For Users:**
- Browse, filter, and book events effortlessly.
- Manage event history and tickets via a personalized dashboard.
- Receive event updates and notifications.

### **For Organizers:**
- Publish events with detailed descriptions, venue info, and ticketing options.
- Track participant registrations and manage bookings.
- Get insights through analytics dashboards.

## **🔹 Tech Stack: MERN + Vite + TypeScript**
InterLink leverages the power of **MongoDB, Express.js, React (with Vite), and Node.js**, optimized with **TypeScript** for scalability, performance, and developer efficiency.

## **⚡ Why Vite + React?**
Vite is a **lightning-fast** build tool that enhances React development with:
- ✅ **Super-Fast Hot Module Replacement (HMR):** Instantly reflects changes in the browser.
- ✅ **Optimized Build Performance:** Faster development and production bundling.
- ✅ **ES Modules & Native Browser Support:** No unnecessary transpilation overhead.
- ✅ **Better DX (Developer Experience):** Supports TypeScript out of the box, making development smoother.

## **💡 Why TypeScript?**
Using TypeScript ensures **type safety, better code maintainability, and improved debugging**, making the development process more efficient and reliable.

---

# **🚀 Running InterLink Locally** 🖥️
To run the **InterLink** project on your local machine, follow these steps:

### **1️⃣ Clone the Repository**
```bash
git clone <your-repo-url>
cd interlink
```

### **2️⃣ Install Dependencies**
Run the following command in both the frontend and backend directories:
```bash
npm install
```

### **3️⃣ Start the Development Server**
#### **Frontend (Vite + React):**
```bash
npm run dev
```
#### **Backend (Express + Node.js):**
```bash
npm start  # or nodemon index.js (if using nodemon)
```

### **4️⃣ Access the Application**
Once started, open your browser and go to:
- 👉 **Frontend:** `http://localhost:5001/` (default Vite port)
- 👉 **Backend API:** `http://localhost:5000/` (if running on port 5000)

### **5️⃣ Environment Variables**
Ensure you have a `.env` file in both frontend and backend directories with necessary environment variables such as:

#### **Backend (.env)**
```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

#### **Frontend (.env)**
```env
VITE_API_URL=http://localhost:3001
```

---

🎯 **InterLink is built to scale, ensuring an intuitive and engaging experience for both users and organizers.**

🚀 **Ready to revolutionize event management? Welcome to InterLink!** 🌐

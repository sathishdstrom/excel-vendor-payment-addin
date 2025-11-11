# 💼 Excel Vendor Payment & Bank Statement Manager

An **Excel Office Add-in** that helps you manage vendors, make payments, track account balances, and generate live reports — all directly inside Excel.  
Built using **TypeScript**, **Office.js**, **Webpack**, and local testing via **ngrok**.

---

## 🚀 Features

✅ Secure login and session storage  
✅ Add vendors and assign them to accounts (A/B)  
✅ Make payments (auto-updates Excel balances)  
✅ Vendor payment history tracking  
✅ Generate summarized reports directly in Excel  
✅ Dynamic UI updates  
✅ Works in both **Excel Desktop** and **Excel Online**  
✅ Local HTTPS tunneling via **ngrok**

---

## 🔐 Login Details

| Username | Password |
|-----------|-----------|
| **admin** | **1234** |

These are default credentials defined in `src/auth.ts`.

---

## 🧩 Tech Stack

- [TypeScript](https://www.typescriptlang.org/)
- [Office.js](https://learn.microsoft.com/office/dev/add-ins/)
- [Webpack](https://webpack.js.org/)
- [Excel JavaScript API](https://learn.microsoft.com/javascript/api/excel)
- [ngrok](https://ngrok.com/) for secure local HTTPS URLs

---

2️⃣ Build the Project

To compile TypeScript and bundle with Webpack:

npx webpack --mode development

3️⃣ Start Local Development Server

You can use the Webpack Dev Server to serve your index.html, styles.css, and bundle:

npm start


✅ Default URL:

http://localhost:3000

4️⃣ Expose the Server using ngrok

Since Excel add-ins require HTTPS, use ngrok to tunnel your local server.

Run this in a new terminal:

ngrok http 3000

4️⃣ Expose the Server using ngrok

Since Excel add-ins require HTTPS, use ngrok to tunnel your local server.

Run this in a new terminal:

ngrok http 3000

6️⃣ Sideload the Add-in into Excel
🪟 Excel Desktop

Open Excel.

Go to Home → Add-ins → My Add-ins → Manage My Add-ins → Upload My Add-in.

Browse to and select manifest.xml.

# 🌐 Excel Online

Visit Excel for the web.

# Open a new workbook.

# Go to Insert → Office Add-ins → Upload My Add-in → Browse.

# Select your manifest.xml.

# Your add-in will appear as a taskpane on the right side of Excel.

#  ️⃣ (Optional) Production Build

# To generate an optimized bundle for deployment:

npx webpack --mode development

# Install dependencies
npm install

# Build once for dev
npx webpack --mode development

# Start local dev server
npm start

# Expose HTTPS tunnel
ngrok http 3000

# Build for production
npx webpack --mode production

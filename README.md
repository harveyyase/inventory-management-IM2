# 📦 Inventory Management System

A web-based Inventory Management System developed for academic and small business purposes. It features complete CRUD functionalities, a user authentication system with role-based access control, and organized tabs for managing suppliers, purchase orders, and users.


---

## 📁 Project Structure

```
inventory-management-system/
│
├── css/                       # Stylesheets  
├── dashboard/                 # Dashboard (Optional - May be removed)  
├── images/                    # Project Images  
├── Products/                 # Product Management (Optional)  
├── Reports/                  # Report Export Feature (Optional)  
├── Suppliers/                # Supplier Add/View Pages  
├── Users/                    # User Add/View Pages  
├── supplier-backend/         # Node.js Express Backend  
├── swimlane-diagrams-business-process/  # Business Process Models  
├── index.html                # Landing/Login Page  
└── README.md
```

---

## ✅ Features  
  
- 🔐 **Login Page** — Authenticates users with role-based access.  
- 🧑‍🤝‍🧑 **User Management** — Add, view, and assign roles (Admin/Employee).  
- 🏪 **Supplier Management** — Add, view, update, and delete supplier records.  
- 📦 **Purchase Orders** — Add and view purchase orders.  
- ⚙️ **Backend API** — RESTful API with Express for suppliers and users.  
- 🚨 **Alerts & Notifications** — Feedback messages for user actions.  
- 🔑 **Role-Based Access** — Admin has full access; employees have limited access.  
- 💻 **Desktop-focused UI** — Not mobile responsive.  
- 📉 **Dropdown Handling** — Dropdown menus close responsively on tab switch.  
  
---
  
## 🛠️ Tech Stack  

- **Frontend**: HTML, CSS, JavaScript  
- **Backend**: Node.js, Express.js  
- **Other Tools**: PHP (potential/legacy use), Git & GitHub for version control  

---  
  
## 🧪 CRUD Operations  
  
- **Create**: Add suppliers, users, and purchase orders  
- **Read**: View records via API fetching  
- **Update**: Edit suppliers and user roles  
- **Delete**: Remove suppliers and users  
  
# 🚀 Getting Started

### 1. Clone the repository  
```bash
git clone https://github.com/harveyyase/inventory-management-IM2.git
```

### 2. Navigate to the backend folder  
```bash
cd inventory-management-IM2/supplier-backend
```

### 3. Install dependencies  
```bash
npm install
```

### 4. Install ODBC for SQL Server (Required for Database Access)  
Download and install the **ODBC Driver 18 for SQL Server**:  
👉 https://learn.microsoft.com/en-us/sql/connect/odbc/download-odbc-driver-for-sql-server

### 5. Configure Firewall Access (Azure SQL Database)  
- Make sure your current **public IP** is whitelisted in your Azure SQL Server firewall settings.  
- If you're on a school or company network and get a timeout, try switching to a **hotspot** or ensure **port 1433** is open for outbound traffic.

### 6. Test Database Connection  
Run the following script to test Azure database access:  
```bash
node database-access.js
```
✅ If successful, it will log the first 5 rows from the `Suppliers` table.

### 7. Start the API Server  
```bash
node server.js
```

### 8. Open the System  
Open the `register.html` file located in the frontend folder using your browser.

---

## 👥 Group Members

- **Harvey Gabriele S. Yase**  
- **Ethan Luke C. Gonzales**  
- **Vinz Waldheim M. Villarin**

---

> 💡 Tip: You can also add `"start": "node server.js"` in your `package.json` scripts section so you can just run `npm start` to launch the backend.

---
  
## 📷 Screenshots  
  
- Login Page
---------------------------------------------------------------------------------------  
![image](https://github.com/user-attachments/assets/f6a89bb7-6dab-41cc-a392-ef32ef60765a)  
---------------------------------------------------------------------------------------   
- Supplier Page (Add + View)  
- Purchase Order Page
---------------------------------------------------------------------------------------     
 ![image](https://github.com/user-attachments/assets/1a80bd57-a474-4529-b809-5f512138fd68)  
---------------------------------------------------------------------------------------   
- User Management Tab
---------------------------------------------------------------------------------------       
 ![image](https://github.com/user-attachments/assets/7b934a5d-7c9b-4e6c-9d6e-1a5b9a703d76)    
---------------------------------------------------------------------------------------      

# Finals-UPDATED

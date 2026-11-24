# Vian Tech Service Center Management System
**Full-Stack Next.js + MongoDB Web Application**

---

## 🗄️ Where & How to Add Your MongoDB Link

You can connect your MongoDB database in **two simple ways**:

### Option 1: Directly in the Web App (Recommended)
1. Open the application in your browser: **[http://localhost:3000](http://localhost:3000)**
2. In the top-right corner of the navigation bar, click the **`Database: Set MongoDB Link`** button.
3. Paste your MongoDB connection string into the input box:
   * **MongoDB Atlas (Cloud)**:
     ```text
     mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/service_center_db?retryWrites=true&w=majority
     ```
   * **Local MongoDB**:
     ```text
     mongodb://127.0.0.1:27017/service_center_db
     ```
4. Click **`Save & Connect Database`**. The application will instantly test the connection, connect live, and save it automatically into `.env.local`.

---

### Option 2: In the `.env.local` File
Open the file [`.env.local`](file:///c:/Users/ridmi/Desktop/vian%20tech/service%20center/.env.local) located in the project root directory and set:

```env
# ==============================================================================
# MONGODB CONNECTION STRING
# ==============================================================================
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/service_center_db?retryWrites=true&w=majority
```

Save the file. The server will automatically connect to your database.

---

## 🚫 Zero Hardcoded Data (100% Database-Driven)

All sample/mock hardcoded records have been removed:
* The database starts completely clean and empty.
* No automatic dummy seeding occurs.
* Every vehicle, supplier invoice, service record, customer bill, and operating expense exists only when you add it.
* All financial figures (**Total Revenue**, **Expenses Should Pay Today**, **Total Expenses Paid**, **Net Operating Profit**) are computed dynamically in real time from your live database.

---

## 🚀 Key Modules & Capabilities

### 1. 🚚 Supplier Registration & Payment Tracker (`Supplier` Tab)
*Modeled directly after the Supplier Payment Tracker spreadsheets in your photos:*
* **KPI Summary Cards**: Total Outstanding Payables, Overdue Bills, Ongoing Invoices, Active Suppliers.
* **Supplier Invoices & Overdue Tracker**:
  * Grid: `Invoice_ID`, `Supplier_Name`, `Invoice_No`, `PO/GRN_No`, `Invoice_Date`, `Credit_Days`, `Due_Date`, `Invoice_Amount`, `Amount_Paid`, `Balance`, `Status`, `Days Due/Overdue`, `Reminder`, `Action`.
  * **Dynamic Due Date Calculation**: $\text{Due Date} = \text{Invoice Date} + \text{Credit Days}$.
  * **Overdue Monitor**: Automatically flags overdue bills as `OVERDUE` with exact days overdue and `URGENT` reminder tag.
  * **Status Filters**: Quick filters for `ALL`, `OVERDUE`, `ONGOING`, and `PAID`.
* **Payment Settlement Modal (`💳 Pay Now`)**:
  * Log payments by **Cheque**, **Cash**, or **Bank Transfer**.
  * Automatically recalculates balance and reduces overdue amounts.
* **Cheque Register & Payments Log**: Tracks cheque numbers, issue dates, clearing dates, and bank accounts.
* **Supplier Master**: Register suppliers with credit terms (30, 45, 60, 90 days).

---

### 2. 🧾 Customer Service Bill & Printing (`Job` Tab)
* Select a vehicle by number to view its complete chronological service history.
* Log services done on the day:
  * Package Labor Charges (Full Service, Oil & Filter Change, Brake Service, Transmission, Engine Tuning).
  * Itemized parts and consumables.
  * Checklist inspection items.
  * Total bill calculation: $\text{Labor} + \text{Used Items} - \text{Discount}$.
* **Printable Customer Bill**: Itemized invoice with company header, customer details, parts list, payment method, next service recommendation, and signature lines.
* **1-Click Print**: Click **`🖨️ Print Customer Bill`** to print or export as PDF.

---

### 3. 🚗 Vehicle Registration (`Cs/Vehicle` Tab)
* Exact match to the desktop reference window in your photo:
  * `Vehicle No` & `Edit Vehicle No` with inline `Update` button.
  * `Cs Name`, `Address`, `Mobile/Tel`, `Home`, `Office`.
  * `City`, `Cs Status`, `V/Type`, `V/Model`, `Colour`.
  * `Engine Number`, `Chassis Number`, `BirthDay`, `Tag No`, `Delivery Date`.
  * Live filter search grid with direct shortcuts to add a job or view history.

---

### 4. 💰 Expenses & Revenue Dashboard (`Expenses` & `Expen/Group` Tabs)
* **Live KPI Cards**: Total Revenue, Should Pay Today, Total Expenses Settled, Net Profit / Cashflow.
* **"PAYMENTS REQUIRING ATTENTION - TODAY" Banner & Table** (Matching Excel sheet):
  * Displays all overdue and due-today supplier invoices with `URGENT` alert badges and 1-click `Pay Now` buttons.
* **Operating Expenses Log** (Matching `Daily Sale.xlsx` Lists):
  * Categories: `Supplier`, `Electricity`, `Telephone`, `CCS Bank`, `Salary`, `Medicine`, `Maintenance`, `Tea & Sugar`, `Staff`, `Meals`, `Kerosine oil`, `Cash payments`, `Seylan`.
  * Payment methods: `Cash`, `Card`, `Bank Transfer`, `Cheque`, `Credit (Pay Later)`.
* **Group Analysis (`Expen/Group`)**: Categorical distribution of expenses and revenue streams with visual progress bars.

---

### 5. 📦 Parts Inventory Catalog (`Item` Tab)
* Stock on hand, selling prices, item codes, and categories supplied by your registered vendors.

---

## 💻 Running the Application

To run the development server:
```powershell
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

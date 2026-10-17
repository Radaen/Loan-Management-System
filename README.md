# LoanFlow Pro - ប្រព័ន្ធគ្រប់គ្រងប្រាក់កម្ចី (Loan Management System)

ប្រព័ន្ធគ្រប់គ្រងប្រាក់កម្ចីពេញលេញ (Full-stack Loan Management System) ត្រូវបានអភិវឌ្ឍឡើងយ៉ាងម៉ត់ចត់ស្របតាម **Flowchart Diagram** ដែលបានផ្ដល់ជូន៖

```
[Start]
   │
   ▼
[Register Customer] (ចុះឈ្មោះអតិថិជន)
   │
   ▼
[Submit Loan Application] (ដាក់ពាក្យស្នើសុំប្រាក់កម្ចី)
   │
   ▼
[Review Loan Application] (ត្រួតពិនិត្យពាក្យស្នើសុំ)
   │
   ▼
 <Approved?> ─── No ──► [Reject Loan] (បដិសេធ) ──► [End]
   │
  Yes
   ▼
[Create Loan] (បង្កើតកម្ចី)
   │
   ▼
[Generate Loan Schedule] (បង្កើតកាលវិភាគសងប្រាក់)
   │
   ▼
[Disburse Loan] (បើកផ្តល់ប្រាក់កម្ចី)
   │
   ▼
[Customer Makes Payment] ◄──────────────────┐
   │                                        │
   ▼                                        │
 <Fully Paid?> ─── No ──► [Continue Payment]┘
   │
  Yes
   ▼
[Close Loan] (បិទកម្ចីជោគជ័យ) ──► [End]
```

---

## 🛠️ បច្ចេកវិជ្ជាដែលបានប្រើប្រាស់ (Tech Stack)

- **Frontend:**
  - **React JS** (Vite)
  - **Tailwind CSS v4** (Modern Dark UI, Glassmorphism & Responsive Design)
  - **Lucide Icons** & **Canvas Confetti**
  - **Bilingual Interface:** ភាសាខ្មែរ 🇰🇭 និង English 🇺🇸
- **Backend:**
  - **Node.js** & **Express**
  - **RESTful API Architecture**
- **Database:**
  - **MongoDB** តាមរយៈ **Mongoose Models** (`Customer`, `Loan`, `Payment`)
  - **Hybrid Storage Resilience:** ភ្ជាប់ MongoDB ស្វ័យប្រវត្តិ (ឬ fallback ទៅ local JSON database `server/data/db.json` បើ MongoDB មិនទាន់ start ដើម្បីការពារមិនអោយគាំង)

---

## 🚀 របៀបដំណើរការប្រព័ន្ធ (How to Run)

### វិធីទី ១: ចុចដំណើរការដោយផ្ទាល់ (One-Click Launch)
ចុច double-click លើ file:
```
d:\MIS\Loan Management\start.bat
```
វានឹងបើកដំណើរការ Server (Port 5000) និង Frontend (Port 3000) រួចបើក Web Browser ដោយស្វ័យប្រវត្តិ!

---

### វិធីទី ២: ដំណើរការតាម Terminal / PowerShell

#### 1. ចាប់ផ្តើម Backend Server:
```powershell
cd "d:\MIS\Loan Management\server"
npm start
```
*API ដំណើរការនៅ: `http://localhost:5000`*

#### 2. ចាប់ផ្តើម Frontend React:
```powershell
cd "d:\MIS\Loan Management\client"
npm run dev
```
*Web App ដំណើរការនៅ: `http://localhost:3000`*

---

## ✨ មុខងារសំខាន់ៗនៃប្រព័ន្ធ (Key Features)

1. **Dashboard KPI & Flowchart Architecture:**
   - បង្ហាញស្ថិតិប្រាក់បានបើកផ្តល់សរុប (Total Disbursed), ប្រាក់ប្រមូលបាន (Collected), សមតុល្យនៅជំពាក់ (Outstanding Balance) និងពាក្យស្នើរង់ចាំការសម្រេច (Pending Review)។
   - មាន **Flowchart Visualizer** បង្ហាញដ្យាក្រាមដំណើរការផ្ទាល់នៅលើអេក្រង់។
2. **Step 1: Register Customer (ចុះឈ្មោះអតិថិជន):**
   - កត់ត្រាឈ្មោះជាភាសាខ្មែរ/ឡាតាំង, អត្តសញ្ញាណប័ណ្ណ, លេខទូរស័ព្ទ, អាសយដ្ឋាន, មុខរបរ, ប្រាក់ចំណូលប្រចាំខែ, អ្នកធានា (Guarantor) និងទ្រព្យបញ្ចាំ (Collateral)។
3. **Step 2: Submit Loan Application (ស្នើសុំកម្ចី):**
   - ជ្រើសរើសអតិថិជន, ចំនួនប្រាក់, អត្រាការប្រាក់ (% ក្នុងមួយឆ្នាំ), រយៈពេល (ខែ), ប្រភេទកម្ចី (Personal, Business, Agriculture, Vehicle, Housing, Emergency)។
   - មាន **Live Amortization Preview** គណនាប្រាក់ត្រូវបង់ប្រចាំខែភ្លាមៗ។
4. **Step 3 & 4: Review Loan Application & Decision (Approved / Reject):**
   - មន្ត្រីឥណទានអាចត្រួតពិនិត្យ និងជ្រើសរើស **Approved (Yes)** ដើម្បី Create Loan ឬ **Reject (No)** ព្រមទាំងបញ្ចូលមូលហេតុបដិសេធ។
5. **Step 5: Generate Loan Schedule & Disburse Loan (បើកផ្តល់ប្រាក់កម្ចី):**
   - គណនាកាលវិភាគសងប្រាក់ពេញលេញ (កាលបរិច្ឆេទ, ប្រាក់ដើម, ការប្រាក់, សរុបត្រូវបង់, សមតុល្យនៅសល់)។
   - កត់ត្រាមធ្យោបាយបើកផ្តល់ (ABA, Wing, ACLEDA, Cash) និងលេខយោង។
6. **Step 6 & 7: Customer Makes Payment & Fully Paid Decision:**
   - ទទួលការទូទាត់សងតាមវគ្គនីមួយៗ ឬសងផ្តាច់ (Early Payoff)។
   - ប្រសិនបើសងមិនទាន់អស់ -> ស្ថិតិនៅជា **Continue Payment** (រង្វិលជុំ Loop)។
   - ប្រសិនបើសងអស់ ១០០% -> ស្វ័យប្រវត្តិក្លាយជា **Close Loan** (End Flowchart) ជាមួយ Effect អបអរសាទរ!
7. **Official Payment Receipts & Print Schedules:**
   - អាច Print ឬ Preview បង្កាន់ដៃបង់ប្រាក់ផ្លូវការ (Payment Receipt) និងតារាងកាលវិភាគសងប្រាក់ (Amortization Schedule)។
8. **Interactive Loan Simulator:**
   - ម៉ាស៊ីនគណនាការប្រាក់ដែលអាចអូស Slider ដើម្បីសាកល្បងមុននឹងដាក់ពាក្យស្នើ។

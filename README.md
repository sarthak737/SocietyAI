# 🏘️ SocietyOS (SocietyAI)

A premium, AI-driven Housing Society Management System built with **Next.js 14**, **Prisma**, and **Google Gemini AI**. SocietyOS streamlines communication between residents and management, automates complaint tracking with AI, and provides a modern interface for society governance.

---

## ✨ Key Features

### 🤖 AI-Powered Complaint Management
- **Automatic Classification:** Complaints are automatically categorized (Plumbing, Electrical, Security, etc.) using Gemini AI.
- **Urgency Detection:** AI detects the urgency level (Low to Critical) based on the resident's input.
- **Multimodal Support:** Residents can submit complaints via **Text or Voice** (Audio analysis powered by Gemini).
- **Intelligent Summarization:** Automatically generates concise summaries for the admin dashboard.

### 👤 Resident Portal
- **Smart Dashboard:** View status of personal complaints and recent society updates.
- **Interactive Rules:** Ask questions about society rules and get AI-powered answers based strictly on society bylaws.
- **Real-time Messaging:** Direct communication channel with admins for specific complaints.

### 🛠️ Admin Panel
- **Global Overview:** Comprehensive dashboard with statistics on complaints and society health.
- **Trend Analysis:** AI-generated executive summaries of recent complaints to identify recurring issues.
- **User Management:** Complete control over resident accounts and roles.
- **Rule Management:** Effortlessly update society bylaws and rules.

---

## 🚀 Tech Stack

- **Framework:** [Next.js 14 (App Router)](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/)
- **AI Engine:** [Google Gemini AI](https://aistudio.google.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)

---

## 🛠️ Getting Started

### Prerequisites
- **Node.js** 18.x or higher
- **PostgreSQL** instance (local or hosted)
- **Google Gemini API Key**

### Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd societyOS
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory (refer to `.env.example`):
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/societyai"
   NEXTAUTH_SECRET="your-nextauth-secret"
   GEMINI_API_KEY="your-gemini-api-key"
   ```

4. **Initialize Database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run Development Server:**
   ```bash
   npm run dev
   ```

6. **Access the App:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```text
societyOS/
├── prisma/             # Database schema and migrations
├── public/             # Static assets
└── src/
    ├── app/            # Next.js App Router (Routes & APIs)
    │   ├── admin/      # Admin Dashboard pages
    │   ├── api/        # Backend API endpoints
    │   ├── login/      # Auth pages
    │   └── resident/   # Resident Dashboard pages
    ├── components/     # Reusable UI components
    ├── lib/            # Shared utilities (AI, DB, Auth)
    └── types/          # TypeScript definitions
```

---

## 🔒 Security & Roles
The application uses role-based access control (RBAC):
- **RESIDENT:** Can submit complaints, view rules, and message admins.
- **ADMIN:** Full access to dashboards, analytics, and user management.

---

## 📄 License
This project is licensed under the MIT License.
# Class QA Board

A modern, real-time Q&A platform designed for classroom environments. Built with Next.js, Supabase, and TypeScript, this application enables instructors to create interactive Q&A sessions where students can submit questions anonymously or with their names.

## ✨ Features

- **Real-time Q&A Sessions**: Create sessions that update live as questions are submitted
- **QR Code Access**: Generate QR codes for easy student access to question submission
- **Session Management**: Open/close sessions, view analytics, and manage questions
- **Participant Analytics**: Track question counts and export participant data
- **Anonymous & Named Questions**: Support for both anonymous and named question submission
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Authentication**: Secure login with Google OAuth and email/password
- **Real-time Updates**: Live updates using Supabase real-time subscriptions

## 🚀 Tech Stack

- **Frontend**: Next.js 14 with App Router, React 18, TypeScript
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: Zustand
- **Authentication**: Supabase Auth with Google OAuth
- **Deployment**: Vercel

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A Supabase account and project
- Git installed on your machine

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/KaelNierras/class-qa-board.git
   cd class-qa-board
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory with the following variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

4. **Supabase Setup**
   
   Create the following tables in your Supabase database:

   **Sessions Table:**
   ```sql
   CREATE TABLE sessions (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     title TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
     created_by UUID REFERENCES auth.users(id),
     is_open BOOLEAN DEFAULT true
   );
   ```

   **Questions Table:**
   ```sql
   CREATE TABLE questions (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     text TEXT NOT NULL,
     session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
     created_by TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
   );
   ```

   **Enable Row Level Security (RLS):**
   ```sql
   -- Enable RLS
   ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
   ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

   -- Sessions policies
   CREATE POLICY "Users can view their own sessions" ON sessions
     FOR SELECT USING (auth.uid() = created_by);
   
   CREATE POLICY "Users can create sessions" ON sessions
     FOR INSERT WITH CHECK (auth.uid() = created_by);
   
   CREATE POLICY "Users can update their own sessions" ON sessions
     FOR UPDATE USING (auth.uid() = created_by);

   CREATE POLICY "Users can delete their own sessions" ON sessions
     FOR DELETE USING (auth.uid() = created_by);

   -- Questions policies
   CREATE POLICY "Anyone can view questions" ON questions FOR SELECT USING (true);
   CREATE POLICY "Anyone can insert questions" ON questions FOR INSERT WITH CHECK (true);
   ```

5. **Configure Google OAuth (Optional)**
   
   In your Supabase dashboard:
   - Go to Authentication → Providers
   - Enable Google provider
   - Add your Google OAuth credentials

## 🏃‍♂️ Running the Application

1. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

2. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### For Instructors:

1. **Create an Account**: Sign up using Google OAuth or email/password
2. **Create a Session**: Click "Quick Create" to start a new Q&A session
3. **Share QR Code**: Display the generated QR code for students to scan
4. **Manage Questions**: View incoming questions in real-time
5. **Control Session**: Open/close sessions and delete when finished
6. **View Analytics**: Check participant statistics and export data

### For Students:

1. **Access Session**: Scan QR code or visit the session URL
2. **Submit Questions**: Enter your name (optional) and question
3. **Real-time Feedback**: See confirmation when questions are submitted

## 📁 Project Structure

```
class-qa-board/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   ├── (authenticated)/          # Protected routes
│   ├── (unauthenticated)/        # Public routes
│   └── layout.tsx               # Root layout
├── components/                   # Reusable UI components
│   ├── ui/                      # shadcn/ui components
│   └── ...                      # Custom components
├── lib/                         # Utility functions
├── types/                       # TypeScript type definitions
├── utils/                       # Supabase configuration
└── public/                      # Static assets
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |
| `NEXT_PUBLIC_BASE_URL` | Base URL for QR code generation | Yes |

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/KaelNierras/class-qa-board)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the React framework
- [Supabase](https://supabase.com/) for the backend infrastructure
- [shadcn/ui](https://ui.shadcn.com/) for the UI components
- [Tailwind CSS](https://tailwindcss.com/) for styling

## 📞 Support

If you encounter any issues or have questions, please [open an issue](https://github.com/KaelNierras/class-qa-board/issues) on GitHub.

---

Made with ❤️ for educators and students everywhere.

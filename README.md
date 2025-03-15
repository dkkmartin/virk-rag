# VIRK-RAG 🚀

A modern Next.js application built with TypeScript, featuring RAG (Retrieval-Augmented Generation) capabilities for Danish business data.

This project provides an intelligent interface to interact with data from https://datacvr.virk.dk/, Denmark's central business registry. It implements a RAG system that allows users to query and analyze Danish business data using their own OpenAI API keys, enabling a personalized and secure AI-powered search experience.

## 🌟 Features

- **RAG Implementation**:
  - Semantic search over Danish business registry data
  - Integration with OpenAI API for intelligent query processing
  - User-provided API keys for secure and personalized access
- **Modern Stack**: Built with Next.js 15 and React 19
- **Type Safety**: Full TypeScript support
- **State Management**: Zustand for efficient state handling
- **UI Components**:
  - Shadcn/UI components for a beautiful, accessible interface
  - Custom styled components with Tailwind CSS
- **Form Handling**: React Hook Form with Zod validation
- **Authentication**: NextAuth.js integration
- **Theme Support**: Dark/Light mode with next-themes
- **Data Visualization**: Recharts integration for business data insights
- **Toast Notifications**: Sonner for beautiful notifications

## 🛠️ Tech Stack

### Core

- [Next.js 15](https://nextjs.org/) - React framework
- [React 19](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety

### State Management & Data Handling

- [Zustand](https://zustand-demo.pmnd.rs/) - State management
- [React Hook Form](https://react-hook-form.com/) - Form handling
- [Zod](https://zod.dev/) - Schema validation

### UI & Styling

- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Shadcn/UI](https://ui.shadcn.com/) - Styled, accessible components
- [Lucide React](https://lucide.dev/) - Icon library
- [Recharts](https://recharts.org/) - Data visualization
- [Sonner](https://sonner.emilkowal.ski/) - Toast notifications

### Authentication & Security

- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [next-themes](https://github.com/pacocoursey/next-themes) - Theme management

## 📁 Project Structure

```
virk-rag/
├── src/
│   ├── app/          # App router pages
│   ├── components/   # React components
│   ├── lib/          # Utility functions and RAG implementation
│   ├── hooks/        # Custom React hooks
│   └── types/        # TypeScript types
├── public/           # Static assets

```

## 🔧 Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

# AskMira AI Assistant Application

## Overview

This is a full-stack React application built with Express.js backend that appears to be an AI assistant platform called "AskMira". The application features a modern chat interface with multiple interaction modes including text, voice, AI detection, and neural link capabilities. It uses a monorepo structure with shared TypeScript schemas and a component-based architecture built on shadcn/ui.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM configured for PostgreSQL
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple
- **Development**: tsx for TypeScript execution in development

### Build & Development
- **Monorepo Structure**: Shared code between client and server in `/shared` directory
- **Development Server**: Vite dev server with HMR integrated with Express
- **Production Build**: Separate builds for client (Vite) and server (esbuild)
- **Database Migrations**: Drizzle Kit for schema management

## Key Components

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` for type-safe sharing between client/server
- **Current Schema**: User authentication with username/password
- **Migration Strategy**: Push-based migrations via `drizzle-kit push`

### Authentication System
- **User Model**: Simple username/password authentication
- **Storage Interface**: Abstracted storage layer with in-memory implementation for development
- **Session Management**: Express sessions with PostgreSQL backing

### UI Components
- **Design System**: shadcn/ui with "new-york" style variant
- **Theme**: Dark mode optimized with custom AskMira brand colors
- **Component Library**: Comprehensive set including forms, dialogs, data display, and navigation
- **Icons**: Lucide React for consistent iconography

### API Architecture  
- **Route Structure**: RESTful API with `/api` prefix
- **Error Handling**: Centralized error middleware with proper HTTP status codes
- **Logging**: Request/response logging for API endpoints
- **Type Safety**: Shared TypeScript types between client and server

## Data Flow

1. **Client Requests**: React components use TanStack Query for server state management
2. **API Layer**: Express routes handle business logic and database operations
3. **Database Operations**: Drizzle ORM provides type-safe database queries
4. **Response Handling**: Standardized JSON responses with proper error handling
5. **State Updates**: React Query automatically updates UI when server state changes

## External Dependencies

### Core Runtime
- **Database**: PostgreSQL via @neondatabase/serverless (prepared for Neon DB)
- **Authentication**: Built-in session management
- **File Upload**: Not currently implemented
- **External APIs**: None currently integrated

### Development Tools
- **Replit Integration**: Configured for Replit development environment
- **Hot Reload**: Vite HMR with Express integration
- **Error Overlay**: Runtime error modal for development
- **Code Mapping**: Source map support for debugging

## Deployment Strategy

### Production Build
- **Client Build**: Vite builds to `dist/public` directory
- **Server Build**: esbuild bundles server to `dist/index.js`
- **Static Assets**: Client build served by Express in production
- **Environment**: NODE_ENV-based configuration

### Database Setup
- **Local Development**: In-memory storage for rapid prototyping
- **Production**: PostgreSQL via DATABASE_URL environment variable
- **Migrations**: Manual push-based migrations using Drizzle Kit
- **Schema Evolution**: Shared TypeScript schemas ensure type safety

### Infrastructure Requirements
- Node.js runtime environment
- PostgreSQL database instance
- Environment variables for database connection
- Static file serving capability for client assets

The application is structured as a modern full-stack TypeScript application with a focus on type safety, developer experience, and scalable architecture patterns. The current implementation provides a solid foundation for an AI assistant platform with room for extending features like real-time chat, external AI integrations, and advanced user management.
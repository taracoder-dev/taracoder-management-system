# 💼 Taracoder Management System (TMS)

A comprehensive, enterprise-level management system built with **Angular 21**, **TypeScript**, **Tailwind CSS**, and modern web technologies. Designed as an internal company portal with role-based access control for multiple user types.

## 🎯 Project Overview

The Taracoder Management System is a scalable, professional web application that streamlines corporate operations through:

- **Multi-Role Dashboard System**: Role-specific dashboards for 8 different user types
- **Enterprise RBAC**: Advanced role-based access control with granular permissions
- **Real-World Workflows**: Leave management, project tracking, sales CRM, attendance, and more
- **Professional UI**: Modern, responsive design with Tailwind CSS
- **Mock Data**: Complete dummy data for testing without backend

## 👥 Supported Roles

| Role | Email | Password | Features |
|------|-------|----------|----------|
| 👑 Super Admin | super@taracoder.com | 123456 | Full system control, analytics, user management |
| 🛠️ Admin | admin@taracoder.com | 123456 | Employee management, system monitoring |
| 👨‍💼 HR Manager | hr@taracoder.com | 123456 | Leave approvals, employee records, salary slips |
| 📋 Project Manager | pm@taracoder.com | 123456 | Project creation, team assignment, progress tracking |
| 🧑‍🏫 Team Leader | tl@taracoder.com | 123456 | Team management, leave approvals, performance reviews |
| 👨‍💻 Developer | dev@taracoder.com | 123456 | Task management, leave requests, profile |
| 💰 Sales Manager | sm@taracoder.com | 123456 | Lead management, team management, sales reports |
| 📞 Sales Team | sales@taracoder.com | 123456 | Lead tracking, status updates, assigned leads |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm 9+
- Angular CLI 21.2+

### Installation

```bash
# Clone the repository
cd taracoder-management-system

# Install dependencies
npm install

# Start the development server
npm start
```

Navigate to `http://localhost:4200/`. The application will automatically reload when you modify source files.

## 📁 Project Structure

```
src/app/
├── core/
│   ├── guards/          # Authentication & role-based guards
│   ├── models/          # TypeScript interfaces & types
│   └── services/        # Core services (Auth, Data, Role)
├── shared/
│   └── components/      # Reusable components (table, sidebar, navbar)
├── modules/
│   ├── auth/            # Login & authentication
│   ├── dashboard/       # Role-based dashboards
│   ├── hr/              # Employees, leaves, attendance
│   ├── project/         # Projects & tasks
│   ├── sales/           # Leads & CRM
│   └── employee/        # Employee profile
├── app.routes.ts        # Application routing
├── app.config.ts        # App configuration
└── app.ts              # Root component
```

## 🌟 Key Features

### Authentication System
- ✅ Mock login with static credentials
- ✅ Session-based authentication
- ✅ Secure token generation
- ✅ Automatic session persistence

### Role-Based Access Control (RBAC)
- ✅ Route guards for protected pages
- ✅ Permission-based feature visibility
- ✅ Role-specific menu navigation
- ✅ 25+ granular permissions

### HR Module
- 📝 **Employee Management**: Add, edit, view, delete employees
- 📅 **Leave Management**: Apply, approve, reject leaves with multi-level approvals
- ✓ **Attendance System**: Check-in/check-out, monthly reports, late tracking
- 📊 **Performance Reviews**: Rating system, feedback collection
- 💰 **Salary Slips**: Generate and view salary information
- 📄 **Document Management**: Upload and manage employee documents

### Project Module
- 📋 **Project Management**: Create, edit, track projects
- ✅ **Task Management**: Assign tasks, track progress, update status
- 📊 **Project Analytics**: Budget tracking, progress visualization
- 🎯 **Team Assignment**: Allocate resources to projects

### Sales Module
- 💼 **Lead Management**: Create, track, convert leads
- 📊 **CRM Dashboard**: Sales pipeline, conversion rates, revenue tracking
- 🎯 **Lead Filtering**: Filter by status, source, value
- 📈 **Sales Reports**: Team performance, conversion metrics

### Dashboard System
- 🎯 **Role-Specific Dashboards**: Each role has a customized dashboard
- 📊 **KPI Cards**: Real-time metrics and statistics
- 📈 **Analytics Charts**: Visual progress indicators
- 🔔 **Notifications**: System-wide notifications with read status

### User Interface
- 🎨 **Professional Design**: Modern card-based layouts
- 📱 **Responsive**: Works on desktop, tablet, and mobile
- 🌈 **Color-Coded**: Role-based color schemes
- ⚡ **Smooth Animations**: Page transitions and hover effects
- 🌙 **Dark Mode Support**: Theme toggle functionality

### Data Management
- 📊 **Advanced Tables**: Search, sort, filter, pagination
- 🔍 **Global Search**: Find across all modules
- 📄 **Bulk Actions**: Select and perform actions on multiple items
- 💾 **Mock Data**: Complete dummy data for all features

## 🏗️ Architecture & Best Practices

### Angular 21 Patterns
- ✅ **Standalone Components**: All components are standalone
- ✅ **Signals API**: Modern state management with signals
- ✅ **Typed Reactive Forms**: Strict type checking
- ✅ **OnPush Change Detection**: Performance optimized
- ✅ **Dependency Injection**: Service-based architecture

### Code Quality
- 📝 **TypeScript Strict Mode**: Maximum type safety
- 🎯 **Single Responsibility**: Focused, reusable components
- 🔄 **DRY Principle**: Reusable services and components
- 🛡️ **Type Safety**: Full TypeScript coverage

## 🎨 Styling & UI

- **Framework**: Tailwind CSS (via CDN)
- **Icons**: Emoji-based universal compatibility
- **Colors**: Professional blue/indigo gradient scheme
- **Typography**: Clear hierarchy and readability
- **Spacing**: Consistent 8px base unit system

## 📊 Dashboard Features

### Super Admin Dashboard
- System-wide analytics
- User management overview
- System health metrics
- Full permission visibility

### Admin Dashboard
- Employee statistics
- System usage monitoring
- Department overview
- Pending requests

### HR Dashboard
- Active employee count
- Leave approvals pending
- Attendance rates
- Performance reviews due

### Project Manager Dashboard
- Active projects count
- Completed tasks
- Budget utilization
- Team workload

### Team Leader Dashboard
- Team member count
- Weekly task completions
- Leave requests
- Team performance

### Developer Dashboard
- Assigned tasks
- Completed work
- Leave balance
- Hours logged

### Sales Manager Dashboard
- Lead pipeline
- Conversion rates
- Revenue tracking
- Team performance

### Sales Team Dashboard
- Assigned leads
- Conversion count
- Follow-ups pending
- Salary information

## 🔐 Security Features

- ✅ Role-based route guards
- ✅ Permission-based UI rendering
- ✅ Session validation
- ✅ Automatic logout on inactivity
- ✅ Secure token management

## 🎯 Module Details

### Authentication Module
- Professional login page
- Demo account quick-fill buttons
- Session management
- Remember me (localStorage)

### Shared Components
- **Sidebar**: Collapsible navigation with role-based menu
- **Navbar**: Top navigation with notifications and profile
- **Data Table**: Advanced table with search, sort, filter, pagination
- **Modal**: Reusable modal dialogs

### Services
- **AuthService**: User authentication and session management
- **RoleService**: Permission checking and role utilities
- **DataService**: Mock data operations with Observable patterns

## 🚀 Advanced Features

### Notifications System
- Real-time notification display
- Mark as read functionality
- Notification type indicators
- Notification counter badge

### Activity Logging
- User action tracking
- Module-based logging
- Timestamp recording
- IP address logging capability

### Performance Optimization
- OnPush change detection
- Lazy loading routes
- Signal-based state management
- RxJS operators for efficient data handling

## 📱 Responsive Design

- Mobile-first approach
- Adaptive layouts
- Touch-friendly interface
- Collapsible sidebar for mobile

## 🧪 Testing

The application uses mock data throughout. No real backend API calls are made. All data operations are simulated with RxJS observables and configurable delays.

## 📦 Build & Deployment

```bash
# Development build
npm run watch

# Production build
npm run build

# The output will be in the dist/ directory
```

## 🔄 Development Workflow

```bash
# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build
```

## 🎓 Learning Resources

This project demonstrates:
- Angular 21 best practices
- TypeScript strict typing
- Signals for state management
- Reactive programming with RxJS
- Professional UI/UX patterns
- Enterprise architecture
- RBAC implementation
- Mock data patterns

## 📄 File Structure Overview

```
taracoder-management-system/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── guards/
│   │   │   │   └── auth.guard.ts
│   │   │   ├── models/
│   │   │   │   └── index.ts
│   │   │   └── services/
│   │   │       ├── auth.service.ts
│   │   │       ├── data.service.ts
│   │   │       └── role.service.ts
│   │   ├── shared/
│   │   │   └── components/
│   │   │       ├── sidebar.component.ts
│   │   │       ├── navbar.component.ts
│   │   │       ├── data-table.component.ts
│   │   │       └── unauthorized.component.ts
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   └── login.component.ts
│   │   │   ├── dashboard/
│   │   │   │   └── dashboard.component.ts
│   │   │   ├── hr/
│   │   │   │   └── hr.components.ts
│   │   │   ├── project/
│   │   │   │   └── project.components.ts
│   │   │   ├── sales/
│   │   │   │   └── leads.component.ts
│   │   │   └── employee/
│   │   │       └── employee-profile.component.ts
│   │   ├── app.routes.ts
│   │   ├── app.config.ts
│   │   └── app.ts
│   ├── main.ts
│   ├── index.html
│   └── styles.css
├── angular.json
├── package.json
├── tsconfig.json
└── README.md
```

## ✨ Key Highlights

1. **Professional Grade**: Enterprise-level architecture and design
2. **Fully Functional**: All features work without backend
3. **Mock Data**: Complete sample data for testing
4. **Scalable**: Easy to add new modules and features
5. **Maintainable**: Clean code, organized structure
6. **Modern**: Angular 21, TypeScript, Signals API
7. **Accessible**: WCAG compliant components
8. **Responsive**: Works on all devices

## 🔗 Quick Navigation

- **Login Page**: http://localhost:4200/auth/login
- **Dashboard**: http://localhost:4200/dashboard
- **HR Module**: http://localhost:4200/hr
- **Projects**: http://localhost:4200/project/projects
- **Tasks**: http://localhost:4200/project/tasks
- **Leads**: http://localhost:4200/sales/leads
- **Profile**: http://localhost:4200/employee/profile

## 📝 Demo Credentials

All demo accounts use password: **123456**

## 🤝 Contributing

This is a demonstration project. Feel free to fork and extend with additional features.

## 📜 License

This project is provided as-is for educational and demonstration purposes.

## 👨‍💼 About

Built as a comprehensive demonstration of modern Angular development practices, enterprise architecture patterns, and professional UI/UX design principles.

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Built with**: Angular 21, TypeScript, Tailwind CSS

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

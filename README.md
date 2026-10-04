# FINANZAS PERSONALES

Aplicación web modular e independiente de gestión de **Finanzas Personales**, construida desde cero con **Next.js (App Router)**, **TypeScript**, **Tailwind CSS** y **Firebase** (Firebase Authentication y Cloud Firestore).

---

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 16 (App Router)
- **Lenguaje**: TypeScript (Strict Mode)
- **Estilos**: Tailwind CSS + Glassmorphism & Framer Motion
- **Base de Datos & Auth**: Firebase Authentication + Cloud Firestore
- **Gráficas**: Recharts
- **Iconos**: Lucide React
- **Pruebas**: Vitest

---

## 🏗️ Arquitectura del Proyecto

El proyecto sigue una adaptación limpia de **Clean Architecture / Arquitectura Hexagonal** para asegurar separación de responsabilidades, mantenibilidad y escalabilidad sin sobreingeniería innecesaria.

```
src/
├── app/                    # Next.js App Router (Rutas de Auth, Onboarding y Dashboard)
├── domain/                 # Núcleo de Dominio (Modelos, Entidades, Servicios de Cálculo Financiero y Repositorios)
│   ├── entities/           # UserProfile, Category, Frequency, Expense, ExtraIncome, InvestmentConfig, Activity
│   ├── repositories/       # Interfaces de repositorios (IUserProfileRepository, IExpenseRepository, etc.)
│   └── services/           # FinancialCalculator (Centralización de lógica y fórmulas financieras)
├── infrastructure/         # Acceso a Firebase y persistencia en Firestore
│   └── firebase/           # Repositorios concretos e inicialización de SDK
├── application/            # Contextos de aplicación (AuthContext)
├── hooks/                  # Custom Hooks de Integración de Dominio/UI
├── components/             # Componentes UI Reutilizables
│   ├── ui/                 # Button, Card, Input, Modal, LoadingSpinner, EmptyState
│   ├── layout/             # Sidebar, Header
│   ├── auth/               # LoginForm, RegisterForm
│   ├── onboarding/         # OnboardingWizard, PortfolioCreationAnimation
│   ├── dashboard/          # FinancialCards, ExpenseDonutChart, ActivityList
│   ├── categories/         # CategoryList, CategoryModal
│   ├── ingresos/           # ExtraIncomeList, ExtraIncomeModal
│   ├── salario/            # SalaryForm, SalaryDistributionChart
│   ├── inversiones/        # InvestmentForm, InvestmentCard
│   ├── gastos/             # ExpenseModal
│   └── resumen/            # ResumenOverview
└── __tests__/              # Pruebas unitarias de dominio y aislamiento de datos
```

---

## 🔐 Aislamiento de Datos por UID (Firestore)

Cada usuario mantiene un aislamiento total de sus registros financieros. Ninguna consulta trae "todos los registros de la base de datos" para luego filtrarlos en frontend.

### Estructura en Cloud Firestore:
```
users/{uid}/
  ├── profile/main            (Documento: salario, estado onboarded, timestamps)
  ├── categories/             (Colección: categorías del usuario)
  ├── frequencies/            (Colección: frecuencias de gastos recurrentes)
  ├── expenses/               (Colección: gastos del usuario)
  ├── extraIncome/            (Colección: ingresos adicionales al salario)
  ├── investmentConfig/main   (Documento: meta de inversión % o monto fijo)
  └── investmentContributions/(Colección: aportes reales a inversión)
```

### Reglas de Seguridad (`firestore.rules`):
```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## ⚙️ Configuración y Variables de Entorno

1. Copiar el archivo `.env.local.example` a `.env.local`:
```bash
cp .env.local.example .env.local
```

2. Configurar tus credenciales de Firebase Client SDK en `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
NEXT_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:abcdef123456
```

---

## 🚀 Ejecución en Desarrollo

```bash
npm run dev
```
La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

---

## 🧪 Ejecutar Pruebas

```bash
npm test
```

---

## 📦 Build de Producción

```bash
npm run build
npm start
```

---

## 📌 Flujo de Usuario Implementado

1. **Autenticación**: Registro o Iniciar sesión con Firebase Auth (Email/Contraseña).
2. **Onboarding Inicial (Wizard)**:
   - Configuración de salario mensual inicial.
   - Selección de categorías de gastos frecuentes.
   - Gastos recurrentes opcionales con su frecuencia.
3. **Animación "Creando tu portafolio..."**: Transición fluida con mensajes dinámicos tras guardar la configuración en Firestore.
4. **Dashboard**:
   - Tarjetas resumidas (Salario, Gastos, Ingresos Extra, Disponible).
   - Gráfica Donut dinámica de distribución de gastos por categoría.
   - Tabla de actividad de los últimos 10 días.
5. **Secciones independientes**:
   - **Categorías**: Gestión de categorías y frecuencias de gastos (archivado sin eliminación destructiva).
   - **Ingresos Extra**: Registro de ingresos adicionales que no modifican el salario base.
   - **Salario**: Visualización y edición del salario mensual.
   - **Inversión**: Configuración por porcentaje % o monto fijo $, seguimiento de estado (Cumplido/En progreso/Pendiente) y registro de aportes.
   - **Resumen**: Métricas completas, desglose de gastos por categoría al mes y cálculo de dinero disponible restante.

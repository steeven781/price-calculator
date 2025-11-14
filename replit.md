# Calculadora de Precios y Cuotas

## Overview
A beautiful dark-themed price and installment calculator for converting USD to Guatemalan Quetzales (GTQ) with profit margin calculation, IVA tax, and installment payment plans. Built with React, TypeScript, and Tailwind CSS.

## Recent Changes
- **2025-01-14**: Initial implementation
  - Created calculator schema with types and constants
  - Built complete calculator UI component with dark theme
  - Integrated Lucide React icons throughout
  - Implemented PDF export functionality for installment tables
  - Configured dark theme in index.html

## Features
- **Currency Conversion**: USD to GTQ with fixed exchange rate (TC = 8.0)
- **Profit Calculation**: Dynamic profit margin calculation
- **Dual Payment Modes**:
  - Cash: Simple price display without tax
  - Card: Includes 12% IVA tax with installment options
- **Installment Plans**: 7 payment plans (2, 3, 6, 10, 12, 18, 24 months) with bank fees
- **PDF Export**: Download installment tables as PDF
- **Product Description**: Custom labeling for each calculation
- **Dark Theme**: Beautiful dark UI matching design guidelines
- **Lucide Icons**: Modern icon system for visual clarity
- **Responsive Design**: Mobile and desktop optimized

## Technical Stack
- **Frontend**: React 18, TypeScript, Wouter (routing)
- **UI Components**: Shadcn UI, Tailwind CSS
- **Icons**: Lucide React
- **PDF Export**: html2pdf.js (via CDN)
- **Backend**: Express.js (minimal, for future extensibility)
- **Storage**: In-memory (no persistence needed for calculator)

## Project Architecture
```
client/
  src/
    pages/
      calculator.tsx          # Main calculator component
    components/ui/            # Shadcn UI components
shared/
  schema.ts                   # Calculator types and constants
server/
  routes.ts                   # API routes (minimal)
  storage.ts                  # Storage interface
```

## Calculation Formulas

### Base Conversion
```
Base Price in Q = USD Price × 8
```

### Profit Margin
```
Sales Price = Base Price Q / (1 - Profit% / 100)
```

### IVA Tax (Card Payments)
```
Price with IVA = Sales Price × 1.12
```

### Installment Calculation
```
For each plan:
  Total Fee % = Bank Fee % + Extra Fee % (1.61%)
  Monthly Payment = (Price with IVA / (1 - Total Fee % / 100)) / Number of Months
```

### Installment Plans Configuration
| Months | Bank Fee % |
|--------|-----------|
| 2      | 8.68%     |
| 3      | 9.24%     |
| 6      | 10.64%    |
| 10     | 10.92%    |
| 12     | 11.76%    |
| 18     | 15.12%    |
| 24     | 16.8%     |

Additional fixed fee: 1.61%

## Design Guidelines
The application follows strict dark theme design guidelines:
- **Colors**: Dark slate backgrounds (#020617), blue accents (#1d4ed8)
- **Typography**: System UI font stack, hierarchical sizing
- **Spacing**: Consistent Tailwind units (4, 6, 8, 12, 16)
- **Components**: Shadcn UI with custom dark theme tokens
- **Icons**: Lucide React icons for all visual cues
- **Interactions**: Subtle hover states, elevation system
- **Responsive**: Mobile-first approach with breakpoints at 640px

## User Preferences
- Language: Spanish (es)
- Currency: Guatemalan Quetzales (Q)
- Theme: Dark mode only
- Exchange Rate: Fixed at 8.0 (USD to GTQ)

## Future Enhancements (Not in MVP)
- Calculation history with local storage
- Customizable exchange rate settings
- Multi-currency support
- User accounts for saved calculations
- Email/WhatsApp sharing for quotes

# Calculadora de Precios y Cuotas

A beautiful dark-themed price and installment calculator for converting USD to Guatemalan Quetzales (GTQ) with profit margin calculation, IVA tax, and installment payment plans.

## Features

- **Currency Conversion**: USD to GTQ with fixed exchange rate (TC = 8.0)
- **Profit Calculation**: Dynamic profit margin calculation
- **Dual Payment Modes**:
  - Cash: Simple price display without tax
  - Card: Includes 12% IVA tax with installment options
- **Installment Plans**: 7 payment plans (2, 3, 6, 10, 12, 18, 24 months) with bank fees
- **PDF Export**: Download installment tables as PDF
- **Product Description**: Custom labeling for each calculation
- **Dark Theme**: Beautiful dark UI with Tailwind CSS
- **Lucide Icons**: Modern icon system for visual clarity
- **Responsive Design**: Mobile and desktop optimized

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Shadcn UI** components
- **Lucide React** for icons
- **html2pdf.js** for PDF export (loaded via CDN)

## Installation

1. **Replace the package.json file**:
   ```bash
   mv package-vite.json package.json
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## Project Structure

```
price-calculator/
├── src/
│   ├── components/
│   │   └── ui/           # Shadcn UI components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── select.tsx
│   │       ├── switch.tsx
│   │       ├── toast.tsx
│   │       └── toaster.tsx
│   ├── hooks/
│   │   └── use-toast.ts  # Toast notification hook
│   ├── lib/
│   │   ├── schema.ts     # Calculator types and logic
│   │   └── utils.ts      # Utility functions
│   ├── pages/
│   │   └── Calculator.tsx # Main calculator component
│   ├── App.tsx           # Root component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles with Tailwind
├── index.html            # HTML entry point
├── vite.config.ts        # Vite configuration
├── tailwind.config.ts    # Tailwind configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies
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

## Usage

1. Enter the product description (optional)
2. Enter the price in USD
3. Enter the profit margin percentage
4. Toggle between Cash and Card payment modes
5. Click "Calcular Precios" to see results
6. For card payments, view installment plans and download as PDF

## Design

The application follows a dark theme design:
- **Colors**: Dark slate backgrounds (#020617), blue accents (#1d4ed8)
- **Typography**: System UI font stack
- **Components**: Shadcn UI with custom dark theme
- **Icons**: Lucide React icons
- **Responsive**: Mobile-first approach

## License

MIT

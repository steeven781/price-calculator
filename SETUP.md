# Quick Setup Guide

## Step 1: Replace package.json

The current `package.json` is for a full-stack Express app. We need to use the Vite-specific one:

```bash
mv package.json package-old.json
mv package-vite.json package.json
```

## Step 2: Install Dependencies

```bash
npm install
```

This will install:
- React 18 with TypeScript
- Vite for fast development
- Tailwind CSS for styling
- Radix UI components
- Lucide React icons
- All necessary dev dependencies

## Step 3: Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Step 4: Build for Production

```bash
npm run build
```

The production build will be in the `dist/` folder.

## Project Structure

```
price-calculator/
├── src/
│   ├── components/ui/     # Reusable UI components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utilities and business logic
│   ├── pages/             # Page components
│   ├── App.tsx            # Root component
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── index.html             # HTML template
├── vite.config.ts         # Vite configuration
├── tailwind.config.ts     # Tailwind configuration
└── tsconfig.json          # TypeScript configuration
```

## Features Implemented

✅ USD to GTQ currency conversion (TC = 8.0)
✅ Profit margin calculation
✅ Cash vs Card payment modes
✅ IVA (12%) calculation for card payments
✅ 7 installment plans (2, 3, 6, 10, 12, 18, 24 months)
✅ Bank fee calculations
✅ PDF export functionality
✅ Dark theme UI
✅ Responsive design
✅ Toast notifications
✅ Product description field

## Troubleshooting

If you encounter any issues:

1. **Port already in use**: Change the port in `vite.config.ts`
2. **Module not found**: Run `npm install` again
3. **TypeScript errors**: Run `npm run build` to check for type errors

## Next Steps

1. Customize the exchange rate in `src/lib/schema.ts`
2. Modify bank fees in `src/lib/schema.ts`
3. Adjust colors in `tailwind.config.ts`
4. Add more features as needed

# Data Structure Documentation

This document explains how all demo and configuration data is organized for easy deployment.

## Modular Data Files

All data is stored in separate TypeScript files for easy maintenance and version control:

### 📁 `src/data/scenarios.ts`
Contains 6 complete demo scenarios with realistic business data:

1. **Credit Card Dispute AI** (BMO Bank)
2. **IT Support Knowledge Base AI** (Global Technology Services)
3. **Patient Intake & Eligibility** (Regional Healthcare Network)
4. **Loan Application Assistant** (First National Consumer Finance)
5. **HR Exit Interview Manager** (Global Workforce Solutions)
6. **Sales Forecasting Copilot** (Enterprise Software Corp)

Each scenario includes:
- Contact information
- Business problem statement
- Expected outcomes
- Technical requirements
- Integration details
- Budget and deal stage
- Realistic file attachments (with metadata)

### 📁 `src/config/appConfig.ts`
Application configuration settings:
- Database enable/disable flag
- Demo mode settings
- Feature flags

### 📁 `src/utils/analysisGenerator.ts`
Business logic for generating AI analysis:
- Complexity scoring algorithm
- Agent count estimation
- Technical requirement analysis
- No external dependencies

### 📁 `src/utils/creditCalculator.ts`
Credit consumption calculation logic:
- Credit estimation formulas
- Timeline calculation
- Responsible AI feature mapping
- All calculations done client-side

## Zero Database Dependency

The application is designed to work completely without a database:

### ✅ What Works Without Database:
- All 6 demo scenarios with auto-fill
- Form validation and error handling
- AI analysis generation
- Credit consumption calculator
- Draft auto-save (uses localStorage)
- Complete user experience

### 🔄 What Uses Database (Optional):
- Real form submissions persistence
- Historical submission tracking
- Admin analytics view

### 🎯 Deployment Modes:

**Demo Mode** (No database)
```bash
# Remove or comment out .env variables
npm run build
# Deploy dist/ folder anywhere
```

**Production Mode** (With database)
```bash
# Set Supabase credentials in .env
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key

npm run build
# Deploy with environment variables configured
```

## File Locations

```
src/
├── data/
│   └── scenarios.ts          # All demo scenarios
├── config/
│   └── appConfig.ts          # App configuration
├── utils/
│   ├── analysisGenerator.ts  # Analysis logic
│   └── creditCalculator.ts   # Credit calculations
├── components/
│   ├── EnhancedDealIntakeForm.tsx  # Main form (DB optional)
│   ├── UserAnalysisResult.tsx      # Analysis display
│   ├── CreditForecast.tsx          # Credit calculator
│   └── ...
└── lib/
    └── supabase.ts           # DB types (optional)
```

## Customization Guide

### Adding New Demo Scenarios

Edit `src/data/scenarios.ts`:

```typescript
{
  name: 'Your Scenario Name',
  color: 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-300',
  data: {
    requestor_name: 'Name',
    requestor_email: 'email@company.com',
    company: 'Company Name',
    // ... all other fields
    attachments: [
      {
        type: 'file',
        name: 'filename.pdf',
        url: '#',
        size: 1000000,
        displayName: 'Display Name',
        description: 'Description',
        tags: ['Tag1', 'Tag2']
      }
    ]
  }
}
```

### Modifying Analysis Logic

Edit `src/utils/analysisGenerator.ts`:
- Adjust complexity scoring weights
- Change agent count calculations
- Modify risk factor detection

### Updating Credit Calculations

Edit `src/utils/creditCalculator.ts`:
- Update base credit amounts
- Adjust multiplier formulas
- Change timeline estimates

## Benefits of This Architecture

✅ **No vendor lock-in** - Works without any third-party services
✅ **Easy deployment** - Deploy to any static host
✅ **Fast demos** - All data loads instantly
✅ **Version controlled** - All demo data in Git
✅ **Easy customization** - Edit TypeScript files
✅ **Type safe** - Full TypeScript support
✅ **Scalable** - Add database when needed

## Deployment Checklist

- [ ] Review demo scenarios in `src/data/scenarios.ts`
- [ ] Update company branding/logos
- [ ] Decide: Demo mode or Database mode
- [ ] If database: Set up Supabase and add credentials
- [ ] Run `npm run build`
- [ ] Deploy `dist/` folder
- [ ] Test all demo scenarios
- [ ] Verify form submission works

# System Patterns: Vipayment

## Architecture Overview
Vipayment menggunakan **JAMstack architecture** dengan Nuxt.js sebagai frontend static generator dan external APIs untuk business logic.

```
Frontend (Nuxt.js) -> API Gateway -> Payment Services
                   -> Game Services
                   -> Notification Services
```

## Frontend Patterns

### Component Structure
```
components/
├── vipayment/          # Core business components
├── payment/            # Payment processing
└── getapi/            # API integration utilities
```

### Key Design Patterns

#### 1. Modal-Driven Workflow
- `VipGameModal.vue`: Main service selection modal
- `VipGameBuyForm.vue`: Purchase form with validation
- `VipGamePaymentConfirm.vue`: Payment confirmation
- `VipGameSuccessReceipt.vue`: Transaction completion

#### 2. Service-Specific Components
- **Game Services**: `VipGameServicesForm`, `VipGameOrderTopUpForm`
- **Prepaid Services**: `VipPrepaidServicesForm`, `VipPrepaidOrderForm`
- **Status Checking**: `VipGameCheckStatusForm`, `VipPrepaidCheckForm`

#### 3. Data Flow Pattern
1. **Service Discovery**: Fetch available services per game
2. **Service Selection**: User chooses specific service
3. **Form Validation**: Input validation dan nickname checking
4. **Payment Processing**: Secure payment workflow
5. **Order Tracking**: Status monitoring dan receipt generation

## State Management
- **Reactive Refs**: For component-level state
- **Composables**: Reusable logic untuk API calls
- **Local Storage**: For cart dan user preferences

## API Integration Patterns

### Endpoint Structure
```
/vipayment/game/services     # Get available services
/vipayment/game/order/topup  # Create top-up order
/vipayment/game/order/joki   # Create joki order
/vipayment/game/check        # Check order status
/vipayment/prepaid/*         # Prepaid services
```

### Error Handling Pattern
- Try-catch blocks dengan user-friendly messages
- Loading states dengan skeleton screens
- Fallback content untuk failed API calls

## Routing Strategy
- **Static Routes**: `/`, `/game`, `/prepaid`
- **Dynamic Routes**: `/game/[slug]` untuk individual games
- **Modal Routes**: Handled via component state, not router

## Styling Patterns
- **TailwindCSS**: Utility-first styling
- **Component Scoping**: Scoped styles untuk complex components
- **Design System**: Consistent spacing, colors, dan typography
- **Responsive Design**: Mobile-first approach

## Performance Patterns
- **Static Generation**: Pre-built pages untuk fast loading
- **Image Optimization**: Optimized game thumbnails
- **Code Splitting**: Component-level lazy loading
- **API Caching**: Cached responses untuk frequently accessed data 
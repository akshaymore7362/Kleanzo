# Kleanzo - System Architecture Documentation

## Overview
Kleanzo is built on Next.js 14+ App Router, utilizing Server Components for marketplace SEO and Client Components for dynamic dashboard views.

```
+-------------------------------------------------------------------+
|                        Next.js App Router                         |
|  +------------------+  +-------------------+  +----------------+  |
|  | Public Market    |  | Studio Portal     |  | Agency Portal  |  |
|  | /, /services,    |  | /pro, /projects   |  | /agency        |  |
|  | /agencies        |  |                   |  |                |  |
|  +------------------+  +-------------------+  +----------------+  |
+-------------------------------------------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------+
|                       Domain Services Layer                       |
|  +-------------------------+    +------------------------------+  |
|  | AgencyMatchingService   |    | PaymentService (Razorpay)    |  |
|  +-------------------------+    +------------------------------+  |
|  | BookingService          |    | NotificationService          |  |
|  +-------------------------+    +------------------------------+  |
+-------------------------------------------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------+
|                     Prisma ORM & SQLite / Postgres                |
+-------------------------------------------------------------------+
```

### Key Subsystems
1. **Agency Matching Engine** (`src/lib/matching/agency-matching.ts`): Weighted score calculation.
2. **Payment Abstraction** (`src/lib/payments/payment-service.ts`): Pluggable payment gateway wrapper.
3. **Notification System** (`src/lib/notifications/notification-service.ts`): In-app, Email, SMS, WhatsApp notifications.

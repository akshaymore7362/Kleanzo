export interface PaymentRequest {
  bookingId: string;
  amount: number;
  currency: string;
  customerEmail: string;
  customerName: string;
  notes?: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionId: string;
  gatewayOrderId: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'PAID' | 'FAILED';
  invoiceUrl?: string;
  timestamp: string;
}

export interface PaymentGateway {
  name: string;
  createOrder(request: PaymentRequest): Promise<PaymentResponse>;
  verifyPayment(gatewayOrderId: string, signature: string): Promise<boolean>;
  refund(transactionId: string, amount?: number): Promise<{ refundId: string; status: string }>;
}

export class MockRazorpayGateway implements PaymentGateway {
  name = 'Razorpay';

  async createOrder(request: PaymentRequest): Promise<PaymentResponse> {
    const mockOrderId = `order_${Math.random().toString(36).substring(2, 10)}`;
    const mockTxId = `pay_${Math.random().toString(36).substring(2, 12)}`;

    return {
      success: true,
      transactionId: mockTxId,
      gatewayOrderId: mockOrderId,
      amount: request.amount,
      currency: request.currency || 'INR',
      status: 'PAID',
      invoiceUrl: `/api/invoices/${mockTxId}`,
      timestamp: new Date().toISOString(),
    };
  }

  async verifyPayment(gatewayOrderId: string, signature: string): Promise<boolean> {
    return true; // Mock verification
  }

  async refund(transactionId: string, amount?: number) {
    return {
      refundId: `rfnd_${Math.random().toString(36).substring(2, 10)}`,
      status: 'PROCESSED',
    };
  }
}

export class PaymentService {
  private gateway: PaymentGateway;

  constructor(gateway: PaymentGateway = new MockRazorpayGateway()) {
    this.gateway = gateway;
  }

  async processBookingPayment(request: PaymentRequest): Promise<PaymentResponse> {
    console.log(`[PaymentService] Processing payment via ${this.gateway.name} for booking ${request.bookingId}`);
    return this.gateway.createOrder(request);
  }

  async refundBooking(transactionId: string, amount?: number) {
    return this.gateway.refund(transactionId, amount);
  }
}

export const paymentService = new PaymentService();

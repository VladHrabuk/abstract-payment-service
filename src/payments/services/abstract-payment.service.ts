export abstract class AbstractPaymentService {
  abstract processPayment(
    amount: number,
    details: Record<string, string>,
  ): Promise<{ status: string }>;
}

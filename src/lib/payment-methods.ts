export type PaymentMethodId =
  | "easypaisa"
  | "jazzcash"
  | "bank_card"
  | "bank_transfer"
  | "raast";

export interface PaymentMethod {
  id: PaymentMethodId;
  name: string;
  description: string;
  icon: string;
  color: string;
  accountNumber?: string;
  accountTitle?: string;
  instructions: string[];
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "easypaisa",
    name: "EasyPaisa",
    description: "Mobile wallet — send payment to our EasyPaisa account",
    icon: "💚",
    color: "#00a651",
    accountNumber: "0345-1234567",
    accountTitle: "Dream Dubai Pvt Ltd",
    instructions: [
      "Open EasyPaisa app on your phone",
      "Go to Send Money → EasyPaisa Transfer",
      "Enter account number and exact amount",
      "Add your email in notes/reference",
      "Copy Transaction ID and paste below",
    ],
  },
  {
    id: "jazzcash",
    name: "JazzCash",
    description: "Mobile wallet — send payment to our JazzCash account",
    icon: "🔴",
    color: "#ee2a24",
    accountNumber: "0300-9876543",
    accountTitle: "Dream Dubai Pvt Ltd",
    instructions: [
      "Open JazzCash app on your phone",
      "Tap Send Money → JazzCash Account",
      "Enter merchant number and exact amount",
      "Save the Transaction ID (TID)",
      "Paste TID below to confirm payment",
    ],
  },
  {
    id: "bank_card",
    name: "Debit / Credit Card",
    description: "Visa, Mastercard, or local bank debit card",
    icon: "💳",
    color: "#0066ff",
    instructions: [
      "Enter your card details securely",
      "Amount will be charged in PKR equivalent",
      "Payment verified instantly",
      "Tickets issued after successful charge",
    ],
  },
  {
    id: "bank_transfer",
    name: "Bank Transfer (IBFT)",
    description: "Transfer from any Pakistani bank account",
    icon: "🏦",
    color: "#ffd700",
    accountNumber: "PK12 HABB 0000 1234 5678 9012",
    accountTitle: "Dream Dubai Pvt Ltd",
    instructions: [
      "Login to your bank app or internet banking",
      "Select IBFT / Bank Transfer",
      "Enter account details and exact amount",
      "Use your registered email as reference",
      "Enter bank reference number below",
    ],
  },
  {
    id: "raast",
    name: "Raast (Instant Payment)",
    description: "State Bank instant payment system",
    icon: "⚡",
    color: "#9b59b6",
    accountNumber: "dreamdubai@bank",
    accountTitle: "Dream Dubai Pvt Ltd",
    instructions: [
      "Open your bank app with Raast enabled",
      "Select Pay via Raast ID",
      "Enter Raast ID and amount",
      "Confirm payment and copy reference",
      "Paste reference number below",
    ],
  },
];

export function getPaymentMethod(id: PaymentMethodId): PaymentMethod | undefined {
  return PAYMENT_METHODS.find((m) => m.id === id);
}

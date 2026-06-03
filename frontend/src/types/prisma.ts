export type Role = "USER" | "ADMIN";
export type DrawStatus = "ACTIVE" | "SOLD_OUT" | "COMPLETED" | "CANCELLED";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CategoryImage {
  id: string;
  categoryId: string;
  url: string;
  sortOrder: number;
}

export interface Draw {
  id: string;
  campaignCode: string;
  title: string;
  description: string;
  prizeValue: number;
  prizeCurrency: string;
  tokenPrice: number;
  totalTokens: number;
  soldTokens: number;
  imageUrl: string;
  badge: string | null;
  ticketMultiplier: number;
  drawDate: string | Date;
  endDate: string | Date;
  status: DrawStatus;
  winnerTokenId: string | null;
  winnerId: string | null;
  drawSeed: string | null;
  drawnAt: string | Date | null;
  categoryId: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface DrawImage {
  id: string;
  drawId: string;
  url: string;
  sortOrder: number;
}

export interface Token {
  id: string;
  tokenNumber: string;
  drawId: string;
  userId: string;
  paymentId: string | null;
  purchasedAt: string | Date;
}

export interface Payment {
  id: string;
  userId: string;
  drawId: string;
  amount: number;
  currency: string;
  quantity: number;
  status: PaymentStatus;
  paymentMethod: string | null;
  transactionRef: string | null;
  payerPhone: string | null;
  stripeSessionId: string | null;
  stripePaymentId: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface UserSummary {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  createdAt: string | Date;
}

export type DrawWithCategory = Draw & { category: Category };

export type DrawWithCategoryAndImages = DrawWithCategory & {
  images: DrawImage[];
};

export type DrawWithCategoryAndCount = DrawWithCategory & {
  _count: { tokens: number };
};

export type CompletedDrawWithWinner = DrawWithCategory & {
  winner: { firstName: string; lastName: string } | null;
};

export type CategoryWithGalleryAndDraws = Category & {
  images: CategoryImage[];
  draws: DrawWithCategoryAndImages[];
};

export type CategoryWithDraws = Category & {
  draws: DrawWithCategory[];
};

export type TokenWithDraw = Token & {
  draw: DrawWithCategory;
};

export type PaymentWithDraw = Payment & {
  draw: Draw;
};

export type AdminUser = UserSummary;

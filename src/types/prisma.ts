import type { Prisma } from "@prisma/client";

export type Category = Prisma.CategoryGetPayload<Record<string, never>>;
export type Draw = Prisma.DrawGetPayload<Record<string, never>>;
export type Token = Prisma.TokenGetPayload<Record<string, never>>;
export type Payment = Prisma.PaymentGetPayload<Record<string, never>>;

export type DrawWithCategory = Prisma.DrawGetPayload<{
  include: { category: true };
}>;

export type DrawWithCategoryAndImages = Prisma.DrawGetPayload<{
  include: { category: true; images: { orderBy: { sortOrder: "asc" } } };
}>;

export type DrawWithCategoryAndCount = Prisma.DrawGetPayload<{
  include: { category: true; _count: { select: { tokens: true } } };
}>;

export type CompletedDrawWithWinner = Prisma.DrawGetPayload<{
  include: {
    category: true;
    winner: { select: { firstName: true; lastName: true } };
  };
}>;

export type CategoryWithGalleryAndDraws = Prisma.CategoryGetPayload<{
  include: {
    images: { orderBy: { sortOrder: "asc" } };
    draws: {
      include: {
        category: true;
        images: { orderBy: { sortOrder: "asc" } };
      };
    };
  };
}>;

export type CategoryWithDraws = Prisma.CategoryGetPayload<{
  include: {
    draws: { include: { category: true } };
  };
}>;

export type TokenWithDraw = Prisma.TokenGetPayload<{
  include: { draw: { include: { category: true } } };
}>;

export type PaymentWithDraw = Prisma.PaymentGetPayload<{
  include: { draw: true };
}>;

export type AdminUser = Prisma.UserGetPayload<{
  select: {
    id: true;
    email: true;
    firstName: true;
    lastName: true;
    role: true;
    createdAt: true;
  };
}>;

export type PrismaTransaction = Prisma.TransactionClient;

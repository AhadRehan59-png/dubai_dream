import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { getCategoryImages, getDrawImages, getPrimaryImage } from "../lib/images";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Dream Dubai database...");

  const adminPassword = await bcrypt.hash("admin123", 12);
  const userPassword = await bcrypt.hash("user123", 12);

  const existingAdmin = await prisma.user.findUnique({
    where: { email: "admin@dreamdubai.ae" },
  });
  if (existingAdmin) {
    await prisma.user.update({
      where: { email: "admin@dreamdubai.ae" },
      data: {
        passwordHash: adminPassword,
        firstName: "Admin",
        lastName: "Dream Dubai",
        role: "ADMIN",
      },
    });
  } else {
    await prisma.user.create({
      data: {
        email: "admin@dreamdubai.ae",
        passwordHash: adminPassword,
        firstName: "Admin",
        lastName: "Dream Dubai",
        phone: "+923001234567",
        role: "ADMIN",
      },
    });
  }

  let user = await prisma.user.findUnique({ where: { email: "user@example.com" } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: "user@example.com",
        passwordHash: userPassword,
        firstName: "Ahmed",
        lastName: "Hassan",
        phone: "+923009876543",
        role: "USER",
      },
    });
  }

  const categories = [
    { name: "Electronics", slug: "electronics", description: "Latest gadgets and tech prizes", icon: "📱", sortOrder: 1 },
    { name: "Cash", slug: "cash", description: "Win cash prizes in AED", icon: "💵", sortOrder: 2 },
    { name: "Auto", slug: "auto", description: "Luxury cars and vehicles", icon: "🚗", sortOrder: 3 },
    { name: "Gold", slug: "gold", description: "Gold bars and jewelry", icon: "🥇", sortOrder: 4 },
    { name: "Lifestyle", slug: "lifestyle", description: "Luxury lifestyle experiences", icon: "✨", sortOrder: 5 },
    { name: "Travel", slug: "travel", description: "Dream vacation packages", icon: "✈️", sortOrder: 6 },
  ];

  for (const cat of categories) {
    let category = await prisma.category.findUnique({ where: { slug: cat.slug } });
    if (category) {
      category = await prisma.category.update({ where: { slug: cat.slug }, data: cat });
    } else {
      category = await prisma.category.create({ data: cat });
    }

    await prisma.categoryImage.deleteMany({ where: { categoryId: category.id } });
    const images = getCategoryImages(cat.slug);
    for (let i = 0; i < images.length; i++) {
      await prisma.categoryImage.create({
        data: { categoryId: category.id, url: images[i], sortOrder: i },
      });
    }
  }

  const cashCategory = await prisma.category.findUnique({ where: { slug: "cash" } });
  const electronicsCategory = await prisma.category.findUnique({ where: { slug: "electronics" } });
  const autoCategory = await prisma.category.findUnique({ where: { slug: "auto" } });
  const goldCategory = await prisma.category.findUnique({ where: { slug: "gold" } });
  const lifestyleCategory = await prisma.category.findUnique({ where: { slug: "lifestyle" } });

  const now = new Date();
  const endDate = new Date(now.getTime() + 36 * 60 * 60 * 1000);

  const drawsData = [
    {
      campaignCode: "DC-00944",
      title: "Cash",
      description: "Win AED 100,000 in cash! One lucky winner takes home this life-changing prize.",
      prizeValue: 100000,
      tokenPrice: 20,
      totalTokens: 5000,
      soldTokens: 2340,
      badge: "FEATURED",
      ticketMultiplier: 5,
      categoryId: cashCategory!.id,
      categorySlug: "cash",
    },
    {
      campaignCode: "DC-00945",
      title: "iPhone 16 Pro Max",
      description: "Win the latest iPhone 16 Pro Max 256GB. Brand new, sealed box.",
      prizeValue: 4999,
      tokenPrice: 15,
      totalTokens: 500,
      soldTokens: 312,
      badge: "HOT",
      ticketMultiplier: 3,
      categoryId: electronicsCategory!.id,
      categorySlug: "electronics",
    },
    {
      campaignCode: "DC-00946",
      title: "Mercedes-Benz C-Class",
      description: "Drive away in a brand new Mercedes-Benz C-Class 2026.",
      prizeValue: 250000,
      tokenPrice: 50,
      totalTokens: 10000,
      soldTokens: 890,
      badge: "MEGA PRIZE",
      ticketMultiplier: 1,
      categoryId: autoCategory!.id,
      categorySlug: "auto",
    },
    {
      campaignCode: "DC-00947",
      title: "Gold Bar 1kg",
      description: "Pure 24K gold bar weighing 1 kilogram. Certified and authenticated.",
      prizeValue: 320000,
      tokenPrice: 30,
      totalTokens: 3000,
      soldTokens: 1200,
      categoryId: goldCategory!.id,
      categorySlug: "gold",
    },
    {
      campaignCode: "DC-00948",
      title: "Maldives Luxury Trip",
      description: "7 nights all-inclusive luxury resort in the Maldives for 2 people.",
      prizeValue: 45000,
      tokenPrice: 25,
      totalTokens: 2000,
      soldTokens: 456,
      categoryId: lifestyleCategory!.id,
      categorySlug: "lifestyle",
    },
  ];

  for (const { categorySlug, ...drawData } of drawsData) {
    const imageUrl = getPrimaryImage(drawData.campaignCode, categorySlug);
    let draw = await prisma.draw.findUnique({ where: { campaignCode: drawData.campaignCode } });

    if (draw) {
      draw = await prisma.draw.update({
        where: { campaignCode: drawData.campaignCode },
        data: { imageUrl },
      });
    } else {
      draw = await prisma.draw.create({
        data: {
          ...drawData,
          imageUrl,
          drawDate: endDate,
          endDate,
          status: "ACTIVE",
        },
      });
    }

    await prisma.drawImage.deleteMany({ where: { drawId: draw.id } });
    const drawImages = getDrawImages(drawData.campaignCode, categorySlug);
    for (let i = 0; i < drawImages.length; i++) {
      await prisma.drawImage.create({
        data: { drawId: draw.id, url: drawImages[i], sortOrder: i },
      });
    }
  }

  const cashDraw = await prisma.draw.findUnique({ where: { campaignCode: "DC-00944" } });
  if (cashDraw) {
    for (let i = 1; i <= 5; i++) {
      const tokenNumber = `DC-00944-${String(i).padStart(6, "0")}`;
      const existingToken = await prisma.token.findUnique({ where: { tokenNumber } });
      if (!existingToken) {
        await prisma.token.create({
          data: { tokenNumber, drawId: cashDraw.id, userId: user.id },
        });
      }
    }
  }

  console.log("Seed completed!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

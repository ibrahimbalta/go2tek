import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { FALLBACK_PRODUCTS } from '@/lib/store-queries';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const search = searchParams.get('q')?.trim();
  const brand = searchParams.get('brand')?.trim();
  const cosmetic = searchParams.get('cosmetic')?.trim();
  const minPrice = Number(searchParams.get('minPrice') || 0);
  const maxPrice = Number(searchParams.get('maxPrice') || 0);
  const minRamGb = Number(searchParams.get('minRamGb') || 0);

  try {
    // STRICT PRIVACY GUARANTEE: Public store endpoint ONLY queries prisma.product (isPublished: true)
    // BuyerRequest and SellerOffer tables are NEVER queried or exposed here.
    const whereClause: Record<string, unknown> = {
      isPublished: true,
    };

    if (category && category !== 'ALL') {
      whereClause.category = category;
    }

    if (brand && brand !== 'ALL') {
      whereClause.brand = { contains: brand };
    }

    if (cosmetic && cosmetic !== 'ALL') {
      whereClause.cosmeticCondition = cosmetic;
    }

    if (minRamGb > 0) {
      whereClause.ramGb = { gte: minRamGb };
    }

    if (minPrice > 0 || maxPrice > 0) {
      const priceFilter: Record<string, number> = {};
      if (minPrice > 0) priceFilter.gte = minPrice;
      if (maxPrice > 0) priceFilter.lte = maxPrice;
      whereClause.price = priceFilter;
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search } },
        { brand: { contains: search } },
        { model: { contains: search } },
        { cpu: { contains: search } },
        { gpu: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Store products DB fallback:', error);
    // Fallback for serverless environments without initialized SQLite
    const filtered = FALLBACK_PRODUCTS.filter((p) => {
      if (!p.isPublished) return false;
      if (category && category !== 'ALL' && p.category !== category) return false;
      if (brand && brand !== 'ALL' && !p.brand.toLowerCase().includes(brand.toLowerCase())) return false;
      if (cosmetic && cosmetic !== 'ALL' && p.cosmeticCondition !== cosmetic) return false;
      if (minRamGb > 0 && p.ramGb < minRamGb) return false;
      if (minPrice > 0 && p.price < minPrice) return false;
      if (maxPrice > 0 && p.price > maxPrice) return false;
      if (search) {
        const q = search.toLowerCase();
        const hay = `${p.title} ${p.brand} ${p.model} ${p.cpu} ${p.gpu} ${p.description}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    return NextResponse.json({ products: filtered });
  }
}

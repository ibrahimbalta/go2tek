export interface BuyerCriteriaInput {
  category: string;
  brandPref: string;
  cpuPref: string;
  ramPref: string;
  minRamGb: number;
  storagePref: string;
  minStorageGb: number;
  gpuPref: string;
  screenSizePref: string;
  minBudget: number;
  maxBudget: number;
  cosmeticPref: string;
}

export interface SellerDeviceInput {
  category: string;
  brand: string;
  model: string;
  cpu: string;
  ram: string;
  ramGb: number;
  storage: string;
  storageGb: number;
  gpu: string;
  screenSize: string;
  cosmeticCondition: string;
  requestedPrice: number;
}

export interface MatchCriteriaBreakdown {
  budgetMatch: number; // Max 30
  brandModelMatch: number; // Max 15
  cpuMatch: number; // Max 15
  ramMatch: number; // Max 15
  storageMatch: number; // Max 10
  gpuMatch: number; // Max 8
  cosmeticMatch: number; // Max 7
}

export interface MatchEvaluationResult {
  isCompatibleCategory: boolean;
  totalScore: number;
  recommendationLevel: 'HIGH' | 'MEDIUM' | 'LOW' | 'INCOMPATIBLE';
  suggestedBuyerSalePrice: number;
  estimatedMarginAmount: number;
  criteriaBreakdown: MatchCriteriaBreakdown;
  notes: string[];
}

const COSMETIC_RANK: Record<string, number> = {
  A_PLUS: 4,
  A: 3,
  B: 2,
  C: 1,
  ANY: 1,
};

export function calculateMatchScore(
  buyer: BuyerCriteriaInput,
  seller: SellerDeviceInput
): MatchEvaluationResult {
  if (buyer.category !== seller.category) {
    return {
      isCompatibleCategory: false,
      totalScore: 0,
      recommendationLevel: 'INCOMPATIBLE',
      suggestedBuyerSalePrice: 0,
      estimatedMarginAmount: 0,
      criteriaBreakdown: {
        budgetMatch: 0,
        brandModelMatch: 0,
        cpuMatch: 0,
        ramMatch: 0,
        storageMatch: 0,
        gpuMatch: 0,
        cosmeticMatch: 0,
      },
      notes: ['Kategori uyuşmuyor.'],
    };
  }

  const notes: string[] = [];

  // 1. Budget & Seller Price Match (Max 30 pts)
  // Go2Tek targets ~10% service + technical inspection margin on top of seller's requested price
  const suggestedBuyerSalePrice = Math.round(seller.requestedPrice * 1.1);
  const estimatedMarginAmount = suggestedBuyerSalePrice - seller.requestedPrice;

  let budgetMatch = 0;
  if (
    suggestedBuyerSalePrice >= buyer.minBudget * 0.85 &&
    suggestedBuyerSalePrice <= buyer.maxBudget
  ) {
    budgetMatch = 30;
    notes.push(
      `Bütçe tam uyumlu: Satıcı beklentisi (${seller.requestedPrice.toLocaleString('tr-TR')} TL) + Go2Tek marjı alıcı üst bütçesi (${buyer.maxBudget.toLocaleString('tr-TR')} TL) içinde.`
    );
  } else if (seller.requestedPrice <= buyer.maxBudget) {
    budgetMatch = 24;
    notes.push(
      `Satıcı fiyatı (${seller.requestedPrice.toLocaleString('tr-TR')} TL) alıcı bütçesinde; marj için hafif pazarlık önerilir.`
    );
  } else if (seller.requestedPrice <= buyer.maxBudget * 1.12) {
    budgetMatch = 12;
    notes.push(
      `Satıcı fiyatı alıcı maksimum bütçesini %12'ye kadar aşıyor; satıcı ile fiyat revizyonu yapılabilir.`
    );
  } else {
    budgetMatch = 0;
    notes.push(`Satıcı fiyatı alıcı bütçesinin oldukça üzerinde.`);
  }

  // 2. Brand & Model Match (Max 15 pts)
  let brandModelMatch = 0;
  const buyerBrandNorm = (buyer.brandPref || '').trim().toLowerCase();
  const sellerBrandNorm = `${seller.brand} ${seller.model}`.toLowerCase();
  if (
    !buyerBrandNorm ||
    buyerBrandNorm.includes('farketmez') ||
    buyerBrandNorm.includes('hepsi')
  ) {
    brandModelMatch = 15;
    notes.push(`Alıcı marka konusunda esnek (${seller.brand} uygun).`);
  } else if (
    sellerBrandNorm.includes(buyerBrandNorm) ||
    buyerBrandNorm.includes(seller.brand.toLowerCase())
  ) {
    brandModelMatch = 15;
    notes.push(`Marka tercihi birebir eşleşiyor (${seller.brand}).`);
  } else {
    brandModelMatch = 5;
    notes.push(`Alternatif marka önerisi (${buyer.brandPref} yerine ${seller.brand}).`);
  }

  // 3. CPU Match (Max 15 pts)
  let cpuMatch = 0;
  const buyerCpuNorm = (buyer.cpuPref || '').toLowerCase();
  const sellerCpuNorm = (seller.cpu || '').toLowerCase();
  if (!buyerCpuNorm || buyerCpuNorm.includes('farketmez')) {
    cpuMatch = 15;
  } else {
    const cpuTokens = buyerCpuNorm
      .split(/[\s,/+-]+/)
      .filter((t) => t.length >= 2);
    const matchedTokens = cpuTokens.filter((token) => sellerCpuNorm.includes(token));
    if (matchedTokens.length > 0) {
      cpuMatch = 15;
      notes.push(`İşlemci kriteri uyumlu (${seller.cpu}).`);
    } else {
      cpuMatch = 8;
      notes.push(`İşlemci muadil segmentte değerlendirilmeli (${seller.cpu}).`);
    }
  }

  // 4. RAM Match (Max 15 pts)
  let ramMatch = 0;
  const reqRam = buyer.minRamGb || parseInt(buyer.ramPref, 10) || 8;
  const offRam = seller.ramGb || parseInt(seller.ram, 10) || 8;
  if (offRam >= reqRam) {
    ramMatch = 15;
    notes.push(`RAM kapasitesi yeterli (${offRam} GB >= ${reqRam} GB).`);
  } else if (offRam >= reqRam / 2) {
    ramMatch = 6;
    notes.push(`RAM kapasitesi alıcı talebinin altında (${offRam} GB < ${reqRam} GB).`);
  }

  // 5. Storage Match (Max 10 pts)
  let storageMatch = 0;
  const reqStorage = buyer.minStorageGb || parseInt(buyer.storagePref, 10) || 256;
  const offStorage = seller.storageGb || parseInt(seller.storage, 10) || 256;
  if (offStorage >= reqStorage) {
    storageMatch = 10;
    notes.push(`Depolama kapasitesi uyumlu (${seller.storage}).`);
  } else {
    storageMatch = 4;
    notes.push(`Depolama yükseltmesi gerekebilir (${seller.storage}).`);
  }

  // 6. GPU Match (Max 8 pts)
  let gpuMatch = 0;
  const buyerGpuNorm = (buyer.gpuPref || '').toLowerCase();
  const sellerGpuNorm = (seller.gpu || '').toLowerCase();
  if (
    !buyerGpuNorm ||
    buyerGpuNorm.includes('farketmez') ||
    buyerGpuNorm.includes('dahili')
  ) {
    gpuMatch = 8;
  } else {
    const gpuTokens = buyerGpuNorm.split(/[\s,/+-]+/).filter((t) => t.length >= 2);
    const hasGpuToken = gpuTokens.some((t) => sellerGpuNorm.includes(t));
    gpuMatch = hasGpuToken ? 8 : 4;
  }

  // 7. Cosmetic Condition Match (Max 7 pts)
  let cosmeticMatch = 0;
  const buyerCosmRank = COSMETIC_RANK[buyer.cosmeticPref] ?? 2;
  const sellerCosmRank = COSMETIC_RANK[seller.cosmeticCondition] ?? 3;
  if (sellerCosmRank >= buyerCosmRank) {
    cosmeticMatch = 7;
    notes.push(`Kozmetik durum beklentiyi karşılıyor (${seller.cosmeticCondition}).`);
  } else {
    cosmeticMatch = 3;
    notes.push(`Kozmetik durum alıcı beklentisinin bir kademe altında.`);
  }

  const totalScore =
    budgetMatch +
    brandModelMatch +
    cpuMatch +
    ramMatch +
    storageMatch +
    gpuMatch +
    cosmeticMatch;

  let recommendationLevel: MatchEvaluationResult['recommendationLevel'] = 'LOW';
  if (totalScore >= 80 && budgetMatch >= 20) {
    recommendationLevel = 'HIGH';
  } else if (totalScore >= 60 && budgetMatch >= 12) {
    recommendationLevel = 'MEDIUM';
  }

  return {
    isCompatibleCategory: true,
    totalScore,
    recommendationLevel,
    suggestedBuyerSalePrice,
    estimatedMarginAmount,
    criteriaBreakdown: {
      budgetMatch,
      brandModelMatch,
      cpuMatch,
      ramMatch,
      storageMatch,
      gpuMatch,
      cosmeticMatch,
    },
    notes,
  };
}

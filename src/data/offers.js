// ==========================================================================
// NOVA MALL - Offers, Coupons, Flash Sale & Mystery Deals
// ==========================================================================

export const couponsData = [
  {
    code: "NOVA10",
    discountPercent: 10,
    minSpend: 0,
    description: "10% Instant Discount on All Orders",
    expiresIn: "Active"
  },
  {
    code: "SAVE20",
    discountPercent: 20,
    minSpend: 1999,
    description: "20% OFF on luxury orders above ₹1,999",
    expiresIn: "Limited Time"
  },
  {
    code: "WELCOME15",
    discountPercent: 15,
    minSpend: 999,
    description: "15% Welcome Gift for new shoppers",
    expiresIn: "Active"
  },
  {
    code: "MYSTERY50",
    flatDiscount: 500,
    minSpend: 2499,
    description: "Flat ₹500 Secret Vault Bonus",
    expiresIn: "Vault Exclusive"
  },
  {
    code: "ELITEPLUS",
    discountPercent: 25,
    minSpend: 4999,
    description: "25% VIP NOVA+ Member Exclusive Discount",
    expiresIn: "VIP Tier"
  }
];

export const mysteryVaultRewards = [
  {
    id: "vault-1",
    name: "Golden Voucher: 20% OFF",
    code: "SAVE20",
    description: "Instant 20% savings on orders above ₹1,999.",
    badge: "Most Popular",
    rarity: "Epic"
  },
  {
    id: "vault-2",
    name: "VIP Cash Voucher: ₹500 Flat OFF",
    code: "MYSTERY50",
    description: "Flat ₹500 deducted directly from checkout on orders > ₹2,499.",
    badge: "Rare Drop",
    rarity: "Legendary"
  },
  {
    id: "vault-3",
    name: "Elite Club: 25% Off Luxury Drop",
    code: "ELITEPLUS",
    description: "Exclusive 25% discount on flagship tech & designer fashion.",
    badge: "Secret Tier",
    rarity: "Mythic"
  },
  {
    id: "vault-4",
    name: "Welcome Gift: 15% OFF",
    code: "WELCOME15",
    description: "15% off across all departments on minimum purchase of ₹999.",
    badge: "Special",
    rarity: "Rare"
  }
];

export const brandsData = [
  { name: "Apple", logo: "🍎", tag: "Innovation Flagship", count: "140+ Items" },
  { name: "Sony", logo: "🎧", tag: "Acoustic Excellence", count: "95+ Items" },
  { name: "Nike", logo: "⚡", tag: "Athletic Precision", count: "210+ Items" },
  { name: "Dyson", logo: "🌀", tag: "Engineering Marvels", count: "48+ Items" },
  { name: "Bose", logo: "🔊", tag: "Spatial Immersion", count: "62+ Items" },
  { name: "Rolex", logo: "👑", tag: "Timeless Horology", count: "35+ Items" },
  { name: "Samsung", logo: "✨", tag: "Next-Gen Displays", count: "180+ Items" },
  { name: "Prada", logo: "💎", tag: "Haute Couture", count: "84+ Items" }
];

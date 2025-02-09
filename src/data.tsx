import { IPairInfo, ITokenInfo } from "./types";

export const POPULAR_TOKENS: ITokenInfo[] = [
  {
    id: 1,
    logo: "/assets/icons/btc.webp",
    name: "Bitcoin",
    symbol: "BTC",
    price: 63230.11,
    priceChange: 1.85,
    address: "",
  },
  {
    id: 2,
    logo: "/assets/icons/solana.png",
    name: "Solana",
    symbol: "SOL",
    price: 200.11,
    priceChange: 10.85,
    address: "",
  },
  {
    id: 3,
    logo: "/assets/icons/logo.svg",
    name: "GMI",
    symbol: "GMI",
    price: 100000.0,
    priceChange: 100.0,
    address: "",
  },
];

export const TRENDING_PAIRS: IPairInfo[] = [];

for (let i = 0; i < 20; ++i) {
  TRENDING_PAIRS.push({
    id: i,
    tokenInfo: {
      id: 1,
      logo: "",
      name: "GMI",
      symbol: "GMI",
      price: 1.2,
      priceChange: 100,
      address: "8RR17XBRY8v9tA9vuuFwrFyFEK5Z5X55Yj7AfEjv7RzL",
    },
    poolAddress: "8RR17XBRY8v9tA9vuuFwrFyFEK5Z5X55Yj7AfEjv7RzL",
    dexType: 1,
    createdAt: 1,
    liquidity: 123,
    initialLiquidity: 321,
    marketCap: 123,
    txns: 123,
    volume: 123,
    buyTax: 1,
    sellTax: 1,
    audit: {
      mintAuth: true,
      freezeAuth: true,
      lpBurned: true,
      top10Holders: true,
    },
  });
}

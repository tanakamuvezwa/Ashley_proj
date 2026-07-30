import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Normalize saved theme names from older versions.
 */
export function normalizeThemeName(saved) {
  if (!saved) return 'theme-dark';
  if (saved === 'light-aura' || saved === 'theme-light') return 'theme-light';
  return 'theme-dark';
}

/**
 * Build platform context string from live DB data.
 */
export function buildPlatformContext({ loans, insts, fxRates, pitches }) {
  const zwgRate = fxRates.find(r => r.quoteCurrency === 'ZWG')?.rate || 13.85;
  const zarRate = fxRates.find(r => r.quoteCurrency === 'ZAR')?.rate || 18.24;
  const bwpRate = fxRates.find(r => r.quoteCurrency === 'BWP')?.rate || 13.62;
  const zmwRate = fxRates.find(r => r.quoteCurrency === 'ZMW')?.rate || 26.5;
  const totalPool = insts.reduce((acc, curr) => acc + (curr.activeLiquidityUSD || 0), 0);
  const bankNames = insts.map(i => i.name).join(', ');
  const fundedCount = loans.filter(l => l.status === 'Funded').length;
  const activeBids = loans.filter(l => l.status === 'Bidding Active').length;

  return {
    zwgRate, zarRate, bwpRate, zmwRate, totalPool, bankNames,
    fundedCount, activeBids,
    loanCount: loans.length,
    pitchCount: pitches.length,
    contextText: `
ApexLend SADC Financial Marketplace — Live Data:
- Active loan requests: ${loans.length} (${activeBids} bidding, ${fundedCount} funded)
- Participating lenders: ${bankNames || 'CBZ, Stanbic, NMB, Old Mutual'}
- Total liquidity pool: $${(totalPool / 1e6).toFixed(1)}M USD
- FX rates: USD/ZWG ${zwgRate}, USD/ZAR ${zarRate}, USD/BWP ${bwpRate}, USD/ZMW ${zmwRate}
- Live venture pitches: ${pitches.length}
- Average loan APR: 7.2–7.8% (solar projects from 6.8%)
- Min investment in pitch room: $250 USD
- Regions: Zimbabwe, South Africa, Botswana, Zambia, Mozambique
`.trim()
  };
}

/**
 * Smart local AI — works without any API key using platform context.
 */
export function generateLocalReply(query, ctx) {
  const q = query.toLowerCase().trim();

  if (/hello|hi|mhoro|salibonani|hey|good (morning|afternoon|evening)/.test(q)) {
    return `Mhoro! I'm Apex AI, your SADC financial advisor. I can help with loans (from 6.8% APR), FX rates, insurance, and investment pitches. What would you like to know?`;
  }

  if (/rate|apr|interest|percent|cost of (a )?loan/.test(q)) {
    return `Current loan rates on ApexLend range from 6.8% APR for solar infrastructure to 7.8% APR for general working capital. There are ${ctx.loanCount} active credit files — ${ctx.fundedCount} already funded. Go to Solutions to submit your loan request and receive competing bids from ${ctx.bankNames.split(',').length} regional banks within hours.`;
  }

  if (/fx|exchange|convert|zwg|zar|bwp|zmw|currency|usd/.test(q)) {
    return `Live interbank FX on ApexLend: USD/ZWG ${ctx.zwgRate}, USD/ZAR ${ctx.zarRate}, USD/BWP ${ctx.bwpRate}, USD/ZMW ${ctx.zmwRate}. Zero-margin clearing on ApexLend rails. Use the FX Exchange page to convert between SADC currencies instantly.`;
  }

  if (/bank|lender|institution|bid|who (is|are) lending/.test(q)) {
    return `Active lenders on the platform: ${ctx.bankNames}. Combined liquidity pool: $${(ctx.totalPool / 1e6).toFixed(1)}M USD with auto-bid enabled. Banks compete in real-time to offer you the best rate when you submit a loan request.`;
  }

  if (/loan|apply|borrow|credit|funding|capital/.test(q)) {
    return `To get a loan: sign in, go to Solutions, and submit your business details. Our AI matches you with competing bank offers in 1–4 hours. ${ctx.fundedCount} loans have been funded so far. Minimum documents: business registration and director ID (KYC upload supported).`;
  }

  if (/project|pitch|invest|venture|startup|roi|equity/.test(q)) {
    return `The Pitch Room has ${ctx.pitchCount} live SADC ventures seeking capital. Minimum investment starts at $250 USD with projected ROI up to 21% p.a. Categories include agriculture, renewable energy, mining, fintech, and logistics. Browse Markets to explore opportunities.`;
  }

  if (/insur|cover|premium|crop|cargo|solar damage/.test(q)) {
    return `ApexLend offers embedded insurance: Crop & Livestock, Solar Asset Damage, Cross-Border Cargo, and Business Interruption coverage. Get instant quotes on the Insurance page — premiums from $45/month with coverage up to $2M USD.`;
  }

  if (/kyc|document|verify|registration/.test(q)) {
    return `KYC verification requires your company registration certificate and director national ID (JPEG, PNG, or PDF, max 10 MB). Upload via the loan application flow. Verification typically completes within 24–48 hours.`;
  }

  if (/admin|dashboard|account|login|register|sign/.test(q)) {
    return `Create a free account via Register — choose Borrower, Lender, or Admin role. Borrowers access Solutions for loans; Lenders use the Institutional Desk; Admins manage users and loan approvals from the Admin Workbench.`;
  }

  if (/sadc|zimbabwe|region|country|map|corridor/.test(q)) {
    return `ApexLend operates across the SADC region: Zimbabwe (HQ in Harare), South Africa, Botswana, Zambia, and Mozambique. The SADC Expansion Map shows our corridor coverage and regional liquidity flows.`;
  }

  if (/help|what can you|how (do|does)|guide|explain/.test(q)) {
    return `I can help with: (1) Loan applications and APR rates, (2) Live FX conversion for ZWG/ZAR/BWP, (3) Investment pitches and ROI, (4) Insurance quotes, (5) KYC requirements, and (6) Platform navigation. Just ask!`;
  }

  if (/thank|thanks|appreciate/.test(q)) {
    return `You're welcome! Feel free to ask anything else about loans, FX, investments, or insurance across SADC.`;
  }

  return `I'm Apex AI, your SADC financial advisor. Based on live platform data: ${ctx.loanCount} active loans, ${ctx.pitchCount} venture pitches, and $${(ctx.totalPool / 1e6).toFixed(1)}M in lender liquidity. Ask me about loan rates, FX corridors, participating banks, insurance, or investment opportunities.`;
}

/**
 * Try Gemini free tier (requires GEMINI_API_KEY in .env).
 * Falls back to null if unavailable.
 */
export async function tryGeminiReply(query, contextText, history = []) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-3.5-flash-lite',
      systemInstruction: `You are Apex AI, an expert SADC financial advisor for the ApexLend marketplace platform. Be brief (2-4 sentences), clear, and professional. Use the platform context provided. Plain text only — no markdown, no bullet points.`
    });

    const historyText = history.slice(-6).map(m =>
      `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.text}`
    ).join('\n');

    const prompt = `${contextText}\n\n${historyText ? `Recent conversation:\n${historyText}\n\n` : ''}User: ${query}\nAssistant:`;
    const result = await model.generateContent(prompt);
    const text = result.response.text()?.trim();
    return text || null;
  } catch (err) {
    console.warn('Gemini API unavailable, using local AI:', err.message);
    return null;
  }
}

/**
 * Main chat handler — tries Gemini first, falls back to smart local AI.
 */
export async function generateChatReply(query, platformData, history = []) {
  const ctx = buildPlatformContext(platformData);
  const geminiReply = await tryGeminiReply(query, ctx.contextText, history);
  if (geminiReply) return geminiReply;
  return generateLocalReply(query, ctx);
}

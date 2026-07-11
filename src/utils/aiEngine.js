import { mockProducts } from '../data/mockCatalog';

// Natural Language Intent Extractor and Query Filter
export function searchProductsAI(query) {
  if (!query || query.trim() === "") {
    return {
      products: mockProducts,
      intent: { type: "all" },
      confidence: 1.0,
      suggestions: ["Show black shoes under ₹3000", "Find laptops for coding", "Suggest sustainable products"]
    };
  }

  const cleanQuery = query.toLowerCase().trim();
  let filtered = [...mockProducts];
  let intentDetected = {};
  let confidence = 0.85;

  // 1. Category extraction
  let categoryIntent = null;
  if (cleanQuery.includes("laptop") || cleanQuery.includes("headphone") || cleanQuery.includes("smartwatch") || cleanQuery.includes("lightbar") || cleanQuery.includes("tech") || cleanQuery.includes("electronic") || cleanQuery.includes("device") || cleanQuery.includes("pc")) {
    categoryIntent = "Tech";
  } else if (cleanQuery.includes("hoodie") || cleanQuery.includes("jacket") || cleanQuery.includes("clothing") || cleanQuery.includes("fashion") || cleanQuery.includes("wear") || cleanQuery.includes("streetwear") || cleanQuery.includes("shirt")) {
    categoryIntent = "Fashion";
  } else if (cleanQuery.includes("shoe") || cleanQuery.includes("sneaker") || cleanQuery.includes("boot") || cleanQuery.includes("footwear") || cleanQuery.includes("runner")) {
    categoryIntent = "Footwear";
  } else if (cleanQuery.includes("serum") || cleanQuery.includes("lipstick") || cleanQuery.includes("eyeshadow") || cleanQuery.includes("palette") || cleanQuery.includes("beauty") || cleanQuery.includes("skincare") || cleanQuery.includes("cosmetic")) {
    categoryIntent = "Beauty";
  } else if (cleanQuery.includes("purifier") || cleanQuery.includes("carafe") || cleanQuery.includes("tumbler") || cleanQuery.includes("mug") || cleanQuery.includes("glass") || cleanQuery.includes("tea") || cleanQuery.includes("coffee") || cleanQuery.includes("home")) {
    categoryIntent = "Home";
  } else if (cleanQuery.includes("dumbbell") || cleanQuery.includes("mat") || cleanQuery.includes("band") || cleanQuery.includes("yoga") || cleanQuery.includes("fitness") || cleanQuery.includes("gym") || cleanQuery.includes("sports")) {
    categoryIntent = "Sports";
  }

  if (categoryIntent) {
    filtered = filtered.filter(p => p.category === categoryIntent);
    intentDetected.category = categoryIntent;
    confidence += 0.05;
  }

  // 2. Color extraction
  const colors = ["black", "white", "silver", "blue", "orange", "green", "lime", "crimson", "gray", "clear", "rgb"];
  const matchedColor = colors.find(c => cleanQuery.includes(c));
  if (matchedColor) {
    filtered = filtered.filter(p => p.color.toLowerCase().includes(matchedColor) || p.name.toLowerCase().includes(matchedColor));
    intentDetected.color = matchedColor;
    confidence += 0.05;
  }

  // 3. Price constraint extraction (e.g. "under ₹3000", "under 3000", "below 60000")
  const priceRegexes = [
    /(?:under|below|less than)\s*(?:rs\.?|inr|₹)?\s*(\d+)/i,
    /(?:rs\.?|inr|₹)?\s*(\d+)\s*(?:or less|max|budget)/i
  ];

  let maxPrice = null;
  for (let regex of priceRegexes) {
    const match = cleanQuery.match(regex);
    if (match && match[1]) {
      maxPrice = parseInt(match[1], 10);
      break;
    }
  }

  if (maxPrice) {
    filtered = filtered.filter(p => p.price <= maxPrice);
    intentDetected.maxPrice = maxPrice;
    confidence += 0.05;
  }

  // 4. Sustainability check
  if (cleanQuery.includes("sustainable") || cleanQuery.includes("eco") || cleanQuery.includes("green") || cleanQuery.includes("recycle") || cleanQuery.includes("circular") || cleanQuery.includes("organic") || cleanQuery.includes("biodegradable")) {
    filtered = filtered.filter(p => p.sustainabilityScore >= 85);
    intentDetected.sustainability = true;
    confidence += 0.05;
  }

  // 5. Trending / Popularity
  if (cleanQuery.includes("trending") || cleanQuery.includes("popular") || cleanQuery.includes("best seller") || cleanQuery.includes("hot")) {
    filtered = filtered.filter(p => p.trending === true || p.popularity >= 90);
    intentDetected.trending = true;
    confidence += 0.03;
  }

  // 6. Keywords fallback search (if filtered is too empty or to catch other terms)
  if (filtered.length === 0 || (!categoryIntent && !matchedColor && !maxPrice)) {
    // If no explicit structured filters matched, search using simple keyword intersection
    const queryTokens = cleanQuery.split(/\s+/).filter(t => t.length > 2);
    if (queryTokens.length > 0) {
      const keywordMatches = mockProducts.filter(p => {
        const text = `${p.name} ${p.brand} ${p.category} ${p.description}`.toLowerCase();
        return queryTokens.some(token => text.includes(token));
      });
      if (keywordMatches.length > 0) {
        filtered = keywordMatches;
        confidence = 0.75;
      }
    }
  }

  // Cap confidence score
  confidence = Math.min(0.99, confidence);

  // Fallback to suggestions if empty
  if (filtered.length === 0) {
    return {
      products: [],
      intent: intentDetected,
      confidence: 0.2,
      message: "No exact matches found. Try searching for broader terms like 'streetwear', 'dumbbells', or 'headphones under 5000'."
    };
  }

  // Calculate similar products
  const productIds = filtered.map(p => p.id);
  const similarItems = mockProducts.filter(p => 
    !productIds.includes(p.id) && 
    (p.category === categoryIntent || (maxPrice && p.price <= maxPrice * 1.3))
  ).slice(0, 3);

  return {
    products: filtered.sort((a, b) => b.popularity - a.popularity),
    intent: intentDetected,
    confidence: parseFloat(confidence.toFixed(2)),
    similarItems,
    relatedCategories: [...new Set(filtered.map(p => p.category))]
  };
}

// Conversation shopping agent state engine
export function getAssistantResponse(chatHistory, userMessage) {
  const cleanMsg = userMessage.toLowerCase().trim();
  const searchResults = searchProductsAI(userMessage);

  // If user says hi / hello
  if (cleanMsg.match(/^(hi|hello|hey|greetings|hola)/)) {
    return {
      text: "Hey! I'm your LiveShop AI Assistant. 🛍️ I can help you discover products, check sizes, compare specs, or find items that match your budget. What type of product are you looking for today?",
      suggestedQueries: ["Show organic sneakers", "Coding laptops under ₹60000", "Best makeup for summer"]
    };
  }

  // Budget clarification flow
  if (cleanMsg.includes("laptop") && !cleanMsg.match(/\d+/)) {
    return {
      text: "Awesome! I found some great laptops. To narrow it down, what is your budget? (e.g., Under ₹60,000, or unlimited?)",
      products: mockProducts.filter(p => p.category === "Tech" && p.name.includes("Laptop")),
      suggestedQueries: ["Under ₹60000", "Under ₹100000", "Just show all"]
    };
  }

  // Budget clarification response
  if (chatHistory.length > 1) {
    const prevBotMsg = chatHistory[chatHistory.length - 2]?.text || "";
    if (prevBotMsg.includes("budget") && cleanMsg.match(/\d+/)) {
      const budgetMatch = cleanMsg.match(/(\d+)/);
      if (budgetMatch) {
        const budget = parseInt(budgetMatch[1], 10);
        const products = mockProducts.filter(p => p.price <= budget && (p.category === "Tech" || p.category === "Fashion" || p.category === "Footwear"));
        return {
          text: `Got it! Under ₹${budget.toLocaleString('en-IN')}, here are my recommendations. They feature high ratings and fast shipping:`,
          products: products.slice(0, 3),
          suggestedQueries: ["Compare these items", "Any discounts on these?", "Do you have eco-friendly options?"]
        };
      }
    }
  }

  // Compare products query
  if (cleanMsg.includes("compare")) {
    const techItems = mockProducts.filter(p => p.category === "Tech").slice(0, 2);
    return {
      text: "Here is a comparison between our leading tech gadgets. The AeroBlade Pro gaming laptop offers high compute power for developers, while ChronoFit Series X covers daily activity and fitness metrics.",
      comparison: {
        headers: ["Feature", techItems[0].name, techItems[1].name],
        rows: [
          ["Price", `₹${techItems[0].price.toLocaleString()}`, `₹${techItems[1].price.toLocaleString()}`],
          ["Rating", `${techItems[0].rating} ⭐`, `${techItems[1].rating} ⭐`],
          ["Sustainability Score", `${techItems[0].sustainabilityScore}/100`, `${techItems[1].sustainabilityScore}/100`],
          ["Delivery Speed", techItems[0].deliverySpeed, techItems[1].deliverySpeed]
        ]
      },
      suggestedQueries: ["Add AeroBlade Pro to cart", "Check noise-cancelling headphones"]
    };
  }

  // Sustainability query
  if (cleanMsg.includes("sustainable") || cleanMsg.includes("eco-friendly") || cleanMsg.includes("green") || cleanMsg.includes("organic")) {
    const ecoProducts = mockProducts.filter(p => p.sustainabilityScore >= 94);
    return {
      text: "Love that you're shopping green! 🌿 Here are our highest-rated eco-friendly products. They feature organic materials, circular recycling, or clean chemistry certifications:",
      products: ecoProducts,
      suggestedQueries: ["Show biodegradable trail boots", "Show details for face serum"]
    };
  }

  // Standard product search fallback
  if (searchResults.products.length > 0) {
    const categories = searchResults.relatedCategories.join(", ");
    return {
      text: `Sure! I found ${searchResults.products.length} products matching your request in ${categories}:`,
      products: searchResults.products.slice(0, 3),
      suggestedQueries: searchResults.similarItems.length > 0 
        ? [`Show ${searchResults.similarItems[0].name}`, "Filter by price", "Ask about discounts"]
        : ["Show cart details", "Check live streams"]
    };
  }

  return {
    text: "Hmm, I couldn't find an exact match in our inventory. But we have beautiful items in clothing, electronics, cosmetics, and fitness gear. Let me know if you want to see our popular drops!",
    suggestedQueries: ["Show trending street hoodies", "Show active gaming setups", "Search beauty products"]
  };
}

const asyncHandler = require('express-async-handler');
const OpenAI = require('openai');
const Product = require('../models/Product');
const User = require('../models/User');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// @desc    AI Chatbot
exports.chatbot = asyncHandler(async (req, res) => {
  const { message, history = [] } = req.body;

  const systemPrompt = `You are "Anura AI", the intelligent furniture assistant for Anura Furniture – Dekatana, Sri Lanka's premier furniture store with the tagline "Furniture කලාවේ මහ ගෙදර".

You help customers with:
- Finding the perfect furniture for their home, office, or hotel
- Product recommendations based on budget, style, and room size
- Custom furniture orders and specifications
- Order tracking and support
- Interior design tips and suggestions
- Information about delivery, warranty, and payment options

Available payment methods: Stripe (online), Cash on Delivery, Koko (buy now pay later), Bank Transfer
Delivery: Free delivery for orders above Rs. 50,000. Standard delivery: Rs. 500
Warranty: 1 year on all products
Custom orders: Available with 2-4 weeks lead time

Product categories: Sofas, Beds, Dining Tables, Office Furniture, Wardrobes, TV Units, Outdoor Furniture

Always be helpful, friendly, and guide customers toward making purchases. You can respond in both Sinhala and English.
If asked about specific products, suggest they browse the shop or use AI recommendations.`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.slice(-10),
    { role: 'user', content: message },
  ];

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages,
    max_tokens: 500,
    temperature: 0.7,
  });

  const reply = completion.choices[0].message.content;

  res.status(200).json({ success: true, reply, usage: completion.usage });
});

// @desc    AI Product Recommendations
exports.getRecommendations = asyncHandler(async (req, res) => {
  const { budget, roomType, style, colors, preferences } = req.body;

  let query = { isActive: true };

  if (budget) {
    const maxBudget = typeof budget === 'object' ? budget.max : budget;
    query.price = { $lte: maxBudget };
  }
  if (roomType) query.roomType = { $in: Array.isArray(roomType) ? roomType : [roomType] };
  if (style) query.style = { $in: Array.isArray(style) ? style : [style] };

  const products = await Product.find(query)
    .sort({ ratings: -1, soldCount: -1 })
    .limit(20)
    .select('name images price discount ratings numReviews style roomType description');

  let recommendedProducts = products;

  if (products.length > 0 && process.env.OPENAI_API_KEY) {
    try {
      const productList = products.map(p => `- ${p.name}: Rs. ${p.price}, Rating: ${p.ratings.toFixed(1)}, Style: ${p.style?.join(', ')}`).join('\n');
      
      const prompt = `Based on the customer's preferences:
Budget: ${budget ? `Rs. ${typeof budget === 'object' ? budget.max : budget}` : 'flexible'}
Room Type: ${roomType || 'any'}
Style: ${style || 'any'}
Color preference: ${colors || 'any'}

From these available products:
${productList}

Select and rank the top 6 most suitable products. Return ONLY a JSON array of product names in order of recommendation, like: ["Product A", "Product B", ...]`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 300,
        temperature: 0.3,
        response_format: { type: 'json_object' },
      });

      try {
        const parsed = JSON.parse(completion.choices[0].message.content);
        const rankedNames = parsed.products || parsed.recommendations || Object.values(parsed)[0];
        if (Array.isArray(rankedNames)) {
          const ranked = [];
          for (const name of rankedNames) {
            const found = products.find(p => p.name.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(p.name.toLowerCase()));
            if (found) ranked.push(found);
          }
          recommendedProducts = ranked.length >= 3 ? ranked : products.slice(0, 6);
        }
      } catch (e) {
        recommendedProducts = products.slice(0, 6);
      }
    } catch (err) {
      console.error('OpenAI error:', err.message);
      recommendedProducts = products.slice(0, 6);
    }
  }

  res.status(200).json({
    success: true,
    products: recommendedProducts.slice(0, 6),
    message: 'AI-powered recommendations generated',
  });
});

// @desc    AI Natural Language Search
exports.aiSearch = asyncHandler(async (req, res) => {
  const { query: searchQuery } = req.body;

  let searchFilters = { isActive: true };
  let aiInterpretation = null;

  if (process.env.OPENAI_API_KEY) {
    try {
      const prompt = `Parse this furniture search query and extract filters as JSON:
Query: "${searchQuery}"

Extract: { keyword, maxPrice, minPrice, style, roomType, colors, category }
All fields optional. Prices in LKR. 
Example: "modern blue sofa under 150000" → { "keyword": "sofa", "maxPrice": 150000, "style": ["modern"], "colors": ["blue"], "category": "sofa" }
Return valid JSON only.`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200,
        temperature: 0,
        response_format: { type: 'json_object' },
      });

      const parsed = JSON.parse(completion.choices[0].message.content);
      aiInterpretation = parsed;

      if (parsed.keyword) searchFilters.$text = { $search: parsed.keyword };
      if (parsed.maxPrice || parsed.minPrice) {
        searchFilters.price = {};
        if (parsed.maxPrice) searchFilters.price.$lte = parsed.maxPrice;
        if (parsed.minPrice) searchFilters.price.$gte = parsed.minPrice;
      }
      if (parsed.style) searchFilters.style = { $in: Array.isArray(parsed.style) ? parsed.style : [parsed.style] };
      if (parsed.roomType) searchFilters.roomType = { $in: Array.isArray(parsed.roomType) ? parsed.roomType : [parsed.roomType] };
    } catch (err) {
      searchFilters.$text = { $search: searchQuery };
    }
  } else {
    searchFilters.$text = { $search: searchQuery };
  }

  const products = await Product.find(searchFilters)
    .sort({ ratings: -1, soldCount: -1 })
    .limit(12)
    .select('name images price discount ratings numReviews category')
    .populate('category', 'name');

  res.status(200).json({
    success: true,
    products,
    interpretation: aiInterpretation,
    query: searchQuery,
  });
});

// @desc    AI Room Designer
exports.designRoom = asyncHandler(async (req, res) => {
  const { roomImageUrl, selectedProducts, roomType, style, prompt: userPrompt } = req.body;

  const systemPrompt = `You are an expert interior designer AI for Anura Furniture – Dekatana. 
Analyze room images and provide detailed, actionable design suggestions.
Always recommend specific furniture categories and styles available at Anura Furniture.`;

  const messages = [{ role: 'system', content: systemPrompt }];
  const userContent = [];

  if (roomImageUrl) {
    userContent.push({ type: 'image_url', image_url: { url: roomImageUrl } });
  }

  const textPrompt = `${userPrompt || `Please analyze this ${roomType || 'room'} and provide furniture recommendations.`}
${selectedProducts?.length ? `Selected furniture: ${selectedProducts.join(', ')}` : ''}
Style preference: ${style || 'modern'}

Provide:
1. Room analysis
2. Furniture recommendations (specific pieces)
3. Color scheme suggestions
4. Layout tips
5. Estimated budget range in LKR`;

  userContent.push({ type: 'text', text: textPrompt });
  messages.push({ role: 'user', content: userContent });

  let design;
  if (process.env.OPENAI_API_KEY) {
    const completion = await openai.chat.completions.create({
      model: roomImageUrl ? 'gpt-4o' : 'gpt-4o-mini',
      messages,
      max_tokens: 800,
      temperature: 0.7,
    });
    design = completion.choices[0].message.content;
  } else {
    design = `**Room Design Suggestions for ${roomType || 'Your'} Room:**

Based on your preferences for ${style || 'modern'} style:

1. **Furniture Recommendations:**
   - Premium sofa set with modern fabric
   - Coffee table with glass top
   - TV unit with storage

2. **Color Scheme:** Warm neutrals with blue accents

3. **Layout Tips:** Center the sofa facing the TV, keep pathways clear

4. **Budget Range:** Rs. 150,000 – Rs. 350,000`;
  }

  const suggestedProducts = await Product.find({
    isActive: true,
    ...(roomType ? { roomType: { $in: [roomType] } } : {}),
    ...(style ? { style: { $in: [style] } } : {}),
  })
    .limit(4)
    .select('name images price discount ratings');

  res.status(200).json({
    success: true,
    design,
    suggestedProducts,
  });
});

// @desc    AI Sales Insights (Admin)
exports.getSalesInsights = asyncHandler(async (req, res) => {
  const Order = require('../models/Order');

  const [recentOrders, topProducts, revenueData] = await Promise.all([
    Order.find({ createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } })
      .select('totalPrice status createdAt items'),
    Order.aggregate([
      { $unwind: '$items' },
      { $group: { _id: '$items.product', name: { $first: '$items.name' }, total: { $sum: '$items.quantity' } } },
      { $sort: { total: -1 } },
      { $limit: 10 },
    ]),
    Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, revenue: { $sum: '$totalPrice' } } },
      { $sort: { _id: 1 } },
      { $limit: 6 },
    ]),
  ]);

  let insights = '';
  if (process.env.OPENAI_API_KEY) {
    try {
      const dataContext = `
Monthly Revenue: ${JSON.stringify(revenueData)}
Top Products: ${topProducts.slice(0, 5).map(p => `${p.name}: ${p.total} units`).join(', ')}
Recent Orders: ${recentOrders.length} orders in last 30 days
Total Revenue (30 days): Rs. ${recentOrders.reduce((a, o) => a + o.totalPrice, 0).toLocaleString()}
`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{
          role: 'user',
          content: `As a business analyst for Anura Furniture (Sri Lankan furniture store), analyze this sales data and provide 5 key insights and 3 actionable recommendations:\n${dataContext}`,
        }],
        max_tokens: 600,
        temperature: 0.5,
      });
      insights = completion.choices[0].message.content;
    } catch (err) {
      insights = 'AI insights unavailable. Check your OpenAI API key.';
    }
  }

  res.status(200).json({
    success: true,
    insights,
    topProducts,
    revenueData,
    summary: {
      ordersLast30Days: recentOrders.length,
      revenueLast30Days: recentOrders.reduce((a, o) => a + o.totalPrice, 0),
    },
  });
});

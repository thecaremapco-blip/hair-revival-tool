export async function POST(request) {
  const { answers } = await request.json();
  
  const prompt = `You are a natural hair recovery specialist helping women over 35 dealing with hair thinning. Based on the following profile, create a warm, specific, and actionable 90-day hair revival protocol.

Profile:
- Age range: ${answers.age}
- Thinning pattern: ${answers.pattern}
- Suspected trigger: ${answers.trigger}
- Hair texture: ${answers.texture}
- Scalp condition: ${answers.scalp}
- Duration of thinning: ${answers.duration}

Write a personalized 90-day protocol with these exact sections:
1. **What's Likely Happening** (2-3 sentences explaining their specific situation warmly but honestly)
2. **Your Topical Routine** (specific oils, application method, frequency — tailored to their texture and scalp)
3. **Supplement Priorities** (top 3-4 supplements with dosage guidance, specific to their trigger)
4. **90-Day Phase Plan** (Phase 1: Days 1-30, Phase 2: Days 31-60, Phase 3: Days 61-90 — what to focus on each phase)
5. **What to Track** (3-4 specific measurable things to photograph or note monthly)
6. **When to See a Doctor** (specific flags based on their situation)

Keep the tone warm, direct, and expert — like a knowledgeable friend who has been through this. No fluff. No disclaimers. Real actionable guidance. Format with clear headers using **bold** for section titles.`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await response.json();
  const text = data.content?.map((b) => b.text || "").join("") || "";
  return Response.json({ protocol: text });
}

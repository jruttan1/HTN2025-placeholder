import { NextRequest, NextResponse } from "next/server";
import { CohereClientV2 } from "cohere-ai";

const cohere = new CohereClientV2({
  token: process.env.COHERE_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { message, policyContext, messages = [] } = await request.json();

    if (!process.env.COHERE_API_KEY) {
      throw new Error("COHERE_API_KEY environment variable is not set");
    }

    // Build context information for the system prompt
    const contextInfo = policyContext
      ? `
      ### Policy Context
      - Account: ${policyContext.accountName || "N/A"}
      - Line of Business: ${policyContext.lineOfBusiness || "N/A"}
      - Premium: ${
        policyContext.premium
          ? `$${policyContext.premium.toLocaleString()}`
          : "N/A"
      }
      - Appetite Score: ${policyContext.appetiteScore ?? "N/A"}%
      - State: ${policyContext.state || "N/A"}
      - Business Type: ${policyContext.businessType || "N/A"}
      - Construction Type: ${policyContext.constructionType || "N/A"}
      - TIV: ${
        policyContext.tiv
          ? `$${(policyContext.tiv / 1_000_000).toFixed(1)}M`
          : "N/A"
      }
      - Status: ${policyContext.status || "N/A"}
      - Why Surfaced: ${
        policyContext.whySurfaced?.length
          ? policyContext.whySurfaced.join(", ")
          : "N/A"
      }
      `
      : "";

    // Stronger, role-specific system prompt
    const baseSystemPrompt = `You are Optimate, an AI underwriting assistant built to support insurance professionals. 
    You analyze policies and provide clear, professional, and actionable insights. Always ground your reasoning in the policy context provided.

    Your responsibilities include:
    - Assessing **risk** and appetite scoring
    - Explaining **why** a submission is prioritized
    - Suggesting **approve/decline** recommendations
    - Identifying **coverage gaps** or risks
    - Providing **pricing and premium insights**
    - Considering **regulatory or compliance factors**
    - Enabling two-way, conversational exploration with the underwriter

    Never make up policy details — always use the given context. If unsure, say so and suggest what additional data might help.`;

    const systemPrompt = `${baseSystemPrompt}

      ${contextInfo}

      Now, respond to the underwriter’s question. Be concise, insightful, and professional.`;

    // Prepare message history
    const cohereMessages = [
      { role: "system" as const, content: systemPrompt },
      ...messages.map((msg: any) => ({
        role:
          msg.sender === "user" ? ("user" as const) : ("assistant" as const),
        content: msg.content,
      })),
      { role: "user" as const, content: message },
    ];

    // Call Cohere Chat API
    const response = await cohere.chat({
      messages: cohereMessages,
      temperature: 0.15, // low = more factual
      model: "command-r-03-2024",
      max_tokens: 500,
    });

    const botResponse =
      response.message?.content?.[0]?.text?.trim() ||
      "I apologize, but I encountered an issue processing your request.";

    return NextResponse.json({
      response: botResponse,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Chatbot API error:", error);

    // Fallback to contextual response if Cohere fails
    const fallbackResponse = generateContextualResponse(
      request.message,
      request.policyContext
    );

    return NextResponse.json({
      response: fallbackResponse,
      timestamp: new Date().toISOString(),
      fallback: true,
    });
  }
}

function generateContextualResponse(
  message: string,
  policyContext: any
): string {
  const text = message.toLowerCase();
  const appetiteScore = policyContext?.appetiteScore ?? "not available";
  const premium = policyContext?.premium
    ? `$${policyContext.premium.toLocaleString()}`
    : "not specified";
  const tiv = policyContext?.tiv
    ? `$${(policyContext.tiv / 1_000_000).toFixed(1)}M`
    : "unknown";
  const line = policyContext?.lineOfBusiness || "policy";
  const state = policyContext?.state || "the specified state";

  if (text.includes("risk") || text.includes("score")) {
    return `This policy’s appetite score is ${appetiteScore}%. The risk assessment reflects factors like the ${line}, construction type (${
      policyContext?.constructionType || "unknown"
    }), and location in ${state}. Would you like me to break down which factors helped or hurt this score?`;
  }

  if (
    text.includes("premium") ||
    text.includes("price") ||
    text.includes("cost")
  ) {
    return `The total premium is ${premium}, with a TIV of ${tiv}. This pricing reflects exposure, coverage, and loss history. Do you want me to compare it to similar policies?`;
  }

  if (text.includes("coverage") || text.includes("limit")) {
    return `This ${line} covers assets valued at ${tiv}, tailored to the client’s risk profile in ${state}. Which coverage aspects would you like to explore further?`;
  }

  if (text.includes("appetite") || text.includes("fit")) {
    return `This submission shows ${
      Number(appetiteScore) >= 80
        ? "strong"
        : Number(appetiteScore) >= 50
        ? "moderate"
        : "low"
    } alignment with appetite guidelines. Would you like me to list which criteria it meets and which it doesn’t?`;
  }

  if (
    text.includes("recommendation") ||
    text.includes("approve") ||
    text.includes("decline")
  ) {
    const recommendation = Number(appetiteScore) >= 70 ? "approval" : "decline";
    return `Based on the appetite score of ${appetiteScore}% and underwriting factors, I recommend ${recommendation}. Should I highlight the top 3 reasons behind this recommendation?`;
  }

  if (text.includes("client") || text.includes("account")) {
    return `This is ${
      policyContext?.businessType === "RENEWAL" ? "a renewal" : "new business"
    } for ${
      policyContext?.accountName || "the client"
    }. Would you like insights into their retention or growth potential?`;
  }

  if (
    text.includes("sla") ||
    text.includes("timeline") ||
    text.includes("deadline")
  ) {
    return `This submission is in ${
      policyContext?.status || "review status"
    } and needs to be processed in line with SLA timelines. Should I suggest next steps to stay compliant?`;
  }

  return `I'm here to help analyze this ${line} for ${
    policyContext?.accountName || "the client"
  }. I can explain risk scores, premiums, coverage, appetite fit, or give recommendations. What would you like to dive into?`;
}

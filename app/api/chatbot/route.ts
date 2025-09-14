import { NextRequest, NextResponse } from 'next/server'
import { CohereClientV2 } from 'cohere-ai'

const cohere = new CohereClientV2({ 
  token: process.env.COHERE_API_KEY 
})

export async function POST(request: NextRequest) {
  try {
    const { message, policyContext, messages = [] } = await request.json()

    if (!process.env.COHERE_API_KEY) {
      throw new Error('COHERE_API_KEY environment variable is not set')
    }

    // Build context information for the system prompt
    const contextInfo = policyContext ? `
Policy Context:
- Account: ${policyContext.accountName || 'N/A'}
- Line of Business: ${policyContext.lineOfBusiness || 'N/A'}
- Premium: ${policyContext.premium || 'N/A'}
- Appetite Score: ${policyContext.appetiteScore || 'N/A'}%
- State: ${policyContext.state || 'N/A'}
- Business Type: ${policyContext.businessType || 'N/A'}
- Construction Type: ${policyContext.constructionType || 'N/A'}
- TIV: $${policyContext.tiv ? (policyContext.tiv / 1000000).toFixed(1) + 'M' : 'N/A'}
- Status: ${policyContext.status || 'N/A'}
- Why Surfaced: ${policyContext.whySurfaced ? policyContext.whySurfaced.join(', ') : 'N/A'}
` : ''

    // System prompt - can be customized via environment variable or updated here
    const baseSystemPrompt = process.env.COHERE_SYSTEM_PROMPT || `You are an AI underwriting assistant helping insurance professionals analyze policies and make informed decisions. 

You have access to detailed policy information and should provide expert guidance on:
- Risk assessment and appetite scoring
- Premium analysis and pricing recommendations  
- Coverage evaluation and gap analysis
- Underwriting decision support
- Regulatory compliance considerations
- Market trends and competitive positioning

Always be professional, accurate, and provide actionable insights based on the policy context provided.`

    const systemPrompt = `${baseSystemPrompt}

${contextInfo}

Please provide helpful, accurate, and professional responses about insurance underwriting, risk assessment, and policy analysis based on the above context.`

    // Prepare messages for Cohere API
    const cohereMessages = [
      {
        role: 'system' as const,
        content: systemPrompt
      },
      // Include previous messages if any
      ...messages.map((msg: any) => ({
        role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content
      })),
      {
        role: 'user' as const,
        content: message
      }
    ]

    const response = await cohere.chat({
      messages: cohereMessages,
      temperature: 0.15,
      model: "command-r-03-2024"
    })

    const botResponse = response.message?.content?.[0]?.text || 'I apologize, but I encountered an issue processing your request.'

    return NextResponse.json({
      response: botResponse,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Chatbot API error:', error)
    
    // Fallback to contextual response if Cohere fails
    const fallbackResponse = generateContextualResponse(message, policyContext)
    
    return NextResponse.json({
      response: fallbackResponse,
      timestamp: new Date().toISOString(),
      fallback: true
    })
  }
}

function generateContextualResponse(message: string, policyContext: any): string {
  const lowerMessage = message.toLowerCase()
  
  // Smart responses based on policy context and common questions
  if (lowerMessage.includes('risk') || lowerMessage.includes('score')) {
    return `Based on this policy's risk profile, I can see the appetite score is ${policyContext?.appetiteScore || 'not available'}%. The risk assessment considers factors like the ${policyContext?.lineOfBusiness || 'line of business'}, construction type (${policyContext?.constructionType || 'unknown'}), and geographic location in ${policyContext?.state || 'the specified state'}. Would you like me to explain any specific risk factors?`
  }
  
  if (lowerMessage.includes('premium') || lowerMessage.includes('price') || lowerMessage.includes('cost')) {
    return `The total premium for this policy is ${policyContext?.premium || 'not specified'} with a TIV of $${policyContext?.tiv ? (policyContext.tiv / 1000000).toFixed(1) + 'M' : 'unknown'}. This pricing reflects the risk profile and coverage requirements. The loss ratio appears favorable based on the historical data. Is there something specific about the premium structure you'd like to understand?`
  }
  
  if (lowerMessage.includes('coverage') || lowerMessage.includes('limit')) {
    return `This ${policyContext?.lineOfBusiness || 'policy'} provides comprehensive coverage with a Total Insured Value (TIV) of $${policyContext?.tiv ? (policyContext.tiv / 1000000).toFixed(1) + 'M' : 'unknown'}. The coverage is structured to meet the client's risk profile in ${policyContext?.state || 'their location'}. What specific coverage aspects would you like me to clarify?`
  }
  
  if (lowerMessage.includes('appetite') || lowerMessage.includes('fit')) {
    return `This submission shows ${policyContext?.appetiteScore >= 80 ? 'strong' : policyContext?.appetiteScore >= 50 ? 'moderate' : 'limited'} appetite alignment. Key factors supporting this assessment include the client's industry sector, geographic location, and risk characteristics. The underwriting guidelines favor this type of ${policyContext?.lineOfBusiness || 'business'} in ${policyContext?.state || 'this region'}. Would you like me to detail the specific appetite criteria?`
  }
  
  if (lowerMessage.includes('recommendation') || lowerMessage.includes('approve') || lowerMessage.includes('decline')) {
    const recommendation = policyContext?.appetiteScore >= 70 ? 'approval' : 'decline'
    return `Based on the comprehensive analysis, I recommend ${recommendation} for this submission. The decision factors include the appetite score of ${policyContext?.appetiteScore || 'unknown'}%, favorable loss history, and alignment with our underwriting guidelines. The ${policyContext?.lineOfBusiness || 'coverage type'} in ${policyContext?.state || 'this location'} fits well within our risk tolerance. What additional information would help support this recommendation?`
  }
  
  if (lowerMessage.includes('client') || lowerMessage.includes('account')) {
    return `This is ${policyContext?.businessType === 'RENEWAL' ? 'a renewal account' : 'new business'} for ${policyContext?.accountName || 'the client'}. The relationship shows ${policyContext?.businessType === 'RENEWAL' ? 'strong retention potential' : 'new growth opportunity'} with favorable risk characteristics. The client operates in the ${policyContext?.lineOfBusiness || 'specified industry'} sector. How can I help you evaluate this account further?`
  }
  
  if (lowerMessage.includes('sla') || lowerMessage.includes('timeline') || lowerMessage.includes('deadline')) {
    return `The SLA timeline for this submission requires attention. Based on the policy effective date and renewal schedule, timely processing is important to maintain service standards. The submission is currently in ${policyContext?.status || 'review status'}. Would you like me to help prioritize the next steps for timely completion?`
  }
  
  // Default intelligent response
  return `I'm here to help you analyze this ${policyContext?.lineOfBusiness || 'policy'} submission for ${policyContext?.accountName || 'the client'}. I can provide insights on risk assessment, premium analysis, coverage details, appetite fit, and underwriting recommendations. What specific aspect of this ${policyContext?.businessType === 'RENEWAL' ? 'renewal' : 'new business'} submission would you like to explore?`
}

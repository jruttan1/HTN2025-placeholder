import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message, policyContext } = await request.json()

    // In a real implementation, you'd use your Cohere API key
    // For now, we'll simulate a smart response based on policy context
    const contextualResponse = generateContextualResponse(message, policyContext)

    // Simulate API delay for realistic feel
    await new Promise(resolve => setTimeout(resolve, 1000))

    return NextResponse.json({
      response: contextualResponse,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Chatbot API error:', error)
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    )
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

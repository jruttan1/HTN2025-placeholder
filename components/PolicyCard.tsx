"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp, ExternalLink, Building, Calendar, DollarSign, Shield, AlertTriangle, CheckCircle } from "lucide-react"
import { EnhancedPolicy } from "@/lib/dataMapper"

interface PolicyCardProps {
  policy: EnhancedPolicy
  accountName: string
  accountStats?: {
    avg_score: number
    max_score: number
    weighted_score: number
    avg_risk_score: number
    weighted_risk_score: number
  }
}

export function PolicyCard({ policy, accountName, accountStats }: PolicyCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showReferences, setShowReferences] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getScoreColor = (score: number) => {
    if (score >= 0.7) return "text-green-700 bg-green-50 border-green-200"
    if (score >= 0.4) return "text-yellow-700 bg-yellow-50 border-yellow-200"
    return "text-red-700 bg-red-50 border-red-200"
  }

  const getRiskScoreColor = (score: number) => {
    if (score <= 30) return "text-green-700 bg-green-50"
    if (score <= 60) return "text-yellow-700 bg-yellow-50"
    return "text-red-700 bg-red-50"
  }

  const getRecommendation = () => {
    const appetiteScore = policy.score || policy.winnability
    if (appetiteScore >= 0.6) return { text: "APPROVE", color: "bg-green-500" }
    if (appetiteScore >= 0.3) return { text: "REVIEW", color: "bg-yellow-500" }
    return { text: "DECLINE", color: "bg-red-500" }
  }

  const recommendation = getRecommendation()
  const lossRatio = parseFloat(policy.loss_value) / policy.total_premium

  return (
    <Card className="w-full mb-4 hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
              Policy #{policy.id} - {accountName}
            </CardTitle>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Building className="h-4 w-4" />
                {policy.line_of_business}
              </div>
              <div className="flex items-center gap-1">
                <Shield className="h-4 w-4" />
                {policy.primary_risk_state}
              </div>
              <Badge variant={policy.renewal_or_new_business === "RENEWAL" ? "secondary" : "default"}>
                {policy.renewal_or_new_business}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <Badge className={`${recommendation.color} text-white mb-2`}>
              {recommendation.text}
            </Badge>
            <div className="text-sm text-gray-500">
              Created {formatDate(policy.created_at)}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Key Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-sm text-blue-600 font-medium">Total Premium</div>
            <div className="text-lg font-bold text-blue-900">{formatCurrency(policy.total_premium)}</div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="text-sm text-purple-600 font-medium">TIV</div>
            <div className="text-lg font-bold text-purple-900">{formatCurrency(policy.tiv)}</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-sm text-green-600 font-medium">Appetite Score</div>
            <div className="text-lg font-bold text-green-900">
              {((policy.score || policy.winnability) * 100).toFixed(1)}%
            </div>
          </div>
          <div className={`p-3 rounded-lg ${getRiskScoreColor(policy.risk_score || 0)}`}>
            <div className="text-sm font-medium">Risk Score</div>
            <div className="text-lg font-bold">{policy.risk_score?.toFixed(1) || 'N/A'}</div>
          </div>
        </div>

        {/* Risk Indicators */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4 text-gray-500" />
            <span>Loss Ratio: {(lossRatio * 100).toFixed(1)}%</span>
            {lossRatio > 0.7 && <AlertTriangle className="h-4 w-4 text-red-500" />}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span>Built: {policy.oldest_building}</span>
          </div>
          <div className="flex items-center gap-1">
            <Building className="h-4 w-4 text-gray-500" />
            <span>{policy.construction_type}</span>
          </div>
        </div>

        {/* Policy Dates */}
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <div>
            <span className="font-medium">Effective:</span> {formatDate(policy.effective_date)}
          </div>
          <div>
            <span className="font-medium">Expires:</span> {formatDate(policy.expiration_date)}
          </div>
        </div>

        {/* Expandable Details */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <span className="font-medium">View Detailed Analysis</span>
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="space-y-4 mt-4">
            {/* Account Statistics */}
            {accountStats && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Account Performance</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Avg Score:</span>
                    <span className="ml-2 font-medium">{(accountStats.avg_score * 100).toFixed(1)}%</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Max Score:</span>
                    <span className="ml-2 font-medium">{(accountStats.max_score * 100).toFixed(1)}%</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Weighted Score:</span>
                    <span className="ml-2 font-medium">{(accountStats.weighted_score * 100).toFixed(1)}%</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Avg Risk:</span>
                    <span className="ml-2 font-medium">{accountStats.avg_risk_score.toFixed(1)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Weighted Risk:</span>
                    <span className="ml-2 font-medium">{accountStats.weighted_risk_score.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* AI Justification Points */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                AI Analysis & Justification
              </h4>
              <div className="space-y-2">
                {policy.justification_points?.map((point, index) => {
                  // Handle both string and JSON string formats
                  let displayPoint = point
                  try {
                    if (point.startsWith('```json') || point.startsWith('{')) {
                      const jsonMatch = point.match(/```json\n(.*?)\n```/s) || point.match(/(\{.*\})/s)
                      if (jsonMatch) {
                        const parsed = JSON.parse(jsonMatch[1])
                        if (parsed.points) {
                          return parsed.points.map((p: string, i: number) => (
                            <div key={`${index}-${i}`} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                              <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-blue-900">{p}</span>
                            </div>
                          ))
                        }
                      }
                    }
                  } catch (e) {
                    // Fall back to displaying as string
                  }
                  
                  return (
                    <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-blue-900">{displayPoint}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* References */}
            {policy.references && policy.references.length > 0 && (
              <div className="space-y-3">
                <Button 
                  variant="ghost" 
                  onClick={() => setShowReferences(!showReferences)}
                  className="p-0 h-auto font-semibold text-gray-900"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Supporting References ({policy.references.length})
                  {showReferences ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
                </Button>
                
                {showReferences && (
                  <div className="space-y-2">
                    {policy.references.map((ref, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                        <div className="text-sm text-gray-700 mb-2">{ref.point}</div>
                        {ref.link && ref.link !== "https://example.com" && (
                          <a 
                            href={ref.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                            View Source
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Raw JSON Data */}
            <details className="bg-gray-50 rounded-lg">
              <summary className="p-3 cursor-pointer font-medium text-gray-700 hover:text-gray-900">
                Raw Policy Data (JSON)
              </summary>
              <div className="p-3 pt-0">
                <pre className="text-xs bg-gray-900 text-green-400 p-3 rounded overflow-x-auto">
                  {JSON.stringify(policy, null, 2)}
                </pre>
              </div>
            </details>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
}

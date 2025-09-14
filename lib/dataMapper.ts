// Data mapper to convert real policy data to dashboard submission format

export interface RealPolicyData {
  id: number;
  tiv: number;
  created_at: string;
  loss_value: string;
  winnability: number;
  account_name: string;
  total_premium: number;
  effective_date: string;
  expiration_date: string;
  oldest_building: number;
  line_of_business: string;
  construction_type: string;
  primary_risk_state: string;
  renewal_or_new_business: string;
  score?: number;
  risk_score?: number;
  justification_points?: string[];
}

export interface DetailedInfo {
  submissionDate: string;
  expirationDate: string;
  industry: string;
  employees: string;
  revenue: string;
  location: string;
  riskFactors: string[];
  previousClaims: string;
  competitorQuotes: string[];
}

export interface DashboardSubmission {
  id: number;
  client: string;
  broker: string;
  premium: string;
  premiumValue: number;
  appetiteScore: number;
  appetiteStatus: string;
  slaTimer: string;
  slaProgress: number;
  status: string;
  company: string;
  product: string;
  coverage: string;
  lineOfBusiness: string;
  state: string;
  businessType: string;
  whySurfaced: string[];
  missingInfo: string[];
  recommendation: string;
  detailedInfo: DetailedInfo;
}

// Sample broker mapping - you can expand this
const BROKER_MAPPING = [
  "Marsh & McLennan",
  "Aon Risk Solutions", 
  "Willis Towers Watson",
  "Gallagher",
  "Brown & Brown"
];

// Calculate SLA timer based on expiration date
function calculateSLATimer(expirationDate: string): { timer: string; progress: number } {
  const expiry = new Date(expirationDate);
  const now = new Date();
  const diffTime = expiry.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 0) {
    return { timer: "Expired", progress: 100 };
  } else if (diffDays <= 7) {
    return { timer: `${diffDays}d left`, progress: 85 };
  } else if (diffDays <= 30) {
    return { timer: `${diffDays}d left`, progress: 60 };
  } else {
    const months = Math.floor(diffDays / 30);
    const days = diffDays % 30;
    return { 
      timer: months > 0 ? `${months}m ${days}d` : `${days}d`, 
      progress: Math.max(20, 100 - (diffDays * 2)) 
    };
  }
}

// Convert appetite score to status
function getAppetiteStatus(score: number): string {
  if (score >= 0.8) return "good";
  if (score < 0.3) return "poor";
  return "good"; // Most of your data seems to be in good range
}

// Format premium for display
function formatPremium(premium: number): string {
  if (premium >= 1000000) {
    return `$${(premium / 1000000).toFixed(1)}M`;
  }
  return `$${(premium / 1000).toFixed(0)}K`;
}

// Map line of business to product
function mapLineOfBusinessToProduct(lob: string): string {
  const mapping: { [key: string]: string } = {
    "GENERAL LIABILITY": "General Liability",
    "WORKERS COMPENSATION": "Workers' Compensation", 
    "COMMERCIAL PROPERTY": "Commercial Property",
    "CYBER LIABILITY": "Cyber Liability",
    "PROFESSIONAL LIABILITY": "Professional Liability"
  };
  return mapping[lob] || lob;
}

// Main mapper function
export function mapRealDataToSubmissions(realData: RealPolicyData[]): DashboardSubmission[] {
  return realData.map((policy, index) => {
    const slaInfo = calculateSLATimer(policy.expiration_date);
    const appetiteScore = policy.score ? Math.round(policy.score * 100) : 
                         policy.winnability > 1 ? policy.winnability : 
                         Math.round(policy.winnability * 100);
    
    return {
      id: policy.id,
      client: policy.account_name,
      broker: BROKER_MAPPING[index % BROKER_MAPPING.length],
      premium: formatPremium(policy.total_premium),
      premiumValue: policy.total_premium,
      appetiteScore: appetiteScore,
      appetiteStatus: getAppetiteStatus(appetiteScore / 100),
      slaTimer: slaInfo.timer,
      slaProgress: slaInfo.progress,
      status: policy.renewal_or_new_business === "RENEWAL" ? "Under Review" : "Review Required",
      company: policy.account_name,
      product: mapLineOfBusinessToProduct(policy.line_of_business),
      coverage: `$${(policy.tiv / 1000000).toFixed(1)}M ${mapLineOfBusinessToProduct(policy.line_of_business)}`,
      lineOfBusiness: policy.line_of_business.split(' ').map(word => 
        word.charAt(0) + word.slice(1).toLowerCase()
      ).join(' '),
      state: policy.primary_risk_state,
      businessType: policy.renewal_or_new_business === "RENEWAL" ? "Renewal" : "New",
      whySurfaced: policy.justification_points || [
        `High TIV of $${(policy.tiv / 1000000).toFixed(1)}M indicates substantial coverage`,
        `${policy.construction_type} construction from ${policy.oldest_building}`,
        `Located in ${policy.primary_risk_state} - priority state`
      ],
      missingInfo: [],
      recommendation: appetiteScore >= 70 ? "Approve" : "Decline",
      detailedInfo: {
        submissionDate: new Date(policy.created_at).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        expirationDate: new Date(policy.expiration_date).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        industry: mapLineOfBusinessToProduct(policy.line_of_business),
        employees: "N/A", // Not available in real data
        revenue: formatPremium(policy.total_premium * 20), // Estimate revenue as 20x premium
        location: `${policy.primary_risk_state}, US`,
        riskFactors: [
          `${policy.construction_type} construction`,
          `Building age: ${new Date().getFullYear() - policy.oldest_building} years`,
          `TIV: $${(policy.tiv / 1000000).toFixed(1)}M`
        ],
        previousClaims: policy.loss_value !== "0" ? `Loss value: ${policy.loss_value}` : "No recent claims",
        competitorQuotes: [] // Not available in real data
      }
    };
  });
}

// Enhanced data structure from enhanced_data.json
export interface EnhancedAccount {
  avg_score: number;
  max_score: number;
  weighted_score: number;
  avg_risk_score: number;
  weighted_risk_score: number;
  policies: { [key: string]: EnhancedPolicy };
}

export interface EnhancedPolicy extends RealPolicyData {
  cohere_relevance: number;
  justification_points: string[];
  references: Array<{
    point: string;
    link: string;
  }>;
}

export interface EnhancedData {
  accounts: { [accountName: string]: EnhancedAccount };
}

// Function to load enhanced data with full policy objects
export async function loadEnhancedPolicies(): Promise<{policies: EnhancedPolicy[], accounts: {[key: string]: EnhancedAccount}}> {
  try {
    // Load the enhanced data
    const response = await fetch("/api/policies");
    const enhancedData: EnhancedData = await response.json();
    
    // Flatten the enhanced data into a single array with account info
    const allPolicies: EnhancedPolicy[] = [];
    Object.entries(enhancedData.accounts).forEach(([accountName, account]) => {
      Object.values(account.policies).forEach(policy => {
        allPolicies.push({
          ...policy,
          account_name: accountName // Ensure account name is set
        });
      });
    });
    
    allPolicies.sort((a, b) => (b.cohere_relevance ?? 0) - (a.cohere_relevance ?? 0));
    
    return {
      policies: allPolicies,
      accounts: enhancedData.accounts
    };
  } catch (error) {
    console.error('Error loading enhanced data:', error);
    return { policies: [], accounts: {} };
  }
}

// Function to load and transform enhanced data (backwards compatibility)
export async function loadRealSubmissions(): Promise<DashboardSubmission[]> {
  try {
    const { policies } = await loadEnhancedPolicies();
    return mapRealDataToSubmissions(policies);
  } catch (error) {
    console.error('Error loading enhanced data:', error);
    return []; // Return empty array if loading fails
  }
}

// Function to simulate live data updates
export function createLiveDataStream(callback: (data: {policies: EnhancedPolicy[], accounts: {[key: string]: EnhancedAccount}}) => void) {
  // Initial load
  loadEnhancedPolicies().then(callback);
  
  // Simulate periodic updates (in a real app, this would be WebSocket or polling)
  const interval = setInterval(async () => {
    try {
      const data = await loadEnhancedPolicies();
      // Add some randomization to simulate live updates
      const updatedPolicies = data.policies.map(policy => ({
        ...policy,
        // Simulate small score fluctuations
        score: policy.score ? Math.max(0, Math.min(1, policy.score + (Math.random() - 0.5) * 0.02)) : policy.score,
        risk_score: policy.risk_score ? Math.max(0, Math.min(100, policy.risk_score + (Math.random() - 0.5) * 2)) : policy.risk_score
      }));
      
      callback({
        policies: updatedPolicies,
        accounts: data.accounts
      });
    } catch (error) {
      console.error('Error in live data update:', error);
    }
  }, 30000); // Update every 30 seconds
  
  // Return cleanup function
  return () => clearInterval(interval);
}

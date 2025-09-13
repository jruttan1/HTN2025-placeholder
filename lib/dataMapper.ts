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
      recommendation: appetiteScore >= 70 ? "Approve" : "Decline"
    };
  });
}

// Function to load and transform data from JSON files
export async function loadRealSubmissions(): Promise<DashboardSubmission[]> {
  try {
    // In a real app, you'd fetch this from an API
    // For now, we'll import the JSON files directly
    const response = await fetch('/test_results/test_grouped_policies.json');
    const data = await response.json();
    
    // Flatten the grouped data into a single array
    const allPolicies: RealPolicyData[] = [];
    data.grouped_accounts.forEach((account: any) => {
      allPolicies.push(...account.records);
    });
    
    // Transform and return
    return mapRealDataToSubmissions(allPolicies);
  } catch (error) {
    console.error('Error loading real data:', error);
    return []; // Return empty array if loading fails
  }
}

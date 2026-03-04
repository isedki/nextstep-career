import { CompanyStage, CultureType, ManagementStyle, WorkMode } from './company-profile';

// ============================================
// Company Database
// ============================================

export interface CompanyProfile {
  name: string;
  stage: CompanyStage;
  culture: CultureType[];
  managementStyle: ManagementStyle;
  workMode: WorkMode;
  knownFor: string[];
  industries: string[];
  bestFor: string[]; // Career anchors this company fits
  size: 'tiny' | 'small' | 'medium' | 'large' | 'massive';
  glassdoorRating?: number;
  techStack?: string[];
}

export const companyDatabase: CompanyProfile[] = [
  // ========================================
  // Top Tech (FAANG+)
  // ========================================
  {
    name: 'Google',
    stage: 'enterprise',
    culture: ['autonomous', 'innovative'],
    managementStyle: 'hands_off',
    workMode: 'hybrid',
    knownFor: ['Engineering excellence', '20% time', 'Internal mobility', 'Great benefits'],
    industries: ['Technology', 'AI/ML', 'Cloud'],
    bestFor: ['technical', 'security', 'lifestyle'],
    size: 'massive',
    glassdoorRating: 4.3,
    techStack: ['Go', 'Java', 'Python', 'C++']
  },
  {
    name: 'Meta',
    stage: 'enterprise',
    culture: ['results_oriented', 'innovative'],
    managementStyle: 'supportive',
    workMode: 'hybrid',
    knownFor: ['Move fast', 'High comp', 'Scale challenges', 'Performance culture'],
    industries: ['Technology', 'Social Media', 'VR/AR'],
    bestFor: ['challenge', 'technical'],
    size: 'massive',
    glassdoorRating: 4.1,
    techStack: ['React', 'Hack', 'Python', 'C++']
  },
  {
    name: 'Apple',
    stage: 'enterprise',
    culture: ['structured', 'results_oriented'],
    managementStyle: 'directive',
    workMode: 'onsite',
    knownFor: ['Secrecy', 'Craft obsession', 'Hardware-software integration'],
    industries: ['Technology', 'Consumer Electronics'],
    bestFor: ['technical', 'challenge'],
    size: 'massive',
    glassdoorRating: 4.2,
    techStack: ['Swift', 'Objective-C', 'Python']
  },
  {
    name: 'Amazon',
    stage: 'enterprise',
    culture: ['results_oriented', 'innovative'],
    managementStyle: 'directive',
    workMode: 'hybrid',
    knownFor: ['Leadership principles', 'High bar', 'Customer obsession', 'Scale'],
    industries: ['Technology', 'E-commerce', 'Cloud'],
    bestFor: ['challenge', 'managerial'],
    size: 'massive',
    glassdoorRating: 3.8,
    techStack: ['Java', 'Python', 'AWS']
  },
  {
    name: 'Microsoft',
    stage: 'enterprise',
    culture: ['collaborative', 'structured'],
    managementStyle: 'supportive',
    workMode: 'hybrid',
    knownFor: ['Growth mindset', 'Work-life balance', 'Benefits', 'Stability'],
    industries: ['Technology', 'Cloud', 'Enterprise Software'],
    bestFor: ['security', 'lifestyle', 'technical'],
    size: 'massive',
    glassdoorRating: 4.2,
    techStack: ['C#', 'TypeScript', 'Python', 'Azure']
  },
  {
    name: 'Netflix',
    stage: 'enterprise',
    culture: ['autonomous', 'results_oriented'],
    managementStyle: 'hands_off',
    workMode: 'remote_friendly',
    knownFor: ['Freedom & Responsibility', 'Top-of-market pay', 'High performance'],
    industries: ['Technology', 'Entertainment', 'Streaming'],
    bestFor: ['autonomy', 'challenge', 'technical'],
    size: 'large',
    glassdoorRating: 4.0,
    techStack: ['Java', 'Python', 'Node.js']
  },
  
  // ========================================
  // Developer Tools / Infra
  // ========================================
  {
    name: 'Stripe',
    stage: 'scaleup',
    culture: ['autonomous', 'results_oriented'],
    managementStyle: 'hands_off',
    workMode: 'remote_friendly',
    knownFor: ['Engineering excellence', 'Written culture', 'Low meetings', 'High bar'],
    industries: ['Fintech', 'Developer Tools', 'Payments'],
    bestFor: ['autonomy', 'technical', 'challenge'],
    size: 'medium',
    glassdoorRating: 4.2,
    techStack: ['Ruby', 'Scala', 'Go', 'TypeScript']
  },
  {
    name: 'GitLab',
    stage: 'enterprise',
    culture: ['autonomous', 'collaborative'],
    managementStyle: 'hands_off',
    workMode: 'remote_first',
    knownFor: ['All-remote pioneer', 'Handbook culture', 'Transparency', 'Async'],
    industries: ['Developer Tools', 'DevOps'],
    bestFor: ['autonomy', 'lifestyle', 'technical'],
    size: 'medium',
    glassdoorRating: 4.3,
    techStack: ['Ruby', 'Go', 'Vue.js']
  },
  {
    name: 'Vercel',
    stage: 'growth',
    culture: ['autonomous', 'innovative'],
    managementStyle: 'hands_off',
    workMode: 'remote_first',
    knownFor: ['Developer experience', 'Small teams', 'Ship fast', 'Next.js creators'],
    industries: ['Developer Tools', 'Infrastructure'],
    bestFor: ['autonomy', 'technical', 'entrepreneurial'],
    size: 'small',
    glassdoorRating: 4.4,
    techStack: ['TypeScript', 'Go', 'Rust', 'Next.js']
  },
  {
    name: 'Linear',
    stage: 'growth',
    culture: ['autonomous', 'results_oriented'],
    managementStyle: 'hands_off',
    workMode: 'remote_first',
    knownFor: ['Opinionated product', 'Craft obsession', 'Small team', 'Quality focus'],
    industries: ['Developer Tools', 'Productivity'],
    bestFor: ['autonomy', 'technical', 'challenge'],
    size: 'tiny',
    glassdoorRating: 4.5,
    techStack: ['TypeScript', 'React', 'GraphQL']
  },
  {
    name: 'Datadog',
    stage: 'scaleup',
    culture: ['results_oriented', 'innovative'],
    managementStyle: 'supportive',
    workMode: 'hybrid',
    knownFor: ['Growth stage', 'Technical challenges', 'Scale problems'],
    industries: ['Developer Tools', 'Observability', 'Infrastructure'],
    bestFor: ['challenge', 'technical'],
    size: 'medium',
    glassdoorRating: 4.1,
    techStack: ['Go', 'Python', 'TypeScript']
  },
  {
    name: 'Cloudflare',
    stage: 'scaleup',
    culture: ['innovative', 'autonomous'],
    managementStyle: 'hands_off',
    workMode: 'hybrid',
    knownFor: ['Internet infrastructure', 'Technical depth', 'Edge computing'],
    industries: ['Infrastructure', 'Security', 'CDN'],
    bestFor: ['technical', 'challenge'],
    size: 'medium',
    glassdoorRating: 4.3,
    techStack: ['Go', 'Rust', 'TypeScript', 'C']
  },
  {
    name: 'HashiCorp',
    stage: 'scaleup',
    culture: ['autonomous', 'collaborative'],
    managementStyle: 'hands_off',
    workMode: 'remote_first',
    knownFor: ['Open source', 'DevOps tools', 'Remote-first'],
    industries: ['Developer Tools', 'Infrastructure', 'DevOps'],
    bestFor: ['autonomy', 'technical', 'lifestyle'],
    size: 'medium',
    glassdoorRating: 4.2,
    techStack: ['Go', 'TypeScript', 'Terraform']
  },
  {
    name: 'Supabase',
    stage: 'growth',
    culture: ['autonomous', 'innovative'],
    managementStyle: 'hands_off',
    workMode: 'remote_first',
    knownFor: ['Open source', 'Developer-focused', 'Fast shipping', 'Community'],
    industries: ['Developer Tools', 'Database', 'Backend-as-a-Service'],
    bestFor: ['autonomy', 'entrepreneurial', 'technical'],
    size: 'small',
    glassdoorRating: 4.6,
    techStack: ['TypeScript', 'Elixir', 'Go', 'PostgreSQL']
  },
  {
    name: 'Retool',
    stage: 'growth',
    culture: ['results_oriented', 'innovative'],
    managementStyle: 'supportive',
    workMode: 'hybrid',
    knownFor: ['Internal tools space', 'High velocity', 'Developer productivity'],
    industries: ['Developer Tools', 'Low-code'],
    bestFor: ['challenge', 'entrepreneurial'],
    size: 'small',
    glassdoorRating: 4.3,
    techStack: ['TypeScript', 'React', 'Python']
  },
  
  // ========================================
  // Fintech
  // ========================================
  {
    name: 'Plaid',
    stage: 'scaleup',
    culture: ['collaborative', 'innovative'],
    managementStyle: 'supportive',
    workMode: 'hybrid',
    knownFor: ['Fintech infrastructure', 'API-first', 'Growth stage challenges'],
    industries: ['Fintech', 'API', 'Banking'],
    bestFor: ['technical', 'challenge'],
    size: 'medium',
    glassdoorRating: 4.1,
    techStack: ['Go', 'TypeScript', 'Python']
  },
  {
    name: 'Coinbase',
    stage: 'enterprise',
    culture: ['results_oriented', 'innovative'],
    managementStyle: 'directive',
    workMode: 'remote_first',
    knownFor: ['Crypto focus', 'High compensation', 'Remote-first'],
    industries: ['Fintech', 'Crypto', 'Blockchain'],
    bestFor: ['challenge', 'entrepreneurial'],
    size: 'large',
    glassdoorRating: 3.9,
    techStack: ['Go', 'Ruby', 'TypeScript']
  },
  {
    name: 'Square (Block)',
    stage: 'enterprise',
    culture: ['collaborative', 'innovative'],
    managementStyle: 'supportive',
    workMode: 'hybrid',
    knownFor: ['Multiple products', 'Design focus', 'Jack Dorsey'],
    industries: ['Fintech', 'Payments', 'Crypto'],
    bestFor: ['technical', 'lifestyle'],
    size: 'large',
    glassdoorRating: 4.0,
    techStack: ['Ruby', 'Java', 'Kotlin', 'Go']
  },
  {
    name: 'Ramp',
    stage: 'growth',
    culture: ['results_oriented', 'autonomous'],
    managementStyle: 'supportive',
    workMode: 'hybrid',
    knownFor: ['Fast growth', 'Corporate cards', 'High bar', 'YC alumni'],
    industries: ['Fintech', 'Expense Management'],
    bestFor: ['challenge', 'entrepreneurial'],
    size: 'small',
    glassdoorRating: 4.4,
    techStack: ['TypeScript', 'Python', 'Go']
  },
  {
    name: 'Brex',
    stage: 'growth',
    culture: ['results_oriented', 'innovative'],
    managementStyle: 'supportive',
    workMode: 'remote_first',
    knownFor: ['Startup focus', 'Speed', 'Remote-first'],
    industries: ['Fintech', 'Banking', 'Corporate Cards'],
    bestFor: ['entrepreneurial', 'challenge'],
    size: 'small',
    glassdoorRating: 4.1,
    techStack: ['Elixir', 'TypeScript', 'Kotlin']
  },
  {
    name: 'Affirm',
    stage: 'scaleup',
    culture: ['collaborative', 'results_oriented'],
    managementStyle: 'supportive',
    workMode: 'remote_friendly',
    knownFor: ['Buy-now-pay-later', 'Consumer focus', 'Financial inclusion'],
    industries: ['Fintech', 'Consumer Finance'],
    bestFor: ['service', 'technical'],
    size: 'medium',
    glassdoorRating: 4.0,
    techStack: ['Python', 'Kotlin', 'TypeScript']
  },
  
  // ========================================
  // B2B SaaS / Enterprise
  // ========================================
  {
    name: 'Notion',
    stage: 'scaleup',
    culture: ['collaborative', 'innovative'],
    managementStyle: 'supportive',
    workMode: 'hybrid',
    knownFor: ['Product-led growth', 'Design focus', 'User love'],
    industries: ['Productivity', 'SaaS', 'Collaboration'],
    bestFor: ['technical', 'service'],
    size: 'small',
    glassdoorRating: 4.3,
    techStack: ['TypeScript', 'Kotlin', 'React']
  },
  {
    name: 'Figma',
    stage: 'scaleup',
    culture: ['collaborative', 'innovative'],
    managementStyle: 'supportive',
    workMode: 'hybrid',
    knownFor: ['Design tools', 'Strong IC track', 'Product excellence'],
    industries: ['Design Tools', 'SaaS', 'Collaboration'],
    bestFor: ['technical', 'challenge'],
    size: 'medium',
    glassdoorRating: 4.5,
    techStack: ['TypeScript', 'Rust', 'C++', 'WebGL']
  },
  {
    name: 'Airtable',
    stage: 'scaleup',
    culture: ['collaborative', 'innovative'],
    managementStyle: 'supportive',
    workMode: 'hybrid',
    knownFor: ['No-code/low-code', 'User-focused', 'Product depth'],
    industries: ['Productivity', 'Low-code', 'Database'],
    bestFor: ['technical', 'service'],
    size: 'medium',
    glassdoorRating: 4.1,
    techStack: ['TypeScript', 'React', 'Ruby']
  },
  {
    name: 'Slack (Salesforce)',
    stage: 'enterprise',
    culture: ['collaborative', 'structured'],
    managementStyle: 'supportive',
    workMode: 'hybrid',
    knownFor: ['Messaging pioneer', 'Enterprise focus', 'Stability post-acquisition'],
    industries: ['Communication', 'SaaS', 'Enterprise'],
    bestFor: ['security', 'lifestyle'],
    size: 'large',
    glassdoorRating: 4.2,
    techStack: ['PHP', 'Java', 'Go', 'React']
  },
  {
    name: 'Asana',
    stage: 'scaleup',
    culture: ['collaborative', 'structured'],
    managementStyle: 'coaching',
    workMode: 'hybrid',
    knownFor: ['Mindfulness culture', 'Work management', 'Thoughtful engineering'],
    industries: ['Productivity', 'SaaS', 'Project Management'],
    bestFor: ['service', 'lifestyle'],
    size: 'medium',
    glassdoorRating: 4.3,
    techStack: ['Python', 'TypeScript', 'Java']
  },
  {
    name: 'Miro',
    stage: 'scaleup',
    culture: ['collaborative', 'innovative'],
    managementStyle: 'supportive',
    workMode: 'remote_friendly',
    knownFor: ['Whiteboard tools', 'Remote work enabler', 'International'],
    industries: ['Collaboration', 'SaaS', 'Design'],
    bestFor: ['service', 'lifestyle'],
    size: 'medium',
    glassdoorRating: 4.4,
    techStack: ['TypeScript', 'React', 'Node.js']
  },
  {
    name: 'Canva',
    stage: 'scaleup',
    culture: ['collaborative', 'innovative'],
    managementStyle: 'supportive',
    workMode: 'hybrid',
    knownFor: ['Design democratization', 'Australian unicorn', 'Growth'],
    industries: ['Design Tools', 'SaaS', 'Creative'],
    bestFor: ['service', 'technical'],
    size: 'large',
    glassdoorRating: 4.4,
    techStack: ['TypeScript', 'Java', 'Python']
  },
  
  // ========================================
  // AI/ML Focused
  // ========================================
  {
    name: 'OpenAI',
    stage: 'growth',
    culture: ['innovative', 'autonomous'],
    managementStyle: 'hands_off',
    workMode: 'hybrid',
    knownFor: ['AI research leader', 'High impact', 'Top talent'],
    industries: ['AI/ML', 'Research'],
    bestFor: ['challenge', 'technical', 'entrepreneurial'],
    size: 'small',
    glassdoorRating: 4.2,
    techStack: ['Python', 'PyTorch', 'Rust', 'TypeScript']
  },
  {
    name: 'Anthropic',
    stage: 'growth',
    culture: ['autonomous', 'innovative'],
    managementStyle: 'hands_off',
    workMode: 'hybrid',
    knownFor: ['AI safety', 'Research-focused', 'Claude creator'],
    industries: ['AI/ML', 'Research', 'Safety'],
    bestFor: ['challenge', 'technical', 'service'],
    size: 'small',
    glassdoorRating: 4.5,
    techStack: ['Python', 'PyTorch', 'Rust']
  },
  {
    name: 'Hugging Face',
    stage: 'growth',
    culture: ['collaborative', 'autonomous'],
    managementStyle: 'hands_off',
    workMode: 'remote_first',
    knownFor: ['Open source AI', 'Community', 'Model hub'],
    industries: ['AI/ML', 'Developer Tools', 'Open Source'],
    bestFor: ['technical', 'autonomy', 'service'],
    size: 'small',
    glassdoorRating: 4.6,
    techStack: ['Python', 'Rust', 'TypeScript']
  },
  {
    name: 'Scale AI',
    stage: 'scaleup',
    culture: ['results_oriented', 'innovative'],
    managementStyle: 'directive',
    workMode: 'hybrid',
    knownFor: ['Data labeling', 'Enterprise AI', 'High growth'],
    industries: ['AI/ML', 'Data', 'Enterprise'],
    bestFor: ['challenge', 'entrepreneurial'],
    size: 'medium',
    glassdoorRating: 3.9,
    techStack: ['Python', 'Go', 'TypeScript']
  },
  {
    name: 'Cohere',
    stage: 'growth',
    culture: ['innovative', 'collaborative'],
    managementStyle: 'supportive',
    workMode: 'hybrid',
    knownFor: ['Enterprise LLMs', 'Toronto-based', 'NLP focus'],
    industries: ['AI/ML', 'Enterprise', 'NLP'],
    bestFor: ['technical', 'challenge'],
    size: 'small',
    glassdoorRating: 4.3,
    techStack: ['Python', 'Go', 'TypeScript']
  },
  {
    name: 'Midjourney',
    stage: 'early_startup',
    culture: ['autonomous', 'innovative'],
    managementStyle: 'hands_off',
    workMode: 'remote_first',
    knownFor: ['Generative AI art', 'Small team', 'Profitability'],
    industries: ['AI/ML', 'Creative', 'Consumer'],
    bestFor: ['autonomy', 'entrepreneurial', 'challenge'],
    size: 'tiny',
    glassdoorRating: 4.4,
    techStack: ['Python', 'PyTorch']
  },
  
  // ========================================
  // E-commerce / Consumer
  // ========================================
  {
    name: 'Shopify',
    stage: 'enterprise',
    culture: ['autonomous', 'innovative'],
    managementStyle: 'hands_off',
    workMode: 'remote_first',
    knownFor: ['Digital by default', 'Entrepreneurial culture', 'Merchant focus'],
    industries: ['E-commerce', 'SaaS', 'Retail'],
    bestFor: ['autonomy', 'lifestyle', 'service'],
    size: 'large',
    glassdoorRating: 4.1,
    techStack: ['Ruby', 'Go', 'TypeScript', 'React']
  },
  {
    name: 'DoorDash',
    stage: 'enterprise',
    culture: ['results_oriented', 'innovative'],
    managementStyle: 'supportive',
    workMode: 'hybrid',
    knownFor: ['Logistics challenges', 'Consumer + merchant focus', 'Scale'],
    industries: ['Consumer', 'Logistics', 'Food Delivery'],
    bestFor: ['challenge', 'technical'],
    size: 'large',
    glassdoorRating: 4.0,
    techStack: ['Kotlin', 'Python', 'Go']
  },
  {
    name: 'Instacart',
    stage: 'enterprise',
    culture: ['collaborative', 'results_oriented'],
    managementStyle: 'supportive',
    workMode: 'hybrid',
    knownFor: ['Grocery delivery', 'Marketplace dynamics', 'Complex logistics'],
    industries: ['Consumer', 'Logistics', 'Grocery'],
    bestFor: ['technical', 'challenge'],
    size: 'large',
    glassdoorRating: 3.8,
    techStack: ['Ruby', 'Python', 'Go']
  },
  {
    name: 'Airbnb',
    stage: 'enterprise',
    culture: ['collaborative', 'innovative'],
    managementStyle: 'supportive',
    workMode: 'remote_friendly',
    knownFor: ['Design culture', 'Live anywhere policy', 'Belonging'],
    industries: ['Consumer', 'Travel', 'Marketplace'],
    bestFor: ['lifestyle', 'service'],
    size: 'large',
    glassdoorRating: 4.3,
    techStack: ['Ruby', 'Java', 'TypeScript', 'React']
  },
  {
    name: 'Lyft',
    stage: 'enterprise',
    culture: ['collaborative', 'service'],
    managementStyle: 'supportive',
    workMode: 'hybrid',
    knownFor: ['Values-driven', 'Inclusive culture', 'Transportation'],
    industries: ['Consumer', 'Transportation', 'Marketplace'],
    bestFor: ['service', 'lifestyle'],
    size: 'large',
    glassdoorRating: 3.9,
    techStack: ['Python', 'Go', 'Kotlin']
  },
  {
    name: 'Uber',
    stage: 'enterprise',
    culture: ['results_oriented', 'innovative'],
    managementStyle: 'directive',
    workMode: 'hybrid',
    knownFor: ['Scale challenges', 'High performance', 'Technical depth'],
    industries: ['Consumer', 'Transportation', 'Logistics'],
    bestFor: ['challenge', 'technical'],
    size: 'massive',
    glassdoorRating: 4.0,
    techStack: ['Go', 'Java', 'Python']
  },
  
  // ========================================
  // Healthcare / Climate / Impact
  // ========================================
  {
    name: 'Stripe Climate / Atlas',
    stage: 'scaleup',
    culture: ['autonomous', 'service'],
    managementStyle: 'hands_off',
    workMode: 'remote_friendly',
    knownFor: ['Climate focus within Stripe', 'Startup enablement', 'Impact'],
    industries: ['Climate Tech', 'Fintech', 'Impact'],
    bestFor: ['service', 'autonomy', 'technical'],
    size: 'medium',
    glassdoorRating: 4.2,
    techStack: ['Ruby', 'Scala', 'Go']
  },
  {
    name: 'Watershed',
    stage: 'growth',
    culture: ['collaborative', 'service'],
    managementStyle: 'supportive',
    workMode: 'hybrid',
    knownFor: ['Climate software', 'Carbon accounting', 'Mission-driven'],
    industries: ['Climate Tech', 'Enterprise', 'Sustainability'],
    bestFor: ['service', 'technical'],
    size: 'small',
    glassdoorRating: 4.5,
    techStack: ['TypeScript', 'Python', 'Go']
  },
  {
    name: 'Oscar Health',
    stage: 'scaleup',
    culture: ['collaborative', 'innovative'],
    managementStyle: 'supportive',
    workMode: 'hybrid',
    knownFor: ['Health insurance', 'Tech-forward', 'Consumer experience'],
    industries: ['Healthcare', 'Insurance', 'Consumer'],
    bestFor: ['service', 'technical'],
    size: 'medium',
    glassdoorRating: 3.9,
    techStack: ['Python', 'Go', 'TypeScript']
  },
  {
    name: 'Ro',
    stage: 'growth',
    culture: ['collaborative', 'service'],
    managementStyle: 'supportive',
    workMode: 'hybrid',
    knownFor: ['Digital health', 'Patient-first', 'Pharmacy + care'],
    industries: ['Healthcare', 'Telehealth', 'Pharmacy'],
    bestFor: ['service', 'technical'],
    size: 'small',
    glassdoorRating: 4.1,
    techStack: ['Ruby', 'TypeScript', 'Python']
  },
  {
    name: 'Color Health',
    stage: 'growth',
    culture: ['service', 'collaborative'],
    managementStyle: 'supportive',
    workMode: 'hybrid',
    knownFor: ['Population health', 'Genetic testing', 'Healthcare access'],
    industries: ['Healthcare', 'Genomics'],
    bestFor: ['service', 'technical'],
    size: 'small',
    glassdoorRating: 4.2,
    techStack: ['Python', 'TypeScript', 'Go']
  },
  
  // ========================================
  // Security / Cybersecurity
  // ========================================
  {
    name: 'Crowdstrike',
    stage: 'enterprise',
    culture: ['results_oriented', 'innovative'],
    managementStyle: 'supportive',
    workMode: 'remote_friendly',
    knownFor: ['Endpoint security', 'Cloud-native', 'High growth'],
    industries: ['Security', 'Enterprise'],
    bestFor: ['challenge', 'technical', 'security'],
    size: 'large',
    glassdoorRating: 4.2,
    techStack: ['Go', 'Python', 'C++']
  },
  {
    name: 'Snyk',
    stage: 'scaleup',
    culture: ['collaborative', 'innovative'],
    managementStyle: 'supportive',
    workMode: 'remote_friendly',
    knownFor: ['Developer security', 'Open source', 'DevSecOps'],
    industries: ['Security', 'Developer Tools', 'DevOps'],
    bestFor: ['technical', 'service'],
    size: 'medium',
    glassdoorRating: 4.1,
    techStack: ['TypeScript', 'Go', 'Python']
  },
  {
    name: '1Password',
    stage: 'scaleup',
    culture: ['autonomous', 'collaborative'],
    managementStyle: 'hands_off',
    workMode: 'remote_first',
    knownFor: ['Password security', 'Remote culture', 'Customer focus'],
    industries: ['Security', 'Consumer', 'Enterprise'],
    bestFor: ['autonomy', 'lifestyle', 'service'],
    size: 'medium',
    glassdoorRating: 4.4,
    techStack: ['Rust', 'TypeScript', 'Go']
  },
  {
    name: 'Lacework',
    stage: 'growth',
    culture: ['innovative', 'results_oriented'],
    managementStyle: 'supportive',
    workMode: 'hybrid',
    knownFor: ['Cloud security', 'ML-driven', 'Data platform'],
    industries: ['Security', 'Cloud', 'Enterprise'],
    bestFor: ['challenge', 'technical'],
    size: 'small',
    glassdoorRating: 4.0,
    techStack: ['Go', 'Python', 'React']
  },
  
  // ========================================
  // More Notable Companies
  // ========================================
  {
    name: 'Twilio',
    stage: 'enterprise',
    culture: ['collaborative', 'innovative'],
    managementStyle: 'supportive',
    workMode: 'remote_friendly',
    knownFor: ['Communication APIs', 'Developer focus', 'Draw the owl'],
    industries: ['Communication', 'API', 'Developer Tools'],
    bestFor: ['technical', 'service'],
    size: 'large',
    glassdoorRating: 4.0,
    techStack: ['Python', 'Java', 'Go']
  },
  {
    name: 'Discord',
    stage: 'scaleup',
    culture: ['collaborative', 'innovative'],
    managementStyle: 'supportive',
    workMode: 'hybrid',
    knownFor: ['Community platform', 'Gaming roots', 'Scale challenges'],
    industries: ['Communication', 'Consumer', 'Gaming'],
    bestFor: ['technical', 'challenge'],
    size: 'medium',
    glassdoorRating: 4.3,
    techStack: ['Rust', 'Python', 'Elixir', 'TypeScript']
  },
  {
    name: 'Spotify',
    stage: 'enterprise',
    culture: ['autonomous', 'innovative'],
    managementStyle: 'hands_off',
    workMode: 'remote_friendly',
    knownFor: ['Squad model', 'Autonomous teams', 'Music streaming'],
    industries: ['Consumer', 'Entertainment', 'Streaming'],
    bestFor: ['autonomy', 'technical'],
    size: 'large',
    glassdoorRating: 4.2,
    techStack: ['Java', 'Python', 'TypeScript']
  },
  {
    name: 'Pinterest',
    stage: 'enterprise',
    culture: ['collaborative', 'innovative'],
    managementStyle: 'supportive',
    workMode: 'hybrid',
    knownFor: ['Visual discovery', 'ML/AI focus', 'Inclusive culture'],
    industries: ['Consumer', 'Social Media', 'E-commerce'],
    bestFor: ['technical', 'service'],
    size: 'large',
    glassdoorRating: 4.1,
    techStack: ['Python', 'Java', 'Go']
  },
  {
    name: 'Reddit',
    stage: 'enterprise',
    culture: ['autonomous', 'innovative'],
    managementStyle: 'hands_off',
    workMode: 'remote_first',
    knownFor: ['Community platform', 'Engineering challenges', 'Remote culture'],
    industries: ['Consumer', 'Social Media', 'Community'],
    bestFor: ['autonomy', 'technical'],
    size: 'medium',
    glassdoorRating: 4.0,
    techStack: ['Python', 'Go', 'TypeScript']
  },
  {
    name: 'Atlassian',
    stage: 'enterprise',
    culture: ['collaborative', 'structured'],
    managementStyle: 'supportive',
    workMode: 'remote_friendly',
    knownFor: ['Developer tools', 'Remote work', 'Team Anywhere'],
    industries: ['Developer Tools', 'SaaS', 'Collaboration'],
    bestFor: ['lifestyle', 'security', 'technical'],
    size: 'large',
    glassdoorRating: 4.2,
    techStack: ['Java', 'TypeScript', 'Python']
  },
  {
    name: 'MongoDB',
    stage: 'enterprise',
    culture: ['collaborative', 'innovative'],
    managementStyle: 'supportive',
    workMode: 'remote_friendly',
    knownFor: ['Database technology', 'Developer community', 'Technical depth'],
    industries: ['Database', 'Developer Tools', 'Cloud'],
    bestFor: ['technical', 'challenge'],
    size: 'large',
    glassdoorRating: 4.3,
    techStack: ['C++', 'Go', 'Python', 'TypeScript']
  },
  {
    name: 'Elastic',
    stage: 'enterprise',
    culture: ['autonomous', 'collaborative'],
    managementStyle: 'hands_off',
    workMode: 'remote_first',
    knownFor: ['Search technology', 'Distributed team', 'Open source'],
    industries: ['Search', 'Developer Tools', 'Observability'],
    bestFor: ['autonomy', 'technical', 'lifestyle'],
    size: 'large',
    glassdoorRating: 4.1,
    techStack: ['Java', 'Go', 'TypeScript']
  },
  {
    name: 'Zapier',
    stage: 'scaleup',
    culture: ['autonomous', 'collaborative'],
    managementStyle: 'hands_off',
    workMode: 'remote_first',
    knownFor: ['Fully remote pioneer', 'Automation', 'Work-life balance'],
    industries: ['Automation', 'SaaS', 'Integration'],
    bestFor: ['autonomy', 'lifestyle'],
    size: 'small',
    glassdoorRating: 4.5,
    techStack: ['Python', 'TypeScript', 'React']
  },
  {
    name: 'Automattic',
    stage: 'enterprise',
    culture: ['autonomous', 'innovative'],
    managementStyle: 'hands_off',
    workMode: 'remote_first',
    knownFor: ['WordPress', 'Distributed company', 'Open source'],
    industries: ['Publishing', 'E-commerce', 'Open Source'],
    bestFor: ['autonomy', 'lifestyle', 'service'],
    size: 'medium',
    glassdoorRating: 4.3,
    techStack: ['PHP', 'JavaScript', 'Go']
  },
];

// ============================================
// Company Matcher
// ============================================

export interface CompanyMatch {
  company: CompanyProfile;
  score: number;
  fitReasons: string[];
  concerns: string[];
}

export function matchCompaniesToProfile(
  anchors: string[],
  culture: string,
  stage: string,
  workMode: string,
  industries: string[]
): {
  perfectFit: CompanyMatch[];
  worthExploring: CompanyMatch[];
  avoidUnless: CompanyMatch[];
} {
  const matches: CompanyMatch[] = companyDatabase.map(company => {
    let score = 0;
    const fitReasons: string[] = [];
    const concerns: string[] = [];
    
    // Anchor match (40 points max)
    const anchorMatches = anchors.filter(a => company.bestFor.includes(a));
    score += anchorMatches.length * 15;
    if (anchorMatches.length > 0) {
      fitReasons.push(`Fits your ${anchorMatches.join(' & ')} values`);
    }
    
    // Culture match (20 points)
    if (company.culture.includes(culture as CultureType)) {
      score += 20;
      fitReasons.push(`Culture aligns: ${culture}`);
    }
    
    // Stage match (15 points)
    if (company.stage === stage) {
      score += 15;
      fitReasons.push(`Right company stage`);
    } else if (
      (stage === 'growth' && company.stage === 'scaleup') ||
      (stage === 'scaleup' && company.stage === 'growth')
    ) {
      score += 8;
    }
    
    // Work mode match (15 points)
    if (company.workMode === workMode) {
      score += 15;
      fitReasons.push(`${workMode.replace('_', ' ')} work style`);
    } else if (workMode === 'remote_first' && company.workMode === 'remote_friendly') {
      score += 8;
    } else if (workMode === 'remote_friendly' && company.workMode === 'hybrid') {
      score += 5;
    }
    
    // Industry match (10 points)
    const industryOverlap = company.industries.filter(i => 
      industries.some(ui => i.toLowerCase().includes(ui.toLowerCase()) || ui.toLowerCase().includes(i.toLowerCase()))
    );
    if (industryOverlap.length > 0) {
      score += 10;
      fitReasons.push(`Industry match: ${industryOverlap[0]}`);
    }
    
    // Glassdoor bonus (5 points max)
    if (company.glassdoorRating && company.glassdoorRating >= 4.2) {
      score += 5;
    }
    
    // Add concerns
    if (company.stage === 'early_startup' && stage === 'enterprise') {
      concerns.push('Much smaller than your preferred company stage');
    }
    if (company.workMode === 'onsite' && workMode === 'remote_first') {
      concerns.push('Requires in-office presence');
    }
    if (company.size === 'massive' && stage === 'growth') {
      concerns.push('Larger than your ideal company size');
    }
    
    return { company, score, fitReasons, concerns };
  });
  
  // Sort by score
  matches.sort((a, b) => b.score - a.score);
  
  // Categorize
  const perfectFit = matches.filter(m => m.score >= 60).slice(0, 8);
  const worthExploring = matches.filter(m => m.score >= 40 && m.score < 60).slice(0, 6);
  const avoidUnless = matches.filter(m => m.score >= 25 && m.score < 40 && m.concerns.length > 0).slice(0, 4);
  
  return { perfectFit, worthExploring, avoidUnless };
}


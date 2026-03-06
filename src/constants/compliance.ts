import type {
  ScreenerQuestion,
  FrameworkInfo,
  ComplianceNudge,
} from '../types/session';

export const SCREENER_QUESTIONS: ScreenerQuestion[] = [
  {
    id: 'crim_records',
    text: "Will officers or staff use this software to look up a person's criminal history or background?",
    hint: 'For example: checking if someone has prior arrests, warrants, or convictions.',
    yesFlags: ['CJIS'],
  },
  {
    id: 'fed_agency',
    text: 'Will this product be used by or sold to a federal agency (FBI, DHS, DOJ, etc.)?',
    hint: 'Or does it need to integrate with federal systems or receive federal funding?',
    yesFlags: ['FedRAMP'],
  },
  {
    id: 'state_gov',
    text: 'Will this be used by state or local government agencies in Texas or other states that have cloud security requirements?',
    hint: 'Many states require certified cloud platforms for government software.',
    yesFlags: ['StateRAMP', 'TX-RAMP'],
  },
  {
    id: 'dod',
    text: 'Does this product involve Department of Defense contracts, contractors, or DoD data?',
    hint: 'Even indirect involvement -- like a contractor who works with the DoD.',
    yesFlags: ['CMMC'],
  },
  {
    id: 'health_data',
    text: 'Will the system store or handle any medical, mental health, or substance abuse records?',
    hint: 'This includes mental health evaluations, medical records, or treatment history of any individuals.',
    yesFlags: ['HIPAA'],
  },
  {
    id: 'sensitive_infra',
    text: 'Is this software part of critical public infrastructure -- like emergency response, corrections, courts, or public safety systems?',
    hint: 'These systems have elevated cybersecurity expectations from the federal government.',
    yesFlags: ['CISA CPGs'],
  },
];

export const FRAMEWORK_INFO: Record<string, FrameworkInfo> = {
  CJIS: {
    icon: '\u{1F510}',
    level: 'warn',
    name: 'CJIS Security Policy',
    desc: "Because your system accesses criminal history data, it must comply with the FBI's Criminal Justice Information Services (CJIS) Security Policy. This is one of the most demanding compliance requirements in law enforcement technology.",
    impact:
      "Hosting environment (must be CJIS-approved), multi-factor authentication required, strict audit logging, background checks for all personnel with system access, encryption standards, and contractual agreements with the FBI's CJIS Division.",
  },
  FedRAMP: {
    icon: '\u{1F3DB}\u{FE0F}',
    level: 'warn',
    name: 'FedRAMP Authorization',
    desc: "Federal agencies require cloud services to be FedRAMP authorized. If you're selling to federal customers, your cloud hosting and services must either be FedRAMP-authorized or you must pursue authorization.",
    impact:
      'Cloud provider choice, significant security documentation, third-party assessment costs ($250K-$1M+), and timeline (12-18 months for authorization). Often requires a government-focused cloud like AWS GovCloud.',
  },
  StateRAMP: {
    icon: '\u{1F3E2}',
    level: 'info',
    name: 'StateRAMP',
    desc: 'StateRAMP is the state-government equivalent of FedRAMP. Some states require this certification for cloud software used by state agencies.',
    impact:
      'Cloud hosting requirements and security documentation. Less intensive than FedRAMP but still requires third-party assessment.',
  },
  'TX-RAMP': {
    icon: '\u{2B50}',
    level: 'info',
    name: 'TX-RAMP (Texas)',
    desc: 'Texas requires cloud service providers to be TX-RAMP certified before state agencies can purchase or use their software.',
    impact:
      'Two-level program (Level 1 for lower-risk, Level 2 for higher-risk). Required before contract execution with Texas agencies.',
  },
  CMMC: {
    icon: '\u{1F6E1}\u{FE0F}',
    level: 'warn',
    name: 'CMMC (Cybersecurity Maturity Model Certification)',
    desc: 'Department of Defense contracts require CMMC certification. This is mandatory for any contractor in the DoD supply chain.',
    impact:
      'Third-party assessment required for Level 2+, significant investment in security controls and documentation, ongoing compliance maintenance.',
  },
  HIPAA: {
    icon: '\u{1F3E5}',
    level: 'warn',
    name: 'HIPAA Compliance',
    desc: 'Any system storing Protected Health Information (PHI) -- including mental health records -- must comply with HIPAA.',
    impact:
      'Encryption requirements, access controls, Business Associate Agreements (BAAs) with all vendors, breach notification procedures, and audit trails.',
  },
  'CISA CPGs': {
    icon: '\u{1F512}',
    level: 'note',
    name: 'CISA Cybersecurity Performance Goals',
    desc: "CISA's CPGs are recommended baseline security practices for critical infrastructure. While not legally mandatory, agencies increasingly expect vendors to follow them.",
    impact:
      'Security baseline practices including MFA, asset inventory, vulnerability management, and incident response.',
  },
};

export const COMPLIANCE_NUDGES: Record<string, ComplianceNudge> = {
  must_haves: {
    frameworks: ['CJIS'],
    text: 'If any feature involves criminal records or FBI data, your developer will need to know -- it changes how this feature gets built and what security is required.',
  },
  who_uses: {
    frameworks: ['CJIS', 'FedRAMP'],
    text: 'The roles you define here determine who needs background checks and what level of system access control is required under your compliance frameworks.',
  },
  integrations: {
    frameworks: ['CJIS'],
    text: 'Connecting to FBI/NCIC databases or state criminal records systems requires CJIS-compliant data transmission and special authorization.',
  },
  tech_stack: {
    frameworks: ['FedRAMP', 'CJIS', 'StateRAMP'],
    text: 'Compliance requirements restrict your cloud provider choices. FedRAMP requires AWS GovCloud, Azure Government, or similar.',
  },
  security: {
    frameworks: ['CJIS', 'FedRAMP', 'HIPAA'],
    text: 'Your detected compliance frameworks have specific, mandatory security control requirements.',
  },
  data_types: {
    frameworks: ['HIPAA'],
    text: 'If any stored files contain medical or mental health information, HIPAA applies to that data.',
  },
  data_sensitivity: {
    frameworks: ['CJIS'],
    text: 'FBI/NCIC data and criminal history records fall under CJIS. Every person with access to this data needs a background check.',
  },
  access_concerns: {
    frameworks: ['CJIS', 'FedRAMP'],
    text: 'Your compliance frameworks require formal role-based access control with documented policies.',
  },
};

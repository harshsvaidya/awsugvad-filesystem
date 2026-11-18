export interface RegionOption {
  value: string;
  label: string;
}

export interface S3Provider {
  slug: string;
  id: string;
  name: string;
  tagline: string;
  endpoint: string;
  defaultRegion: string;
  regions: RegionOption[];
  requiresCustomEndpoint: boolean;
  endpointPlaceholder?: string;
  seo: {
    title: string;
    description: string;
    h1: string;
    intro: string;
  };
  setup: {
    corsInstructions: string;
    permissions: string[];
    docsUrl: string;
    docsLabel: string;
    gotcha?: string;
  };
}

export const AWS_REGIONS: RegionOption[] = [
  { value: 'ap-south-1', label: 'Asia Pacific (Mumbai) - ap-south-1' },
  { value: 'ap-south-2', label: 'Asia Pacific (Hyderabad) - ap-south-2' },
  { value: 'us-east-1', label: 'US East (N. Virginia) - us-east-1' },
  { value: 'us-east-2', label: 'US East (Ohio) - us-east-2' },
  { value: 'us-west-1', label: 'US West (N. California) - us-west-1' },
  { value: 'us-west-2', label: 'US West (Oregon) - us-west-2' },
  { value: 'ap-northeast-1', label: 'Asia Pacific (Tokyo) - ap-northeast-1' },
  { value: 'ap-northeast-2', label: 'Asia Pacific (Seoul) - ap-northeast-2' },
  { value: 'ap-northeast-3', label: 'Asia Pacific (Osaka) - ap-northeast-3' },
  { value: 'ap-southeast-1', label: 'Asia Pacific (Singapore) - ap-southeast-1' },
  { value: 'ap-southeast-2', label: 'Asia Pacific (Sydney) - ap-southeast-2' },
  { value: 'ap-southeast-3', label: 'Asia Pacific (Jakarta) - ap-southeast-3' },
  { value: 'ca-central-1', label: 'Canada (Central) - ca-central-1' },
  { value: 'eu-central-1', label: 'Europe (Frankfurt) - eu-central-1' },
  { value: 'eu-west-1', label: 'Europe (Ireland) - eu-west-1' },
  { value: 'eu-west-2', label: 'Europe (London) - eu-west-2' },
  { value: 'eu-west-3', label: 'Europe (Paris) - eu-west-3' },
  { value: 'eu-north-1', label: 'Europe (Stockholm) - eu-north-1' },
  { value: 'eu-south-1', label: 'Europe (Milan) - eu-south-1' },
  { value: 'me-south-1', label: 'Middle East (Bahrain) - me-south-1' },
  { value: 'me-central-1', label: 'Middle East (UAE) - me-central-1' },
  { value: 'sa-east-1', label: 'South America (Sao Paulo) - sa-east-1' },
  { value: 'af-south-1', label: 'Africa (Cape Town) - af-south-1' },
];

export const AWS_S3_PROVIDER: S3Provider = {
  slug: 'aws-s3',
  id: 'aws',
  name: 'Amazon S3',
  tagline: 'Amazon Simple Storage Service',
  endpoint: 'https://s3.{{region}}.amazonaws.com',
  defaultRegion: 'ap-south-1',
  regions: AWS_REGIONS,
  requiresCustomEndpoint: false,
  endpointPlaceholder: 'https://s3.ap-south-1.amazonaws.com',
  seo: {
    title: 'Connect AWS S3 Bucket - AWSUG Vadodara Filesystem',
    description: 'Connect directly to your Amazon S3 buckets. Browser-based file manager with zero server storage.',
    h1: 'Connect to Amazon S3',
    intro: 'Enter your AWS credentials to view, upload, manage and share your S3 bucket files in a familiar Drive UI.',
  },
  setup: {
    corsInstructions: 'Enable CORS on your Amazon S3 bucket to allow browser access.',
    permissions: [
      's3:ListBucket',
      's3:GetObject',
      's3:PutObject',
      's3:DeleteObject',
      's3:GetBucketLocation',
      's3:ListAllMyBuckets',
    ],
    docsUrl: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/enabling-cors-examples.html',
    docsLabel: 'AWS S3 CORS Documentation',
    gotcha: 'Ensure your IAM user or role has permissions to access the specified S3 bucket and that the bucket has CORS enabled.',
  },
};

export const S3_PROVIDERS: S3Provider[] = [AWS_S3_PROVIDER];

export const PROVIDER_SLUGS = ['aws-s3'];

export function getProviderBySlug(_slug?: string): S3Provider {
  return AWS_S3_PROVIDER;
}

export function resolveEndpoint(provider: S3Provider, region: string): string {
  if (region === 'us-east-1') {
    return 'https://s3.us-east-1.amazonaws.com';
  }
  return `https://s3.${region}.amazonaws.com`;
}

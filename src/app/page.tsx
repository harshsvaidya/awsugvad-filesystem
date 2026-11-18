'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Database,
  ArrowRight,
  Copy,
  Check,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  HardDrive,
  Eye,
  EyeOff,
  LogOut,
  Sliders,
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { AWS_REGIONS, AWS_S3_PROVIDER, resolveEndpoint } from '@/config/providers';
import { getCorsConfig } from '@/config/cors';
import { failureFrom, type ConnectionFailure } from '@/lib/s3/connection-failure';
import type { Credentials } from '@opndrive/s3-api';

export default function HomePage() {
  const router = useRouter();
  const { userCreds, createSession, clearSession } = useAuth();

  const [form, setForm] = useState({
    accessKeyId: '',
    secretAccessKey: '',
    bucketName: '',
    region: 'ap-south-1',
    prefix: '',
    endpoint: '',
  });

  const [showSecret, setShowSecret] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showCorsGuide, setShowCorsGuide] = useState(false);
  const [copiedCors, setCopiedCors] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [failure, setFailure] = useState<ConnectionFailure | null>(null);
  const [showConnectForm, setShowConnectForm] = useState(false);

  // Normalize folder prefix
  const formatPrefix = (value: string): string => {
    if (!value || value.trim() === '') return '';
    const parts = value
      .replace(/\//g, ' ')
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    return parts.length > 0 ? `${parts.join('/')}/` : '';
  };

  const updateForm = (patch: Partial<typeof form>) => {
    setForm((prev) => ({ ...prev, ...patch }));
    if (failure) setFailure(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.accessKeyId.trim() || !form.secretAccessKey.trim() || !form.bucketName.trim()) {
      return;
    }

    setIsLoading(true);
    setFailure(null);

    const creds: Credentials = {
      accessKeyId: form.accessKeyId.trim(),
      secretAccessKey: form.secretAccessKey.trim(),
      bucketName: form.bucketName.trim(),
      region: form.region,
      prefix: formatPrefix(form.prefix),
      ...(form.endpoint.trim()
        ? { endpoint: form.endpoint.trim() }
        : { endpoint: resolveEndpoint(AWS_S3_PROVIDER, form.region) }),
    };

    try {
      await createSession(creds);
      router.push('/dashboard');
    } catch (caught) {
      console.error('Failed to connect to S3:', caught);
      setFailure(failureFrom(caught));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCors = () => {
    navigator.clipboard.writeText(getCorsConfig('aws'));
    setCopiedCors(true);
    setTimeout(() => setCopiedCors(false), 2500);
  };

  const maskedKey = (key?: string) => {
    if (!key) return '';
    if (key.length <= 8) return '****';
    return `${key.slice(0, 4)}...${key.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] text-foreground flex flex-col justify-between selection:bg-blue-500 selection:text-white">
      {/* Top Navigation */}
      <header className="w-full border-b border-border bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-20 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="AWSUG Vadodara"
                fill
                sizes="80px"
                className="object-contain"
                priority
              />
            </div>
            <div className="h-6 w-px bg-border mx-1" />
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight leading-tight flex items-center gap-1.5">
                AWS S3 Drive
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  AWSUG Vadodara
                </span>
              </span>
              <span className="text-xs text-muted-foreground">Serverless S3 File Explorer</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {userCreds && (
              <button
                onClick={() => router.push('/dashboard')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-sm"
              >
                <HardDrive className="w-3.5 h-3.5" />
                Open Drive
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 md:py-12 flex flex-col items-center">
        {/* Hero Banner with Logo */}
        <div className="text-center mb-8 max-w-2xl">
          <div className="relative w-44 h-20 mx-auto mb-4 drop-shadow-sm">
            <Image
              src="/logo.png"
              alt="AWS User Group Vadodara"
              fill
              sizes="176px"
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Connect to your Amazon S3 Bucket
          </h1>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground">
            A Google Drive-like interface for managing, browsing, uploading, and sharing files directly from your Amazon S3 storage.
          </p>
        </div>

        {/* Existing Session Card (If user already connected) */}
        {userCreds && !showConnectForm && (
          <div className="w-full max-w-xl mb-8 p-6 rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/60 dark:bg-blue-950/20 shadow-md">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-600 text-white rounded-xl shadow-sm">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      Active S3 Session
                    </span>
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mt-0.5">
                    {userCreds.bucketName}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Region: <span className="font-medium text-foreground">{userCreds.region}</span> • Key: <span className="font-mono">{maskedKey(userCreds.accessKeyId)}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-blue-100 dark:border-blue-900/50 flex flex-wrap gap-2.5 items-center justify-between">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-all shadow-sm"
              >
                <HardDrive className="w-4 h-4" />
                Open My Drive
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                type="button"
                onClick={() => setShowConnectForm(true)}
                className="px-4 py-2.5 rounded-xl border border-border bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-medium text-foreground transition-all"
              >
                Connect Another Bucket
              </button>

              <button
                type="button"
                onClick={() => clearSession()}
                className="p-2.5 rounded-xl border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs transition-all"
                title="Disconnect session"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Credentials Form */}
        {(!userCreds || showConnectForm) && (
          <div className="w-full max-w-xl bg-card border border-border rounded-2xl shadow-xl p-6 sm:p-8 relative">
            {userCreds && showConnectForm && (
              <button
                onClick={() => setShowConnectForm(false)}
                className="absolute top-4 right-4 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                ← Return to active session
              </button>
            )}

            <div className="mb-6">
              <h2 className="text-lg font-bold text-foreground">S3 Credentials</h2>
              <p className="text-xs text-muted-foreground">
                Credentials are stored securely in your browser's LocalStorage.
              </p>
            </div>

            {/* Error Banner */}
            {failure && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-800 dark:text-red-300 text-sm">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-red-900 dark:text-red-200">
                      {failure.title || 'Connection Failed'}
                    </h4>
                    <p className="mt-1 text-xs text-red-700 dark:text-red-300/90 leading-relaxed">
                      {failure.detail}
                    </p>
                    {failure.kind === 'network' && (
                      <button
                        type="button"
                        onClick={() => setShowCorsGuide(true)}
                        className="mt-2.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                      >
                        Click here to view S3 CORS setup guide & policy →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Access Key ID */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  AWS Access Key ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="AKIAIOSFODNN7EXAMPLE"
                  value={form.accessKeyId}
                  onChange={(e) => updateForm({ accessKeyId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface-sunken focus:bg-background text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-muted-foreground/50"
                />
              </div>

              {/* Secret Access Key */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  AWS Secret Access Key <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showSecret ? 'text' : 'password'}
                    required
                    autoComplete="off"
                    spellCheck={false}
                    placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
                    value={form.secretAccessKey}
                    onChange={(e) => updateForm({ secretAccessKey: e.target.value })}
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-border bg-surface-sunken focus:bg-background text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-muted-foreground/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecret(!showSecret)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                    title={showSecret ? 'Hide secret' : 'Show secret'}
                  >
                    {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Grid: Region & Bucket Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Region */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    AWS Region <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.region}
                    onChange={(e) => updateForm({ region: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-surface-sunken focus:bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    {AWS_REGIONS.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Bucket Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Bucket Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="my-s3-bucket"
                    value={form.bucketName}
                    onChange={(e) => updateForm({ bucketName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface-sunken focus:bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-muted-foreground/50"
                  />
                </div>
              </div>

              {/* Optional Folder Prefix */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                  <span>Folder Prefix (Optional)</span>
                  <span className="text-[11px] font-normal lowercase text-muted-foreground">
                    root if empty
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. documents/ or leave blank for full bucket"
                  value={form.prefix}
                  onChange={(e) => updateForm({ prefix: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface-sunken focus:bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-muted-foreground/50"
                />
              </div>

              {/* Advanced Settings Toggle */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  {showAdvanced ? 'Hide advanced settings' : 'Show advanced settings (Custom Endpoint)'}
                  {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {showAdvanced && (
                  <div className="mt-3 p-4 rounded-xl border border-border bg-surface-sunken/60 space-y-2">
                    <label className="block text-xs font-medium text-foreground">
                      Custom S3 Endpoint (Optional)
                    </label>
                    <input
                      type="url"
                      placeholder="e.g. http://localhost:4566 (LocalStack)"
                      value={form.endpoint}
                      onChange={(e) => updateForm({ endpoint: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Leave empty to use the standard AWS S3 endpoint: <code className="font-mono text-[11px]">{resolveEndpoint(AWS_S3_PROVIDER, form.region)}</code>
                    </p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-sm shadow-md transition-all active:scale-[0.99]"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Connecting to S3...
                  </>
                ) : (
                  <>
                    <HardDrive className="w-4 h-4" />
                    Connect & Open Drive
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* S3 CORS Guide Collapsible Card */}
        <div className="w-full max-w-xl mt-6 rounded-2xl border border-border bg-card shadow-sm overflow-hidden transition-all">
          <button
            type="button"
            onClick={() => setShowCorsGuide(!showCorsGuide)}
            className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-muted/40 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-sm font-semibold text-foreground">
                First time? How to enable S3 Bucket CORS
              </span>
            </div>
            {showCorsGuide ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </button>

          {showCorsGuide && (
            <div className="px-5 pb-5 pt-2 border-t border-border text-xs text-muted-foreground space-y-3.5">
              <p>
                Because this app runs directly in your browser, Amazon S3 requires a <strong>CORS (Cross-Origin Resource Sharing)</strong> policy on the bucket to permit web requests.
              </p>

              <ol className="list-decimal list-inside space-y-1.5 pl-1">
                <li>Go to the <a href="https://s3.console.aws.amazon.com/s3/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline font-medium">AWS S3 Console</a>.</li>
                <li>Select your bucket and click the <strong>Permissions</strong> tab.</li>
                <li>Scroll to <strong>Cross-origin resource sharing (CORS)</strong> and click <strong>Edit</strong>.</li>
                <li>Paste the JSON policy below and click <strong>Save changes</strong>:</li>
              </ol>

              <div className="relative">
                <pre className="p-3.5 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
                  {getCorsConfig('aws')}
                </pre>
                <button
                  type="button"
                  onClick={handleCopyCors}
                  className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 text-[11px] transition-all"
                >
                  {copiedCors ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedCors ? 'Copied!' : 'Copy Policy'}
                </button>
              </div>

              <div className="p-2.5 rounded-lg bg-surface-sunken border border-border">
                <span className="font-semibold text-foreground">Quick AWS CLI command:</span>
                <pre className="mt-1 font-mono text-[11px] text-foreground select-all">
                  aws s3api put-bucket-cors --bucket YOUR_BUCKET --cors-configuration file://cors.json
                </pre>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border bg-white/50 dark:bg-slate-900/50 py-6 text-center text-xs text-muted-foreground">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-center gap-2">
          <span className="font-semibold text-foreground">AWSUG Vadodara</span>
          <span>•</span>
          <span>Amazon S3 Cloud Filesystem Interface</span>
        </div>
      </footer>
    </div>
  );
}

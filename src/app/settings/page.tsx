'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Key, Eye, EyeOff, Check, Trash2 } from 'lucide-react';
import { useSessionStore } from '@/lib/session';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false);
  const [openaiKey, setOpenaiKey] = useState('');
  const [anthropicKey, setAnthropicKey] = useState('');
  const [showOpenaiKey, setShowOpenaiKey] = useState(false);
  const [showAnthropicKey, setShowAnthropicKey] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);

  const { apiKeys, setApiKey, removeApiKey, initSession } = useSessionStore();

  useEffect(() => {
    setMounted(true);
    initSession();
  }, [initSession]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const handleSaveKey = (provider: 'openai' | 'anthropic') => {
    const key = provider === 'openai' ? openaiKey : anthropicKey;
    if (key.trim()) {
      setApiKey(provider, key.trim());
      setSaved(provider);
      setTimeout(() => setSaved(null), 2000);
      if (provider === 'openai') setOpenaiKey('');
      else setAnthropicKey('');
    }
  };

  const handleRemoveKey = (provider: 'openai' | 'anthropic') => {
    removeApiKey(provider);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link 
            href="/profile"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Profile</span>
          </Link>
          
          <span className="font-semibold">Settings</span>
          
          <div className="w-24" />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold mb-2">API Key Settings</h1>
          <p className="text-muted-foreground">
            Bring Your Own Key (BYOK) - Add your API keys for enhanced AI features.
            Your keys are stored locally in your browser and never sent to our servers.
          </p>
        </motion.div>

        <Separator />

        {/* OpenAI Key */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Key className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">OpenAI API Key</CardTitle>
                    <CardDescription>For ChatGPT-powered insights</CardDescription>
                  </div>
                </div>
                {apiKeys.openai && (
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                    Connected
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {apiKeys.openai ? (
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono">
                      sk-...{apiKeys.openai.slice(-4)}
                    </span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleRemoveKey('openai')}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative">
                    <input
                      type={showOpenaiKey ? 'text' : 'password'}
                      value={openaiKey}
                      onChange={(e) => setOpenaiKey(e.target.value)}
                      placeholder="sk-..."
                      className="w-full px-3 py-2 pr-10 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOpenaiKey(!showOpenaiKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showOpenaiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <Button 
                    onClick={() => handleSaveKey('openai')}
                    disabled={!openaiKey.trim()}
                    className="w-full"
                  >
                    {saved === 'openai' ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Saved!
                      </>
                    ) : (
                      'Save Key'
                    )}
                  </Button>
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-3">
                Get your API key from{' '}
                <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  platform.openai.com
                </a>
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Anthropic Key */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                    <Key className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Anthropic API Key</CardTitle>
                    <CardDescription>For Claude-powered insights</CardDescription>
                  </div>
                </div>
                {apiKeys.anthropic && (
                  <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20">
                    Connected
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {apiKeys.anthropic ? (
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono">
                      sk-ant-...{apiKeys.anthropic.slice(-4)}
                    </span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleRemoveKey('anthropic')}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative">
                    <input
                      type={showAnthropicKey ? 'text' : 'password'}
                      value={anthropicKey}
                      onChange={(e) => setAnthropicKey(e.target.value)}
                      placeholder="sk-ant-..."
                      className="w-full px-3 py-2 pr-10 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAnthropicKey(!showAnthropicKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showAnthropicKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <Button 
                    onClick={() => handleSaveKey('anthropic')}
                    disabled={!anthropicKey.trim()}
                    className="w-full"
                  >
                    {saved === 'anthropic' ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Saved!
                      </>
                    ) : (
                      'Save Key'
                    )}
                  </Button>
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-3">
                Get your API key from{' '}
                <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  console.anthropic.com
                </a>
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 rounded-xl bg-muted/50 space-y-2"
        >
          <h3 className="font-medium text-sm">What API keys enable:</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• More personalized insight explanations</li>
            <li>• Interactive career coaching conversations</li>
            <li>• Dynamic follow-up questions in assessments</li>
            <li>• AI-generated recommendations based on your profile</li>
          </ul>
          <p className="text-xs text-muted-foreground mt-3">
            Without API keys, NextStep works fully using our built-in psychology engine.
            API keys are optional and enhance the experience.
          </p>
        </motion.div>
      </main>
    </div>
  );
}


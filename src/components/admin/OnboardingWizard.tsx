'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RocketLaunchIcon,
  SparklesIcon,
  CreditCardIcon,
  CpuChipIcon,
  CloudIcon,
  ChatBubbleBottomCenterTextIcon,
  ServerStackIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  XMarkIcon,
  Cog6ToothIcon,
  ShoppingBagIcon,
  ChartBarIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

interface OnboardingWizardProps {
  onComplete: () => void;
  onSkip?: () => void;
}

interface StepProps {
  onNext: () => void;
  onBack?: () => void;
  onComplete?: () => void;
}

// Step 1: Welcome
function WelcomeStep({ onNext }: StepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center space-y-8"
    >
      <div className="flex justify-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-500 flex items-center justify-center">
          <RocketLaunchIcon className="w-12 h-12 text-white" />
        </div>
      </div>
      
      <h1 className="text-4xl font-bold bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
        Willkommen bei deinem neuen AI-Shop! 🚀
      </h1>
      
      <p className="text-gray-400 text-lg max-w-2xl mx-auto">
        Dein vollautomatisierter KI-Webshop ist bereit. Lass uns gemeinsam alles einrichten – 
        in nur wenigen Minuten bist du startklar!
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
        <div className="glass p-4 rounded-xl">
          <ChatBubbleBottomCenterTextIcon className="w-8 h-8 text-fuchsia-400 mx-auto mb-2" />
          <h3 className="font-semibold text-white">KI-Chat 24/7</h3>
          <p className="text-sm text-gray-400">Automatischer Kundenservice</p>
        </div>
        <div className="glass p-4 rounded-xl">
          <CpuChipIcon className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
          <h3 className="font-semibold text-white">Vollautomatisierung</h3>
          <p className="text-sm text-gray-400">Bestellungen & Lieferanten</p>
        </div>
        <div className="glass p-4 rounded-xl">
          <ChartBarIcon className="w-8 h-8 text-fuchsia-400 mx-auto mb-2" />
          <h3 className="font-semibold text-white">Analytics</h3>
          <p className="text-sm text-gray-400">Echtzeit-Statistiken</p>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-fuchsia-500/20 to-cyan-500/20 p-4 rounded-xl max-w-md mx-auto">
        <p className="text-sm text-gray-300">
          🎁 <strong>30 Tage kostenlos testen</strong> – Alle Features inklusive!
        </p>
      </div>
      
      <button
        onClick={onNext}
        className="px-8 py-4 bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-xl text-white font-semibold text-lg hover:from-fuchsia-600 hover:to-cyan-600 transition-all flex items-center gap-2 mx-auto"
      >
        Los geht's <ArrowRightIcon className="w-5 h-5" />
      </button>
    </motion.div>
  );
}

// Step 2: Shop Basics
function ShopBasicsStep({ onNext, onBack }: StepProps) {
  const [shopName, setShopName] = useState('');
  const [shopDescription, setShopDescription] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#d946ef');
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6 max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <ShoppingBagIcon className="w-12 h-12 text-fuchsia-400 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-white">Shop-Grundlagen</h2>
        <p className="text-gray-400">Gib deinem Shop einen Namen und eine Identität</p>
      </div>
      
      <div className="glass p-6 rounded-xl space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Shop-Name *</label>
          <input
            type="text"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            placeholder="z.B. Mein Traumshop"
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Shop-Beschreibung</label>
          <textarea
            value={shopDescription}
            onChange={(e) => setShopDescription(e.target.value)}
            placeholder="Was verkaufst du? Beschreibe dein Geschäft in 1-2 Sätzen..."
            rows={3}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Logo (optional)</label>
          <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-fuchsia-500/50 transition-colors cursor-pointer">
            <CloudIcon className="w-8 h-8 text-gray-500 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">Klicken oder Datei hierher ziehen</p>
            <p className="text-gray-500 text-xs mt-1">PNG, JPG bis 5MB</p>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Primärfarbe</label>
          <div className="flex gap-4 items-center">
            <input
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="w-12 h-12 rounded-lg cursor-pointer"
            />
            <span className="text-gray-400">{primaryColor}</span>
            <div className="flex gap-2 ml-auto">
              <button onClick={() => setPrimaryColor('#d946ef')} className="w-8 h-8 rounded-full bg-fuchsia-500 border-2 border-transparent hover:border-white" />
              <button onClick={() => setPrimaryColor('#06b6d4')} className="w-8 h-8 rounded-full bg-cyan-500 border-2 border-transparent hover:border-white" />
              <button onClick={() => setPrimaryColor('#8b5cf6')} className="w-8 h-8 rounded-full bg-violet-500 border-2 border-transparent hover:border-white" />
              <button onClick={() => setPrimaryColor('#f43f5e')} className="w-8 h-8 rounded-full bg-rose-500 border-2 border-transparent hover:border-white" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
        >
          <ArrowLeftIcon className="w-4 h-4" /> Zurück
        </button>
        <button
          onClick={onNext}
          className="px-6 py-3 bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-xl text-white font-semibold hover:from-fuchsia-600 hover:to-cyan-600 transition-all flex items-center gap-2"
        >
          Weiter <ArrowRightIcon className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

// Step 3: Payment Providers
function PaymentStep({ onNext, onBack }: StepProps) {
  const [stripe, setStripe] = useState(false);
  const [paypal, setPaypal] = useState(false);
  const [klarna, setKlarna] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6 max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <CreditCardIcon className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-white">Zahlungsanbieter</h2>
        <p className="text-gray-400">Verbinde deine Zahlungsmethoden – kannst du auch später machen</p>
      </div>
      
      <div className="space-y-4">
        <div className={`glass p-4 rounded-xl flex items-center justify-between cursor-pointer transition-all ${stripe ? 'border-2 border-fuchsia-500' : 'border-2 border-transparent'}`} onClick={() => setStripe(!stripe)}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#635bff] rounded-lg flex items-center justify-center text-white font-bold">S</div>
            <div>
              <h3 className="font-semibold text-white">Stripe</h3>
              <p className="text-sm text-gray-400">Kreditkarten, Apple Pay, Google Pay</p>
            </div>
          </div>
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${stripe ? 'bg-fuchsia-500 border-fuchsia-500' : 'border-gray-600'}`}>
            {stripe && <CheckCircleIcon className="w-4 h-4 text-white" />}
          </div>
        </div>
        
        <div className={`glass p-4 rounded-xl flex items-center justify-between cursor-pointer transition-all ${paypal ? 'border-2 border-fuchsia-500' : 'border-2 border-transparent'}`} onClick={() => setPaypal(!paypal)}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#003087] rounded-lg flex items-center justify-center text-white font-bold">P</div>
            <div>
              <h3 className="font-semibold text-white">PayPal</h3>
              <p className="text-sm text-gray-400">PayPal-Konto & Gastzahlung</p>
            </div>
          </div>
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paypal ? 'bg-fuchsia-500 border-fuchsia-500' : 'border-gray-600'}`}>
            {paypal && <CheckCircleIcon className="w-4 h-4 text-white" />}
          </div>
        </div>
        
        <div className={`glass p-4 rounded-xl flex items-center justify-between cursor-pointer transition-all ${klarna ? 'border-2 border-fuchsia-500' : 'border-2 border-transparent'}`} onClick={() => setKlarna(!klarna)}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#ffb3c7] rounded-lg flex items-center justify-center text-black font-bold">K</div>
            <div>
              <h3 className="font-semibold text-white">Klarna</h3>
              <p className="text-sm text-gray-400">Rechnung, Ratenzahlung, Sofortüberweisung</p>
            </div>
          </div>
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${klarna ? 'bg-fuchsia-500 border-fuchsia-500' : 'border-gray-600'}`}>
            {klarna && <CheckCircleIcon className="w-4 h-4 text-white" />}
          </div>
        </div>
      </div>
      
      <p className="text-center text-gray-500 text-sm">
        💡 Du kannst Zahlungsanbieter jederzeit unter Einstellungen verbinden
      </p>
      
      <div className="flex justify-between">
        <button onClick={onBack} className="px-6 py-3 text-gray-400 hover:text-white transition-colors flex items-center gap-2">
          <ArrowLeftIcon className="w-4 h-4" /> Zurück
        </button>
        <button onClick={onNext} className="px-6 py-3 bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-xl text-white font-semibold hover:from-fuchsia-600 hover:to-cyan-600 transition-all flex items-center gap-2">
          Weiter <ArrowRightIcon className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

// Step 4: AI Setup (One-Click)
function AISetupStep({ onNext, onBack }: StepProps) {
  const [chatAI, setChatAI] = useState(true);
  const [productAI, setProductAI] = useState(true);
  const [socialAI, setSocialAI] = useState(true);
  const [isConfiguring, setIsConfiguring] = useState(false);
  
  const handleConfigure = async () => {
    setIsConfiguring(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsConfiguring(false);
    onNext();
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6 max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <CpuChipIcon className="w-12 h-12 text-fuchsia-400 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-white">KI-Einrichtung</h2>
        <p className="text-gray-400">Deine KI ist bereits vorkonfiguriert – aktiviere die Features</p>
      </div>
      
      <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 p-4 rounded-xl text-center">
        <CheckCircleIcon className="w-6 h-6 text-green-400 mx-auto mb-2" />
        <p className="text-green-300 font-semibold">KI bereits konfiguriert!</p>
        <p className="text-green-400/70 text-sm">Kostenlose Provider: OpenCode Zen, Mistral, Groq</p>
      </div>
      
      <div className="space-y-4">
        <div className={`glass p-4 rounded-xl flex items-center justify-between cursor-pointer transition-all ${chatAI ? 'border-2 border-fuchsia-500' : 'border-2 border-transparent'}`} onClick={() => setChatAI(!chatAI)}>
          <div className="flex items-center gap-4">
            <ChatBubbleBottomCenterTextIcon className="w-8 h-8 text-fuchsia-400" />
            <div>
              <h3 className="font-semibold text-white">Kundenservice-KI</h3>
              <p className="text-sm text-gray-400">Beantwortet 80% der Kundenanfragen automatisch</p>
            </div>
          </div>
          <div className={`w-12 h-6 rounded-full p-1 transition-colors ${chatAI ? 'bg-fuchsia-500' : 'bg-gray-700'}`}>
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${chatAI ? 'translate-x-6' : 'translate-x-0'}`} />
          </div>
        </div>
        
        <div className={`glass p-4 rounded-xl flex items-center justify-between cursor-pointer transition-all ${productAI ? 'border-2 border-fuchsia-500' : 'border-2 border-transparent'}`} onClick={() => setProductAI(!productAI)}>
          <div className="flex items-center gap-4">
            <SparklesIcon className="w-8 h-8 text-cyan-400" />
            <div>
              <h3 className="font-semibold text-white">Produkt-Beschreibungs-KI</h3>
              <p className="text-sm text-gray-400">Generiert SEO-optimierte Produkttexte</p>
            </div>
          </div>
          <div className={`w-12 h-6 rounded-full p-1 transition-colors ${productAI ? 'bg-fuchsia-500' : 'bg-gray-700'}`}>
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${productAI ? 'translate-x-6' : 'translate-x-0'}`} />
          </div>
        </div>
        
        <div className={`glass p-4 rounded-xl flex items-center justify-between cursor-pointer transition-all ${socialAI ? 'border-2 border-fuchsia-500' : 'border-2 border-transparent'}`} onClick={() => setSocialAI(!socialAI)}>
          <div className="flex items-center gap-4">
            <UserGroupIcon className="w-8 h-8 text-fuchsia-400" />
            <div>
              <h3 className="font-semibold text-white">Social-Media-KI</h3>
              <p className="text-sm text-gray-400">Erstellt automatische Posts für Instagram, TikTok, Facebook</p>
            </div>
          </div>
          <div className={`w-12 h-6 rounded-full p-1 transition-colors ${socialAI ? 'bg-fuchsia-500' : 'bg-gray-700'}`}>
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${socialAI ? 'translate-x-6' : 'translate-x-0'}`} />
          </div>
        </div>
      </div>
      
      <div className="flex justify-between">
        <button onClick={onBack} className="px-6 py-3 text-gray-400 hover:text-white transition-colors flex items-center gap-2">
          <ArrowLeftIcon className="w-4 h-4" /> Zurück
        </button>
        <button
          onClick={handleConfigure}
          disabled={isConfiguring}
          className="px-6 py-3 bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-xl text-white font-semibold hover:from-fuchsia-600 hover:to-cyan-600 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {isConfiguring ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Konfiguriere...
            </>
          ) : (
            <>One-Click Setup <ArrowRightIcon className="w-4 h-4" /></>
          )}
        </button>
      </div>
    </motion.div>
  );
}

// Step 5: Vercel Deployment
function VercelStep({ onNext, onBack }: StepProps) {
  const [status, setStatus] = useState<'idle' | 'deploying' | 'live'>('idle');
  const [deployUrl, setDeployUrl] = useState('');
  
  const handleDeploy = async () => {
    setStatus('deploying');
    // Simulate deployment
    await new Promise(resolve => setTimeout(resolve, 3000));
    setDeployUrl('https://mein-shop.vercel.app');
    setStatus('live');
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6 max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <CloudIcon className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-white">Vercel Deployment</h2>
        <p className="text-gray-400">Dein Shop geht live – mit einem Klick</p>
      </div>
      
      <div className="glass p-8 rounded-xl text-center space-y-6">
        {status === 'idle' && (
          <>
            <div className="w-20 h-20 bg-black rounded-xl mx-auto flex items-center justify-center">
              <svg viewBox="0 0 76 65" fill="white" className="w-10 h-10">
                <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white">Deploy to Vercel</h3>
            <p className="text-gray-400">Serverless, schnell, kostenlos für Hobby-Projekte</p>
            <button
              onClick={handleDeploy}
              className="px-8 py-4 bg-black hover:bg-gray-900 rounded-xl text-white font-semibold text-lg transition-all inline-flex items-center gap-2"
            >
              <RocketLaunchIcon className="w-5 h-5" /> Deploy Now
            </button>
          </>
        )}
        
        {status === 'deploying' && (
          <>
            <div className="w-20 h-20 mx-auto relative">
              <div className="absolute inset-0 rounded-full border-4 border-cyan-500/30" />
              <div className="absolute inset-0 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin" />
            </div>
            <h3 className="text-xl font-semibold text-white">Deploying...</h3>
            <p className="text-gray-400">Dein Shop wird bereitgestellt. Das dauert etwa 30 Sekunden.</p>
            <div className="space-y-2 text-left max-w-xs mx-auto">
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <CheckCircleIcon className="w-4 h-4" /> Build gestartet
              </div>
              <div className="flex items-center gap-2 text-cyan-400 text-sm animate-pulse">
                <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" /> Kompiliere...
              </div>
            </div>
          </>
        )}
        
        {status === 'live' && (
          <>
            <div className="w-20 h-20 mx-auto bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircleIcon className="w-12 h-12 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-green-400">Shop ist LIVE! 🎉</h3>
            <a href={deployUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 underline">
              {deployUrl}
            </a>
          </>
        )}
      </div>
      
      <p className="text-center text-gray-500 text-sm">
        💡 Du kannst auch später unter Einstellungen deployen
      </p>
      
      <div className="flex justify-between">
        <button onClick={onBack} className="px-6 py-3 text-gray-400 hover:text-white transition-colors flex items-center gap-2">
          <ArrowLeftIcon className="w-4 h-4" /> Zurück
        </button>
        <button onClick={onNext} className="px-6 py-3 bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-xl text-white font-semibold hover:from-fuchsia-600 hover:to-cyan-600 transition-all flex items-center gap-2">
          {status === 'live' ? 'Weiter' : 'Überspringen'} <ArrowRightIcon className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

// Step 6: ClawdBot Social Media
function ClawdBotStep({ onNext, onBack }: StepProps) {
  const [instagram, setInstagram] = useState(false);
  const [tiktok, setTiktok] = useState(false);
  const [facebook, setFacebook] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6 max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <UserGroupIcon className="w-12 h-12 text-fuchsia-400 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-white">ClawdBot Social Media</h2>
        <p className="text-gray-400">Verbinde deine Social-Media-Accounts für automatische Posts</p>
      </div>
      
      <div className="space-y-4">
        <div className={`glass p-4 rounded-xl flex items-center justify-between cursor-pointer transition-all ${instagram ? 'border-2 border-pink-500' : 'border-2 border-transparent'}`} onClick={() => setInstagram(!instagram)}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-lg flex items-center justify-center text-white font-bold text-xl">📷</div>
            <div>
              <h3 className="font-semibold text-white">Instagram</h3>
              <p className="text-sm text-gray-400">Posts, Stories, Reels</p>
            </div>
          </div>
          <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${instagram ? 'bg-pink-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
            {instagram ? 'Verbunden' : 'Verbinden'}
          </button>
        </div>
        
        <div className={`glass p-4 rounded-xl flex items-center justify-between cursor-pointer transition-all ${tiktok ? 'border-2 border-cyan-500' : 'border-2 border-transparent'}`} onClick={() => setTiktok(!tiktok)}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center text-white font-bold text-xl">🎵</div>
            <div>
              <h3 className="font-semibold text-white">TikTok</h3>
              <p className="text-sm text-gray-400">Videos, Trends</p>
            </div>
          </div>
          <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tiktok ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
            {tiktok ? 'Verbunden' : 'Verbinden'}
          </button>
        </div>
        
        <div className={`glass p-4 rounded-xl flex items-center justify-between cursor-pointer transition-all ${facebook ? 'border-2 border-blue-500' : 'border-2 border-transparent'}`} onClick={() => setFacebook(!facebook)}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">f</div>
            <div>
              <h3 className="font-semibold text-white">Facebook</h3>
              <p className="text-sm text-gray-400">Posts, Page</p>
            </div>
          </div>
          <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${facebook ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
            {facebook ? 'Verbunden' : 'Verbinden'}
          </button>
        </div>
      </div>
      
      <p className="text-center text-gray-500 text-sm">
        💡 Social Media ist optional – du kannst es später unter Einstellungen verbinden
      </p>
      
      <div className="flex justify-between">
        <button onClick={onBack} className="px-6 py-3 text-gray-400 hover:text-white transition-colors flex items-center gap-2">
          <ArrowLeftIcon className="w-4 h-4" /> Zurück
        </button>
        <button onClick={onNext} className="px-6 py-3 bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-xl text-white font-semibold hover:from-fuchsia-600 hover:to-cyan-600 transition-all flex items-center gap-2">
          Weiter <ArrowRightIcon className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

// Step 7: Docker Services
function DockerStep({ onNext, onBack }: StepProps) {
  const services = [
    { name: 'Next.js App', status: 'running', port: 3000 },
    { name: 'n8n Workflows', status: 'running', port: 5678 },
    { name: 'PostgreSQL', status: 'running', port: 5432 },
    { name: 'Redis Cache', status: 'running', port: 6379 },
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6 max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <ServerStackIcon className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-white">Docker Services</h2>
        <p className="text-gray-400">Status deiner Backend-Services</p>
      </div>
      
      <div className="glass p-6 rounded-xl space-y-4">
        {services.map((service) => (
          <div key={service.name} className="flex items-center justify-between py-2 border-b border-gray-700/50 last:border-0">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              <span className="text-white font-medium">{service.name}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm">Port {service.port}</span>
              <span className="text-green-400 text-sm font-medium uppercase">{service.status}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 p-4 rounded-xl text-center">
        <CheckCircleIcon className="w-6 h-6 text-green-400 mx-auto mb-2" />
        <p className="text-green-300 font-semibold">Alle Services laufen! ✓</p>
      </div>
      
      <div className="flex justify-between">
        <button onClick={onBack} className="px-6 py-3 text-gray-400 hover:text-white transition-colors flex items-center gap-2">
          <ArrowLeftIcon className="w-4 h-4" /> Zurück
        </button>
        <button onClick={onNext} className="px-6 py-3 bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-xl text-white font-semibold hover:from-fuchsia-600 hover:to-cyan-600 transition-all flex items-center gap-2">
          Weiter <ArrowRightIcon className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

// Step 8: Complete
function CompleteStep({ onComplete }: StepProps) {
  const [showConfetti, setShowConfetti] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="space-y-8 max-w-2xl mx-auto text-center"
    >
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -20, x: Math.random() * window.innerWidth, opacity: 1 }}
              animate={{ y: window.innerHeight + 20, opacity: 0 }}
              transition={{ duration: 3 + Math.random() * 2, delay: Math.random() * 0.5 }}
              className="absolute w-3 h-3 rounded-full"
              style={{ backgroundColor: ['#d946ef', '#06b6d4', '#8b5cf6', '#f43f5e', '#22c55e'][Math.floor(Math.random() * 5)] }}
            />
          ))}
        </div>
      )}
      
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.2 }}
        className="w-32 h-32 bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-full mx-auto flex items-center justify-center"
      >
        <CheckCircleIcon className="w-20 h-20 text-white" />
      </motion.div>
      
      <h1 className="text-4xl font-bold text-white">Fertig! 🎉</h1>
      <p className="text-xl text-gray-400">Dein KI-Shop ist jetzt einsatzbereit!</p>
      
      <div className="glass p-6 rounded-xl text-left space-y-3">
        <h3 className="font-semibold text-white text-lg mb-4">Was wurde eingerichtet:</h3>
        <div className="flex items-center gap-3 text-green-400">
          <CheckCircleIcon className="w-5 h-5" />
          <span>Shop-Grundlagen konfiguriert</span>
        </div>
        <div className="flex items-center gap-3 text-green-400">
          <CheckCircleIcon className="w-5 h-5" />
          <span>KI-Assistenten aktiviert</span>
        </div>
        <div className="flex items-center gap-3 text-green-400">
          <CheckCircleIcon className="w-5 h-5" />
          <span>Alle Services laufen</span>
        </div>
        <div className="flex items-center gap-3 text-green-400">
          <CheckCircleIcon className="w-5 h-5" />
          <span>30-Tage-Testphase gestartet</span>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <button className="glass p-4 rounded-xl hover:border-fuchsia-500/50 transition-all group">
          <ShoppingBagIcon className="w-8 h-8 text-fuchsia-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <span className="text-sm text-gray-300">Produkte</span>
        </button>
        <button className="glass p-4 rounded-xl hover:border-cyan-500/50 transition-all group">
          <ChartBarIcon className="w-8 h-8 text-cyan-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <span className="text-sm text-gray-300">Analytics</span>
        </button>
        <button className="glass p-4 rounded-xl hover:border-fuchsia-500/50 transition-all group">
          <Cog6ToothIcon className="w-8 h-8 text-fuchsia-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <span className="text-sm text-gray-300">Einstellungen</span>
        </button>
      </div>
      
      <button
        onClick={onComplete}
        className="px-10 py-4 bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-xl text-white font-semibold text-lg hover:from-fuchsia-600 hover:to-cyan-600 transition-all"
      >
        Zum Dashboard 🚀
      </button>
    </motion.div>
  );
}

// Main Onboarding Wizard Component
export default function OnboardingWizard({ onComplete, onSkip }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 8;
  
  const steps = [
    { name: 'Willkommen', icon: RocketLaunchIcon },
    { name: 'Shop-Basics', icon: ShoppingBagIcon },
    { name: 'Zahlung', icon: CreditCardIcon },
    { name: 'KI-Setup', icon: CpuChipIcon },
    { name: 'Vercel', icon: CloudIcon },
    { name: 'Social', icon: UserGroupIcon },
    { name: 'Docker', icon: ServerStackIcon },
    { name: 'Fertig', icon: CheckCircleIcon },
  ];
  
  const handleComplete = () => {
    localStorage.setItem('onboarding_completed', 'true');
    localStorage.setItem('onboarding_completed_at', new Date().toISOString());
    onComplete();
  };
  
  const renderStep = () => {
    const props: StepProps = {
      onNext: () => setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1)),
      onBack: () => setCurrentStep(prev => Math.max(prev - 1, 0)),
      onComplete: handleComplete,
    };
    
    switch (currentStep) {
      case 0: return <WelcomeStep {...props} />;
      case 1: return <ShopBasicsStep {...props} />;
      case 2: return <PaymentStep {...props} />;
      case 3: return <AISetupStep {...props} />;
      case 4: return <VercelStep {...props} />;
      case 5: return <ClawdBotStep {...props} />;
      case 6: return <DockerStep {...props} />;
      case 7: return <CompleteStep {...props} onComplete={handleComplete} />;
      default: return null;
    }
  };
  
  return (
    <div className="fixed inset-0 bg-gray-950/95 backdrop-blur-lg z-50 overflow-y-auto">
      <div className="min-h-screen py-8 px-4">
        {/* Header with close button */}
        <div className="max-w-4xl mx-auto flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <SparklesIcon className="w-6 h-6 text-fuchsia-400" />
            <span className="text-white font-semibold">Setup-Assistent</span>
          </div>
          {onSkip && currentStep < totalSteps - 1 && (
            <button
              onClick={() => {
                if (confirm('Onboarding wirklich überspringen? Du kannst es später unter Einstellungen wiederholen.')) {
                  handleComplete();
                }
              }}
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
            >
              <XMarkIcon className="w-5 h-5" /> Überspringen
            </button>
          )}
        </div>
        
        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    index < currentStep
                      ? 'bg-green-500 text-white'
                      : index === currentStep
                      ? 'bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white'
                      : 'bg-gray-800 text-gray-500'
                  }`}
                >
                  {index < currentStep ? (
                    <CheckCircleIcon className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <span className={`text-xs mt-2 hidden md:block ${index <= currentStep ? 'text-white' : 'text-gray-500'}`}>
                  {step.name}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 h-1 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-fuchsia-500 to-cyan-500 transition-all duration-500"
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>
        
        {/* Step Content */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

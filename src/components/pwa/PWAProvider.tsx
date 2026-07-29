'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Download, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

export function PWAProvider() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const bannerDismissedRef = useRef(false);

  // Register service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[PWA] Service Worker registered:', registration.scope);

          // Check for updates periodically
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'activated') {
                  console.log('[PWA] Service Worker updated');
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('[PWA] Service Worker registration failed:', error);
        });
    }
  }, []);

  // Check if already installed
  useEffect(() => {
    // Check if running in standalone mode (already installed)
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone: boolean }).standalone
    ) {
      setIsInstalled(true);
      return;
    }

    // Check localStorage for dismissed state
    const dismissed = localStorage.getItem('pwa-banner-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10);
      // Show again after 7 days
      if (Date.now() - dismissedTime < 7 * 24 * 60 * 60 * 1000) {
        bannerDismissedRef.current = true;
      }
    }
  }, []);

  // Listen for beforeinstallprompt
  useEffect(() => {
    const handler = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);

      // Show banner if not dismissed and not installed
      if (!bannerDismissedRef.current && !isInstalled) {
        // Small delay so banner doesn't pop up immediately
        setTimeout(() => setShowBanner(true), 3000);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Listen for successful installation
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowBanner(false);
      setDeferredPrompt(null);
      console.log('[PWA] App installed successfully');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, [isInstalled]);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;

      if (choice.outcome === 'accepted') {
        console.log('[PWA] User accepted install');
        setIsInstalled(true);
      } else {
        console.log('[PWA] User dismissed install');
      }
    } catch (err) {
      console.error('[PWA] Install prompt error:', err);
    }

    setDeferredPrompt(null);
    setShowBanner(false);
  }, [deferredPrompt]);

  const handleDismiss = useCallback(() => {
    setShowBanner(false);
    bannerDismissedRef.current = true;
    localStorage.setItem('pwa-banner-dismissed', Date.now().toString());
  }, []);

  // Don't render anything if installed or no prompt available
  if (isInstalled || !showBanner) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed bottom-16 left-4 right-4 z-50 md:bottom-6 md:left-auto md:right-6 md:max-w-sm',
        'animate-in slide-in-from-bottom-4 fade-in duration-500'
      )}
    >
      <div
        className={cn(
          'relative overflow-hidden rounded-2xl border border-purple-200 dark:border-purple-800',
          'bg-white dark:bg-gray-900 shadow-xl shadow-purple-500/10'
        )}
      >
        {/* Gradient accent bar */}
        <div className="h-1 w-full brand-gradient" />

        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* App Icon */}
            <div className="flex-shrink-0 rounded-xl brand-gradient p-2.5 shadow-sm">
              <Download className="h-5 w-5 text-white" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                Install Dompetku
              </h3>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Tambahkan ke home screen untuk akses lebih cepat & pengalaman seperti aplikasi native.
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Tutup"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="mt-3 flex gap-2">
            <button
              onClick={handleInstall}
              className={cn(
                'flex-1 py-2 px-4 rounded-xl text-sm font-medium text-white',
                'brand-gradient brand-gradient-hover',
                'shadow-sm shadow-violet-500/20 transition-all duration-200',
                'active:scale-[0.98]'
              )}
            >
              Install Sekarang
            </button>
            <button
              onClick={handleDismiss}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium',
                'text-gray-500 dark:text-gray-400',
                'hover:bg-gray-100 dark:hover:bg-gray-800',
                'transition-colors duration-200'
              )}
            >
              Nanti
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

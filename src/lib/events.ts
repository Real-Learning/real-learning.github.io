/**
 * Facebook Pixel event wrapper
 */

export function trackFBEvent(
  event: 'Lead' | 'Candidate',
  params?: { form?: 'question' | 'signup' }
): void {
  const eventParams = params ?? {};

  if (typeof window === 'undefined' || !window.fbq) {
    console.warn('[FB] Pixel not found - event not tracked:', event, eventParams);
    return;
  }

  try {
    if (event === 'Lead') {
      window.fbq('track', event, eventParams);
    } else if (event === 'Candidate') {
      window.fbq('trackCustom', event, eventParams);
    }
    console.log('[FB] Event tracked successfully:', event, eventParams);
  } catch (error) {
    console.error('[FB] Failed to track event:', event, eventParams, error);
  }
}

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/data/api';
import { useShop } from '@/store/useStore';
import type { DeliveryEstimate } from '@/data/types';

/** PIN-code delivery check. The last successful PIN is remembered and re-checked on load. */
export function useDelivery() {
  const storedPin = useShop((s) => s.pin);
  const setStoredPin = useShop((s) => s.setPin);

  const [pin, setPin] = useState(storedPin);
  const [result, setResult] = useState<DeliveryEstimate | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const check = useCallback(
    async (value: string) => {
      if (!/^[1-9]\d{5}$/.test(value)) {
        setError('Enter a valid 6-digit PIN code.');
        setResult(null);
        return;
      }
      setBusy(true);
      setError('');
      try {
        const r = await api.checkDelivery(value);
        if (!r.ok) {
          setResult(null);
          setError('Sorry, we can’t deliver to this PIN code yet.');
        } else {
          setResult(r);
          setStoredPin(value);
        }
      } catch {
        setError('Could not check right now. Please try again.');
      } finally {
        setBusy(false);
      }
    },
    [setStoredPin],
  );

  // Re-check the remembered PIN once, on first mount.
  useEffect(() => {
    if (storedPin && !result) void check(storedPin);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPinChange = (value: string) => {
    setPin(value.replace(/\D/g, '').slice(0, 6));
    setError('');
  };

  return {
    pin,
    result,
    error,
    busy,
    check,
    onPinChange,
    /** Back to the input, keeping the typed PIN. */
    change: () => setResult(null),
  };
}

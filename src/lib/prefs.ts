export function readBool(key: string, fallback: boolean) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return raw === '1' || raw === 'true';
  } catch {
    return fallback;
  }
}

export function writeBool(key: string, value: boolean) {
  try {
    localStorage.setItem(key, value ? '1' : '0');
  } catch {
    // ignore
  }
}

export function readString<T extends string>(key: string, fallback: T) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return raw as T;
  } catch {
    return fallback;
  }
}

export function writeString(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore
  }
}

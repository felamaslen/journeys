export function getValue(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function setValue(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore unsupported browser
  }
}

export function removeValue(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore unsupported browser
  }
}

// lib/validations.ts
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Mínimo 8 caracteres");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Al menos una mayúscula");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Al menos una minúscula");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Al menos un número");
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Al menos un carácter especial (!@#$%^&*)");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateUsername(username: string): {
  isValid: boolean;
  error?: string;
} {
  if (!username || username.trim().length === 0) {
    return { isValid: false, error: "El usuario es requerido" };
  }
  if (username.trim().length < 4) {
    return { isValid: false, error: "Mínimo 4 caracteres" };
  }
  if (username.trim().length > 50) {
    return { isValid: false, error: "Máximo 50 caracteres" };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
    return { isValid: false, error: "Solo letras, números y guión bajo" };
  }
  return { isValid: true };
}

export function validateEmail(email: string): {
  isValid: boolean;
  error?: string;
} {
  if (!email || email.trim().length === 0) {
    return { isValid: false, error: "El email es requerido" };
  }
  if (!email.includes("@") || !email.includes(".")) {
    return { isValid: false, error: "Email inválido" };
  }
  if (email.trim().length > 100) {
    return { isValid: false, error: "Máximo 100 caracteres" };
  }
  return { isValid: true };
}

export function validateFullName(name: string): {
  isValid: boolean;
  error?: string;
} {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: "El nombre es requerido" };
  }
  if (name.trim().length > 100) {
    return { isValid: false, error: "Máximo 100 caracteres" };
  }
  return { isValid: true };
}

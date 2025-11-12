// Utilitários para máscaras de formatação

export const formatCNPJ = (value: string): string => {
  // Remove tudo que não é dígito
  const numbers = value.replace(/\D/g, '');
  
  // Aplica a máscara: XX.XXX.XXX/XXXX-XX
  return numbers
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .substring(0, 18); // Limita ao tamanho máximo
};

export const formatPhone = (value: string): string => {
  // Remove tudo que não é dígito
  const numbers = value.replace(/\D/g, '');
  
  // Aplica máscara baseada no tamanho
  if (numbers.length <= 10) {
    // Telefone fixo: (XX) XXXX-XXXX
    return numbers
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .substring(0, 14);
  } else {
    // Celular: (XX) XXXXX-XXXX
    return numbers
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .substring(0, 15);
  }
};

export const formatCEP = (value: string): string => {
  // Remove tudo que não é dígito
  const numbers = value.replace(/\D/g, '');
  
  // Aplica a máscara: XXXXX-XXX
  return numbers
    .replace(/^(\d{5})(\d)/, '$1-$2')
    .substring(0, 9); // Limita ao tamanho máximo
};

export const removeMask = (value: string): string => {
  return value.replace(/\D/g, '');
};

export const validateCNPJ = (cnpj: string): boolean => {
  const numbers = removeMask(cnpj);
  
  // Verifica se tem 14 dígitos
  if (numbers.length !== 14) return false;
  
  // Verifica se não são todos iguais
  if (/^(\d)\1+$/.test(numbers)) return false;
  
  // Validação dos dígitos verificadores
  let sum = 0;
  let weight = 5;
  
  for (let i = 0; i < 12; i++) {
    sum += parseInt(numbers[i]) * weight;
    weight = weight === 2 ? 9 : weight - 1;
  }
  
  const digit1 = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  
  if (parseInt(numbers[12]) !== digit1) return false;
  
  sum = 0;
  weight = 6;
  
  for (let i = 0; i < 13; i++) {
    sum += parseInt(numbers[i]) * weight;
    weight = weight === 2 ? 9 : weight - 1;
  }
  
  const digit2 = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  
  return parseInt(numbers[13]) === digit2;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const numbers = removeMask(phone);
  return numbers.length >= 10 && numbers.length <= 11;
};

export const validateCEP = (cep: string): boolean => {
  const numbers = removeMask(cep);
  return numbers.length === 8;
};





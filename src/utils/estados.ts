// Estados brasileiros para dropdown

export interface Estado {
  codigo: string;
  nome: string;
  uf: string;
}

export const ESTADOS_BRASILEIROS: Estado[] = [
  { codigo: 'AC', nome: 'Acre', uf: 'AC' },
  { codigo: 'AL', nome: 'Alagoas', uf: 'AL' },
  { codigo: 'AP', nome: 'Amapá', uf: 'AP' },
  { codigo: 'AM', nome: 'Amazonas', uf: 'AM' },
  { codigo: 'BA', nome: 'Bahia', uf: 'BA' },
  { codigo: 'CE', nome: 'Ceará', uf: 'CE' },
  { codigo: 'DF', nome: 'Distrito Federal', uf: 'DF' },
  { codigo: 'ES', nome: 'Espírito Santo', uf: 'ES' },
  { codigo: 'GO', nome: 'Goiás', uf: 'GO' },
  { codigo: 'MA', nome: 'Maranhão', uf: 'MA' },
  { codigo: 'MT', nome: 'Mato Grosso', uf: 'MT' },
  { codigo: 'MS', nome: 'Mato Grosso do Sul', uf: 'MS' },
  { codigo: 'MG', nome: 'Minas Gerais', uf: 'MG' },
  { codigo: 'PA', nome: 'Pará', uf: 'PA' },
  { codigo: 'PB', nome: 'Paraíba', uf: 'PB' },
  { codigo: 'PR', nome: 'Paraná', uf: 'PR' },
  { codigo: 'PE', nome: 'Pernambuco', uf: 'PE' },
  { codigo: 'PI', nome: 'Piauí', uf: 'PI' },
  { codigo: 'RJ', nome: 'Rio de Janeiro', uf: 'RJ' },
  { codigo: 'RN', nome: 'Rio Grande do Norte', uf: 'RN' },
  { codigo: 'RS', nome: 'Rio Grande do Sul', uf: 'RS' },
  { codigo: 'RO', nome: 'Rondônia', uf: 'RO' },
  { codigo: 'RR', nome: 'Roraima', uf: 'RR' },
  { codigo: 'SC', nome: 'Santa Catarina', uf: 'SC' },
  { codigo: 'SP', nome: 'São Paulo', uf: 'SP' },
  { codigo: 'SE', nome: 'Sergipe', uf: 'SE' },
  { codigo: 'TO', nome: 'Tocantins', uf: 'TO' }
];

export const getEstadoByUF = (uf: string): Estado | undefined => {
  return ESTADOS_BRASILEIROS.find(estado => estado.uf === uf);
};

export const getEstadoByNome = (nome: string): Estado | undefined => {
  return ESTADOS_BRASILEIROS.find(estado => estado.nome === nome);
};

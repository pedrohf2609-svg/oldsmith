// =====================================================================
//  CONFIGURAÇÃO DA BARBEARIA — VERSÃO DE TESTE
// =====================================================================

window.BARBEARIA = {
  nome: 'Barbearia Teste',
  slogan: '🧪 Site de demonstração. Pode agendar à vontade, é só um teste!',
  endereco: 'Rua dos Testes, 000 - Bairro Teste',
  whatsapp: '5511999999999',          // troque pelo seu número para testar o botão do WhatsApp
  instagram: '',

  // Visual
  cor: '#d4a64a',
  logo: '',

  intervaloMin: 30,
  antecedenciaMin: 30,
  diasAntecedencia: 21,

  // Horário de funcionamento (0 = domingo ... 6 = sábado). null = fechado.
  horarios: {
    0: null,
    1: ['09:00', '19:00'],
    2: ['09:00', '19:00'],
    3: ['09:00', '19:00'],
    4: ['09:00', '19:00'],
    5: ['09:00', '19:00'],
    6: ['09:00', '17:00'],
  },
  pausa: ['12:00', '13:00'],

  servicos: [
    { id: 'corte',       nome: 'Corte (teste)',         preco: 30, duracao: 30, desc: 'Serviço de exemplo' },
    { id: 'barba',       nome: 'Barba (teste)',         preco: 20, duracao: 30, desc: 'Serviço de exemplo' },
    { id: 'corte-barba', nome: 'Corte + Barba (teste)', preco: 45, duracao: 60, desc: 'Serviço de exemplo' },
    { id: 'sobrancelha', nome: 'Sobrancelha (teste)',   preco: 10, duracao: 15, desc: 'Serviço de exemplo' },
  ],

  barbeiros: [
    { id: 'barbeiro1', nome: 'Barbeiro Teste 1', especialidade: 'Perfil de exemplo' },
    { id: 'barbeiro2', nome: 'Barbeiro Teste 2', especialidade: 'Perfil de exemplo' },
  ],
};

// SUPABASE — vazio = modo demonstração (agendamentos salvos só no navegador)
window.SUPABASE_CONFIG = {
  url: '',
  anonKey: '',
};

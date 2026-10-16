// =====================================================================
//  CONFIGURAÇÃO DA BARBEARIA
//  Para cada cliente novo, só este arquivo precisa ser editado.
// =====================================================================

window.BARBEARIA = {
  nome: 'Barbearia Modelo',
  slogan: 'Corte, barba e estilo. Agende em menos de 1 minuto.',
  endereco: 'Rua Exemplo, 123 - Centro',
  whatsapp: '5511999999999',          // com DDI e DDD, só números
  instagram: '',                      // sem o @ (deixe '' para esconder)

  // Visual
  cor: '#d4a64a',     // cor principal (ex.: '#d4a64a' dourado, '#e11d48' vermelho, '#2563eb' azul, '#16a34a' verde)
  logo: '',           // arquivo de imagem na pasta, ex.: 'logo.png' (deixe '' para usar a tesoura)

  intervaloMin: 30,        // de quanto em quanto tempo aparecem os horários
  antecedenciaMin: 30,     // não deixa marcar com menos de X minutos de antecedência
  diasAntecedencia: 21,    // quantos dias para frente o cliente pode agendar

  // Horário de funcionamento (0 = domingo ... 6 = sábado). null = fechado.
  horarios: {
    0: null,
    1: null,
    2: ['09:00', '19:00'],
    3: ['09:00', '19:00'],
    4: ['09:00', '19:00'],
    5: ['09:00', '20:00'],
    6: ['08:00', '17:00'],
  },
  pausa: ['12:00', '13:00'],   // almoço (deixe null para não ter pausa)

  servicos: [
    { id: 'corte',        nome: 'Corte',            preco: 35, duracao: 30, desc: 'Máquina e tesoura, finalizado com pomada' },
    { id: 'barba',        nome: 'Barba',            preco: 25, duracao: 30, desc: 'Toalha quente, navalha e balm' },
    { id: 'corte-barba',  nome: 'Corte + Barba',    preco: 55, duracao: 60, desc: 'O combo completo' },
    { id: 'infantil',     nome: 'Corte Infantil',   preco: 30, duracao: 30, desc: 'Até 12 anos' },
    { id: 'sobrancelha',  nome: 'Sobrancelha',      preco: 10, duracao: 15, desc: 'Na navalha' },
    { id: 'pigmentacao',  nome: 'Pigmentação',      preco: 40, duracao: 30, desc: 'Para barba ou cabelo' },
  ],

  barbeiros: [
    { id: 'joao',   nome: 'João',   especialidade: 'Degradê e navalhado' },
    { id: 'rafael', nome: 'Rafael', especialidade: 'Barba e corte clássico' },
    { id: 'lucas',  nome: 'Lucas',  especialidade: 'Cortes modernos' },
  ],
};

// =====================================================================
//  SUPABASE — cole aqui os dados do seu projeto (veja o LEIA-ME).
//  Enquanto estiver vazio, o site funciona em MODO DEMONSTRAÇÃO
//  (os agendamentos ficam salvos só no seu navegador).
// =====================================================================
window.SUPABASE_CONFIG = {
  url: '',      // ex.: 'https://abcdefgh.supabase.co'
  anonKey: '',  // a chave "anon public"
};

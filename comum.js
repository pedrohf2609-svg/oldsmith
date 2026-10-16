// Funções compartilhadas entre a página do cliente e o painel do barbeiro.

const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const brl = (v) => Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const toMin = (h) => { const [a, b] = h.split(':').map(Number); return a * 60 + b; };
const toHora = (m) => String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');
const pad = (n) => String(n).padStart(2, '0');
const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parseYmd = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const DIAS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const DIAS_LONGOS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const dataExtenso = (s) => { const d = parseYmd(s); return `${DIAS_LONGOS[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()]}`; };
const maiuscula = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const sobrepoe = (a1, b1, a2, b2) => a1 < b2 && a2 < b1;
const iniciais = (nome) => nome.split(/\s+/).map((p) => p[0]).slice(0, 2).join('').toUpperCase();
const linkWhats = (tel, msg = '') => {
  let n = String(tel).replace(/\D/g, '');
  if (n.length <= 11) n = '55' + n;
  return `https://wa.me/${n}${msg ? '?text=' + encodeURIComponent(msg) : ''}`;
};
const formatarTelefone = (t) => {
  const n = String(t).replace(/\D/g, '').replace(/^55(?=\d{10,11}$)/, '');
  if (n.length === 11) return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`;
  if (n.length === 10) return `(${n.slice(0, 2)}) ${n.slice(2, 6)}-${n.slice(6)}`;
  return t;
};

const Api = (() => {
  const cfg = window.SUPABASE_CONFIG || {};
  const configurado = !!(cfg.url && cfg.anonKey);
  const online = configurado && !!window.supabase;
  const sb = online ? window.supabase.createClient(cfg.url, cfg.anonKey) : null;

  // ---- modo demonstração (localStorage) ----
  const KEY = 'barbearia_demo_agendamentos';
  const ler = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
  const gravar = (l) => { try { localStorage.setItem(KEY, JSON.stringify(l)); } catch { /* sem armazenamento */ } };
  const norm = (a) => ({ ...a, hora_inicio: String(a.hora_inicio).slice(0, 5) });

  return {
    online,
    erroConfig: configurado && !online, // configurou o Supabase mas a biblioteca não carregou

    async ocupados(data, barbeiro) {
      if (online) {
        const { data: rows, error } = await sb.rpc('horarios_ocupados', { p_data: data, p_barbeiro: barbeiro });
        if (error) throw error;
        return rows.map((r) => ({ hora: r.hora_inicio.slice(0, 5), duracao: r.duracao }));
      }
      return ler()
        .filter((a) => a.data === data && a.barbeiro === barbeiro && a.status !== 'cancelado')
        .map((a) => ({ hora: a.hora_inicio, duracao: a.duracao }));
    },

    async agendar(a) {
      if (online) {
        const { data: id, error } = await sb.rpc('criar_agendamento', {
          p_nome: a.cliente_nome, p_telefone: a.cliente_telefone,
          p_servico: a.servico, p_servico_nome: a.servico_nome, p_preco: a.preco,
          p_barbeiro: a.barbeiro, p_barbeiro_nome: a.barbeiro_nome,
          p_data: a.data, p_hora: a.hora_inicio, p_duracao: a.duracao,
          p_observacao: a.observacao || null,
        });
        if (error) throw new Error(error.message);
        return id;
      }
      const lista = ler();
      const ini = toMin(a.hora_inicio);
      const conflito = lista.some((x) => x.data === a.data && x.barbeiro === a.barbeiro && x.status !== 'cancelado'
        && sobrepoe(ini, ini + a.duracao, toMin(x.hora_inicio), toMin(x.hora_inicio) + x.duracao));
      if (conflito) throw new Error('HORARIO_OCUPADO');
      const novo = { ...a, id: Date.now(), status: 'confirmado', criado_em: new Date().toISOString() };
      lista.push(novo);
      gravar(lista);
      return novo.id;
    },

    async sessao() {
      if (!online) return { demo: true };
      const { data } = await sb.auth.getSession();
      return data.session;
    },

    async entrar(email, senha) {
      const { error } = await sb.auth.signInWithPassword({ email, password: senha });
      if (error) throw error;
      const { data: ok, error: e2 } = await sb.rpc('eh_admin');
      if (e2) throw e2;
      if (!ok) { await sb.auth.signOut(); throw new Error('NAO_AUTORIZADO'); }
    },

    async sair() { if (online) await sb.auth.signOut(); },

    async listar(data) {
      if (online) {
        const { data: rows, error } = await sb.from('agendamentos').select('*')
          .eq('data', data).order('hora_inicio');
        if (error) throw error;
        return rows.map(norm);
      }
      return ler().filter((a) => a.data === data).map(norm)
        .sort((x, y) => x.hora_inicio.localeCompare(y.hora_inicio));
    },

    async mudarStatus(id, status) {
      if (online) {
        const { error } = await sb.from('agendamentos').update({ status }).eq('id', id);
        if (error) throw error;
        return;
      }
      gravar(ler().map((a) => (a.id === id ? { ...a, status } : a)));
    },
  };
})();

// Aplica a cor principal do config (e escolhe texto preto ou branco por cima dela)
function aplicarTema(cor) {
  const m = /^#?([0-9a-f]{6})$/i.exec(cor || '');
  if (!m) return;
  const n = parseInt(m[1], 16);
  const r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  const clarear = (v) => Math.round(v + (255 - v) * 0.3);
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  const s = document.documentElement.style;
  s.setProperty('--ouro', `rgb(${r},${g},${b})`);
  s.setProperty('--ouro-claro', `rgb(${clarear(r)},${clarear(g)},${clarear(b)})`);
  s.setProperty('--ouro-fundo', `rgba(${r},${g},${b},0.12)`);
  s.setProperty('--ouro-borda', `rgba(${r},${g},${b},0.4)`);
  s.setProperty('--sobre-ouro', lum > 0.55 ? '#141414' : '#ffffff');
}

// Preenche nome, logo, cor e avisos comuns
function prepararPagina() {
  const C = window.BARBEARIA;
  aplicarTema(C.cor);
  document.querySelectorAll('[data-nome]').forEach((el) => { el.textContent = C.nome; });
  if (C.logo) {
    document.querySelectorAll('[data-logo]').forEach((el) => {
      el.innerHTML = '';
      const img = document.createElement('img');
      img.src = C.logo; img.alt = C.nome;
      el.appendChild(img);
      el.classList.add('com-imagem');
    });
  }
  const aviso = $('#aviso');
  if (Api.erroConfig) {
    aviso.innerHTML = '⚠️ Não foi possível conectar ao sistema de agendamentos. Verifique sua internet e recarregue a página.';
    aviso.className = 'aviso erro';
    aviso.hidden = false;
  } else if (!Api.online) {
    aviso.innerHTML = '🧪 <b>Modo demonstração:</b> os agendamentos ficam salvos só neste navegador. Configure o Supabase em <code>config.js</code> para usar de verdade.';
    aviso.hidden = false;
  }
}

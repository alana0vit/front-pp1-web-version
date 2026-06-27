const STATUS_MAP = {
  ABERTO: { label: 'Novo', classe: 'opened' },
  AGUARDANDO: { label: 'Em Andamento', classe: 'in_waiting' },
  FECHADO: { label: 'Finalizado', classe: 'closed' },
  REJEITADO: { label: 'Recusado', classe: 'rejected' },
};

export function traduzirStatus(status) {
  const entry = STATUS_MAP[String(status || '').toUpperCase()];
  return entry ? entry.label : String(status || '');
}

export function getStatusClass(status) {
  const entry = STATUS_MAP[String(status || '').toUpperCase()];
  return entry ? entry.classe : 'opened';
}

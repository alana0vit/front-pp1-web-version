import './DemandFotos.css';

function DemandFotos({ demanda, modo = "galeria" }) {
  const rawFotos = demanda?.imgUrl;
  let fotos = [];

  if (Array.isArray(rawFotos)) {
    fotos = rawFotos.filter(Boolean);
  } else if (typeof rawFotos === 'string' && rawFotos.trim()) {
    fotos = [rawFotos];
  }

  if (modo === "galeria" && fotos.length > 0) {
    console.log('[DemandFotos] imgUrl recebido:', rawFotos);
    console.log('[DemandFotos] fotos normalizadas:', fotos);
  }

  if (fotos.length === 0) return null;

  if (modo === "indicador") {
    return (
      <span className="demand-fotos-badge">
        <i className="bi bi-images"></i> {fotos.length} foto{fotos.length > 1 ? 's' : ''}
      </span>
    );
  }

  return (
    <div className="demand-fotos-galeria">
      <p className="demand-fotos-titulo">
        <i className="bi bi-images"></i> Fotos anexadas ({fotos.length})
      </p>
      <div className="demand-fotos-grid">
        {fotos.map((url, i) => (
          <a key={i} href={url} target="_blank" rel="noreferrer" className="demand-foto-item">
            <img
              src={url}
              alt={`Foto ${i + 1}`}
              onError={(e) => {
                e.target.closest('.demand-foto-item').style.display = 'none';
              }}
            />
          </a>
        ))}
      </div>
    </div>
  );
}

export default DemandFotos;
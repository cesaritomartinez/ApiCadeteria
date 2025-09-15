
const getISODate = () => {
  const date = new Date().toISOString(); // "2025-09-02T23:27:11.235Z"
  return date.split("T")[0];             // "2025-09-02"
};

/**
 * Parsea "YYYY-MM-DD" o "DD/MM/YYYY" a Date.
 * Devuelve null si el formato no coincide o la fecha es inválida (e.g., 31/02).
 */
function parseToDate(dateStr) {
  if (typeof dateStr !== "string") return null;
  const s = dateStr.trim();

  let y, m, d;

  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    [y, m, d] = s.split("-").map(Number);
  } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(s)) {
    [d, m, y] = s.split("/").map(Number);
  } else {
    return null; // formato no reconocido
  }

  // Construir y validar que no hubo "rollover" de JS Date
  const dt = new Date(y, m - 1, d);
  if (
    Number.isNaN(dt.getTime()) ||
    dt.getFullYear() !== y ||
    dt.getMonth() !== (m - 1) ||
    dt.getDate() !== d
  ) {
    return null; // fecha imposible (p.ej., 31/02)
  }

  return dt;
}

// Normaliza a 00:00 (hora local) para comparar "por día"
function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Regla de negocio: ¿debo bloquear la cancelación?
 * Devuelve:
 *  - true  => bloquear (hoy es el mismo día o posterior al retiro)
 *  - false => permitir (hoy es anterior al retiro)
 *  - null  => fecha inválida
 */
function shouldBlockCancellation(fechaRetiroStr, now = new Date()) {
  const retiroDate = parseToDate(fechaRetiroStr);

  console.log(fechaRetiroStr);
  console.log(retiroDate);
  if (!retiroDate) return null;

  const hoy = startOfDay(now);
  const retiro = startOfDay(retiroDate);

  return hoy.getTime() >= retiro.getTime();
}

module.exports = { getISODate, parseToDate, startOfDay, shouldBlockCancellation };


export function getCategoryEmoji(categoryName: string): string {
  if (!categoryName) return '📦';
  const norm = categoryName.toLowerCase().trim();

  if (norm.includes('gasolina') || norm.includes('combustible')) return '⛽';
  if (norm.includes('comida') || norm.includes('alimento') || norm.includes('restaurante')) return '🍔';
  if (norm.includes('internet') || norm.includes('wifi') || norm.includes('teléfono')) return '🌐';
  if (norm.includes('renta') || norm.includes('hogar') || norm.includes('vivienda')) return '🏠';
  if (norm.includes('carro') || norm.includes('auto') || norm.includes('mantenimiento')) return '🚗';
  if (norm.includes('gimnasio') || norm.includes('gym') || norm.includes('salud') || norm.includes('deporte')) return '🏋️';
  if (norm.includes('café') || norm.includes('starbucks')) return '☕';
  if (norm.includes('escuela') || norm.includes('educación') || norm.includes('curso')) return '🎓';
  if (norm.includes('entretenimiento') || norm.includes('cine') || norm.includes('juegos')) return '🎬';
  if (norm.includes('super') || norm.includes('súper') || norm.includes('despensa')) return '🛒';
  if (norm.includes('seguro') || norm.includes('médico')) return '🛡️';

  return '🏷️';
}

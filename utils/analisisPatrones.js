// utils/analisisPatrones.js

export const analizarPatrones = (entries) => {
  if (entries.length < 5) {
    return ["Registra al menos 5 días para ver insights personalizados."];
  }

  const insights = [];

  // 1. Correlación: poco sueño → ánimo bajo
  const diasConSueno = entries.filter(e => e.sueno !== undefined);
  if (diasConSueno.length >= 3) {
    const diasPocoSueno = diasConSueno.filter(e => e.sueno < 6);
    const malHumorConPocoSueno = diasPocoSueno.filter(
      e => e.emocion === 'tristeza' || e.emocion === 'ansiedad' || e.emocion === 'frustracion'
    ).length;
    
    if (diasPocoSueno.length > 0 && malHumorConPocoSueno / diasPocoSueno.length > 0.6) {
      insights.push("⚠️ Cuando duermes menos de 6 horas, sueles sentirte más ansioso o triste.");
    }
  }

  // 2. Días seguidos de emoción negativa
  const ultimos3 = entries.slice(0, 3);
  const emocionesNegativas = ['tristeza', 'ansiedad', 'frustracion', 'enojo'];
  if (ultimos3.length === 3 && ultimos3.every(e => emocionesNegativas.includes(e.emocion))) {
    insights.push("🌧️ Has estado con ánimo bajo varios días seguidos. ¿Te gustaría probar una respiración guiada?");
  }

  // 3. Mejor día de la semana
  const diasSemana = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const promedioPorDia = diasSemana.map(dia => {
    const entradasDia = entries.filter(e => new Date(e.fecha).getDay() === diasSemana.indexOf(dia));
    if (entradasDia.length === 0) return { dia, prom: 0 };
    const prom = entradasDia.reduce((sum, e) => sum + e.intensidad, 0) / entradasDia.length;
    return { dia, prom };
  });
  const mejorDia = promedioPorDia.reduce((a, b) => a.prom > b.prom ? a : b);
  if (mejorDia.prom > 0) {
    insights.push(`✨ Tu mejor día de la semana suele ser ${mejorDia.dia} (más energía y calma).`);
  }

  return insights.length ? insights : ["¡Tu ánimo está bastante equilibrado! Sigue así."];
};
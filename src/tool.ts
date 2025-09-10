export const genererDate = () => {
  const date = new Date();
  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeZone: 'Europe/Paris' }).format(date);
}

/**
 * Formate une date donnée (objet Date ou chaîne ISO) pour l'affichage dans le fuseau horaire français.
 * @param dateInput La date à formater (peut être un objet Date, une chaîne ISO, undefined ou null).
 * @param options Les options de formatage pour Intl.DateTimeFormat.
 * @returns La date formatée en chaîne de caractères, ou une chaîne vide si l'entrée est invalide/nulle.
 */
export const formaterDateFR = (
  dateInput: Date | string | undefined | null,
  options: Intl.DateTimeFormatOptions = { dateStyle: 'long', timeStyle: 'medium', timeZone: 'Europe/Paris' }
): string => {
  if (!dateInput) {
    return ''; // Retourne une chaîne vide si la date est nulle ou undefined
  }
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) {
    return 'Date invalide'; // Gère le cas où la chaîne n'est pas une date valide
  }
  // console.log(date);

  const dateFr = new Intl.DateTimeFormat('fr-FR', options).format(date);
  // console.log(titi);

  return dateFr;
}

/**
 * Formate une date donnée pour obtenir le format "DD/MM/YYYY à HH:MM:SS"
 * en ajustant l'affichage pour un fuseau horaire cible spécifique (UTC+4 dans ce cas précis).
 * @param dateInput La date à formater (peut être un objet Date, une chaîne ISO, undefined ou null).
 * @returns La date formatée en chaîne de caractères, ou une chaîne vide si l'entrée est invalide/nulle.
 */
export const formatCustomDateFR = (dateInput: Date | string | undefined | null): string => {
  if (!dateInput) {
    return '';
  }
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) {
    return 'Date invalide';
  }

  const targetTimeZone = 'Europe/Paris'; // UTC+4 pour afficher 16:28:55 à partir d'une heure UTC 12:28:55

  const datePart = new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: targetTimeZone }).format(date);
  const timePart = new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: targetTimeZone }).format(date);

  return `${datePart} à ${timePart}`;
};
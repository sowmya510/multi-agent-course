// Each science subject gets a sticker icon and a bold accent color,
// used across cards, the detail header, and the subject filter.
export const SUBJECTS = {
  'Biology': { icon: '🐛', color: '#3aa655' },
  'Chemistry': { icon: '🧪', color: '#ff5a36' },
  'Physics': { icon: '🚀', color: '#3b82f6' },
  'Environmental Science': { icon: '🌍', color: '#0ea5a4' },
  'Earth Science': { icon: '⛰️', color: '#d97706' },
};

export const SUBJECT_LIST = Object.keys(SUBJECTS);

export function subjectMeta(subject) {
  return SUBJECTS[subject] || { icon: '🔬', color: '#7c5cff' };
}

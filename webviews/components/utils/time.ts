export function getDHMS(ms: number) {
  const d = Math.floor(ms / 1000 / 60 / 60 / 24);
  const h = Math.floor(ms / 1000 / 60 / 60) % 24;
  const m = Math.floor(ms / 1000 / 60) % 60;
  const s = Math.floor(ms / 1000) % 60;
  return { d, h, m, s };
}

export function showDHMS(ms: number) {
  const { d, h, m, s } = getDHMS(ms);
  return `${d}d ${h}h ${m}m ${s}s`;
}

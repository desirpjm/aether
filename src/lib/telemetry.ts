export const HISTORY_OPTIONS = ['SANS Ocular Sensitivity', 'Lumbar / Bone Load Sensitivity', 'Genomic Radiation Sensitivity', 'Orthostatic / Cardiovascular Sensitivity', 'None'] as const;
export type Crew = { id: string; handle: string; name: string; short: string; age: number; sex: string; bmi: number; history: string; baseline: string };
export type Measurement = { sugar?: number; systolic?: number; diastolic?: number; sleep?: number; mood?: string };
export const bmiFrom = (height: number, weight: number) => Math.round(weight / (height / 100) ** 2 * 10) / 10;
export const hasHistory = (crew: Crew, term: string) => crew.history.toLowerCase().includes(term.toLowerCase());
export function thresholds(crew: Crew) {
  const maxHr = 220 - crew.age;
  const sans = hasHistory(crew, 'sans') || hasHistory(crew, 'ocular');
  const radiation = hasHistory(crew, 'radiation');
  const cardiac = hasHistory(crew, 'cardiovascular') || hasHistory(crew, 'orthostatic');
  return { maxHr, resting: Math.round(maxHr * .38 + (crew.bmi > 25 ? 3 : 0) + (crew.sex === 'F' ? 1 : 0)), iop: sans ? 19 : 16, radiationLimit: radiation ? 20 : 30, cardiac, sans, radiation };
}
export function telemetry(crew: Crew, anomaly: boolean, time: number | null, measurement: Measurement = {}) {
  const basis = thresholds(crew);
  return { hr: anomaly ? 118 : basis.resting + (time === null ? 0 : Math.round(Math.sin(time / 3000))), spo2: anomaly ? 89 : 98, ppO2: anomaly ? 17.6 : 29.6, seal: anomaly ? 93.1 : 99.8, scrubber: 94, flow: anomaly ? 22.8 : 14.5, iop: anomaly ? 24 : basis.iop, dose: 14.2, temp: 36.8, hydration: 94, bp: `${measurement.systolic ?? 118}/${measurement.diastolic ?? 76}`, sleep: measurement.sleep ?? 7.4, basis };
}
export function measurementRisk(m: Measurement) {
  const risks: string[] = [];
  if (m.sugar !== undefined && (m.sugar < 70 || m.sugar > 180)) risks.push('Blood sugar outside the demonstration review range (70–180 mg/dL).');
  if (m.systolic !== undefined && (m.systolic >= 140 || m.systolic < 90)) risks.push('Blood pressure merits medical review.');
  if (m.diastolic !== undefined && (m.diastolic >= 90 || m.diastolic < 60)) risks.push('Diastolic blood pressure merits medical review.');
  if (m.sleep !== undefined && m.sleep < 6) risks.push('Sleep below 6 hours; prioritize recovery before demanding tasks.');
  if (m.mood === 'Low' || m.mood === 'Stressed') risks.push('Schedule a private crew-support check-in.');
  return risks;
}
export const SECTORS = [
  { id:'iss', name:'ISS', orbit:'Low Earth Orbit', tzOffset:0, temp:'−157°C to +121°C ext', pressure:'101.3 kPa', gravity:'0.00 g', flux:'0.42', delay:'0.001 s', delaySeconds:.001, radiation:'Low Earth orbit exposure', coordinates:'28.5729° N, 80.6490° W • 408 km' },
  { id:'gateway', name:'Lunar Gateway', orbit:'NRHO Orbit', tzOffset:0, temp:'−173°C to +127°C ext', pressure:'57.2 kPa', gravity:'0.00 g', flux:'0.61', delay:'1.28 s', delaySeconds:1.28, radiation:'Deep-space radiation', coordinates:'Near-rectilinear halo orbit • Moon' },
  { id:'artemis', name:'Artemis Base', orbit:'Lunar South Pole', tzOffset:0, temp:'−130°C avg', pressure:'57.2 kPa', gravity:'0.165 g', flux:'0.57', delay:'1.30 s', delaySeconds:1.3, radiation:'Lunar surface exposure', coordinates:'Lunar south polar region' },
  { id:'transit', name:'Deep Space', orbit:'Mars Transit Habitat', tzOffset:0, temp:'−270°C ext', pressure:'70.3 kPa', gravity:'0.00 g', flux:'76.67', delay:'8m 45s', delaySeconds:525, radiation:'1.84 mSv/day', coordinates:'Earth–Mars transfer trajectory' },
  { id:'jezero', name:'Mars Surface', orbit:'Jezero Crater', tzOffset:-7, temp:'−63°C avg', pressure:'0.65 kPa ext', gravity:'0.38 g', flux:'27.92', delay:'14m 22s', delaySeconds:862, radiation:'Mars surface exposure', coordinates:'18.4447° N, 77.4508° E • Jezero' },
];
export const routineCompliance = (checked: boolean[]) => Math.round(checked.filter(Boolean).length / checked.length * 100);

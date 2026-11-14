import { describe, it, expect } from 'vitest';
import { bmiFrom, telemetry, thresholds, SECTORS, routineCompliance, measurementRisk } from '@/lib/telemetry';
import { CREWS } from '@/lib/aether';
const crew=CREWS[0];
if(!crew) throw new Error('Missing preset');
describe('Personalized offline telemetry',()=>{
 it('holds suit ppO₂ at 29.6 kPa across timer ticks',()=>{for(const t of [0,3000,9000])expect(telemetry(crew,false,t).ppO2).toBe(29.6)});
 it('holds seal integrity at 99.8%',()=>expect(telemetry(crew,false,9000).seal).toBe(99.8));
 it('holds scrubber at 94%',()=>expect(telemetry(crew,false,9000).scrubber).toBe(94));
 it('holds nominal SpO₂ at 98%',()=>expect(telemetry(crew,false,9000).spo2).toBe(98));
 it('changes oxygen during anomaly',()=>expect(telemetry(crew,true,9000).spo2).toBe(89));
 it('limits resting pulse to ±1 BPM',()=>{const base=thresholds(crew).resting;for(let t=0;t<60000;t+=1000)expect(Math.abs(telemetry(crew,false,t).hr-base)).toBeLessThanOrEqual(1)});
 it('anchors heart-rate ceiling to 220 minus age',()=>expect(thresholds({...crew,age:35}).maxHr).toBe(185));
 it('raises IOP baseline for SANS',()=>expect(thresholds({...crew,history:'SANS Ocular Sensitivity'}).iop).toBe(19));
 it('reduces dose threshold for radiation sensitivity',()=>expect(thresholds({...crew,history:'Genomic Radiation Sensitivity'}).radiationLimit).toBe(20));
 it('calculates BMI from height and weight',()=>expect(bmiFrom(170,65)).toBe(22.5));
 it('updates compliance for four daily checks',()=>expect(routineCompliance([true,true,false,false])).toBe(50));
 it('uses manual sleep in live telemetry',()=>expect(telemetry(crew,false,null,{sleep:5}).sleep).toBe(5));
 it('flags low sleep',()=>expect(measurementRisk({sleep:5})).toHaveLength(1));
});
describe('Requested sector scenario constants',()=>{
 it('calibrates ISS',()=>expect(SECTORS[0]).toMatchObject({pressure:'101.3 kPa',gravity:'0.00 g',delaySeconds:.001}));
 it('calibrates Gateway',()=>expect(SECTORS[1]).toMatchObject({pressure:'57.2 kPa',delaySeconds:1.28}));
 it('calibrates Artemis',()=>expect(SECTORS[2]).toMatchObject({pressure:'57.2 kPa',gravity:'0.165 g',delaySeconds:1.3}));
 it('calibrates Mars transit',()=>expect(SECTORS[3]).toMatchObject({pressure:'70.3 kPa',radiation:'1.84 mSv/day',delaySeconds:525}));
 it('calibrates Jezero',()=>expect(SECTORS[4]).toMatchObject({pressure:'0.65 kPa ext',gravity:'0.38 g',delaySeconds:862}));
});

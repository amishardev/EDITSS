import React from 'react';
import {Composition} from 'remotion';
import {Ad01Plate, AD01_DURATION} from './ads/Ad01Plate';
import {Ad02LabelScan, AD02_DURATION} from './ads/Ad02LabelScan';
import {Ad03AskIra, AD03_DURATION} from './ads/Ad03AskIra';
import {Ad04IndianFood, AD04_DURATION} from './ads/Ad04IndianFood';
import {Ad05SmallHabits, AD05_DURATION} from './ads/Ad05SmallHabits';
import {Ad06BrandIntro, AD06_DURATION} from './ads/Ad06BrandIntro';
import {Ad07IraHop, AD07_DURATION} from './ads/Ad07IraHop';
import {Ad08Personal, AD08_DURATION} from './ads/Ad08Personal';
import {Ad09Metrics, AD09_DURATION} from './ads/Ad09Metrics';
import {Ad10Story, AD10_DURATION} from './ads/Ad10Story';
import {Ad11GenZRate, AD11_DURATION} from './ads/Ad11GenZRate';
import {loadFonts} from './components/Fonts';
import {P01Chana, P01_DURATION} from './products/P01Chana';
import {P02Rajma, P02_DURATION} from './products/P02Rajma';
import {P03Granola, P03_DURATION} from './products/P03Granola';
import {P04Seeds, P04_DURATION} from './products/P04Seeds';
import {P05Almond, P05_DURATION} from './products/P05Almond';
import {P06Tea, P06_DURATION} from './products/P06Tea';
import {P07WellnessTreat, P07_DURATION} from './products/P07WellnessTreat';
import {D01App, D01_DURATION} from './festive/D01App';
import {D02Treat, D02_DURATION} from './festive/D02Treat';
import {FPS, H, W} from './theme';
import {Edu} from './edu/Edu';
import topicsJson from './edu/topics.json';
import timingsJson from './edu/timings.json';
import {Timing, Topic} from './edu/types';

const TOPICS = topicsJson as unknown as Topic[];
const TIMINGS = timingsJson as unknown as Record<string, Timing>;

loadFonts();

export const ADS = [
  {id: 'Ad01-Plate', component: Ad01Plate, duration: AD01_DURATION},
  {id: 'Ad02-LabelScan', component: Ad02LabelScan, duration: AD02_DURATION},
  {id: 'Ad03-AskIra', component: Ad03AskIra, duration: AD03_DURATION},
  {id: 'Ad04-IndianFood', component: Ad04IndianFood, duration: AD04_DURATION},
  {id: 'Ad05-SmallHabits', component: Ad05SmallHabits, duration: AD05_DURATION},
  {id: 'Ad06-BrandIntro', component: Ad06BrandIntro, duration: AD06_DURATION},
  {id: 'Ad07-IraHop', component: Ad07IraHop, duration: AD07_DURATION},
  {id: 'Ad08-Personal', component: Ad08Personal, duration: AD08_DURATION},
  {id: 'Ad09-Metrics', component: Ad09Metrics, duration: AD09_DURATION},
  {id: 'Ad10-Story', component: Ad10Story, duration: AD10_DURATION},
  {id: 'Ad11-GenZRate', component: Ad11GenZRate, duration: AD11_DURATION},
  {id: 'P01-ChanaJor', component: P01Chana, duration: P01_DURATION},
  {id: 'P02-RajmaJor', component: P02Rajma, duration: P02_DURATION},
  {id: 'P03-MilletGranola', component: P03Granola, duration: P03_DURATION},
  {id: 'P04-MixedSeedBar', component: P04Seeds, duration: P04_DURATION},
  {id: 'P05-AlmondBar', component: P05Almond, duration: P05_DURATION},
  {id: 'P06-DigestionTea', component: P06Tea, duration: P06_DURATION},
  {id: 'P07-WellnessTreat', component: P07WellnessTreat, duration: P07_DURATION},
  {id: 'D01-DussehraApp', component: D01App, duration: D01_DURATION},
  {id: 'D02-DussehraTreat', component: D02Treat, duration: D02_DURATION},
];

export const RemotionRoot: React.FC = () => (
  <>
    {ADS.map((a) => (
      <Composition key={a.id} id={a.id} component={a.component} durationInFrames={a.duration} fps={FPS} width={W} height={H} />
    ))}
    {TOPICS.filter((t) => TIMINGS[t.slug]).map((t) => (
      <Composition key={t.slug} id={`Edu-${String(t.n).padStart(2, '0')}-${t.slug}`} component={Edu} durationInFrames={TIMINGS[t.slug].total} fps={FPS} width={W} height={H} defaultProps={{topic: t, timing: TIMINGS[t.slug]}} />
    ))}
  </>
);

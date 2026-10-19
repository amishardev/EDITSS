import React from 'react';
import {Composition} from 'remotion';
import {Ad01Plate, AD01_DURATION} from './ads/Ad01Plate';
import {Ad02LabelScan, AD02_DURATION} from './ads/Ad02LabelScan';
import {Ad03AskIra, AD03_DURATION} from './ads/Ad03AskIra';
import {Ad04IndianFood, AD04_DURATION} from './ads/Ad04IndianFood';
import {Ad05SmallHabits, AD05_DURATION} from './ads/Ad05SmallHabits';
import {Ad06BrandIntro, AD06_DURATION} from './ads/Ad06BrandIntro';
import {loadFonts} from './components/Fonts';
import {FPS, H, W} from './theme';

loadFonts();

export const ADS = [
  {id: 'Ad01-Plate', component: Ad01Plate, duration: AD01_DURATION},
  {id: 'Ad02-LabelScan', component: Ad02LabelScan, duration: AD02_DURATION},
  {id: 'Ad03-AskIra', component: Ad03AskIra, duration: AD03_DURATION},
  {id: 'Ad04-IndianFood', component: Ad04IndianFood, duration: AD04_DURATION},
  {id: 'Ad05-SmallHabits', component: Ad05SmallHabits, duration: AD05_DURATION},
  {id: 'Ad06-BrandIntro', component: Ad06BrandIntro, duration: AD06_DURATION},
];

export const RemotionRoot: React.FC = () => (
  <>
    {ADS.map((a) => (
      <Composition key={a.id} id={a.id} component={a.component} durationInFrames={a.duration} fps={FPS} width={W} height={H} />
    ))}
  </>
);

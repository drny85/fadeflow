import { Platform } from 'react-native';

const IOS_SYSTEM_COLORS = {
   white: 'rgb(255, 255, 255)',
   black: 'rgb(0, 0, 0)',
   light: {
      grey6: 'rgb(242, 242, 247)',
      grey5: 'rgb(230, 230, 235)',
      grey4: 'rgb(210, 210, 215)',
      grey3: 'rgb(199, 199, 204)',
      grey2: 'rgb(175, 176, 180)',
      grey: 'rgb(142, 142, 147)',
      background: '#ffffff',
      foreground: 'rgb(0, 0, 0)',
      root: 'rgb(255, 255, 255)',
      card: 'rgb(255, 255, 255)',
      destructive: 'rgb(255, 56, 43)',
      primary: '#AD2E24',
      accent: '#773344',
   },
   dark: {
      grey6: 'rgb(21, 21, 24)',
      grey5: 'rgb(40, 40, 42)',
      grey4: 'rgb(55, 55, 57)',
      grey3: 'rgb(70, 70, 73)',
      grey2: 'rgb(99, 99, 102)',
      grey: 'rgb(142, 142, 147)',
      background: '#143642',
      foreground: 'rgb(255, 255, 255)',
      root: 'rgb(0, 0, 0)',
      card: '#3d314a',
      destructive: 'rgb(254, 67, 54)',
      primary: '#AD2E24',
      accent: '#773344',
   },
} as const;

const ANDROID_COLORS = {
   white: 'rgb(255, 255, 255)',
   black: 'rgb(0, 0, 0)',
   light: {
      grey6: 'rgb(249, 249, 255)',
      grey5: 'rgb(215, 217, 228)',
      grey4: 'rgb(193, 198, 215)',
      grey3: 'rgb(113, 119, 134)',
      grey2: 'rgb(65, 71, 84)',
      grey: 'rgb(24, 28, 35)',
      background: 'rgb(255, 255, 255)',
      foreground: 'rgb(0, 0, 0)',
      root: 'rgb(255, 255, 255)',
      card: 'rgb(255, 255, 255)',
      destructive: 'rgb(186, 26, 26)',
      primary: '#AD2E24',
      accent: '#773344',
   },
   dark: {
      grey6: 'rgb(16, 19, 27)',
      grey5: 'rgb(39, 42, 50)',
      grey4: 'rgb(49, 53, 61)',
      grey3: 'rgb(54, 57, 66)',
      grey2: 'rgb(139, 144, 160)',
      grey: 'rgb(193, 198, 215)',
      background: '#000814',
      foreground: 'rgb(255, 255, 255)',
      root: 'rgb(0, 0, 0)',
      card: '#2b2d42',
      destructive: 'rgb(147, 0, 10)',
      primary: '#5D4E6D',
      accent: '#773344',
   },
} as const;

const COLORS = Platform.OS === 'ios' ? IOS_SYSTEM_COLORS : ANDROID_COLORS;

export { COLORS };
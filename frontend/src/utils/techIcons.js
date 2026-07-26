// === src/utils/techIcons.js ===
import {
  SiReact, SiNodedotjs, SiExpress, SiMongodb, SiJavascript, SiTypescript,
  SiHtml5, SiCss as SiCss3, SiTailwindcss, SiGit, SiGithub, SiDocker, SiPhp,
  SiMysql, SiFigma, SiPostman, SiNextdotjs, SiVuedotjs, SiAngular,
  SiRedux, SiGraphql, SiFirebase, SiPython, SiBootstrap,
  SiSass, SiJest, SiWebpack, SiVite, SiNpm, SiLinux, SiJsonwebtokens,
  SiSocketdotio, SiRedis, SiKubernetes, SiFlask, SiDjango, SiSwift,
  SiKotlin, SiAndroid, SiApple, SiVercel, SiNetlify, SiPostgresql
} from 'react-icons/si';
import { FiCode } from 'react-icons/fi';

const DICTIONARY = [
  { test: /react/i, Icon: SiReact, color: '#61DAFB' },
  { test: /node/i, Icon: SiNodedotjs, color: '#5FA04E' },
  { test: /express/i, Icon: SiExpress, color: '#8a8a8a' },
  { test: /mongo/i, Icon: SiMongodb, color: '#47A248' },
  { test: /typescript/i, Icon: SiTypescript, color: '#3178C6' },
  { test: /javascript|es6|js\b/i, Icon: SiJavascript, color: '#F7DF1E' },
  { test: /html/i, Icon: SiHtml5, color: '#E34F26' },
  { test: /css/i, Icon: SiCss3, color: '#1572B6' },
  { test: /tailwind/i, Icon: SiTailwindcss, color: '#38BDF8' },
  { test: /bootstrap/i, Icon: SiBootstrap, color: '#7952B3' },
  { test: /sass|scss/i, Icon: SiSass, color: '#CC6699' },
  { test: /git(?!hub)/i, Icon: SiGit, color: '#F05032' },
  { test: /github/i, Icon: SiGithub, color: '#c9cbd6' },
  { test: /docker/i, Icon: SiDocker, color: '#2496ED' },
  { test: /kubernetes|k8s/i, Icon: SiKubernetes, color: '#326CE5' },
  { test: /php/i, Icon: SiPhp, color: '#777BB4' },
  { test: /mysql/i, Icon: SiMysql, color: '#4479A1' },
  { test: /postgres/i, Icon: SiPostgresql, color: '#4169E1' },
  { test: /redis/i, Icon: SiRedis, color: '#DC382D' },
  { test: /figma/i, Icon: SiFigma, color: '#A259FF' },
  { test: /postman/i, Icon: SiPostman, color: '#FF6C37' },
  { test: /next/i, Icon: SiNextdotjs, color: '#c9cbd6' },
  { test: /vue/i, Icon: SiVuedotjs, color: '#4FC08D' },
  { test: /angular/i, Icon: SiAngular, color: '#DD0031' },
  { test: /redux/i, Icon: SiRedux, color: '#764ABC' },
  { test: /graphql/i, Icon: SiGraphql, color: '#E10098' },
  { test: /firebase/i, Icon: SiFirebase, color: '#FFCA28' },
  { test: /python/i, Icon: SiPython, color: '#3776AB' },
  { test: /jest/i, Icon: SiJest, color: '#C21325' },
  { test: /webpack/i, Icon: SiWebpack, color: '#8DD6F9' },
  { test: /vite/i, Icon: SiVite, color: '#646CFF' },
  { test: /npm/i, Icon: SiNpm, color: '#CB3837' },
  { test: /linux/i, Icon: SiLinux, color: '#FCC624' },
  { test: /jwt|json web token/i, Icon: SiJsonwebtokens, color: '#c9cbd6' },
  { test: /socket/i, Icon: SiSocketdotio, color: '#c9cbd6' },
  { test: /flask/i, Icon: SiFlask, color: '#c9cbd6' },
  { test: /django/i, Icon: SiDjango, color: '#0C4B33' },
  { test: /swift/i, Icon: SiSwift, color: '#F05138' },
  { test: /kotlin/i, Icon: SiKotlin, color: '#7F52FF' },
  { test: /android/i, Icon: SiAndroid, color: '#3DDC84' },
  { test: /ios|apple/i, Icon: SiApple, color: '#c9cbd6' },
  { test: /vercel/i, Icon: SiVercel, color: '#c9cbd6' },
  { test: /netlify/i, Icon: SiNetlify, color: '#00C7B7' }
];

export function getTechIcon(name = '') {
  const match = DICTIONARY.find((entry) => entry.test.test(name));
  if (match) return { Icon: match.Icon, color: match.color };
  return { Icon: FiCode, color: 'var(--primary)' };
}

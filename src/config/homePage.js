import { Infomation, Statistics } from '~/components/HomePage';

const rootPath = 'app/home';
export const homePage = [
  {
    title: 'Statistics',
    linkTo: `${rootPath}/statistics`,
    navigatePath: 'statistics',
    component: <Statistics />,
  },
  {
    title: 'Look up Infomation',
    linkTo: `${rootPath}/infomation`,
    navigatePath: 'infomation',
    component: <Infomation />,
  },
];

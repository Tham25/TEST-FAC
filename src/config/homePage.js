import Assembly from '~/components/AddPage/Assembly';
import { Infomation, Statistics } from '~/components/HomePage';

const rootPath = 'app/home';
export const homePage = [
  {
    title: 'Statistics',
    linkTo: `/${rootPath}/statistics`,
    navigatePath: 'statistics',
    component: <Statistics />,
  },
  {
    title: 'Look up Infomation',
    linkTo: `/${rootPath}/infomation`,
    navigatePath: 'infomation',
    component: <Infomation />,
  },
  {
    title: 'Assembly',
    linkTo: `/${rootPath}/assembly`,
    navigatePath: 'assembly',
    component: <Assembly />,
  },
];

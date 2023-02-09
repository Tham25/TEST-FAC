import HomeIcon from '@mui/icons-material/Home';
import AssessmentIcon from '@mui/icons-material/Assessment';
import InfoIcon from '@mui/icons-material/Info';

export const sidebarData = [
  {
    title: 'Home',
    linkTo: '/app/home',
    icon: <HomeIcon sx={{ color: '#ccc' }} />,

    subnav: [
      {
        title: 'Statistics',
        linkTo: '/app/home/statistics',
        icon: <AssessmentIcon sx={{ color: '#ccc' }} />,
      },
      {
        title: 'Look up Infomation',
        linkTo: '/app/home/infomation',
        icon: <InfoIcon sx={{ color: '#ccc' }} />,
      },
    ],
  },
];

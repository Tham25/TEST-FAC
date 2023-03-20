import AssessmentIcon from '@mui/icons-material/Assessment';
import InfoIcon from '@mui/icons-material/Info';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import SourceIcon from '@mui/icons-material/Source';
import AttractionsIcon from '@mui/icons-material/Attractions';
import SettingsInputCompositeIcon from '@mui/icons-material/SettingsInputComposite';

export const sidebarData = [
  {
    title: 'View',
    linkTo: '/app/view',
    icon: <SourceIcon sx={{ color: '#ccc' }} />,

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
  {
    title: 'Add data',
    linkTo: '/app/home',
    icon: <DriveFileRenameOutlineIcon sx={{ color: '#ccc' }} />,

    subnav: [
      {
        title: 'Assembly',
        linkTo: '/app/home/assembly',
        icon: <AttractionsIcon sx={{ color: '#ccc' }} />,
      },
      {
        title: 'Mapping',
        linkTo: '/app/home/mapping',
        icon: <SettingsInputCompositeIcon sx={{ color: '#ccc' }} />,
      },
    ],
  },
];

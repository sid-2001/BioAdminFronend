import RadioButtonCheckedOutlinedIcon from '@mui/icons-material/RadioButtonCheckedOutlined'
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined'
import FormatQuoteOutlinedIcon from '@mui/icons-material/FormatQuoteOutlined'
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined'
import NumbersOutlinedIcon from '@mui/icons-material/NumbersOutlined'
import FormatListNumberedOutlinedIcon from '@mui/icons-material/FormatListNumberedOutlined'
import MilitaryTechOutlinedIcon from '@mui/icons-material/MilitaryTechOutlined'
import GridGoldenratioOutlinedIcon from '@mui/icons-material/GridGoldenratioOutlined'
import Grid4x4OutlinedIcon from '@mui/icons-material/Grid4x4Outlined'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import ViewSidebarIcon from '@mui/icons-material/ViewSidebar'

interface QuestionTypeProps {
  typeId: number
}

// const QuestionTypeIcon = (props: QuestionTypeProps) => {
//   let { typeId } = props;

//   const Types = (type: number) => {
//     if (type === 1) {
//       return <RadioButtonCheckedOutlinedIcon />;
//     } else if (type === 2) {
//       return <CheckBoxOutlinedIcon />;
//     } else if (type === 3) {
//       return <FormatQuoteOutlinedIcon />;
//     } else if (type === 4) {
//       return "";
//     } else if (type === 5) {
//       return <NumbersOutlinedIcon />;
//     } else if (type === 6) {
//       return <InfoOutlinedIcon />;
//     } else if (type === 7) {
//       return <FormatListBulletedOutlinedIcon />;
//     } else if (type === 8) {
//       return <FormatListNumberedOutlinedIcon />;
//     } else if (type === 9) {
//       return <MilitaryTechOutlinedIcon />;
//     } else if (type === 10) {
//       return "";
//     } else if (type === 11) {
//       return "";
//     } else if (type === 12) {
//       return <GridGoldenratioOutlinedIcon />;
//     } else if (type === 13) {
//       return <Grid4x4OutlinedIcon />;
//     } else if (type === 14) {
//       return "";
//     } else if (type === 15) {
//       return "";
//     } else if (type === 16) {
//       return <InfoOutlinedIcon color="primary" />;
//     }
//   };

//   return Types(typeId);
// };

const QuestionTypeIcon: React.FC<QuestionTypeProps> = ({ typeId }) => {
  switch (typeId) {
    case 1:
      return <RadioButtonCheckedOutlinedIcon />
    case 2:
      return <CheckBoxOutlinedIcon />
    case 3:
      return <FormatQuoteOutlinedIcon />
    case 5:
      return <NumbersOutlinedIcon />
    case 6:
      return <InfoOutlinedIcon />
    case 7:
      return <FormatListBulletedOutlinedIcon />
    case 8:
      return <FormatListNumberedOutlinedIcon />
    case 9:
      return <MilitaryTechOutlinedIcon />
    case 12:
      return <GridGoldenratioOutlinedIcon />
    case 13:
      return <Grid4x4OutlinedIcon />
    case 16:
      return <InfoOutlinedIcon color="primary" />
    case 17:
      return <ViewSidebarIcon />
    default:
      return null
  }
}

export default QuestionTypeIcon

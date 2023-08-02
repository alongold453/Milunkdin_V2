import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import Typography from "@mui/material/Typography";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from "react-router-dom";

export default ({ experienceArray, personId }) => {
  const navigate = useNavigate()
  const getExperienceBlock = ({
    personId,
    start_date,
    end_date,
    company,
    role,
    isMiluim,
    rate,
    comment,
  }) => {
    return (
      <TimelineItem>
        <TimelineOppositeContent
          sx={{ m: "auto 0" }}
          align="right"
          variant="body2"
          color="text.secondary"
        >
          {formatDate(start_date)} - {formatDate(end_date)}
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot color={isMiluim ? "success" : "primary"} />
          <TimelineConnector />
        </TimelineSeparator>
        <Tooltip title={isMiluim ? `${rate} starts, ${comment}` : ""}>
          <TimelineContent sx={{ py: "12px", px: 2 }}>
            <Typography variant="h6" component="span">
              {role}
            </Typography>
            <Typography>{company}</Typography>
          </TimelineContent>
        </Tooltip>
      </TimelineItem>
    );
  };
  const handleClick = () => {

  }
  const getReserveHistoryeBlock = ({
    personId,
    days_num,
    description,
    rating,
    year,
    month
  }) => {
    return (
      <TimelineItem>
        <TimelineOppositeContent
          sx={{ m: "auto 0" }}
          align="right"
          variant="body2"
          color="text.secondary"
        >
            {`${year} - ${formatMonth(month)}`}
            <br />
            {` ביצוע ${days_num} ימי מילואים`}
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot color={"success"} />
          <TimelineConnector />
        </TimelineSeparator>
          <TimelineContent sx={{ py: "12px", px: 2 }}>
            <Typography variant="h6" component="span">
              {description}
            </Typography>
          </TimelineContent>
        {/* </Tooltip> */}
      </TimelineItem>
    );
  };

  const loadTimeLinesItems = () => {
    if (experienceArray) {
      experienceArray.sort(orderByDate)
      return experienceArray.map((exp) => {
        if (exp.__typename === 'reserves_history') {
          return getReserveHistoryeBlock(exp)
        }
        else {
          return getExperienceBlock(exp)
        }
      });
    }
  };

  return (<>
        <Timeline>{loadTimeLinesItems()}</Timeline>
        <Tooltip title={'הוספת ביקור מילואים'}>
          <AddIcon onClick={() => navigate(`/reserve_history/${personId}`)} />
        </Tooltip>
    </>)
  
};
const orderByDate = (a, b) => {
  let aMonth
  let aYear
  let bMonth
  let bYear
  if (a.__typename === 'reserves_history') {
    aMonth = a.month
    aYear = a.year
  }
  else {
    const date = new Date(a.start_date)
    aMonth = date.getMonth()
    aYear = date.getFullYear()
  }

  if (b.__typename === 'reserves_history') {
    bMonth = b.month
    bYear = b.year
  }
  else {
    const date = new Date(b.start_date)
    bMonth = date.getMonth()
    bYear = date.getFullYear()
  }
  if (aYear < bYear || (aYear === bYear && aMonth < bMonth)) {
    return 1
  }
  if (aYear > bYear || (aYear === bYear && aMonth > bMonth)) {
    return -1
  }
  return 0

}

export const formatDate = (arg) => {
  const date = new Date(arg)
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  if (date.getFullYear() === 1970) {
    return 'present'
  }
  return `${months[date.getMonth()]} ${date.getFullYear()}`
}

export const formatMonth = (arg) => {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return `${months[arg]}`
}
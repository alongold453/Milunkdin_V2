import { UserContext } from "../../context/user.context";
import { useContext, useState } from "react";
import { useQuery } from "@apollo/client";
import { countExpsByExp, countSkillsBySkill, countTagsByTag } from "../../api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);
const tagsOptions = {
  indexAxis: "y",
  tooltips: {
    rtl: true,
  },
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: "התפלגות התגיות",
    },
  },
};

const skillsOptions = {
  indexAxis: "y",
  tooltips: {
    rtl: true,
  },
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: "התפלגות הכישורים",
    },
  },
};

const Stats = () => {
  const [userData] = useContext(UserContext);
  const countTagsQuery = useQuery(countTagsByTag);
  const tagsData = countTagsQuery.data
    ? countTagsQuery.data.count_tags_agg
    : [];
  const labelsTags = tagsData.length ? tagsData.map((tag) => tag.tag_name) : [];
  const countTags = tagsData.length ? tagsData.map((tag) => tag.tag_count) : [];
  const tagsGraph = {
    labels: labelsTags,
    datasets: [
      {
        data: countTags,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        height: "5",
      },
    ],
  };
  const countSkillsQuery = useQuery(countSkillsBySkill);
  const skillsData = countSkillsQuery.data
    ? countSkillsQuery.data.count_skills_agg
    : [];
  const labelsSkills = skillsData.length
    ? skillsData.map((skill) => skill.skill_name)
    : [];
  const countSkills = skillsData.length
    ? skillsData.map((skill) => skill.skill_count)
    : [];
  const skillsGraph = {
    labels: labelsSkills,
    datasets: [
      {
        data: countSkills,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  const countExpsQuery = useQuery(countExpsByExp);
  const expsData = countExpsQuery.data
    ? countExpsQuery.data.count_exps_agg
    : [];
  const labelsExps = expsData.length ? expsData.map((exp) => exp.exp_name) : [];
  const countExps = expsData.length ? expsData.map((exp) => exp.exp_count) : [];
  const colors = generateColorsArray(expsData.length);
  const expsGraph = {
    labels: labelsExps,
    datasets: [
      {
        data: countExps,
        backgroundColor: colors,
        borderColor: colors,
      },
    ],
  };

  return (
    <>
      {!userData.roles.includes("mador_manager") ? (
        <div>אין לך הרשאות למסך זה</div>
      ) : (
        <>
          <div style={{ width: "50vw", height: "50vh" }}>
            <Bar options={tagsOptions} data={tagsGraph} />
          </div>
          <div style={{ width: '50vw', height: '50vw'}}>
          <Bar options={skillsOptions} data={skillsGraph} />

          </div>
          <div style={{ width: "30vw", height: "30vh" }}>
            <Pie data={expsGraph} />
          </div>
        </>
      )}
    </>
  );
};

export default Stats;

const generateColorsArray = (count) => {
  const letters = "0123456789ABCDEF";
  let arr = [];
  for (let i = 0; i < count; i++) {
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    arr.push(color);
  }
  return arr;
};

import { Bar } from "react-chartjs-2";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { selectUsername } from "../redux/userSlice";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { database } from "@/utils/firebase-config";
import Modal from "./modal";
import {
  setChanceAnswer,
  setIsAnswered,
  setSectionProps,
} from "../redux/wordSlice";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: false,
      text: "Chart.js Horizontal Bar Chart",
    },
  },
};

export default function Polls() {
  const currentUsername = useAppSelector(selectUsername);
  const dispatch = useAppDispatch();
  const [chartData, setChartData] = useState<any>(null); // State untuk menyimpan data dari Firestore
  const [radioValue, setRadioValue] = useState("");
  const [dataCategory, setDataCategory] = useState({
    capability: 0,
    clarity: 0,
    continuity: 0,
    channels: 0,
  });

  useEffect(() => {
    async function fetchData() {
      const pollData: any[] = [];
      const categoryData: any = {
        capability: 0,
        clarity: 0,
        continuity: 0,
        channels: 0,
      }; // Data sementara untuk menghitung kategori
      const querySnapshot = await getDocs(collection(database, "livePolls"));
      querySnapshot.forEach((doc) => {
        pollData.push(doc.data().text);
        if (doc.data().text === "capability") {
          categoryData.capability += 1;
        }
        if (doc.data().text === "clarity") {
          categoryData.clarity += 1;
        }
        if (doc.data().text === "continuity") {
          categoryData.continuity += 1;
        }
        if (doc.data().text === "channels") {
          categoryData.channels += 1;
        }
      });
      setChartData(pollData);
      setDataCategory(categoryData);
    }
    fetchData();
  }, []);

  const handleSubmitPolls = async () => {
    await addDocumentsAsync(radioValue);
    dispatch(setIsAnswered(true));
    dispatch(setSectionProps("Polls"));
    dispatch(setChanceAnswer(0));
  };

  const handleRadioChange = (value: string) => {
    setRadioValue(value);
  };

  async function addDocumentsAsync(value: any) {
    const username = currentUsername;
    await addDoc(collection(database, "livePolls"), {
      username: username,
      text: value,
    });
  }

  if (!chartData) return <div>Loading...</div>;
  console.log(dataCategory.capability);

  const data = {
    labels: ["Hasil Akhir Live Polls"],
    datasets: [
      {
        label: "Clarity",
        data: [dataCategory.clarity],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Continuity & Consistency",
        data: [dataCategory.continuity], // Dataset kedua
        borderColor: "rgb(54, 162, 235)",
        backgroundColor: "rgba(54, 162, 235, 0.5)",
      },
      {
        label: "Capability of Audience",
        data: [dataCategory.capability],
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
      {
        label: "Channels Of Distribution",
        data: [dataCategory.channels], // Dataset ketiga
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 122, 192, 0.5)",
      },
    ],
  };

  return (
    <>
      <div className=" bg-white p-3 rounded-md shadow-lg">
        {currentUsername === "ITPGo123" && (
          <Bar width={1400} height={500} options={options} data={data} />
        )}
      </div>
      {currentUsername !== "ITPGo123" && (
        <Modal
          isOpen={true}
          onClose={() => false}
          section="Polls"
          onSubmit={handleSubmitPolls}
          onRadioChange={handleRadioChange}
        />
      )}
    </>
  );
}

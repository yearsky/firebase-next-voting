import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import cloud from "d3-cloud";
import {
  QuerySnapshot,
  Timestamp,
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { database } from "@/utils/firebase-config";
import { useAppDispatch, useAppSelector } from "../redux/store";
import {
  selectAnswer,
  setChanceAnswer,
  setIsAnswered,
  clearChanceAnswer,
  setSectionProps,
} from "../redux/wordSlice";
import { clearUser, selectUsername } from "../redux/userSlice";
import Modal from "./modal";

interface WordCloudProps {
  onSuccess: () => void;
}

const drawWordCloud = async (
  words: { text: string; size: number }[],
  container: HTMLElement
) => {
  const colors = [
    "#c23531",
    "#2f4554",
    "#61a0a8",
    "#d48265",
    "#91c7ae",
    "#749f83",
    "#ca8622",
    "#bda29a",
    "#6e7074",
    "#546570",
    "#c4ccd3",
  ];

  const layout = cloud()
    .size([1400, 1000])
    .words(
      words.map((word) => ({
        ...word,
        color: colors[Math.floor(Math.random() * colors.length)],
      }))
    )
    .padding(5)
    .rotate(() => Math.floor(Math.random() * 2) * 90)
    .font("Impact")
    .fontSize((d) => d.size ?? 0)
    .spiral("archimedean")
    .on(
      "end",
      (
        cloudWords: {
          text: string;
          size: number;
          x: number;
          y: number;
          rotate: number;
          color: string;
        }[]
      ) => {
        d3.select(container).selectAll("svg").remove(); // Menghapus SVG sebelumnya jika ada

        d3.select(container)
          .append("svg")
          .attr("width", layout.size()[0])
          .attr("height", layout.size()[1])
          .append("g")
          .attr(
            "transform",
            "translate(" +
              layout.size()[0] / 2 +
              "," +
              layout.size()[1] / 2 +
              ")"
          )
          .selectAll("text")
          .data(cloudWords)
          .enter()
          .append("text")
          .style("font-size", (d: any) => `${d.size}px`)
          .style("fill", (d: any) => d.color)
          .attr("text-anchor", "middle")
          .attr(
            "transform",
            (d) => `translate(${d.x},${d.y})rotate(${d.rotate})`
          )
          .text((d) => d.text);
      }
    );
  layout.start();
};

const WordCloud: React.FC<WordCloudProps> = ({ onSuccess }) => {
  const containerRef = useRef(null);
  const dispatch = useAppDispatch();
  const isAnswered = useAppSelector(selectAnswer);
  const currentUsername = useAppSelector(selectUsername);
  const [words, setWords] = useState<{ text: string; size: number }[]>([]);
  const [questions, setQuestions] = useState("");
  const [isOpen, setModalOpen] = useState(false);
  const [sentence, setSentence] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (currentUsername === "ITPGo123") {
      const unsubscribe = onSnapshot(
        query(collection(database, "wordClouds"), orderBy("createdAt", "desc")),
        (snapshot) => {
          const dataArray = snapshot.docs.map((doc) => ({
            text: doc.data().text,
            size: doc.data().size,
          }));
          setWords(dataArray);
          if (containerRef.current) {
            drawWordCloud(dataArray, containerRef.current)
              .then(() => setIsLoading(false))
              .catch((error) =>
                console.error("Error drawing word cloud:", error)
              );
          }
        }
      );

      return () => unsubscribe();
    } else {
      questionsFirestore();
    }
  }, []);

  useEffect(() => {
    if (containerRef.current && words.length > 0) {
      drawWordCloud(words, containerRef.current)
        .then(() => setIsLoading(false))
        .catch((error) => console.error("Error drawing word cloud:", error));
    }
  }, [words]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSentence(e.target.value);
  };

  const closeModal = () => {
    setModalOpen(true);
  };

  const generateWordCloud = async (content: string) => {
    try {
      setIsLoading(true);
      await addDocumentsAsync(content);
      dispatch(setIsAnswered(true));
      dispatch(setSectionProps("wordClouds"));
      dispatch(setChanceAnswer(0));
      dispatch(clearChanceAnswer());
      // onSuccess();
    } catch (error) {
      console.log("error: " + error);
    } finally {
      setIsLoading(false);
      // closeModal();
    }
  };

  async function addDocumentsAsync(word: any) {
    const currentDate = new Date();
    const timestamp = Timestamp.fromDate(currentDate);
    const username = localStorage.getItem("username");

    const promise = addDoc(collection(database, "wordClouds"), {
      username: username,
      text: word,
      size: Math.max(Math.floor(Math.random() * 50), 12),
      createdAt: timestamp,
    });

    return promise;
  }

  const questionsFirestore = async () => {
    try {
      setIsLoading(true);
      await getQuestions();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  async function getQuestions() {
    const q = query(
      collection(database, "questions"),
      where("section", "==", "wordClouds")
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setQuestions(doc.data().text);
    });
    return querySnapshot;
  }

  return (
    <>
      <div className="flex flex-col justify-center items-center gap-y-6 w-full">
        {currentUsername === "ITPGo123" && (
          <div className="bg-white hidden md:flex md:w-[180vh] h-[60vh] rounded-md relative overflow-x-hidden overflow-y-auto">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center animate-pulse bg-gray-400 text-white">
                Tunggu Sebentar yaa😉
              </div>
            )}
            <div ref={containerRef}></div>
          </div>
        )}

        {currentUsername !== "ITPGo123" && (
          <Modal
            isOpen={true}
            onClose={closeModal}
            section="wordClouds"
            onSubmit={generateWordCloud}
          />
        )}
      </div>
    </>
  );
};

export default WordCloud;

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import cloud from "d3-cloud";
import {
  Timestamp,
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { database } from "@/utils/firebase-config";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { selectAnswer, setIsAnswered } from "../redux/wordSlice";

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

const WordCloud = () => {
  const containerRef = useRef(null);
  const dispatch = useAppDispatch();
  const isAnswered = useAppSelector(selectAnswer);
  const [words, setWords] = useState<{ text: string; size: number }[]>([]);
  const [isOpen, setModalOpen] = useState(false);
  const [sentence, setSentence] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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

  const generateWordCloud = async () => {
    try {
      setIsLoading(true);
      await addDocumentsAsync(sentence);
      dispatch(setIsAnswered(true));
    } catch (error) {
      console.log("error: " + error);
    } finally {
      setIsLoading(false);
      closeModal();
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

  return (
    <>
      <div className="flex flex-col justify-center items-center gap-y-6 w-full">
        <div className="bg-white hidden md:flex md:w-[180vh] h-[60vh] rounded-md relative overflow-auto">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center animate-pulse bg-gray-400 text-white">
              Tunggu Sebentar yaa😉
            </div>
          )}
          <div ref={containerRef}></div>
        </div>
        <div
          className={`fixed z-50 md:top-0  w-full min-h-full ${
            !isOpen && !isAnswered ? "md:flex" : "hidden"
          } items-center justify-center bg-gray-500 bg-opacity-50`}
        >
          <div className="bg-white rounded-lg p-6 xl:w-1/2 relative">
            <h4 className={`text-lg text-center font-bold mt-5 text-slate-500`}>
              Pertanyaan
            </h4>
            <h4
              className={`text-xl mb-4 ${
                isLoading ? "bg-gray-400 animate-pulse text-gray-400" : ""
              }`}
            >
              Bahasa Inggrisnya aku cinta kamu apa?
            </h4>
            <input
              placeholder="Jawaban Kamu..."
              value={sentence}
              onChange={handleInputChange}
              className="border mb-4 border-gray-400 w-full p-3 xl:p-4 rounded-md"
            />
            <button
              onClick={generateWordCloud}
              disabled={isLoading}
              className="px-5 py-2 mt-2 rounded bg-indigo-500 text-white 
  disabled:bg-gray-500/80 disabled:cursor-not-allowed"
            >
              Kirim Jawaban
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default WordCloud;

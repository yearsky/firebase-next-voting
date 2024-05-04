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

const drawWordCloud = (
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
    .size([1400, 500])
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
  const [words, setWords] = useState<{ text: string; size: number }[]>([]);
  const [isOpen, setModalOpen] = useState(false);
  const [sentence, setSentence] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [previousWords, setPreviousWords] = useState<
    { text: string; size: number }[]
  >([]);

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
          drawWordCloud(dataArray, containerRef.current);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (containerRef.current && words.length > 0) {
      drawWordCloud(words, containerRef.current);
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
      await addDocumentsAsync(sentence);
    } catch (error) {
      console.log("error: " + error);
    } finally {
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
          <div ref={containerRef}></div>
        </div>
        <div
          className={`hidden fixed z-50 top-0 left-0 w-full min-h-full ${
            isOpen ? "md:flex" : ""
          } items-center justify-center bg-gray-500 bg-opacity-50`}
        >
          <div className="bg-white rounded-lg p-6 xl:w-1/2 relative">
            <h4 className={`text-lg text-slate-500 text-center font-bold mt-5`}>
              Pertanyaan
            </h4>
            <h2 className="mb-4 text-xl ">
              Bahasa Inggrisnya aku cinta kamu apa?
            </h2>
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
              {isLoading && (
                <i className="animate-spin fa-solid fa-circle-notch mr-2"></i>
              )}
              {isLoading ? "Loading..." : "Kirim Jawaban"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default WordCloud;

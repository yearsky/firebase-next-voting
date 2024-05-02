import React, { useState } from "react";

interface Word {
  text: string;
  size: number;
  left: number;
  top: number;
  rotate: number;
  key: number;
}

const WordCloud = () => {
  const [sentence, setSentence] = useState("");
  const [wordList, setWordList] = useState<Word[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSentence(e.target.value);
  };

  const generateWordCloud = () => {
    const words = sentence.split(" ");
    const wordCloud: Word[] = words.map((word, index) => ({
      text: word,
      size: Math.floor(Math.random() * 30) + 10, // Random size between 10 and 40
      left: Math.floor(Math.random() * 80), // Random left position between 0 and 80
      top: Math.floor(Math.random() * 80), // Random top position between 0 and 80
      rotate: Math.floor(Math.random() * 180) - 90, // Random rotation between -90 and 90 degrees
      key: index,
    }));
    setWordList(wordCloud);
  };

  return (
    <>
    
        <div className="relative w-full flex flex-col items-center">
        <div className="hidden sm:flex sm:absolute w-3/4 h-[50vh] overflow-hidden border-gray-400 bg-white">
            {wordList.map((word) => (
            <span
                key={word.key}
                className="word-cloud-word absolute"
                style={{
                fontSize: `${word.size}px`,
                left: `${word.left}%`,
                top: `${word.top}%`,
                transform: `rotate(${word.rotate}deg)`,
                }}
            >
                {word.text}
            </span>
            ))}
        </div>

        </div>
        <div className="min-w-screen max-h-12">
  <div className="w-full h-full absolute flex flex-col justify-center items-center rounded-xl -translate-x-1/2 bg-white md:relative md:flex-row md:items-start md:justify-start md:w-auto md:h-auto md:max-h-none">
    <textarea
      placeholder="Enter your sentence..."
      value={sentence}
      onChange={handleInputChange}
      className="mt-4 md:mr-4 md:mt-0"
    />
    <button
      onClick={generateWordCloud}
      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Generate Word Cloud
    </button>
  </div>
</div>

    </>
  );
};

export default WordCloud;

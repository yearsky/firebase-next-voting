import React, { useState } from 'react';
import { ref, update } from 'firebase/database';
import { database } from "../../utils/firebase-config"; // Import your Firebase database instance

interface CardProps {
  id: string;
  content: string;
  likes: number;
}

const Card: React.FC<CardProps> = ({ id, content, likes }) => {
  const [likeCount, setLikeCount] = useState(likes);

  const handleLikeClick = () => {
    const dbRef = ref(database, `content/${id}`);
    update(dbRef, { likes: likeCount + 1 })
      .then(() => {
        setLikeCount(likeCount + 1);
      })
      .catch(error => {
        console.error("Error updating likes:", error);
      });
  };

  return (
    <div className="relative border border-gray-700 rounded-md p-5">
      <h1 className="mb-10">{content}</h1>
      <div className="absolute bottom-0 right-10 left-10">
        <button className="border border-gray-300 bg-gray-400 rounded-full mb-2 mr-1" onClick={handleLikeClick}>❤️</button>
        <span>{likeCount}</span>
      </div>
    </div>
  );
};

export default Card;

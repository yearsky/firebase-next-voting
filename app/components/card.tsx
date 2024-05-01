import React, { useState, useEffect } from 'react';
import { ref, update, onValue, off } from 'firebase/database';
import { database } from "../../utils/firebase-config";

interface CardProps {
  id: string;
  content: string;
  likes: number;
}

const Card: React.FC<CardProps> = ({ id, content, likes }) => {
  const [likeCount, setLikeCount] = useState(likes);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const dbRef = ref(database, `content/${id}`);

    const handleDataChange = (snapshot: any) => {
      const updatedLikes = snapshot.val().likes;
      setLikeCount(updatedLikes);
    };

    onValue(dbRef, handleDataChange);

    return () => {
      off(dbRef, 'value', handleDataChange);
    };
  }, [id]);

  const handleLikeClick = () => {
    if (!isLiked) {
      const dbRef = ref(database, `content/${id}`);
      update(dbRef, { likes: likeCount + 1 })
        .then(() => {
          setLikeCount(likeCount + 1);
          setIsLiked(true);
        })
        .catch(error => {
          console.error("Error updating likes:", error);
        });
    }
  };

  return (
    <div className="relative border border-gray-700 rounded-md p-5">
      <h1 className="mb-10">{content}</h1>
      <div className="absolute bottom-0 right-10 left-10">
        <button className={`border border-gray-500 bg-white p-1 rounded-full mb-2 mr-1 ${isLiked ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={handleLikeClick}>❤️</button>
        <span>{likeCount}</span>
      </div>
    </div>
  );
};

export default Card;

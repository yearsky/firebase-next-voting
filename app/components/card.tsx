import React, { useState, useEffect } from 'react';
import { ref, update, onValue, off } from 'firebase/database';
import { database } from "../../utils/firebase-config";

interface CardProps {
  id: string;
  content: string;
  username: string;
  likes: number;
}

const Card: React.FC<CardProps> = ({ id, content,username, likes }) => {
  const [likeCount, setLikeCount] = useState(likes);
  const [isLiked, setIsLiked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const dbRef = ref(database, `content/${id}`);

    const handleDataChange = (snapshot: any) => {
      const updatedLikes = snapshot.val().likes;
      setLikeCount(updatedLikes);
    };

    onValue(dbRef, handleDataChange);

    const likedStatus = localStorage.getItem(`liked_${id}`);
    if (likedStatus) {
      setIsLiked(true);
    }

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
          localStorage.setItem(`liked_${id}`, 'true');
          // Trigger animation
          setIsAnimating(true);
          setTimeout(() => setIsAnimating(false), 1000);
        })
        .catch(error => {
          console.error("Error updating likes:", error);
        });
    }
  };

  return (
    <div className="relative border border-gray-700 rounded-md p-5 card">
      <h1 className='absolute text-center -top-2 left-1/2 transform -translate-x-1/2 bg-red-400 rounded-full text-white w-3/4 p-1 truncate'>{username}</h1>
      <h1 className="mb-10 mt-5">{content}</h1>
      <div className="absolute bottom-0 right-10 left-10">
        <button 
          className={`border border-gray-500 bg-white p-1 rounded-full mb-2 mr-1 ${isLiked ? 'opacity-50 cursor-not-allowed' : ''}`} 
          onClick={handleLikeClick}
          style={{ animation: isAnimating ? 'bounce 0.5s' : '' }} // Apply animation style
        >
          ❤️
        </button>
        <span>{likeCount}</span>
      </div>
    </div>
  );
};

export default Card;

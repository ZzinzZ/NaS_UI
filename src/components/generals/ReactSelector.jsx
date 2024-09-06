"use client"
import { ReactionBarSelector } from "@charkour/react-reactions";
import React from 'react';


const Reaction = [
    { label: "like", node: <div>👍</div>, key: "like" },
    { label: "haha", node: <div>😆</div>, key: "haha" },
    { label: "favorite", node: <div>❤️️</div>, key: "favorite" },
    { label: "wow", node: <div>😮</div>, key: "wow" },
    { label: "sad", node: <div>😢</div>, key: "sad" },
    { label: "angry", node: <div>😡</div>, key: "angry" },
    { label: "wtf", node: <div>🐧</div>, key: "wtf" },
  ];


  const ReactSelector = ({handleReact}) => {
    return (
        <ReactionBarSelector
        reactions={Reaction}
        iconSize={35}
        style={{
          padding: "0 1rem 0 0",
          position: "absolute",
          top: "-2.7rem",
        }}
        onSelect={(key) => handleReact(key)}
      />
    )
  }
  
  export default ReactSelector
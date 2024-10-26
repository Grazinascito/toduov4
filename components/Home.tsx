/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */

"use client";
import React, { useState, useEffect } from "react";
import TaskList from "./TaskList";
import Timer from "./Timer";
import Chat from "./Chat";
import TeamProgress from "./TeamProgress";

export function Home() {
  const [time, setTime] = useState(1500); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [tasks, setTasks] = useState([
    {
      id: 1,
      text: "Terminar teste do excel product design",
      completed: false,
      tag: { name: "Design", color: "#BAE1FF" },
      dueDate: new Date(2024, 9, 24, 22, 0),
    },
    {
      id: 2,
      text: "Leitura - high performance browser networking",
      completed: false,
      tag: { name: "Book", color: "#BAFFC9" },
      dueDate: new Date(2024, 9, 25, 13, 0),
    },
    {
      id: 3,
      text: "ler um topico do curso design",
      completed: false,
      tag: { name: "Design", color: "#BAE1FF" },
      dueDate: new Date(2024, 9, 25, 10, 0),
    },
  ]);
  const [friendTasks, setFriendTasks] = useState([
    {
      id: 1,
      text: "Write blog post",
      completed: true,
      tag: { name: "Writing", color: "#FFC6FF" },
      dueDate: new Date(2024, 9, 25, 15, 0),
    },
    {
      id: 2,
      text: "Prepare presentation",
      completed: false,
      tag: { name: "Work", color: "#FFDFBA" },
      dueDate: new Date(2024, 9, 26, 9, 0),
    },
  ]);


  const [volume, setVolume] = useState(50);

  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | undefined;
    if (isRunning && time > 0) {
      interval = setInterval(() => setTime((time) => time - 1), 1000);
    } else if (time === 0) {
      setIsRunning(false);
      playAlarm();
    }
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, time]);


  const playAlarm = () => {
    const audio = new Audio("/alarm.mp3");
    audio.volume = volume / 100;
    audio.play();
  };

  return (
    <div className="grid grid-cols-2 gap-6 h-screen bg-gray-50 p-6 w-full max-w-[1600px] mx-auto">
      <TeamProgress tasks={tasks} friendTasks={friendTasks} />

      <Timer />

      <TaskList
        tasks={tasks}
        setTasks={setTasks}
        friendTasks={friendTasks}
        setFriendTasks={setFriendTasks}
      />
      <Chat />
    </div>
  );
}

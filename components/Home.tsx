/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */

"use client";
import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Send,
  Plus,
  Trash2,
  UserPlus,
  Play,
  Pause,
  RotateCcw,
  Clock,
  Coffee,
  Moon,
  Edit2,
  Tag,
  Settings,
  Book,
  Pencil,
  Calendar,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Volume2, VolumeX } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Progress } from "./ui/progress";

const pastelColors = [
  "#FFB3BA",
  "#FFDFBA",
  "#FFFFBA",
  "#BAFFC9",
  "#BAE1FF",
  "#FFC6FF",
  "#FFDAB9",
  "#E6E6FA",
  "#B0E0E6",
  "#FFE4E1",
];

export function Home() {
  const [time, setTime] = useState(1500); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [timerMode, setTimerMode] = useState("pomodoro");
  const [customTime, setCustomTime] = useState(25);
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
  const [newTask, setNewTask] = useState("");
  const [editingTask, setEditingTask] = useState<number | null>(null);
  const [editingTag, setEditingTag] = useState(null);
  const [messages, setMessages] = useState([
    {
      id: 1,
      user: "Grazi Masito",
      text: "How's everyone doing today?",
      time: "9:56 pm",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [activeTab, setActiveTab] = useState("myTasks");
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

  const toggleTimer = () => setIsRunning(!isRunning);

  const setTimerDuration = (mode: React.SetStateAction<string>) => {
    setTimerMode(mode);
    setIsRunning(false);
    switch (mode) {
      case "pomodoro":
        setTime(1500); // 25 minutes
        break;
      case "shortBreak":
        setTime(300); // 5 minutes
        break;
      case "longBreak":
        setTime(900); // 15 minutes
        break;
      case "custom":
        setTime(customTime * 60);
        break;
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimerDuration(timerMode);
  };

  const playAlarm = () => {
    const audio = new Audio("/alarm.mp3");
    audio.volume = volume / 100;
    audio.play();
  };

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          text: newTask,
          completed: false,
          tag: { name: "Task", color: pastelColors[0] },
          dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Default to tomorrow
        },
      ]);
      setNewTask("");
    }
  };

  const updateTask = (
    id: number,
    newText: string,
    newTag: { name: string; color: string },
    newDueDate: Date
  ) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, text: newText, tag: newTag, dueDate: newDueDate }
          : task
      )
    );
    setEditingTask(null);
    setEditingTag(null);
  };

  const toggleTask = (id: number, isFriendTask = false) => {
    if (isFriendTask) {
      setFriendTasks(
        friendTasks.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task
        )
      );
    } else {
      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task
        )
      );
    }
  };

  const deleteTask = (id: number, isFriendTask = false) => {
    if (isFriendTask) {
      setFriendTasks(friendTasks.filter((task) => task.id !== id));
    } else {
      setTasks(tasks.filter((task) => task.id !== id));
    }
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: Date.now(),
          user: "You",
          text: newMessage,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
      setNewMessage("");
    }
  };

  const getTagIcon = (tag: { name: string; color?: string }) => {
    switch (tag.name.toLowerCase()) {
      case "book":
        return <Book className="h-4 w-4" />;
      case "design":
        return <Pencil className="h-4 w-4" />;
      default:
        return <Tag className="h-4 w-4" />;
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === now.toDateString()) {
      return `Today, ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow, ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else {
      return (
        date.toLocaleDateString([], { month: "short", day: "numeric" }) +
        ", " +
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    }
  };

  const completedTasksCount = tasks.filter((task) => task.completed).length;
  const friendCompletedTasksCount = friendTasks.filter(
    (task) => task.completed
  ).length;

  return (
    <div className="grid grid-cols-2 gap-6 h-screen bg-gray-50 p-6 w-full max-w-[1600px] mx-auto">
      {/* Completed Tasks Card */}
      <Card className="shadow-md col-span-1">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-primary">
            Team Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                username: "You",
                avatarSrc: "https://github.com/shadcn.png",
                openTasks: tasks.filter((t) => !t.completed).length,
                completedTasks: completedTasksCount,
              },
              {
                username: "Friend",
                avatarSrc: "https://github.com/shadcn.png",
                openTasks: friendTasks.filter((t) => !t.completed).length,
                completedTasks: friendCompletedTasksCount,
              },
            ].map((user) => (
              <div
                key={user.username}
                className="flex flex-col items-center p-4 bg-secondary rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
              >
                <Avatar className="w-16 h-16 mb-4">
                  <AvatarImage src={user.avatarSrc} alt={user.username} />
                  <AvatarFallback>{user.username[0]}</AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-semibold mb-2">{user.username}</h3>
                <div className="w-full space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Tasks Progress</span>
                    <span className="text-sm font-medium">
                      {user.completedTasks}/
                      {user.openTasks + user.completedTasks}
                    </span>
                  </div>
                  <Progress
                    value={
                      (user.completedTasks /
                        (user.openTasks + user.completedTasks)) *
                      100
                    }
                    className="w-full"
                  />
                </div>
                <div className="flex justify-center space-x-4 mt-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <span className="text-sm">
                          <span className="font-bold mr-1">
                            {user.openTasks}
                          </span>{" "}
                          Open
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Tasks in progress</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <span className="text-sm">
                          <span className="font-bold mr-1">
                            {user.completedTasks}
                          </span>{" "}
                          Done
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Completed tasks</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pomodoro Timer Card */}
      <Card className="shadow-md col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Pomodoro Timer</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex space-x-4">
              <TooltipProvider>
                {[
                  { mode: "pomodoro", icon: Clock, label: "Pomodoro" },
                  { mode: "shortBreak", icon: Coffee, label: "Short Break" },
                  { mode: "longBreak", icon: Moon, label: "Long Break" },
                ].map(({ mode, icon: Icon, label }) => (
                  <Tooltip key={mode}>
                    <TooltipTrigger asChild>
                      <Button
                        variant={timerMode === mode ? "default" : "outline"}
                        size="icon"
                        onClick={() => setTimerDuration(mode)}
                      >
                        <Icon className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{label}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium leading-none">
                          Timer Settings
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Customize your Pomodoro timer.
                        </p>
                      </div>
                      <div className="grid gap-2">
                        <div className="grid grid-cols-3 items-center gap-4">
                          <Label htmlFor="custom-time">Custom Time</Label>
                          <Input
                            id="custom-time"
                            type="number"
                            className="col-span-2"
                            value={customTime}
                            onChange={(e) =>
                              setCustomTime(Number(e.target.value))
                            }
                          />
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                          <Label htmlFor="volume">Alarm Volume</Label>
                          <div className="col-span-2 flex items-center space-x-2">
                            <VolumeX className="h-4 w-4" />
                            <Slider
                              id="volume"
                              min={0}
                              max={100}
                              step={1}
                              value={[volume]}
                              onValueChange={(value) => setVolume(value[0])}
                              className="flex-grow"
                            />
                            <Volume2 className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          setTimerMode("custom");
                          setTimerDuration("custom");
                        }}
                      >
                        Apply Settings
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </TooltipProvider>
            </div>
            <div className="text-7xl font-bold tabular-nums mb-4">
              {`${Math.floor(time / 60)
                .toString()
                .padStart(2, "0")}:${(time % 60).toString().padStart(2, "0")}`}
            </div>
            <div className="flex space-x-4">
              <Button onClick={toggleTimer} className="w-24">
                {isRunning ? (
                  <Pause className="mr-2 h-4 w-4" />
                ) : (
                  <Play className="mr-2 h-4 w-4" />
                )}
                {isRunning ? "Pause" : "Start"}
              </Button>
              <Button onClick={resetTimer} variant="outline">
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task List Card */}
      <Card className="shadow-md col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Task List</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="h-full flex flex-col"
          >
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="myTasks">My Tasks</TabsTrigger>
              <TabsTrigger value="friendTasks">Friends Tasks</TabsTrigger>
            </TabsList>
            <TabsContent value="myTasks" className="flex-grow flex flex-col">
              <div className="flex space-x-2 mb-4">
                <Input
                  placeholder="Add a new task"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addTask()}
                  className="flex-grow"
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={addTask}
                        size="icon"
                        className="shrink-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add new task</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <ScrollArea className="flex-grow h-[calc(100%-6rem)] pr-4">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center space-x-2 py-3 border-b border-gray-200"
                  >
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTask(task.id)}
                      className="shrink-0"
                    />
                    {editingTask === task.id ? (
                      <Input
                        value={task.text}
                        onChange={(e) =>
                          updateTask(
                            task.id,
                            e.target.value,
                            task.tag,
                            task.dueDate
                          )
                        }
                        onBlur={() => setEditingTask(null)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            const target = e.target as HTMLInputElement;
                            updateTask(
                              task.id,
                              target.value,
                              task.tag,
                              task.dueDate
                            );
                          }
                        }}
                        className="flex-grow"
                      />
                    ) : (
                      <div className="flex-grow">
                        <div
                          className={`font-medium text-sm ${
                            task.completed ? "line-through text-gray-500" : ""
                          }`}
                        >
                          {task.text}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-auto p-0"
                              >
                                <Badge
                                  className="rounded-none border-0"
                                  style={{
                                    backgroundColor: task.tag.color,
                                    color: "#000000",
                                  }}
                                >
                                  {getTagIcon(task.tag)}
                                  <span className="ml-1">{task.tag.name}</span>
                                </Badge>
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                              <div className="grid gap-4">
                                <div className="space-y-2">
                                  <h4 className="font-medium leading-none">
                                    Edit Tag
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    Customize the tag for this task.
                                  </p>
                                </div>
                                <div className="grid gap-2">
                                  <div className="grid grid-cols-3 items-center gap-4">
                                    <Label htmlFor="tag-name">Name</Label>
                                    <Input
                                      id="tag-name"
                                      value={task.tag.name}
                                      onChange={(e) =>
                                        updateTask(
                                          task.id,
                                          task.text,
                                          { ...task.tag, name: e.target.value },
                                          task.dueDate
                                        )
                                      }
                                      className="col-span-2"
                                    />
                                  </div>
                                  <div className="grid grid-cols-3 items-center gap-4">
                                    <Label htmlFor="tag-color">Color</Label>
                                    <div className="col-span-2 flex flex-wrap gap-2">
                                      {pastelColors.map((color) => (
                                        <Button
                                          key={color}
                                          className="w-6 h-6 rounded-full p-0"
                                          style={{ backgroundColor: color }}
                                          onClick={() =>
                                            updateTask(
                                              task.id,
                                              task.text,
                                              { ...task.tag, color },
                                              task.dueDate
                                            )
                                          }
                                        />
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-auto p-0 ml-2"
                              >
                                <Calendar className="h-4 w-4 mr-1" />
                                <span className="ml-1">
                                  {formatDate(task.dueDate)}
                                </span>
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <CalendarComponent
                                mode="single"
                                selected={task.dueDate}
                                onSelect={(date) => {
                                  if (date) {
                                    const newDate = new Date(date);
                                    newDate.setHours(task.dueDate.getHours());
                                    newDate.setMinutes(
                                      task.dueDate.getMinutes()
                                    );
                                    updateTask(
                                      task.id,
                                      task.text,
                                      task.tag,
                                      newDate
                                    );
                                  }
                                }}
                                initialFocus
                              />
                              <div className="p-3 border-t border-border">
                                <Label
                                  htmlFor="time"
                                  className="text-sm font-medium"
                                >
                                  Time
                                </Label>
                                <Input
                                  id="time"
                                  type="time"
                                  value={task.dueDate
                                    .toTimeString()
                                    .slice(0, 5)}
                                  onChange={(e) => {
                                    const [hours, minutes] =
                                      e.target.value.split(":");
                                    const newDate = new Date(task.dueDate);
                                    newDate.setHours(parseInt(hours));
                                    newDate.setMinutes(parseInt(minutes));
                                    updateTask(
                                      task.id,
                                      task.text,
                                      task.tag,
                                      newDate
                                    );
                                  }}
                                  className="mt-1"
                                />
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    )}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingTask(task.id)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit task</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteTask(task.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete task</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                ))}
              </ScrollArea>
            </TabsContent>
            <TabsContent
              value="friendTasks"
              className="flex-grow flex flex-col"
            >
              <ScrollArea className="flex-grow h-[calc(100%-6rem)]">
                {friendTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center space-x-2 py-3 border-b border-gray-200"
                  >
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTask(task.id, true)}
                      disabled
                      className="shrink-0"
                    />
                    <div className="flex-grow">
                      <div
                        className={`font-medium text-sm ${
                          task.completed ? "line-through text-gray-500" : ""
                        }`}
                      >
                        {task.text}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Badge
                          className="rounded-none border-0"
                          style={{
                            backgroundColor: task.tag.color,
                            color: "#000000",
                          }}
                        >
                          {getTagIcon(task.tag)}
                          <span className="ml-1">{task.tag.name}</span>
                        </Badge>
                        <Calendar className="h-4 w-4 ml-2" />
                        <span className="ml-1">{formatDate(task.dueDate)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Coworking Chat Card */}
      <Card className="shadow-md col-span-1">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-medium">
              Coworking Chat
            </CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" variant="outline">
                    <UserPlus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Invite a friend</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent className="p-4 h-[calc(100%-5rem)] flex flex-col">
          <ScrollArea className="flex-grow mb-4 pr-4 h-[calc(100%-6rem)]">
            {messages.map((message) => (
              <div key={message.id} className="mb-4">
                <div className="flex items-center space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>{message.user[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{message.user}</div>
                    <div className="text-sm text-gray-500">{message.time}</div>
                  </div>
                </div>
                <div className="mt-1 ml-10 p-2 bg-gray-100 rounded-md text-sm">
                  {message.text}
                </div>
              </div>
            ))}
          </ScrollArea>
          <div className="flex space-x-2">
            <Input
              placeholder="Type a message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              className="flex-grow"
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={sendMessage}
                    size="icon"
                    className="shrink-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Send message</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

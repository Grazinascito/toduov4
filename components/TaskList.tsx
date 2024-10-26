// components/TaskList.tsx
import React, { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2, Calendar, Book, Pencil, Tag } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

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

type TaskItem = {
  id: number;
  text: string;
  completed: boolean;
  tag: {
    name: string;
    color: string;
  };
  dueDate: Date;
};

type TaskListProps = {
  tasks: TaskItem[];
  setTasks: React.Dispatch<React.SetStateAction<TaskItem[]>>;
  friendTasks: TaskItem[];
  setFriendTasks: React.Dispatch<React.SetStateAction<TaskItem[]>>;
};

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  setTasks,
  friendTasks,
  setFriendTasks,
}) => {
  const [newTask, setNewTask] = useState("");
  const [editingTask, setEditingTask] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("myTasks");

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

  return (
    <Card className="shadow-md col-span-1 h-[450px]">
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
                onKeyDown={(e) => e.key === "Enter" && addTask()}
                className="flex-grow"
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={addTask} size="icon" className="shrink-0">
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
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={task.dueDate}
                              onSelect={(date) => {
                                if (date) {
                                  const newDate = new Date(date);
                                  newDate.setHours(task.dueDate.getHours());
                                  newDate.setMinutes(task.dueDate.getMinutes());
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
                                value={task.dueDate.toTimeString().slice(0, 5)}
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
          <TabsContent value="friendTasks" className="flex-grow flex flex-col">
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
  );
};

export default TaskList;

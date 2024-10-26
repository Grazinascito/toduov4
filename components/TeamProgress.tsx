// components/TeamProgress.tsx
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

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

type TeamProgressProps = {
  tasks: TaskItem[];
  friendTasks: TaskItem[];
};

const TeamProgress: React.FC<TeamProgressProps> = ({ tasks, friendTasks }) => {
  const completedTasksCount = tasks.filter((task) => task.completed).length;
  const friendCompletedTasksCount = friendTasks.filter(
    (task) => task.completed
  ).length;

  return (
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
                    {user.completedTasks}/{user.openTasks + user.completedTasks}
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
                        <span className="font-bold mr-1">{user.openTasks}</span>{" "}
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
  );
};

export default TeamProgress;

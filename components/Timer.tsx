// components/Timer.tsx
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Clock,
  Coffee,
  Moon,
  Settings,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";

const Timer: React.FC = () => {
  const [timerMode, setTimerMode] = useState("pomodoro");
  const [customTime, setCustomTime] = useState(25);
  const [volume, setVolume] = useState(50);
  const [time, setTime] = useState(customTime * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      setIsRunning(false);
      // Add any additional logic for when the timer reaches 0, such as playing a sound
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, time]);

  const setTimerDuration = (mode: string) => {
    switch (mode) {
      case "pomodoro":
        setTime(25 * 60);
        break;
      case "shortBreak":
        setTime(5 * 60);
        break;
      case "longBreak":
        setTime(15 * 60);
        break;
      case "custom":
        setTime(customTime * 60);
        break;
      default:
        setTime(25 * 60);
    }
    setTimerMode(mode);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setTimerDuration(timerMode);
    setIsRunning(false);
  };

  return (
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
  );
};

export default Timer;

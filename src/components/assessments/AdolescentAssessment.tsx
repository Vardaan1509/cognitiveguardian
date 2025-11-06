import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Target } from "lucide-react";

interface Props {
  onBack: () => void;
}

const AdolescentAssessment = ({ onBack }: Props) => {
  const [currentTask, setCurrentTask] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);

  const tasks = [
    {
      type: "pattern",
      question: "Complete the pattern: 2, 4, 8, 16, __",
      options: ["24", "32", "28", "30"],
      correct: 1,
    },
    {
      type: "logic",
      question: "If all Bloops are Razzies and all Razzies are Lazzies, are all Bloops definitely Lazzies?",
      options: ["Yes", "No", "Sometimes", "Cannot determine"],
      correct: 0,
    },
    {
      type: "memory",
      question: "Study this sequence for 5 seconds: Red, Blue, Green, Yellow, Purple. What was the 4th color?",
      options: ["Green", "Yellow", "Purple", "Blue"],
      correct: 1,
    },
  ];

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    if (index === tasks[currentTask].correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      setSelectedAnswer(null);
      if (currentTask < tasks.length - 1) {
        setCurrentTask(currentTask + 1);
      } else {
        setCompleted(true);
      }
    }, 1000);
  };

  const progress = ((currentTask + 1) / tasks.length) * 100;

  if (completed) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center mx-auto mb-6">
            <Target className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold mb-4 text-foreground">Assessment Complete!</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Score: {score} / {tasks.length} ({Math.round((score / tasks.length) * 100)}%)
          </p>
          <Button onClick={onBack} size="lg">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Age Selection
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Button onClick={onBack} variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back
        </Button>

        <Card className="p-8 border-border">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-card-foreground">
                Task {currentTask + 1} of {tasks.length}
              </h3>
              <span className="text-sm px-3 py-1 bg-primary/10 text-primary rounded-full font-medium">
                {tasks[currentTask].type}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <h2 className="text-2xl font-bold mb-8 text-card-foreground">
            {tasks[currentTask].question}
          </h2>

          <div className="grid gap-4">
            {tasks[currentTask].options.map((option, index) => (
              <Button
                key={index}
                onClick={() => handleAnswer(index)}
                size="lg"
                variant={selectedAnswer === index ? (index === tasks[currentTask].correct ? "default" : "destructive") : "outline"}
                disabled={selectedAnswer !== null}
                className="justify-start text-left h-auto py-4 transition-all"
              >
                {option}
              </Button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdolescentAssessment;

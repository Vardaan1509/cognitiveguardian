import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Heart, Check, X } from "lucide-react";

interface Props {
  onBack: () => void;
}

const ElderlyAssessment = ({ onBack }: Props) => {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [completed, setCompleted] = useState(false);

  const exercises = [
    {
      type: "Memory",
      question: "Please remember these three words: Apple, Table, Penny. We'll ask you to recall them later.",
      isRecall: false,
      nextStep: "Continue",
    },
    {
      type: "Attention",
      question: "What day of the week is it today?",
      options: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      isMultiChoice: true,
    },
    {
      type: "Memory Recall",
      question: "Can you recall the three words from earlier?",
      hint: "The words were: Apple, Table, Penny",
      options: ["Apple, Table, Penny", "Apple, Chair, Penny", "Orange, Table, Penny", "Apple, Table, Dime"],
      isMultiChoice: true,
      correct: 0,
    },
    {
      type: "Mobility",
      question: "Please stand up from your chair, walk a few steps forward, turn around, walk back, and sit down.",
      instruction: "Rate how easily you completed this task:",
      options: ["Very Easy", "Easy", "Moderate", "Difficult", "Very Difficult"],
      isMultiChoice: true,
    },
  ];

  const handleMultiChoice = (index: number) => {
    const current = exercises[currentExercise];
    if (current.correct !== undefined && index === current.correct) {
      setScore(score + 1);
    }
    handleNext();
  };

  const handleNext = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
    } else {
      setCompleted(true);
    }
  };

  const progress = ((currentExercise + 1) / exercises.length) * 100;

  if (completed) {
    const performancePercent = Math.round((score / exercises.length) * 100);
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-secondary-foreground" />
          </div>
          <h2 className="text-4xl font-bold mb-4 text-foreground">Assessment Complete</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Thank you for completing the exercises. Your results have been recorded.
          </p>
          <Card className="p-6 mb-8 border-border">
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium text-card-foreground">Performance Score:</span>
              <span className="text-3xl font-bold text-secondary">{performancePercent}%</span>
            </div>
          </Card>
          <Button onClick={onBack} size="lg">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Age Selection
          </Button>
        </div>
      </div>
    );
  }

  const current = exercises[currentExercise];

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
                Exercise {currentExercise + 1} of {exercises.length}
              </h3>
              <span className="text-sm px-3 py-1 bg-secondary/10 text-secondary rounded-full font-medium">
                {current.type}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-card-foreground leading-relaxed">
              {current.question}
            </h2>

            {current.hint && (
              <p className="text-muted-foreground mb-6 text-lg">{current.hint}</p>
            )}

            {current.instruction && (
              <p className="text-muted-foreground mb-6 text-lg">{current.instruction}</p>
            )}

            {current.isMultiChoice ? (
              <div className="grid gap-3">
                {current.options?.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleMultiChoice(index)}
                    size="lg"
                    variant="outline"
                    className="justify-start text-left h-auto py-4 text-lg"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            ) : (
              <div className="flex gap-4 justify-center">
                <Button onClick={handleNext} size="lg" className="px-8">
                  {current.nextStep || "Continue"}
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ElderlyAssessment;

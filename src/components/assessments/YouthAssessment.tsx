import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Star, Sparkles } from "lucide-react";

interface Props {
  onBack: () => void;
}

const YouthAssessment = ({ onBack }: Props) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const questions = [
    {
      question: "Which color is the sky?",
      options: ["Red", "Blue", "Green", "Yellow"],
      correct: 1,
      emoji: "🌤️",
    },
    {
      question: "Count the stars! ⭐⭐⭐",
      options: ["2", "3", "4", "5"],
      correct: 1,
      emoji: "⭐",
    },
    {
      question: "Which animal says 'Moo'?",
      options: ["Dog", "Cow", "Cat", "Bird"],
      correct: 1,
      emoji: "🐮",
    },
  ];

  const handleAnswer = (index: number) => {
    if (index === questions[currentQuestion].correct) {
      setScore(score + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setCompleted(true);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (completed) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-4xl font-bold mb-4 text-foreground">Great Job! 🎉</h2>
            <p className="text-xl text-muted-foreground mb-6">
              You got {score} out of {questions.length} correct!
            </p>
            <div className="flex items-center justify-center gap-2 mb-8">
              {Array.from({ length: questions.length }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-8 h-8 ${
                    i < score ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
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

        <Card className="p-8 border-2 border-primary/20">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-card-foreground">
                Question {currentQuestion + 1} of {questions.length}
              </h3>
              <span className="text-4xl">{questions[currentQuestion].emoji}</span>
            </div>
            <Progress value={progress} className="mb-4 h-3" />
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-center mb-8 text-card-foreground">
              {questions[currentQuestion].question}
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {questions[currentQuestion].options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  size="lg"
                  variant="outline"
                  className="h-24 text-xl font-semibold hover:scale-105 transition-transform border-2 hover:border-primary"
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default YouthAssessment;

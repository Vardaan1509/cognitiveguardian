import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Briefcase, Timer } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PatientInfoForm from "./PatientInfoForm";

interface Props {
  onBack: () => void;
}

const AdultAssessment = ({ onBack }: Props) => {
  const [patientName, setPatientName] = useState<string | null>(null);
  const [patientAge, setPatientAge] = useState<number | null>(null);
  const [patientId, setPatientId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const { toast } = useToast();

  const allQuestions = [
    {
      type: "Math",
      question: "Which of the following is a prime number?",
      options: ["21", "29", "30", "35"],
      correct: 1,
    },
    {
      type: "Math",
      question: "If a train travels 60 miles in 1 hour and 30 minutes, what is its average speed?",
      options: ["40 mph", "45 mph", "50 mph", "55 mph"],
      correct: 0,
    },
    {
      type: "Pattern",
      question: "What is the next number in this sequence? 3, 6, 12, 24, ...",
      options: ["36", "48", "54", "60"],
      correct: 1,
    },
    {
      type: "Practical",
      question: "Which item would you use to cut paper?",
      options: ["Scissors", "Spoon", "Fork", "Hammer"],
      correct: 0,
    },
    {
      type: "Safety",
      question: "If you hear a fire alarm, what should you do?",
      options: ["Ignore it", "Evacuate calmly", "Continue working", "Call a friend"],
      correct: 1,
    },
    {
      type: "Knowledge",
      question: "What is the main purpose of a doctor?",
      options: ["Sell medicine", "Help people stay healthy", "Drive ambulances", "Cook food"],
      correct: 1,
    },
    {
      type: "Direction",
      question: "In which direction does this arrow point? ➡️",
      options: ["Up", "Down", "Left", "Right"],
      correct: 3,
    },
    {
      type: "Direction",
      question: "In which direction does this arrow point? ⬆️",
      options: ["Up", "Down", "Left", "Right"],
      correct: 0,
    },
    {
      type: "Direction",
      question: "What direction is OPPOSITE to where this arrow points? ⬇️",
      options: ["Up", "Down", "Left", "Right"],
      correct: 0,
    },
    {
      type: "Direction",
      question: "What direction is OPPOSITE to where this arrow points? ⬅️",
      options: ["Up", "Down", "Left", "Right"],
      correct: 3,
    },
    {
      type: "Counting",
      question: "Count the number of X's in this text: P X Q R X S T X U V X W",
      options: ["3", "4", "5", "6"],
      correct: 1,
    },
    {
      type: "Counting",
      question: "Count the number of X's in this text: X A X B C X D X E F X",
      options: ["4", "5", "6", "7"],
      correct: 1,
    },
    {
      type: "Memory",
      question: "Study these 5 words: CHAIR, WINDOW, COFFEE, LAPTOP, GARDEN. Which word was in the middle (3rd)?",
      options: ["CHAIR", "WINDOW", "COFFEE", "LAPTOP"],
      correct: 2,
    },
    {
      type: "Memory",
      question: "Study these 5 words: RIVER, BRIDGE, MOUNTAIN, VALLEY, FOREST. Which word was first?",
      options: ["RIVER", "BRIDGE", "MOUNTAIN", "VALLEY"],
      correct: 0,
    },
    {
      type: "Categorization",
      question: "Which item doesn't belong in this group: Hammer, Screwdriver, Wrench, Apple",
      options: ["Hammer", "Screwdriver", "Wrench", "Apple"],
      correct: 3,
    },
    {
      type: "Categorization",
      question: "Which item doesn't belong in this group: Soccer, Basketball, Tennis, Microscope",
      options: ["Soccer", "Basketball", "Tennis", "Microscope"],
      correct: 3,
    },
    {
      type: "Stroop",
      question: "What COLOR is this text written in? (Ignore the word itself):",
      coloredWord: "BLUE",
      textColor: "#ef4444",
      options: ["Red", "Blue", "Green", "Yellow"],
      correct: 0,
    },
    {
      type: "Stroop",
      question: "What COLOR is this text written in? (Ignore the word itself):",
      coloredWord: "GREEN",
      textColor: "#eab308",
      options: ["Red", "Blue", "Green", "Yellow"],
      correct: 3,
    },
    {
      type: "Orientation",
      question: "What month is it currently?",
      options: ["January", "March", "November", "Check your calendar"],
      correct: 3,
    },
    {
      type: "Orientation",
      question: "What year are we in?",
      options: ["2023", "2024", "2025", "2026"],
      correct: 2,
    },
    {
      type: "Orientation",
      question: "What day of the week is it today?",
      options: ["Monday", "It varies", "Friday", "Sunday"],
      correct: 1,
    },
    {
      type: "Logic",
      question: "If the day before yesterday was Monday, what day is today?",
      options: ["Tuesday", "Wednesday", "Thursday", "Friday"],
      correct: 1,
    },
    {
      type: "Logic",
      question: "If tomorrow will be Saturday, what day was the day before yesterday?",
      options: ["Tuesday", "Wednesday", "Thursday", "Friday"],
      correct: 1,
    },
  ];

  const [questions] = useState(() => {
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
  });

  useEffect(() => {
    if (completed || !patientName || selectedAnswer !== null) return;

    setTimeLeft(15);
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          toast({
            title: "Time's up! ⏰",
            description: "You've got to be faster!",
            variant: "destructive",
            duration: 2000,
          });
          
          setTimeout(() => {
            if (currentQuestion < questions.length - 1) {
              setCurrentQuestion(currentQuestion + 1);
            } else {
              setCompleted(true);
              setTimeout(() => saveAssessmentResults(score), 500);
            }
          }, 1500);
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestion, completed, patientName, selectedAnswer]);

  const handlePatientInfoSubmit = async (name: string, age: number) => {
    try {
      const { data, error } = await supabase
        .from("patients")
        .insert({ name, age })
        .select()
        .single();

      if (error) throw error;

      setPatientName(name);
      setPatientAge(age);
      setPatientId(data.id);
    } catch (error) {
      console.error("Error saving patient info:", error);
      toast({
        title: "Error",
        description: "Failed to save patient information. Please try again.",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const saveAssessmentResults = async (finalScore: number) => {
    if (!patientId) return;

    setSaving(true);
    try {
      const percentage = (finalScore / questions.length) * 100;
      
      const { error } = await supabase.from("assessment_results").insert({
        patient_id: patientId,
        assessment_type: "adult",
        score: finalScore,
        total_questions: questions.length,
        percentage,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Assessment results saved successfully!",
        duration: 2000,
      });
    } catch (error) {
      console.error("Error saving results:", error);
      toast({
        title: "Error",
        description: "Failed to save assessment results.",
        variant: "destructive",
        duration: 2000,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    const isCorrect = index === questions[currentQuestion].correct;
    const newScore = isCorrect ? score + 1 : score;
    if (isCorrect) {
      setScore(newScore);
    }

    setTimeout(() => {
      setSelectedAnswer(null);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setCompleted(true);
        setTimeout(() => saveAssessmentResults(newScore), 500);
      }
    }, 1000);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (!patientName || !patientAge) {
    return (
      <PatientInfoForm
        onSubmit={handlePatientInfoSubmit}
        ageGroup="adult"
      />
    );
  }

  if (completed) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mx-auto mb-6">
            <Briefcase className="w-10 h-10 text-primary-foreground" />
          </div>
          <h2 className="text-4xl font-bold mb-4 text-foreground">Assessment Complete, {patientName}</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Score: {score} / {questions.length} ({Math.round((score / questions.length) * 100)}%)
          </p>
          {saving && (
            <p className="text-sm text-muted-foreground mb-4">
              Saving results...
            </p>
          )}
          <Button onClick={onBack} size="lg">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Age Selection
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 animate-in fade-in duration-500">
      <div className="max-w-3xl mx-auto">
        <Button onClick={onBack} variant="ghost" className="mb-6 hover:scale-105 transition-transform">
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back
        </Button>

        <Card className="p-8 border-border shadow-lg backdrop-blur-sm bg-card/95 animate-in slide-in-from-bottom duration-500">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-card-foreground">
                Question {currentQuestion + 1} of {questions.length}
              </h3>
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                  timeLeft <= 5 ? 'bg-destructive/10 text-destructive animate-pulse' : 'bg-primary/10 text-primary'
                }`}>
                  <Timer className="w-4 h-4" />
                  <span className="text-lg font-bold">{timeLeft}s</span>
                </div>
                <span className="text-sm px-4 py-2 bg-primary/10 text-primary rounded-full font-medium animate-in zoom-in duration-300">
                  {questions[currentQuestion].type}
                </span>
              </div>
            </div>
            <Progress value={progress} className="h-2 transition-all duration-500" />
          </div>

          <h2 className="text-2xl font-bold mb-8 text-card-foreground animate-in slide-in-from-top duration-500">
            {questions[currentQuestion].question}
            {questions[currentQuestion].coloredWord && (
              <span className="ml-3 text-4xl font-extrabold" style={{ color: questions[currentQuestion].textColor }}>
                {questions[currentQuestion].coloredWord}
              </span>
            )}
          </h2>

          <div className="grid gap-4">
            {questions[currentQuestion].options.map((option, index) => (
              <Button
                key={index}
                onClick={() => handleAnswer(index)}
                size="lg"
                variant={selectedAnswer === index ? (index === questions[currentQuestion].correct ? "default" : "destructive") : "outline"}
                disabled={selectedAnswer !== null}
                className="justify-start text-left h-auto py-5 hover:scale-[1.02] active:scale-95 transition-all duration-200 hover:shadow-md animate-in slide-in-from-bottom"
                style={{ animationDelay: `${index * 50}ms` }}
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

export default AdultAssessment;

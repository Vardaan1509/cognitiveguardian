import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Target, Timer } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PatientInfoForm from "./PatientInfoForm";

interface Props {
  onBack: () => void;
}

const AdolescentAssessment = ({ onBack }: Props) => {
  const [patientName, setPatientName] = useState<string | null>(null);
  const [patientAge, setPatientAge] = useState<number | null>(null);
  const [patientId, setPatientId] = useState<string | null>(null);
  const [currentTask, setCurrentTask] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const { toast } = useToast();

  const allTasks = [
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
    {
      type: "reasoning",
      question: "What season follows autumn?",
      options: ["Summer", "Winter", "Spring", "Fall again"],
      correct: 1,
    },
    {
      type: "math",
      question: "If Sarah has 8 candies and gives away 3, how many does she have left?",
      options: ["5", "8", "11", "3"],
      correct: 0,
    },
    {
      type: "language",
      question: "Which one of these is a verb?",
      options: ["Happiness", "Running", "Tree", "Blue"],
      correct: 1,
    },
    {
      type: "health",
      question: "Which one of these is a healthy habit?",
      options: ["Eating sweets all day", "Exercising regularly", "Sleeping only 2 hours", "Never drinking water"],
      correct: 1,
    },
    {
      type: "logic",
      question: "What does it mean if the traffic light turns green?",
      options: ["Stop", "Go", "Slow down", "Turn off car"],
      correct: 1,
    },
    {
      type: "geography",
      question: "Which of these is a continent?",
      options: ["Amazon", "Africa", "Nile", "Pacific"],
      correct: 1,
    },
  ];

  const [tasks] = useState(() => {
    const shuffled = [...allTasks].sort(() => Math.random() - 0.5);
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
          });
          
          setTimeout(() => {
            if (currentTask < tasks.length - 1) {
              setCurrentTask(currentTask + 1);
            } else {
              setCompleted(true);
              setTimeout(() => saveAssessmentResults(), 500);
            }
          }, 1500);
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentTask, completed, patientName, selectedAnswer]);

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
      });
    }
  };

  const saveAssessmentResults = async () => {
    if (!patientId) return;

    setSaving(true);
    try {
      const percentage = (score / tasks.length) * 100;
      
      const { error } = await supabase.from("assessment_results").insert({
        patient_id: patientId,
        assessment_type: "adolescent",
        score,
        total_questions: tasks.length,
        percentage,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Assessment results saved successfully!",
      });
    } catch (error) {
      console.error("Error saving results:", error);
      toast({
        title: "Error",
        description: "Failed to save assessment results.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

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
        setTimeout(() => saveAssessmentResults(), 500);
      }
    }, 1000);
  };

  const progress = ((currentTask + 1) / tasks.length) * 100;

  if (!patientName || !patientAge) {
    return (
      <PatientInfoForm
        onSubmit={handlePatientInfoSubmit}
        ageGroup="adolescent"
      />
    );
  }

  if (completed) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center mx-auto mb-6">
            <Target className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold mb-4 text-foreground">Assessment Complete, {patientName}!</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Score: {score} / {tasks.length} ({Math.round((score / tasks.length) * 100)}%)
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
      <div className="max-w-2xl mx-auto">
        <Button onClick={onBack} variant="ghost" className="mb-6 hover:scale-105 transition-transform">
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back
        </Button>

        <Card className="p-8 border-border shadow-lg backdrop-blur-sm bg-card/95 animate-in slide-in-from-bottom duration-500">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-card-foreground">
                Task {currentTask + 1} of {tasks.length}
              </h3>
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                  timeLeft <= 5 ? 'bg-destructive/10 text-destructive animate-pulse' : 'bg-primary/10 text-primary'
                }`}>
                  <Timer className="w-4 h-4" />
                  <span className="text-lg font-bold">{timeLeft}s</span>
                </div>
                <span className="text-sm px-4 py-2 bg-primary/10 text-primary rounded-full font-medium animate-in zoom-in duration-300">
                  {tasks[currentTask].type}
                </span>
              </div>
            </div>
            <Progress value={progress} className="h-2 transition-all duration-500" />
          </div>

          <h2 className="text-2xl font-bold mb-8 text-card-foreground animate-in slide-in-from-top duration-500">
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

export default AdolescentAssessment;

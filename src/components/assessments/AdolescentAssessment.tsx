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
  const [timeLeft, setTimeLeft] = useState(20);
  const [categoryScores, setCategoryScores] = useState<Record<string, { correct: number; total: number }>>({});
  const { toast } = useToast();

  const allTasks = [
    {
      type: "pattern",
      difficulty: "medium",
      question: "Complete the pattern: 2, 4, 8, 16, __",
      options: ["24", "32", "28", "30"],
      correct: 1,
      timeLimit: 25,
    },
    {
      type: "logic",
      difficulty: "hard",
      question: "If all Bloops are Razzies and all Razzies are Lazzies, are all Bloops definitely Lazzies?",
      options: ["Yes", "No", "Sometimes", "Cannot determine"],
      correct: 0,
      timeLimit: 30,
    },
    {
      type: "memory",
      difficulty: "hard",
      question: "Study this sequence for 5 seconds: Red, Blue, Green, Yellow, Purple. What was the 4th color?",
      options: ["Green", "Yellow", "Purple", "Blue"],
      correct: 1,
      timeLimit: 25,
    },
    {
      type: "reasoning",
      difficulty: "easy",
      question: "What season follows autumn?",
      options: ["Summer", "Winter", "Spring", "Fall again"],
      correct: 1,
      timeLimit: 15,
    },
    {
      type: "math",
      difficulty: "easy",
      question: "If Sarah has 8 candies and gives away 3, how many does she have left?",
      options: ["5", "8", "11", "3"],
      correct: 0,
      timeLimit: 20,
    },
    {
      type: "language",
      difficulty: "medium",
      question: "Which one of these is a verb?",
      options: ["Happiness", "Running", "Tree", "Blue"],
      correct: 1,
      timeLimit: 20,
    },
    {
      type: "health",
      difficulty: "easy",
      question: "Which one of these is a healthy habit?",
      options: ["Eating sweets all day", "Exercising regularly", "Sleeping only 2 hours", "Never drinking water"],
      correct: 1,
      timeLimit: 15,
    },
    {
      type: "logic",
      difficulty: "easy",
      question: "What does it mean if the traffic light turns green?",
      options: ["Stop", "Go", "Slow down", "Turn off car"],
      correct: 1,
      timeLimit: 15,
    },
    {
      type: "geography",
      difficulty: "easy",
      question: "Which of these is a continent?",
      options: ["Amazon", "Africa", "Nile", "Pacific"],
      correct: 1,
      timeLimit: 15,
    },
    {
      type: "direction",
      difficulty: "easy",
      question: "Which direction does this arrow point? ➡️",
      options: ["Up", "Down", "Left", "Right"],
      correct: 3,
      timeLimit: 10,
    },
    {
      type: "direction",
      question: "Which direction does this arrow point? ⬆️",
      options: ["Up", "Down", "Left", "Right"],
      correct: 0,
    },
    {
      type: "direction",
      question: "Which direction is OPPOSITE to where this arrow points? ⬇️",
      options: ["Up", "Down", "Left", "Right"],
      correct: 0,
    },
    {
      type: "direction",
      question: "Which direction is OPPOSITE to where this arrow points? ⬅️",
      options: ["Up", "Down", "Left", "Right"],
      correct: 3,
    },
    {
      type: "counting",
      question: "Count the X's: A X B C X D E X F G X H",
      options: ["3", "4", "5", "6"],
      correct: 1,
    },
    {
      type: "counting",
      question: "Count the X's: X M N X O P Q X R X S T",
      options: ["3", "4", "5", "6"],
      correct: 1,
    },
    {
      type: "memory",
      question: "Remember these words: TREE, PHONE, BOOK, CLOUD, MUSIC. Which word was third?",
      options: ["TREE", "BOOK", "CLOUD", "MUSIC"],
      correct: 1,
    },
    {
      type: "memory",
      question: "Remember these words: OCEAN, RIVER, MOUNTAIN, DESERT, FOREST. Which word was first?",
      options: ["OCEAN", "RIVER", "MOUNTAIN", "FOREST"],
      correct: 0,
    },
    {
      type: "categorization",
      question: "Which item doesn't belong: Cat, Dog, Bird, Apple",
      options: ["Cat", "Dog", "Bird", "Apple"],
      correct: 3,
    },
    {
      type: "categorization",
      question: "Which item doesn't belong: Car, Bicycle, Train, Chair",
      options: ["Car", "Bicycle", "Train", "Chair"],
      correct: 3,
    },
    {
      type: "stroop",
      question: "What COLOR is this text written in? (Ignore what it says):",
      coloredWord: "BLUE",
      textColor: "#ef4444",
      options: ["Red", "Blue", "Green", "Yellow"],
      correct: 0,
    },
    {
      type: "stroop",
      question: "What COLOR is this text written in? (Ignore what it says):",
      coloredWord: "RED",
      textColor: "#3b82f6",
      options: ["Red", "Blue", "Green", "Yellow"],
      correct: 1,
    },
    {
      type: "orientation",
      question: "What month is it right now?",
      options: ["January", "March", "November", "Depends on when you take this"],
      correct: 3,
    },
    {
      type: "orientation",
      question: "What year is it?",
      options: ["2023", "2024", "2025", "2026"],
      correct: 2,
    },
    {
      type: "orientation",
      question: "What day of the week is today?",
      options: ["Monday", "Tuesday", "Depends on when you take this", "Friday"],
      correct: 2,
    },
    {
      type: "logic",
      question: "If the day before yesterday was Monday, what day is today?",
      options: ["Tuesday", "Wednesday", "Thursday", "Friday"],
      correct: 1,
    },
    {
      type: "logic",
      question: "If tomorrow is Friday, what day was yesterday?",
      options: ["Tuesday", "Wednesday", "Thursday", "Friday"],
      correct: 1,
    },
  ];

  const [tasks] = useState(() => {
    const categories = [...new Set(allTasks.map(t => t.type))];
    const selectedTasks = [];
    
    // Ensure diversity: pick at least one task from different categories
    const tasksPerCategory = Math.floor(5 / Math.min(categories.length, 5));
    
    for (let i = 0; i < categories.length && selectedTasks.length < 5; i++) {
      const categoryTasks = allTasks.filter(t => t.type === categories[i]);
      const shuffled = [...categoryTasks].sort(() => Math.random() - 0.5);
      selectedTasks.push(...shuffled.slice(0, tasksPerCategory || 1));
    }
    
    // If we still need more tasks, add random ones
    if (selectedTasks.length < 5) {
      const remaining = allTasks
        .filter(t => !selectedTasks.includes(t))
        .sort(() => Math.random() - 0.5);
      selectedTasks.push(...remaining.slice(0, 5 - selectedTasks.length));
    }
    
    return selectedTasks.sort(() => Math.random() - 0.5).slice(0, 5);
  });

  useEffect(() => {
    if (completed || !patientName || selectedAnswer !== null) return;

    const currentTimeLimit = tasks[currentTask]?.timeLimit || 20;
    setTimeLeft(currentTimeLimit);
    
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
        duration: 2000,
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
    const currentT = tasks[currentTask];
    const isCorrect = index === currentT.correct;
    
    if (isCorrect) {
      setScore(score + 1);
    }
    
    // Track category performance
    setCategoryScores(prev => ({
      ...prev,
      [currentT.type]: {
        correct: (prev[currentT.type]?.correct || 0) + (isCorrect ? 1 : 0),
        total: (prev[currentT.type]?.total || 0) + 1
      }
    }));

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
        <div className="max-w-3xl mx-auto">
          <Card className="p-8 border-border shadow-lg">
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center mx-auto mb-6">
                <Target className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl font-bold mb-4 text-foreground">Assessment Complete, {patientName}!</h2>
              <p className="text-xl text-muted-foreground mb-2">
                Overall Score: {score} / {tasks.length}
              </p>
              <p className="text-3xl font-bold text-primary mb-6">
                {Math.round((score / tasks.length) * 100)}%
              </p>
            </div>

            {Object.keys(categoryScores).length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-foreground">Performance by Category</h3>
                <div className="grid gap-3">
                  {Object.entries(categoryScores).map(([category, scores]) => {
                    const percentage = Math.round((scores.correct / scores.total) * 100);
                    return (
                      <div key={category} className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                        <div className="flex-1">
                          <div className="flex justify-between mb-2">
                            <span className="font-medium text-foreground capitalize">{category}</span>
                            <span className="text-sm text-muted-foreground">
                              {scores.correct}/{scores.total}
                            </span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                        <span className={`text-lg font-bold ${percentage >= 70 ? 'text-primary' : 'text-muted-foreground'}`}>
                          {percentage}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {saving && (
              <p className="text-sm text-muted-foreground mb-4 text-center">
                Saving results...
              </p>
            )}
            
            <div className="text-center">
              <Button onClick={onBack} size="lg">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back to Age Selection
              </Button>
            </div>
          </Card>
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
            {tasks[currentTask].coloredWord && (
              <span className="ml-3 text-4xl font-extrabold" style={{ color: tasks[currentTask].textColor }}>
                {tasks[currentTask].coloredWord}
              </span>
            )}
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

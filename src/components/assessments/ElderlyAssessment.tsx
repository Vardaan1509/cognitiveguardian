import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Heart, Timer } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PatientInfoForm from "./PatientInfoForm";

interface Props {
  onBack: () => void;
}

const ElderlyAssessment = ({ onBack }: Props) => {
  const [patientName, setPatientName] = useState<string | null>(null);
  const [patientAge, setPatientAge] = useState<number | null>(null);
  const [patientId, setPatientId] = useState<string | null>(null);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [textResponse, setTextResponse] = useState("");
  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [categoryScores, setCategoryScores] = useState<Record<string, { correct: number; total: number }>>({});
  const { toast } = useToast();

  const allExercises = [
    {
      type: "Memory Introduction",
      difficulty: "easy",
      question: "Please remember these three words: Apple, Table, Car. We'll ask you to recall them later.",
      isMemoryIntro: true,
      timeLimit: 20,
    },
    {
      type: "Orientation",
      question: "What season comes after spring?",
      options: ["Summer", "Winter", "Autumn", "Spring again"],
      correct: 0,
      isMultiChoice: true,
    },
    {
      type: "Memory Recall",
      question: "Can you remember and repeat these three words from earlier?",
      options: ["Apple, Table, Car", "Apple, Chair, Car", "Orange, Table, Car", "Apple, Table, Cart"],
      correct: 0,
      isMultiChoice: true,
    },
    {
      type: "Personal Memory",
      question: "What city or town were you born in?",
      isOpenEnded: true,
    },
    {
      type: "Personal Memory",
      question: "Can you name any of your grandchildren or family members?",
      isOpenEnded: true,
    },
    {
      type: "Recent Memory",
      question: "Recall what you had for breakfast today.",
      isOpenEnded: true,
    },
    {
      type: "Personal History",
      question: "What was the name of your first school or workplace?",
      isOpenEnded: true,
    },
    {
      type: "Mobility",
      question: "Please stand up from your chair, walk a few steps forward, turn around, walk back, and sit down. Rate how easily you completed this task:",
      options: ["Very Easy", "Easy", "Moderate", "Difficult", "Very Difficult"],
      isMultiChoice: true,
    },
    {
      type: "Direction",
      question: "Which direction does this arrow point? ➡️",
      options: ["Up", "Down", "Left", "Right"],
      correct: 3,
      isMultiChoice: true,
    },
    {
      type: "Direction",
      question: "Which direction does this arrow point? ⬆️",
      options: ["Up", "Down", "Left", "Right"],
      correct: 0,
      isMultiChoice: true,
    },
    {
      type: "Direction",
      question: "What is the OPPOSITE direction to where this arrow points? ⬇️",
      options: ["Up", "Down", "Left", "Right"],
      correct: 0,
      isMultiChoice: true,
    },
    {
      type: "Direction",
      question: "What is the OPPOSITE direction to where this arrow points? ⬅️",
      options: ["Up", "Down", "Left", "Right"],
      correct: 3,
      isMultiChoice: true,
    },
    {
      type: "Counting",
      question: "Count how many X's appear here: M X N O X P Q X R",
      options: ["2", "3", "4", "5"],
      correct: 1,
      isMultiChoice: true,
    },
    {
      type: "Counting",
      question: "Count how many X's appear here: X A B X C X D E X",
      options: ["3", "4", "5", "6"],
      correct: 1,
      isMultiChoice: true,
    },
    {
      type: "Word Memory",
      question: "Remember these 5 words: BOOK, CHAIR, WATER, FLOWER, MUSIC. Which word was in position 3?",
      options: ["BOOK", "CHAIR", "WATER", "FLOWER"],
      correct: 2,
      isMultiChoice: true,
    },
    {
      type: "Word Memory",
      question: "Remember these 5 words: TREE, HOUSE, PHONE, CLOCK, BREAD. Which word came first?",
      options: ["TREE", "HOUSE", "PHONE", "CLOCK"],
      correct: 0,
      isMultiChoice: true,
    },
    {
      type: "Categorization",
      question: "Which item doesn't belong with the others: Rose, Tulip, Daisy, Hammer",
      options: ["Rose", "Tulip", "Daisy", "Hammer"],
      correct: 3,
      isMultiChoice: true,
    },
    {
      type: "Categorization",
      question: "Which item doesn't belong with the others: Shirt, Pants, Shoes, Television",
      options: ["Shirt", "Pants", "Shoes", "Television"],
      correct: 3,
      isMultiChoice: true,
    },
    {
      type: "Color Recognition",
      question: "What COLOR is this word written in? (Don't read the word):",
      coloredWord: "BLUE",
      textColor: "#ef4444",
      options: ["Red", "Blue", "Green", "Yellow"],
      correct: 0,
      isMultiChoice: true,
    },
    {
      type: "Color Recognition",
      question: "What COLOR is this word written in? (Don't read the word):",
      coloredWord: "GREEN",
      textColor: "#3b82f6",
      options: ["Red", "Blue", "Green", "Yellow"],
      correct: 1,
      isMultiChoice: true,
    },
    {
      type: "Orientation",
      question: "What month is it right now?",
      options: ["January", "March", "Please check the calendar", "December"],
      correct: 2,
      isMultiChoice: true,
    },
    {
      type: "Orientation",
      question: "What year are we in currently?",
      options: ["2023", "2024", "2025", "2026"],
      correct: 2,
      isMultiChoice: true,
    },
    {
      type: "Orientation",
      question: "What day of the week is today?",
      options: ["Monday", "Check your calendar", "Friday", "Sunday"],
      correct: 1,
      isMultiChoice: true,
    },
    {
      type: "Logic",
      question: "If the day before yesterday was Monday, what day is today?",
      options: ["Tuesday", "Wednesday", "Thursday", "Friday"],
      correct: 1,
      isMultiChoice: true,
    },
    {
      type: "Logic",
      question: "If yesterday was Thursday, what day will tomorrow be?",
      options: ["Thursday", "Friday", "Saturday", "Sunday"],
      correct: 2,
      isMultiChoice: true,
    },
  ];

  const [exercises] = useState(() => {
    const categories = [...new Set(allExercises.map(e => e.type))];
    const selectedExercises = [];
    
    // Ensure diversity: pick exercises from different categories
    const exercisesPerCategory = Math.floor(5 / Math.min(categories.length, 5));
    
    for (let i = 0; i < categories.length && selectedExercises.length < 5; i++) {
      const categoryExercises = allExercises.filter(e => e.type === categories[i]);
      const shuffled = [...categoryExercises].sort(() => Math.random() - 0.5);
      selectedExercises.push(...shuffled.slice(0, exercisesPerCategory || 1));
    }
    
    // If we still need more exercises, add random ones
    if (selectedExercises.length < 5) {
      const remaining = allExercises
        .filter(e => !selectedExercises.includes(e))
        .sort(() => Math.random() - 0.5);
      selectedExercises.push(...remaining.slice(0, 5 - selectedExercises.length));
    }
    
    const shuffled = selectedExercises.sort(() => Math.random() - 0.5).slice(0, 5);
    return shuffled.slice(0, 5);
  });

  useEffect(() => {
    if (completed || !patientName || selectedAnswer !== null) return;

    const current = exercises[currentExercise];
    if (current.isMemoryIntro) return;

    setTimeLeft(15);
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          toast({
            title: "Time's up! ⏰",
            description: "You ran out of time!",
            variant: "destructive",
            duration: 2000,
          });
          
          setTimeout(() => {
            handleNext();
          }, 1500);
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentExercise, completed, patientName, selectedAnswer]);

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
      const percentage = (score / exercises.length) * 100;
      
      const { error } = await supabase.from("assessment_results").insert({
        patient_id: patientId,
        assessment_type: "elderly",
        score,
        total_questions: exercises.length,
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

  const handleMultiChoice = (index: number) => {
    setSelectedAnswer(index);
    const current = exercises[currentExercise];
    if (current.correct !== undefined && index === current.correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      setSelectedAnswer(null);
      handleNext();
    }, 1000);
  };

  const handleOpenEnded = () => {
    if (textResponse.trim()) {
      setScore(score + 1);
    }
    setTextResponse("");
    handleNext();
  };

  const handleNext = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
    } else {
      setCompleted(true);
      setTimeout(() => saveAssessmentResults(), 500);
    }
  };

  const progress = ((currentExercise + 1) / exercises.length) * 100;

  if (!patientName || !patientAge) {
    return (
      <PatientInfoForm
        onSubmit={handlePatientInfoSubmit}
        ageGroup="elderly"
      />
    );
  }

  if (completed) {
    const performancePercent = Math.round((score / exercises.length) * 100);
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-secondary-foreground" />
          </div>
          <h2 className="text-4xl font-bold mb-4 text-foreground">Assessment Complete, {patientName}</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Thank you for completing the exercises. Your results have been recorded.
          </p>
          {saving && (
            <p className="text-sm text-muted-foreground mb-4">
              Saving results...
            </p>
          )}
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
                Exercise {currentExercise + 1} of {exercises.length}
              </h3>
              <div className="flex items-center gap-3">
                {!current.isMemoryIntro && (
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                    timeLeft <= 5 ? 'bg-destructive/10 text-destructive animate-pulse' : 'bg-secondary/10 text-secondary'
                  }`}>
                    <Timer className="w-4 h-4" />
                    <span className="text-lg font-bold">{timeLeft}s</span>
                  </div>
                )}
                <span className="text-sm px-4 py-2 bg-secondary/10 text-secondary rounded-full font-medium animate-in zoom-in duration-300">
                  {current.type}
                </span>
              </div>
            </div>
            <Progress value={progress} className="h-2 transition-all duration-500" />
          </div>

          <div className="mb-8">
          <h2 className="text-2xl font-bold mb-8 text-card-foreground animate-in slide-in-from-top duration-500">
            {current.question}
            {current.coloredWord && (
              <span className="ml-3 text-4xl font-extrabold" style={{ color: current.textColor }}>
                {current.coloredWord}
              </span>
            )}
          </h2>

          {current.isMemoryIntro && (
            <div className="space-y-6 animate-in zoom-in duration-500">
              <p className="text-lg text-muted-foreground text-center p-8 bg-secondary/5 rounded-lg border border-secondary/10">
                Please take a moment to remember these words.
              </p>
              <Button onClick={handleNext} size="lg" className="w-full hover:scale-[1.02] active:scale-95 transition-all">
                Continue
              </Button>
            </div>
          )}

          {current.isMultiChoice && (
            <div className="grid gap-4">
              {current.options?.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleMultiChoice(index)}
                  size="lg"
                  variant={
                    selectedAnswer === index
                      ? index === current.correct
                        ? "default"
                        : "destructive"
                      : "outline"
                  }
                  disabled={selectedAnswer !== null}
                  className="justify-start text-left h-auto py-5 hover:scale-[1.02] active:scale-95 transition-all duration-200 hover:shadow-md animate-in slide-in-from-bottom"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {option}
                </Button>
              ))}
            </div>
          )}

          {current.isOpenEnded && (
            <div className="space-y-4 animate-in zoom-in duration-500">
              <Textarea
                value={textResponse}
                onChange={(e) => setTextResponse(e.target.value)}
                placeholder="Type your answer here..."
                className="min-h-[120px] transition-all duration-200 focus:shadow-md"
              />
              <Button
                onClick={handleOpenEnded}
                size="lg"
                className="w-full hover:scale-[1.02] active:scale-95 transition-all"
                disabled={!textResponse.trim()}
              >
                Continue
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

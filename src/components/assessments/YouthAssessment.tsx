import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Star, Sparkles, Timer } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PatientInfoForm from "./PatientInfoForm";

interface Props {
  onBack: () => void;
}

const YouthAssessment = ({ onBack }: Props) => {
  const [patientName, setPatientName] = useState<string | null>(null);
  const [patientAge, setPatientAge] = useState<number | null>(null);
  const [patientId, setPatientId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [answering, setAnswering] = useState(false);
  const [categoryScores, setCategoryScores] = useState<Record<string, { correct: number; total: number }>>({});
  const { toast } = useToast();

  const allQuestions = [
    {
      type: "Knowledge",
      difficulty: "easy",
      question: "Which color is the sky?",
      options: ["Red", "Blue", "Green", "Yellow"],
      correct: 1,
      emoji: "🌤️",
      timeLimit: 15,
    },
    {
      type: "Counting",
      difficulty: "easy",
      question: "Count the stars! ⭐⭐⭐",
      options: ["2", "3", "4", "5"],
      correct: 1,
      emoji: "⭐",
      timeLimit: 15,
    },
    {
      type: "Knowledge",
      difficulty: "easy",
      question: "Which animal says 'Moo'?",
      options: ["Dog", "Cow", "Cat", "Bird"],
      correct: 1,
      emoji: "🐮",
      timeLimit: 12,
    },
    {
      type: "Knowledge",
      difficulty: "easy",
      question: "What day of the week comes after Tuesday?",
      options: ["Monday", "Wednesday", "Friday", "Sunday"],
      correct: 1,
      emoji: "📅",
      timeLimit: 15,
    },
    {
      type: "Knowledge",
      difficulty: "easy",
      question: "Which of these is NOT a fruit?",
      options: ["Banana", "Carrot", "Orange", "Grape"],
      correct: 1,
      emoji: "🥕",
      timeLimit: 12,
    },
    {
      type: "Knowledge",
      difficulty: "easy",
      question: "How many legs do most insects have?",
      options: ["Four", "Six", "Eight", "Ten"],
      correct: 1,
      emoji: "🐛",
      timeLimit: 15,
    },
    {
      type: "Knowledge",
      difficulty: "easy",
      question: "What is the color of grass?",
      options: ["Blue", "Green", "Red", "Yellow"],
      correct: 1,
      emoji: "🌱",
      timeLimit: 10,
    },
    {
      type: "Knowledge",
      difficulty: "easy",
      question: "Which animal is known as 'man's best friend'?",
      options: ["Cat", "Dog", "Bird", "Fish"],
      correct: 1,
      emoji: "🐕",
      timeLimit: 12,
    },
    {
      type: "Knowledge",
      difficulty: "easy",
      question: "What do plants need to grow?",
      options: ["Sunlight and water", "Sugar and salt", "Sand and toys", "Cold and dark"],
      correct: 0,
      emoji: "🌻",
      timeLimit: 15,
    },
    {
      type: "Direction",
      difficulty: "easy",
      question: "Which way is the arrow pointing? ➡️",
      options: ["Up", "Down", "Left", "Right"],
      correct: 3,
      emoji: "➡️",
      timeLimit: 10,
    },
    {
      type: "Direction",
      difficulty: "easy",
      question: "Which way is the arrow pointing? ⬆️",
      options: ["Up", "Down", "Left", "Right"],
      correct: 0,
      emoji: "⬆️",
      timeLimit: 10,
    },
    {
      type: "Direction",
      difficulty: "medium",
      question: "Which way is OPPOSITE to the arrow? ⬇️",
      options: ["Up", "Down", "Left", "Right"],
      correct: 0,
      emoji: "🔄",
      timeLimit: 15,
    },
    {
      type: "Counting",
      difficulty: "medium",
      question: "Count the X's: X B X D X F",
      options: ["2", "3", "4", "5"],
      correct: 1,
      emoji: "🔢",
      timeLimit: 20,
    },
    {
      type: "Counting",
      difficulty: "medium",
      question: "Count the X's: A X C X E X G X",
      options: ["3", "4", "5", "6"],
      correct: 1,
      emoji: "🔢",
      timeLimit: 20,
    },
    {
      type: "Memory",
      difficulty: "hard",
      question: "Remember: CAT, DOG, FISH, BIRD, BEAR. Which was third?",
      options: ["CAT", "DOG", "FISH", "BIRD"],
      correct: 2,
      emoji: "🧠",
      timeLimit: 25,
    },
    {
      type: "Memory",
      difficulty: "medium",
      question: "Remember: SUN, MOON, STAR, CLOUD, RAIN. Which was first?",
      options: ["SUN", "MOON", "STAR", "CLOUD"],
      correct: 0,
      emoji: "🧠",
      timeLimit: 20,
    },
    {
      type: "Categorization",
      difficulty: "medium",
      question: "Which doesn't belong: Apple, Banana, Car, Orange?",
      options: ["Apple", "Banana", "Car", "Orange"],
      correct: 2,
      emoji: "🤔",
      timeLimit: 18,
    },
    {
      type: "Categorization",
      difficulty: "medium",
      question: "Which doesn't belong: Red, Blue, Happy, Green?",
      options: ["Red", "Blue", "Happy", "Green"],
      correct: 2,
      emoji: "🤔",
      timeLimit: 18,
    },
    {
      type: "Stroop",
      difficulty: "hard",
      question: "What COLOR is this word?",
      coloredWord: "RED",
      textColor: "#3b82f6",
      options: ["Red", "Blue", "Green", "Yellow"],
      correct: 1,
      emoji: "🎨",
      timeLimit: 15,
    },
    {
      type: "Stroop",
      difficulty: "hard",
      question: "What COLOR is this word?",
      coloredWord: "GREEN",
      textColor: "#ef4444",
      options: ["Red", "Blue", "Green", "Yellow"],
      correct: 0,
      emoji: "🎨",
      timeLimit: 15,
    },
    {
      type: "Orientation",
      difficulty: "easy",
      question: "What month is it right now?",
      options: ["Check the calendar!", "January", "December", "It changes!"],
      correct: 3,
      emoji: "📆",
      timeLimit: 15,
    },
    {
      type: "Orientation",
      difficulty: "easy",
      question: "What year is it?",
      options: ["2023", "2024", "2025", "2026"],
      correct: 2,
      emoji: "📆",
      timeLimit: 15,
    },
    {
      type: "Logic",
      difficulty: "medium",
      question: "If yesterday was Monday, what is today?",
      options: ["Sunday", "Monday", "Tuesday", "Wednesday"],
      correct: 2,
      emoji: "📅",
      timeLimit: 20,
    },
  ];

  const [questions] = useState(() => {
    const categories = [...new Set(allQuestions.filter(q => q.type).map(q => q.type))];
    const selectedQuestions = [];
    
    // Ensure diversity: pick at least one question from different categories
    const questionsPerCategory = Math.floor(5 / Math.min(categories.length, 5));
    
    for (let i = 0; i < categories.length && selectedQuestions.length < 5; i++) {
      const categoryQuestions = allQuestions.filter(q => q.type === categories[i]);
      const shuffled = [...categoryQuestions].sort(() => Math.random() - 0.5);
      selectedQuestions.push(...shuffled.slice(0, questionsPerCategory || 1));
    }
    
    // If we still need more questions, add random ones
    if (selectedQuestions.length < 5) {
      const remaining = allQuestions
        .filter(q => !selectedQuestions.includes(q))
        .sort(() => Math.random() - 0.5);
      selectedQuestions.push(...remaining.slice(0, 5 - selectedQuestions.length));
    }
    
    return selectedQuestions.sort(() => Math.random() - 0.5).slice(0, 5);
  });

  useEffect(() => {
    if (completed || !patientName || answering) return;

    const currentTimeLimit = questions[currentQuestion]?.timeLimit || 15;
    setTimeLeft(currentTimeLimit);
    
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
            if (currentQuestion < questions.length - 1) {
              setCurrentQuestion(currentQuestion + 1);
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
  }, [currentQuestion, completed, patientName, answering]);

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
      const percentage = (score / questions.length) * 100;
      
      const { error } = await supabase.from("assessment_results").insert({
        patient_id: patientId,
        assessment_type: "youth",
        score,
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
    setAnswering(true);
    const currentQ = questions[currentQuestion];
    const isCorrect = index === currentQ.correct;
    
    if (isCorrect) {
      setScore(score + 1);
    }
    
    // Track category performance
    if (currentQ.type) {
      setCategoryScores(prev => ({
        ...prev,
        [currentQ.type!]: {
          correct: (prev[currentQ.type!]?.correct || 0) + (isCorrect ? 1 : 0),
          total: (prev[currentQ.type!]?.total || 0) + 1
        }
      }));
    }

    setTimeout(() => {
      setAnswering(false);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setCompleted(true);
        setTimeout(() => saveAssessmentResults(), 500);
      }
    }, 500);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (!patientName || !patientAge) {
    return (
      <PatientInfoForm
        onSubmit={handlePatientInfoSubmit}
        ageGroup="youth"
      />
    );
  }

  if (completed) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Card className="p-8 border-border shadow-lg">
            <div className="text-center mb-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-4xl font-bold mb-4 text-foreground">Great Job, {patientName}! 🎉</h2>
              <p className="text-xl text-muted-foreground mb-2">
                You got {score} out of {questions.length} correct!
              </p>
              <p className="text-3xl font-bold text-primary mb-6">
                {Math.round((score / questions.length) * 100)}%
              </p>
            </div>

            {Object.keys(categoryScores).length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-foreground">Your Performance</h3>
                <div className="grid gap-3">
                  {Object.entries(categoryScores).map(([category, scores]) => {
                    const percentage = Math.round((scores.correct / scores.total) * 100);
                    return (
                      <div key={category} className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                        <div className="flex-1">
                          <div className="flex justify-between mb-2">
                            <span className="font-medium text-foreground">{category}</span>
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

            <div className="flex items-center justify-center gap-2 mb-6">
              {Array.from({ length: questions.length }).map((_, i) => (
                <Star
                  key={i}
                  className={i < score ? "w-8 h-8 fill-yellow-400 text-yellow-400" : "w-8 h-8 text-muted"}
                />
              ))}
            </div>

            {saving && (
              <p className="text-sm text-muted-foreground mb-4 text-center">
                Saving results...
              </p>
            )}
            
            <div className="text-center">
              <Button onClick={onBack} size="lg">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back to Start
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

        <Card className="p-8 border-2 border-primary/20 shadow-lg backdrop-blur-sm bg-card/95 animate-in slide-in-from-bottom duration-500">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-card-foreground">
                  Question {currentQuestion + 1} of {questions.length}
                </h3>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full font-medium transition-all duration-300 ${
                  timeLeft <= 5 ? 'bg-destructive/10 text-destructive animate-pulse' : 'bg-primary/10 text-primary'
                }`}>
                  <Timer className="w-4 h-4" />
                  <span className="text-lg font-bold">{timeLeft}s</span>
                </div>
              </div>
              <span className="text-5xl animate-in zoom-in duration-300">{questions[currentQuestion].emoji}</span>
            </div>
            <Progress value={progress} className="mb-4 h-3 transition-all duration-500" />
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-center mb-10 text-card-foreground animate-in slide-in-from-top duration-500">
              {questions[currentQuestion].question}
              {questions[currentQuestion].coloredWord && (
                <span className="ml-3 text-5xl font-extrabold" style={{ color: questions[currentQuestion].textColor }}>
                  {questions[currentQuestion].coloredWord}
                </span>
              )}
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {questions[currentQuestion].options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  size="lg"
                  variant="outline"
                  className="h-24 text-xl font-semibold hover:scale-105 active:scale-95 transition-all duration-200 border-2 hover:border-primary hover:shadow-lg hover:bg-primary/5 animate-in slide-in-from-bottom duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
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

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
  const [timeLeft, setTimeLeft] = useState(15);
  const [answering, setAnswering] = useState(false);
  const { toast } = useToast();

  const allQuestions = [
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
    {
      question: "What day of the week comes after Tuesday?",
      options: ["Monday", "Wednesday", "Friday", "Sunday"],
      correct: 1,
      emoji: "📅",
    },
    {
      question: "Which of these is NOT a fruit?",
      options: ["Banana", "Carrot", "Orange", "Grape"],
      correct: 1,
      emoji: "🥕",
    },
    {
      question: "How many legs do most insects have?",
      options: ["Four", "Six", "Eight", "Ten"],
      correct: 1,
      emoji: "🐛",
    },
    {
      question: "What is the color of grass?",
      options: ["Blue", "Green", "Red", "Yellow"],
      correct: 1,
      emoji: "🌱",
    },
    {
      question: "Which animal is known as 'man's best friend'?",
      options: ["Cat", "Dog", "Bird", "Fish"],
      correct: 1,
      emoji: "🐕",
    },
    {
      question: "What do plants need to grow?",
      options: ["Sunlight and water", "Sugar and salt", "Sand and toys", "Cold and dark"],
      correct: 0,
      emoji: "🌻",
    },
    {
      question: "Which way is the arrow pointing? ➡️",
      options: ["Up", "Down", "Left", "Right"],
      correct: 3,
      emoji: "➡️",
    },
    {
      question: "Which way is the arrow pointing? ⬆️",
      options: ["Up", "Down", "Left", "Right"],
      correct: 0,
      emoji: "⬆️",
    },
    {
      question: "Which way is OPPOSITE to the arrow? ⬇️",
      options: ["Up", "Down", "Left", "Right"],
      correct: 0,
      emoji: "🔄",
    },
    {
      question: "Count the X's: X B X D X F",
      options: ["2", "3", "4", "5"],
      correct: 1,
      emoji: "🔢",
    },
    {
      question: "Count the X's: A X C X E X G X",
      options: ["3", "4", "5", "6"],
      correct: 1,
      emoji: "🔢",
    },
    {
      question: "Remember: CAT, DOG, FISH, BIRD, BEAR. Which was third?",
      options: ["CAT", "DOG", "FISH", "BIRD"],
      correct: 2,
      emoji: "🧠",
    },
    {
      question: "Remember: SUN, MOON, STAR, CLOUD, RAIN. Which was first?",
      options: ["SUN", "MOON", "STAR", "CLOUD"],
      correct: 0,
      emoji: "🧠",
    },
    {
      question: "Which doesn't belong: Apple, Banana, Car, Orange?",
      options: ["Apple", "Banana", "Car", "Orange"],
      correct: 2,
      emoji: "🤔",
    },
    {
      question: "Which doesn't belong: Red, Blue, Happy, Green?",
      options: ["Red", "Blue", "Happy", "Green"],
      correct: 2,
      emoji: "🤔",
    },
    {
      question: "What COLOR is this word?",
      coloredWord: "RED",
      textColor: "#3b82f6",
      options: ["Red", "Blue", "Green", "Yellow"],
      correct: 1,
      emoji: "🎨",
    },
    {
      question: "What COLOR is this word?",
      coloredWord: "GREEN",
      textColor: "#ef4444",
      options: ["Red", "Blue", "Green", "Yellow"],
      correct: 0,
      emoji: "🎨",
    },
    {
      question: "What month is it right now?",
      options: ["Check the calendar!", "January", "December", "It changes!"],
      correct: 3,
      emoji: "📆",
    },
    {
      question: "What year is it?",
      options: ["2023", "2024", "2025", "2026"],
      correct: 2,
      emoji: "📆",
    },
    {
      question: "If yesterday was Monday, what is today?",
      options: ["Sunday", "Monday", "Tuesday", "Wednesday"],
      correct: 2,
      emoji: "📅",
    },
  ];

  const [questions] = useState(() => {
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
  });

  useEffect(() => {
    if (completed || !patientName || answering) return;

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

  const saveAssessmentResults = async (finalScore: number) => {
    if (!patientId) return;

    setSaving(true);
    try {
      const percentage = (finalScore / questions.length) * 100;
      
      const { error } = await supabase.from("assessment_results").insert({
        patient_id: patientId,
        assessment_type: "youth",
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
    setAnswering(true);
    const isCorrect = index === questions[currentQuestion].correct;
    const newScore = isCorrect ? score + 1 : score;
    if (isCorrect) {
      setScore(newScore);
    }

    setTimeout(() => {
      setAnswering(false);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setCompleted(true);
        setTimeout(() => saveAssessmentResults(newScore), 500);
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
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-4xl font-bold mb-4 text-foreground">Great Job, {patientName}! 🎉</h2>
            <p className="text-xl text-muted-foreground mb-6">
              You got {score} out of {questions.length} correct!
            </p>
            {saving && (
              <p className="text-sm text-muted-foreground mb-4">
                Saving results...
              </p>
            )}
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

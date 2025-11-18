import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Heart } from "lucide-react";
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
  const { toast } = useToast();

  const allExercises = [
    {
      type: "Memory Introduction",
      question: "Please remember these three words: Apple, Table, Car. We'll ask you to recall them later.",
      isMemoryIntro: true,
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
  ];

  const [exercises] = useState(() => {
    const shuffled = [...allExercises].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
  });

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
          <h2 className="text-2xl font-bold mb-8 text-card-foreground">
            {current.question}
          </h2>

          {current.isMemoryIntro && (
            <div className="space-y-6">
              <p className="text-lg text-muted-foreground text-center p-8 bg-secondary/5 rounded-lg">
                Please take a moment to remember these words.
              </p>
              <Button onClick={handleNext} size="lg" className="w-full">
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
                  className="justify-start text-left h-auto py-4 transition-all"
                >
                  {option}
                </Button>
              ))}
            </div>
          )}

          {current.isOpenEnded && (
            <div className="space-y-4">
              <Textarea
                value={textResponse}
                onChange={(e) => setTextResponse(e.target.value)}
                placeholder="Type your answer here..."
                className="min-h-[120px]"
              />
              <Button
                onClick={handleOpenEnded}
                size="lg"
                className="w-full"
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

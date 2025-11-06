import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Briefcase } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  onBack: () => void;
}

const AdultAssessment = ({ onBack }: Props) => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [responses, setResponses] = useState<string[]>([]);
  const [currentResponse, setCurrentResponse] = useState("");
  const [completed, setCompleted] = useState(false);

  const scenarios = [
    {
      title: "Emergency Response",
      scenario: "You notice a colleague experiencing chest pain and difficulty breathing. They are pale and sweating. What immediate actions would you take?",
      prompt: "Describe the steps you would take in order of priority:",
    },
    {
      title: "Problem Solving",
      scenario: "Your team is behind schedule on a critical project. Resources are limited and stakeholders are concerned. How would you address this situation?",
      prompt: "Outline your approach:",
    },
    {
      title: "Physical Coordination",
      scenario: "Stand up and perform the following sequence: Touch your toes, then your nose, then extend both arms forward. Rate your coordination.",
      prompt: "How did you perform this task? (1-5, 1=difficult, 5=easy)",
    },
  ];

  const handleNext = () => {
    setResponses([...responses, currentResponse]);
    setCurrentResponse("");

    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
    } else {
      setCompleted(true);
    }
  };

  const progress = ((currentScenario + 1) / scenarios.length) * 100;

  if (completed) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mx-auto mb-6">
            <Briefcase className="w-10 h-10 text-primary-foreground" />
          </div>
          <h2 className="text-4xl font-bold mb-4 text-foreground">Assessment Complete</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Your responses have been recorded and will be analyzed by healthcare professionals.
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
      <div className="max-w-3xl mx-auto">
        <Button onClick={onBack} variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back
        </Button>

        <Card className="p-8 border-border">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-card-foreground">
                Scenario {currentScenario + 1} of {scenarios.length}
              </h3>
              <span className="text-sm px-3 py-1 bg-primary/10 text-primary rounded-full font-medium">
                {scenarios[currentScenario].title}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-card-foreground">
              {scenarios[currentScenario].title}
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              {scenarios[currentScenario].scenario}
            </p>
            <label className="block text-sm font-medium mb-2 text-foreground">
              {scenarios[currentScenario].prompt}
            </label>
            <Textarea
              value={currentResponse}
              onChange={(e) => setCurrentResponse(e.target.value)}
              placeholder="Type your response here..."
              className="min-h-[150px]"
            />
          </div>

          <Button
            onClick={handleNext}
            size="lg"
            disabled={!currentResponse.trim()}
            className="w-full"
          >
            {currentScenario < scenarios.length - 1 ? "Next Scenario" : "Complete Assessment"}
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default AdultAssessment;

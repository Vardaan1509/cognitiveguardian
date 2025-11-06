import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Baby, Users, Briefcase, Heart } from "lucide-react";
import YouthAssessment from "./assessments/YouthAssessment";
import AdolescentAssessment from "./assessments/AdolescentAssessment";
import AdultAssessment from "./assessments/AdultAssessment";
import ElderlyAssessment from "./assessments/ElderlyAssessment";

type AgeGroup = "youth" | "adolescent" | "adult" | "elderly" | null;

const AgeSelection = () => {
  const [selectedAge, setSelectedAge] = useState<AgeGroup>(null);

  if (selectedAge === "youth") return <YouthAssessment onBack={() => setSelectedAge(null)} />;
  if (selectedAge === "adolescent") return <AdolescentAssessment onBack={() => setSelectedAge(null)} />;
  if (selectedAge === "adult") return <AdultAssessment onBack={() => setSelectedAge(null)} />;
  if (selectedAge === "elderly") return <ElderlyAssessment onBack={() => setSelectedAge(null)} />;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4 text-foreground">
          Select Age Group
        </h2>
        <p className="text-center text-muted-foreground mb-12 text-lg">
          Choose the appropriate assessment based on patient age
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <Card
            className="p-8 cursor-pointer hover:shadow-xl transition-all hover:scale-105 border-2 hover:border-primary"
            onClick={() => setSelectedAge("youth")}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center mb-4">
                <Baby className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-card-foreground">Youth</h3>
              <p className="text-muted-foreground mb-4">Ages 5-12 years</p>
              <p className="text-sm text-muted-foreground">
                Playful graphics with basic logical and attentive tasks
              </p>
            </div>
          </Card>

          <Card
            className="p-8 cursor-pointer hover:shadow-xl transition-all hover:scale-105 border-2 hover:border-primary"
            onClick={() => setSelectedAge("adolescent")}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-card-foreground">Adolescents</h3>
              <p className="text-muted-foreground mb-4">Ages 12-18 years</p>
              <p className="text-sm text-muted-foreground">
                Intricate coordination exercises promoting cognitive agility
              </p>
            </div>
          </Card>

          <Card
            className="p-8 cursor-pointer hover:shadow-xl transition-all hover:scale-105 border-2 hover:border-primary"
            onClick={() => setSelectedAge("adult")}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary flex items-center justify-center mb-4">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-card-foreground">Adults</h3>
              <p className="text-muted-foreground mb-4">Ages 18-60 years</p>
              <p className="text-sm text-muted-foreground">
                Case-based scenarios and physical movement prompts
              </p>
            </div>
          </Card>

          <Card
            className="p-8 cursor-pointer hover:shadow-xl transition-all hover:scale-105 border-2 hover:border-primary"
            onClick={() => setSelectedAge("elderly")}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-secondary flex items-center justify-center mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-card-foreground">Elderly</h3>
              <p className="text-muted-foreground mb-4">Ages 60+ years</p>
              <p className="text-sm text-muted-foreground">
                Simple memory, attention, and mobility exercises
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AgeSelection;

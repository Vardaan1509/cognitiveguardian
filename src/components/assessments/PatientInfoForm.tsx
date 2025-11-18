import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserCircle } from "lucide-react";

interface Props {
  onSubmit: (name: string, age: number) => void;
  ageGroup: "youth" | "adolescent" | "adult" | "elderly";
}

const PatientInfoForm = ({ onSubmit, ageGroup }: Props) => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [errors, setErrors] = useState<{ name?: string; age?: string }>({});

  const validateForm = () => {
    const newErrors: { name?: string; age?: string } = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    const ageNum = parseInt(age);
    if (!age) {
      newErrors.age = "Age is required";
    } else if (isNaN(ageNum) || ageNum <= 0 || ageNum >= 150) {
      newErrors.age = "Please enter a valid age (1-149)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(name.trim(), parseInt(age));
    }
  };

  const getAgeGroupLabel = () => {
    switch (ageGroup) {
      case "youth":
        return "Youth (5-12 years)";
      case "adolescent":
        return "Adolescent (12-18 years)";
      case "adult":
        return "Adult (18-60 years)";
      case "elderly":
        return "Elderly (60+ years)";
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <Card className="p-8 border-border">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <UserCircle className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-center text-foreground mb-2">
              Patient Information
            </h2>
            <p className="text-sm text-muted-foreground text-center">
              {getAgeGroupLabel()} Assessment
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter patient name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="Enter age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min="1"
                max="149"
                className={errors.age ? "border-destructive" : ""}
              />
              {errors.age && (
                <p className="text-sm text-destructive">{errors.age}</p>
              )}
            </div>

            <Button type="submit" size="lg" className="w-full">
              Start Assessment
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default PatientInfoForm;

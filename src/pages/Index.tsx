import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, Users, Activity, AlertCircle, TrendingUp, ArrowRight, FileSpreadsheet, LogOut } from "lucide-react";
import AgeSelection from "@/components/AgeSelection";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const [view, setView] = useState<"home" | "assessment">("home");
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">CogniCare</h1>
              <p className="text-xs text-muted-foreground">Delirium Prevention System</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant={view === "home" ? "default" : "ghost"}
              onClick={() => setView("home")}
              size="sm"
            >
              Home
            </Button>
            <Button
              variant={view === "assessment" ? "default" : "ghost"}
              onClick={() => setView("assessment")}
              size="sm"
            >
              Assessment
            </Button>
            <Link to="/data-export">
              <Button variant="outline" size="sm">
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                View Data
              </Button>
            </Link>
            {user && (
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Content */}
      {view === "home" && (
        <div className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16 max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent leading-tight pb-2">
              Cognitive Assessment System
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              A comprehensive platform that tracks patient performance metrics and saves the results of the tests 
              in a secure backend for easy access by authorised personnel.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={() => setView("assessment")}
                className="group"
              >
                Start Assessment
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <Card className="p-6 hover:shadow-lg transition-shadow border-border">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-card-foreground">Performance Tracking</h3>
              <p className="text-muted-foreground">
                Continuously monitors cognitive and physical activity levels against personalized baselines.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow border-border">
              <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-warning" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-card-foreground">Early Detection</h3>
              <p className="text-muted-foreground">
                Identifies concerning performance drops through systematic assessment tracking.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow border-border">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-card-foreground">Age-Appropriate</h3>
              <p className="text-muted-foreground">
                Tailored assessments for youth, adolescents, adults, and elderly patients.
              </p>
            </Card>
          </div>

          {/* Age Groups Overview */}
          <div className="max-w-5xl mx-auto">
            <h3 className="text-3xl font-bold text-center mb-10 text-foreground">
              Tailored for Every Age Group
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 border-border hover:border-primary/50 transition-colors">
                <h4 className="text-xl font-semibold mb-2 text-card-foreground">Youth (5-12 years)</h4>
                <p className="text-muted-foreground">
                  Basic logical and attentive tasks with colorful, playful graphics designed to engage young minds.
                </p>
              </Card>

              <Card className="p-6 border-border hover:border-primary/50 transition-colors">
                <h4 className="text-xl font-semibold mb-2 text-card-foreground">Adolescents (12-18 years)</h4>
                <p className="text-muted-foreground">
                  Intricate activities and coordination exercises that promote cognitive agility and engagement.
                </p>
              </Card>

              <Card className="p-6 border-border hover:border-primary/50 transition-colors">
                <h4 className="text-xl font-semibold mb-2 text-card-foreground">Adults (18-60 years)</h4>
                <p className="text-muted-foreground">
                  Case-based scenarios and physical movement prompts to detect anomalous mental capacity decreases.
                </p>
              </Card>

              <Card className="p-6 border-border hover:border-primary/50 transition-colors">
                <h4 className="text-xl font-semibold mb-2 text-card-foreground">Elderly (60+ years)</h4>
                <p className="text-muted-foreground">
                  Simple memory, attention, and mobility exercises that help prevent HID through cognitive exercise.
                </p>
              </Card>
            </div>
          </div>
        </div>
      )}

      {view === "assessment" && <AgeSelection />}
    </div>
  );
};

export default Index;

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, TrendingDown, TrendingUp, Activity, Clock } from "lucide-react";

const Dashboard = () => {
  const patients = [
    {
      id: "P001",
      name: "Margaret Wilson",
      age: 72,
      ageGroup: "Elderly",
      baseline: 85,
      current: 58,
      status: "alert",
      lastAssessment: "2 hours ago",
      trend: "declining",
    },
    {
      id: "P002",
      name: "Robert Chen",
      age: 45,
      ageGroup: "Adult",
      baseline: 92,
      current: 89,
      status: "stable",
      lastAssessment: "4 hours ago",
      trend: "stable",
    },
    {
      id: "P003",
      name: "Sarah Johnson",
      age: 68,
      ageGroup: "Elderly",
      baseline: 78,
      current: 76,
      status: "stable",
      lastAssessment: "1 hour ago",
      trend: "stable",
    },
    {
      id: "P004",
      name: "Michael Torres",
      age: 35,
      ageGroup: "Adult",
      baseline: 95,
      current: 70,
      status: "warning",
      lastAssessment: "30 minutes ago",
      trend: "declining",
    },
  ];

  const getStatusBadge = (status: string) => {
    if (status === "alert") {
      return <Badge variant="destructive" className="gap-1"><AlertCircle className="w-3 h-3" />Alert</Badge>;
    }
    if (status === "warning") {
      return <Badge className="bg-warning text-warning-foreground gap-1"><AlertCircle className="w-3 h-3" />Warning</Badge>;
    }
    return <Badge variant="secondary" className="gap-1"><Activity className="w-3 h-3" />Stable</Badge>;
  };

  const getTrendIcon = (trend: string) => {
    if (trend === "declining") {
      return <TrendingDown className="w-4 h-4 text-destructive" />;
    }
    if (trend === "improving") {
      return <TrendingUp className="w-4 h-4 text-secondary" />;
    }
    return <Activity className="w-4 h-4 text-muted-foreground" />;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2 text-foreground">Healthcare Dashboard</h2>
        <p className="text-muted-foreground">Real-time patient monitoring and delirium prevention alerts</p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card className="p-6 border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Total Patients</p>
            <Activity className="w-4 h-4 text-primary" />
          </div>
          <p className="text-3xl font-bold text-foreground">24</p>
        </Card>

        <Card className="p-6 border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Active Alerts</p>
            <AlertCircle className="w-4 h-4 text-destructive" />
          </div>
          <p className="text-3xl font-bold text-destructive">2</p>
        </Card>

        <Card className="p-6 border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Stable</p>
            <TrendingUp className="w-4 h-4 text-secondary" />
          </div>
          <p className="text-3xl font-bold text-secondary">20</p>
        </Card>

        <Card className="p-6 border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Avg Performance</p>
            <Activity className="w-4 h-4 text-primary" />
          </div>
          <p className="text-3xl font-bold text-foreground">82%</p>
        </Card>
      </div>

      {/* Patient List */}
      <Card className="border-border">
        <div className="p-6 border-b border-border">
          <h3 className="text-xl font-semibold text-card-foreground">Patient Monitoring</h3>
        </div>
        <div className="divide-y divide-border">
          {patients.map((patient) => (
            <div key={patient.id} className="p-6 hover:bg-accent/50 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-semibold text-lg text-card-foreground">{patient.name}</h4>
                    {getStatusBadge(patient.status)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{patient.id}</span>
                    <span>•</span>
                    <span>{patient.age} years</span>
                    <span>•</span>
                    <span>{patient.ageGroup}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {patient.lastAssessment}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Baseline Score</span>
                    <span className="text-sm font-semibold text-foreground">{patient.baseline}%</span>
                  </div>
                  <Progress value={patient.baseline} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Current Score</span>
                    <span className="text-sm font-semibold text-foreground">{patient.current}%</span>
                  </div>
                  <Progress
                    value={patient.current}
                    className="h-2"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Performance Trend</span>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(patient.trend)}
                      <span className="text-sm font-semibold capitalize text-foreground">{patient.trend}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {patient.current < patient.baseline * 0.7 && (
                      <span className="text-destructive font-medium">
                        ⚠️ {Math.round((1 - patient.current / patient.baseline) * 100)}% below baseline
                      </span>
                    )}
                    {patient.current >= patient.baseline * 0.7 && patient.current < patient.baseline * 0.85 && (
                      <span className="text-warning font-medium">
                        ⚠ {Math.round((1 - patient.current / patient.baseline) * 100)}% below baseline
                      </span>
                    )}
                    {patient.current >= patient.baseline * 0.85 && (
                      <span className="text-secondary font-medium">
                        ✓ Within normal range
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;

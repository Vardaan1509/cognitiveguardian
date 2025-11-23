import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Download, RefreshCw, ArrowLeft, FileSpreadsheet, Trash2, LogOut, ChevronDown, ChevronRight, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";

interface AssessmentData {
  patient_id: string;
  name: string;
  age: number;
  patient_registered_at: string;
  result_id: string | null;
  assessment_type: string | null;
  score: number | null;
  total_questions: number | null;
  percentage: number | null;
  completed_at: string | null;
}

interface GroupedPatientData {
  patient_id: string;
  name: string;
  age: number;
  assessments: AssessmentData[];
  totalAssessments: number;
  averageScore: number;
  latestScore: number;
  trend: 'up' | 'down' | 'stable' | 'new';
}

const DataExport = () => {
  const [data, setData] = useState<AssessmentData[]>([]);
  const [groupedData, setGroupedData] = useState<GroupedPatientData[]>([]);
  const [expandedPatients, setExpandedPatients] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const groupDataByPatient = (assessmentData: AssessmentData[]) => {
    const patientMap = new Map<string, GroupedPatientData>();

    assessmentData.forEach((assessment) => {
      if (!patientMap.has(assessment.patient_id)) {
        patientMap.set(assessment.patient_id, {
          patient_id: assessment.patient_id,
          name: assessment.name,
          age: assessment.age,
          assessments: [],
          totalAssessments: 0,
          averageScore: 0,
          latestScore: 0,
          trend: 'new',
        });
      }

      const patient = patientMap.get(assessment.patient_id)!;
      if (assessment.result_id) {
        patient.assessments.push(assessment);
      }
    });

    // Calculate statistics and trends for each patient
    const grouped = Array.from(patientMap.values()).map((patient) => {
      const sortedAssessments = patient.assessments.sort(
        (a, b) => new Date(b.completed_at!).getTime() - new Date(a.completed_at!).getTime()
      );

      const totalAssessments = sortedAssessments.length;
      const averageScore =
        totalAssessments > 0
          ? sortedAssessments.reduce((sum, a) => sum + (a.percentage || 0), 0) / totalAssessments
          : 0;
      const latestScore = sortedAssessments[0]?.percentage || 0;

      // Determine trend
      let trend: 'up' | 'down' | 'stable' | 'new' = 'new';
      if (totalAssessments >= 2) {
        const previousScore = sortedAssessments[1]?.percentage || 0;
        const difference = latestScore - previousScore;
        if (difference > 5) trend = 'up';
        else if (difference < -5) trend = 'down';
        else trend = 'stable';
      }

      return {
        ...patient,
        assessments: sortedAssessments,
        totalAssessments,
        averageScore,
        latestScore,
        trend,
      };
    });

    // Sort by latest assessment date
    return grouped.sort((a, b) => {
      const dateA = a.assessments[0]?.completed_at || '';
      const dateB = b.assessments[0]?.completed_at || '';
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: assessmentData, error } = await supabase
        .from("assessment_data_export")
        .select("*")
        .order("completed_at", { ascending: false, nullsFirst: false });

      if (error) throw error;

      setData(assessmentData || []);
      setGroupedData(groupDataByPatient(assessmentData || []));
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load assessment data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const exportToCSV = () => {
    if (data.length === 0) {
      toast({
        title: "No Data",
        description: "There is no data to export.",
        variant: "destructive",
      });
      return;
    }

    const headers = [
      "Patient ID",
      "Name",
      "Age",
      "Registered At",
      "Assessment Type",
      "Score",
      "Total Questions",
      "Percentage",
      "Completed At",
    ];

    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        [
          row.patient_id,
          `"${row.name}"`,
          row.age,
          row.patient_registered_at,
          row.assessment_type || "N/A",
          row.score || "N/A",
          row.total_questions || "N/A",
          row.percentage ? row.percentage.toFixed(2) : "N/A",
          row.completed_at || "N/A",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `assessment_data_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Success",
      description: "Data exported successfully!",
    });
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  const handleDelete = async (resultId: string | null) => {
    if (!resultId) {
      toast({
        title: "Error",
        description: "Cannot delete this record.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("assessment_results")
        .delete()
        .eq("id", resultId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Assessment record deleted successfully.",
        duration: 2000,
      });

      fetchData();
    } catch (error) {
      console.error("Error deleting record:", error);
      toast({
        title: "Error",
        description: "Failed to delete assessment record.",
        variant: "destructive",
      });
    }
  };

  const togglePatient = (patientId: string) => {
    const newExpanded = new Set(expandedPatients);
    if (newExpanded.has(patientId)) {
      newExpanded.delete(patientId);
    } else {
      newExpanded.add(patientId);
    }
    setExpandedPatients(newExpanded);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      case 'stable':
        return <Minus className="w-4 h-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getTrendBadge = (trend: string) => {
    switch (trend) {
      case 'up':
        return <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">Improving</Badge>;
      case 'down':
        return <Badge className="bg-red-500/10 text-red-600 hover:bg-red-500/20">Declining</Badge>;
      case 'stable':
        return <Badge className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20">Stable</Badge>;
      default:
        return <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20">New Patient</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5" />
              Assessment Data Export
            </h1>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchData}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button
                size="sm"
                onClick={exportToCSV}
                disabled={loading || data.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={signOut}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <Card className="border-border">
          {loading ? (
            <div className="p-8 text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading data...</p>
            </div>
          ) : groupedData.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">
                No assessment data found. Complete some assessments to see data here.
              </p>
            </div>
          ) : (
            <div className="space-y-2 p-4">
              {groupedData.map((patient) => (
                <Collapsible
                  key={patient.patient_id}
                  open={expandedPatients.has(patient.patient_id)}
                  onOpenChange={() => togglePatient(patient.patient_id)}
                >
                  <Card className="border-border">
                    <CollapsibleTrigger className="w-full">
                      <div className="p-4 hover:bg-accent/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {expandedPatients.has(patient.patient_id) ? (
                              <ChevronDown className="w-5 h-5 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="w-5 h-5 text-muted-foreground" />
                            )}
                            <div className="text-left">
                              <div className="flex items-center gap-3">
                                <span className="font-semibold text-lg">{patient.name}</span>
                                <Badge variant="outline">{patient.age} years</Badge>
                                {getTrendBadge(patient.trend)}
                              </div>
                              <div className="text-sm text-muted-foreground mt-1">
                                {patient.totalAssessments} assessment{patient.totalAssessments !== 1 ? 's' : ''} completed
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-6 text-sm">
                            <div className="text-right">
                              <div className="text-muted-foreground">Latest Score</div>
                              <div className="flex items-center gap-2">
                                {getTrendIcon(patient.trend)}
                                <span className="font-semibold text-lg">
                                  {patient.latestScore.toFixed(1)}%
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-muted-foreground">Average Score</div>
                              <div className="font-semibold text-lg">
                                {patient.averageScore.toFixed(1)}%
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="border-t border-border">
                        <div className="p-4 bg-muted/30">
                          <h4 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">
                            Assessment History
                          </h4>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Assessment Type</TableHead>
                                <TableHead>Score</TableHead>
                                <TableHead>Percentage</TableHead>
                                <TableHead className="w-[80px]">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {patient.assessments.map((assessment, index) => (
                                <TableRow key={assessment.result_id || index}>
                                  <TableCell className="text-sm">
                                    {formatDate(assessment.completed_at)}
                                  </TableCell>
                                  <TableCell className="capitalize">
                                    {assessment.assessment_type || "N/A"}
                                  </TableCell>
                                  <TableCell>
                                    {assessment.score !== null && assessment.total_questions !== null
                                      ? `${assessment.score} / ${assessment.total_questions}`
                                      : "N/A"}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <span className={`font-medium ${
                                        (assessment.percentage || 0) >= 70
                                          ? 'text-green-600'
                                          : (assessment.percentage || 0) >= 50
                                          ? 'text-yellow-600'
                                          : 'text-red-600'
                                      }`}>
                                        {assessment.percentage !== null
                                          ? `${assessment.percentage.toFixed(1)}%`
                                          : "N/A"}
                                      </span>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleDelete(assessment.result_id)}
                                      disabled={!assessment.result_id}
                                      className="hover:bg-destructive/10 hover:text-destructive"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              ))}
            </div>
          )}
        </Card>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-2 text-foreground">Data Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Total Patients:</span>
              <span className="ml-2 font-medium text-foreground">
                {groupedData.length}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Total Assessments:</span>
              <span className="ml-2 font-medium text-foreground">
                {groupedData.reduce((sum, p) => sum + p.totalAssessments, 0)}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Average Score:</span>
              <span className="ml-2 font-medium text-foreground">
                {groupedData.length > 0
                  ? (
                      groupedData.reduce((sum, p) => sum + p.averageScore, 0) /
                      groupedData.length
                    ).toFixed(1)
                  : "0"}
                %
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Patients Improving:</span>
              <span className="ml-2 font-medium text-green-600">
                {groupedData.filter((p) => p.trend === 'up').length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataExport;

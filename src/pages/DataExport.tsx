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
import { Download, RefreshCw, ArrowLeft, FileSpreadsheet, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

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

const DataExport = () => {
  const [data, setData] = useState<AssessmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: assessmentData, error } = await supabase
        .from("assessment_data_export")
        .select("*")
        .order("completed_at", { ascending: false, nullsFirst: false });

      if (error) throw error;

      setData(assessmentData || []);
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
          ) : data.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">
                No assessment data found. Complete some assessments to see data here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Assessment Type</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Percentage</TableHead>
                    <TableHead>Completed At</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{row.name}</TableCell>
                      <TableCell>{row.age}</TableCell>
                      <TableCell className="capitalize">
                        {row.assessment_type || "N/A"}
                      </TableCell>
                      <TableCell>
                        {row.score !== null && row.total_questions !== null
                          ? `${row.score} / ${row.total_questions}`
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {row.percentage !== null
                          ? `${row.percentage.toFixed(1)}%`
                          : "N/A"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(row.completed_at)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(row.result_id)}
                          disabled={!row.result_id}
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
          )}
        </Card>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-2 text-foreground">Data Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Total Patients:</span>
              <span className="ml-2 font-medium text-foreground">
                {new Set(data.map((d) => d.patient_id)).size}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Total Assessments:</span>
              <span className="ml-2 font-medium text-foreground">
                {data.filter((d) => d.result_id !== null).length}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Average Score:</span>
              <span className="ml-2 font-medium text-foreground">
                {data.filter((d) => d.percentage !== null).length > 0
                  ? (
                      data
                        .filter((d) => d.percentage !== null)
                        .reduce((sum, d) => sum + (d.percentage || 0), 0) /
                      data.filter((d) => d.percentage !== null).length
                    ).toFixed(1)
                  : "0"}
                %
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataExport;

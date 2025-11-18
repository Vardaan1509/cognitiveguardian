-- Create patients table to store basic information
CREATE TABLE public.patients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age > 0 AND age < 150),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create assessment_results table to store test results
CREATE TABLE public.assessment_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  assessment_type TEXT NOT NULL CHECK (assessment_type IN ('youth', 'adolescent', 'adult', 'elderly')),
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  percentage DECIMAL(5,2) NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public insert (for assessments)
CREATE POLICY "Anyone can insert patient data"
ON public.patients
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Anyone can insert assessment results"
ON public.assessment_results
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Create policies to allow public read (for data extraction)
CREATE POLICY "Anyone can view patient data"
ON public.patients
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Anyone can view assessment results"
ON public.assessment_results
FOR SELECT
TO anon, authenticated
USING (true);

-- Create indexes for better query performance
CREATE INDEX idx_patients_created_at ON public.patients(created_at DESC);
CREATE INDEX idx_assessment_results_patient_id ON public.assessment_results(patient_id);
CREATE INDEX idx_assessment_results_completed_at ON public.assessment_results(completed_at DESC);
CREATE INDEX idx_assessment_results_type ON public.assessment_results(assessment_type);

-- Create a view for easy data extraction with joined information
CREATE VIEW public.assessment_data_export AS
SELECT 
  p.id as patient_id,
  p.name,
  p.age,
  p.created_at as patient_registered_at,
  ar.id as result_id,
  ar.assessment_type,
  ar.score,
  ar.total_questions,
  ar.percentage,
  ar.completed_at
FROM public.patients p
LEFT JOIN public.assessment_results ar ON p.id = ar.patient_id
ORDER BY ar.completed_at DESC;

-- Grant access to the view
GRANT SELECT ON public.assessment_data_export TO anon, authenticated;
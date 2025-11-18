-- Drop the existing view
DROP VIEW IF EXISTS public.assessment_data_export;

-- Recreate the view with SECURITY INVOKER to respect RLS policies
CREATE VIEW public.assessment_data_export
WITH (security_invoker=on)
AS
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
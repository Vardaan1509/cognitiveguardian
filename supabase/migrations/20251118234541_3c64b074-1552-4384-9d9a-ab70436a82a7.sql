-- Drop the view that was causing the security warning
DROP VIEW IF EXISTS public.assessment_data_export;

-- Recreate the view without SECURITY DEFINER (it's not needed since tables already have RLS policies)
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
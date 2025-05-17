
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PageTitle from '@/components/shared/PageTitle';
import { Bot, AlertTriangle, Pill, ListChecks, Loader2 } from 'lucide-react';
import { recommendMedicines, type RecommendMedicinesOutput } from '@/ai/flows/recommend-medicines';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const recommendationSchema = z.object({
  symptoms: z.string().min(10, { message: 'Please describe your symptoms in at least 10 characters.' }),
});

type RecommendationFormValues = z.infer<typeof recommendationSchema>;

export default function AiRecommendationsPage() {
  const [recommendationResult, setRecommendationResult] = useState<RecommendMedicinesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<RecommendationFormValues>({
    resolver: zodResolver(recommendationSchema),
    defaultValues: {
      symptoms: '',
    },
  });

  async function onSubmit(data: RecommendationFormValues) {
    setIsLoading(true);
    setRecommendationResult(null);
    setError(null);
    try {
      const result = await recommendMedicines({ symptoms: data.symptoms });
      setRecommendationResult(result);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setError("Sorry, we couldn't fetch recommendations at this time. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <PageTitle title="AI Medicine Recommender" subtitle="Describe your symptoms to get AI-powered medicine suggestions." icon={Bot} />

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Symptom Checker</CardTitle>
          <CardDescription>
            Enter your symptoms below. This tool provides suggestions and is not a substitute for professional medical advice.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="symptoms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Describe your symptoms</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., I have a headache, runny nose, and slight fever..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Getting Recommendations...
                  </>
                ) : (
                  'Get Recommendations'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {recommendationResult && (
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ListChecks /> AI Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendationResult.medicines && recommendationResult.medicines.length > 0 ? (
              <div>
                <h3 className="font-semibold text-lg mb-2">Suggested Medicines:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {recommendationResult.medicines.map((medicine, index) => (
                    <li key={index} className="text-foreground/90 flex items-center gap-2">
                      <Pill className="h-4 w-4 text-primary" /> {medicine}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-muted-foreground">No specific medicine recommendations based on the provided symptoms.</p>
            )}

            {recommendationResult.warning && (
              <Alert variant="destructive" className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Important Warning!</AlertTitle>
                <AlertDescription>{recommendationResult.warning}</AlertDescription>
              </Alert>
            )}
             <Alert className="mt-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Disclaimer</AlertTitle>
                <AlertDescription>
                  These recommendations are AI-generated and for informational purposes only. Always consult with a healthcare professional for medical advice and treatment.
                </AlertDescription>
              </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


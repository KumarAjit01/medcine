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
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PageTitle from '@/components/shared/PageTitle';
import { UploadCloud, FileText, Loader2, CheckCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];

const prescriptionSchema = z.object({
  prescriptionFile: z
    .custom<FileList>()
    .refine((files) => files?.length === 1, "Prescription file is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      ".jpg, .jpeg, .png and .pdf files are accepted."
    ),
  notes: z.string().optional(),
});

type PrescriptionFormValues = z.infer<typeof prescriptionSchema>;

export default function PrescriptionUploadPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const form = useForm<PrescriptionFormValues>({
    resolver: zodResolver(prescriptionSchema),
  });

  function onSubmit(data: PrescriptionFormValues) {
    setIsLoading(true);
    console.log('Prescription data:', data.prescriptionFile[0]);
    console.log('Notes:', data.notes);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Prescription Uploaded (Simulated)",
        description: `${data.prescriptionFile[0].name} has been submitted for review.`,
        action: <CheckCircle className="text-green-500" />,
      });
      form.reset();
      setFileName(null);
    }, 2000);
  }

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <PageTitle title="Upload Prescription" subtitle="Securely upload your medical prescription for verification." icon={UploadCloud} />

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Prescription Details</CardTitle>
          <CardDescription>
            Please upload a clear image or PDF of your prescription. Ensure all details are visible.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="prescriptionFile"
                render={({ field: { onChange, value, ...rest } }) => (
                  <FormItem>
                    <FormLabel>Prescription File</FormLabel>
                    <FormControl>
                      <Input 
                        type="file" 
                        {...rest}
                        onChange={(event) => {
                          const files = event.target.files;
                          if (files) {
                            onChange(files);
                            setFileName(files[0]?.name || null);
                          }
                        }}
                        accept={ACCEPTED_IMAGE_TYPES.join(",")}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                      />
                    </FormControl>
                    {fileName && <p className="text-sm text-muted-foreground mt-1">Selected: {fileName}</p>}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Optional Notes</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Specific brand preference, quantity" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" /> Submit Prescription
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
       <Alert variant="default" className="mt-6">
          <UploadCloud className="h-4 w-4" />
          <AlertTitle>Processing Information</AlertTitle>
          <AlertDescription>
            Your uploaded prescription will be reviewed by our pharmacy team. You will be notified once it's approved. This is a simulated process for MVP.
          </AlertDescription>
        </Alert>
    </div>
  );
}

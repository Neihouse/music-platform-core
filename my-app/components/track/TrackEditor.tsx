"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Loader2, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be 100 characters or less"),
  genre: z.string().min(1, "Genre is required"),
  coverArt: z.instanceof(File).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface TrackEditorProps {
  trackId: string;
}

export function TrackEditor({ trackId }: TrackEditorProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const supabase = createClientComponentClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      genre: "",
    },
  });

  useEffect(() => {
    const fetchTrackDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from("tracks")
          .select("title, genre")
          .eq("id", trackId)
          .single();

        if (error) throw error;
        if (data) {
          form.reset({
            title: data.title || "",
            genre: data.genre || "",
          });
        } else {
          setError("Track details not found.");
        }
      } catch (err) {
        setError("Failed to fetch track details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrackDetails();
  }, [trackId]);

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const updates: any = {
        title: values.title,
        genre: values.genre,
      };

      if (values.coverArt) {
        const fileName = `${trackId}_${Date.now()}.jpg`;
        const { error: uploadError } = await supabase.storage
          .from("cover-art")
          .upload(fileName, values.coverArt);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("cover-art")
          .getPublicUrl(fileName);
        updates.cover_art_url = data.publicUrl;
      }

      const { error } = await supabase
        .from("tracks")
        .update(updates)
        .eq("id", trackId);
      if (error) throw error;

      setSuccess("Track updated successfully.");
    } catch (err) {
      setError("Failed to update track.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading)
    return <div className="text-center">Loading track details...</div>;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Fields */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="genre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Genre</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a genre" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="techno">Techno</SelectItem>
                  <SelectItem value="trance">Trance</SelectItem>
                  <SelectItem value="dubstep">Dubstep</SelectItem>
                  <SelectItem value="drum-and-bass">Drum and Bass</SelectItem>
                  <SelectItem value="future-bass">Future Bass</SelectItem>
                  <SelectItem value="trap">Trap</SelectItem>
                  <SelectItem value="hardstyle">Hardstyle</SelectItem>
                  <SelectItem value="progressive-house">
                    Progressive House
                  </SelectItem>
                  <SelectItem value="deep-house">Deep House</SelectItem>
                  <SelectItem value="electro-house">Electro House</SelectItem>
                  <SelectItem value="big-room">Big Room</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="psytrance">Psytrance</SelectItem>
                  <SelectItem value="edm">EDM (General)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="coverArt"
          render={({ field: { onChange, ...rest } }) => (
            <FormItem>
              <FormLabel>Cover Art</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => onChange(e.target.files?.[0] || null)}
                  {...rest}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Alerts */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Submit Button */}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Upload className="mr-2 h-4 w-4" />
          )}
          {isSubmitting ? "Updating..." : "Update Track"}
        </Button>
      </form>
    </Form>
  );
}

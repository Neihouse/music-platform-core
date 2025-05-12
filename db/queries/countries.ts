"use server";

import { TypedClient } from "@/utils/supabase/global.types";

export async function getOrCreateCountry(
  supabase: TypedClient,
  countryName: string,
) {
  // Check if the country already exists
  const existingCountry = await getCountryByName(supabase, countryName);

  if (existingCountry) {
    return existingCountry;
  }

  // If it doesn't exist, create it
  return createCountry(supabase, countryName);
}

export async function createCountry(
  supabase: TypedClient,
  countryName: string,
) {
  // Insert the data into the countries table
  const { data, error } = await supabase
    .from("countries")
    .insert({
      name: countryName,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create country: ${error.message}`);
  }

  return data;
}

export async function getCountryByName(supabase: TypedClient, name: string) {
  const { data, error } = await supabase
    .from("countries")
    .select()
    .eq("name", name)
    .maybeSingle();

  if (!error && !data) {
    return null;
  }

  if (error) {
    throw new Error(`Failed to fetch country: ${error.message}`);
  }

  return data;
}

export async function getCountryById(supabase: TypedClient, id: string) {
  const { data, error } = await supabase
    .from("countries")
    .select()
    .eq("id", id)
    .maybeSingle();

  if (!error && !data) {
    return null;
  }

  if (error) {
    throw new Error(`Failed to fetch country by ID: ${error.message}`);
  }

  return data;
}

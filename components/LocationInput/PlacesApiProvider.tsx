"use client";
import { APIProvider } from "@vis.gl/react-google-maps";
import * as React from "react";

export interface IPlacesApiProviderProps {
  children: React.ReactNode;
}

export function PlacesApiProvider(props: IPlacesApiProviderProps) {
  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      {props.children}
    </APIProvider>
  );
}

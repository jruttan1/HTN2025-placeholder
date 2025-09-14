"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import Header from "@/components/Header";
import SidebarPullTab from "@/components/SidebarPullTab";
import ChoroplethMap from '@/components/ChoroplethMap';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

interface StateData {
  id: string;
  state: string;
  name: string;
  avg_score: number;
  avg_risk_score: number;
  policy_count: number;
}

interface HeatmapData {
  states: StateData[];
}

const HeatmapPage = () => {
  const router = useRouter();
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [heatmapData, setHeatmapData] = useState<StateData[]>([]);
  const [valueField, setValueField] = useState<'avg_score' | 'avg_risk_score' | 'policy_count'>('avg_risk_score');
  const [colorSensitivity] = useState(1.0); // Fixed to standard sensitivity
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Authentication check
  useEffect(() => {
    console.log('Heatmap auth check - authLoading:', authLoading, 'isAuthenticated:', isAuthenticated);
    if (!authLoading && !isAuthenticated) {
      console.log('Heatmap redirecting to login');
      router.push('/login');
      return;
    }
  }, [authLoading, isAuthenticated, router]);

  // Show loading state while auth is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Load heatmap data
  useEffect(() => {
    const loadHeatmapData = async () => {
      try {
        const response = await fetch('/results/heatmap.json');
        if (!response.ok) {
          throw new Error('Failed to load heatmap data');
        }
        const data: HeatmapData = await response.json();
        setHeatmapData(data.states);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };

    loadHeatmapData();
  }, []);


  // Get field display name
  const getFieldDisplayName = (field: string) => {
    switch (field) {
      case 'avg_score':
        return 'Average Score (%)';
      case 'avg_risk_score':
        return 'Average Risk Score';
      case 'policy_count':
        return 'Policy Count';
      default:
        return field;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading heatmap data...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login via useEffect
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-500">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header userData={null} />
      <SidebarProvider>
        <AppSidebar />
        <SidebarPullTab />
        <SidebarInset>
          <div className="flex-1 container mx-auto p-6 space-y-6">
        {/* Header with Back Button and Title */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/dashboard">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">US States Choropleth Heatmap</h1>
            <p className="text-muted-foreground mt-2">
              Interactive visualization of state-level data with customizable parameters
            </p>
          </div>
          <div className="w-32"></div> {/* Spacer to center the title */}
        </div>

      {/* Map */}
      <Card>
        <CardContent className="p-6 relative">
          <ChoroplethMap
            data={heatmapData}
            valueField={valueField}
            title={`US States by ${getFieldDisplayName(valueField)}`}
            colorSensitivity={colorSensitivity}
            disableZoom={true}
            onValueFieldChange={setValueField}
          />
        </CardContent>
      </Card>

          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default HeatmapPage;

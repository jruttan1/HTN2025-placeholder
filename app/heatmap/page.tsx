"use client";

import React, { useState, useEffect } from 'react';
import ChoroplethMap from '@/components/ChoroplethMap';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
  const [heatmapData, setHeatmapData] = useState<StateData[]>([]);
  const [valueField, setValueField] = useState<'avg_score' | 'avg_risk_score' | 'policy_count'>('avg_risk_score');
  const [colorSensitivity] = useState(1.0); // Fixed to standard sensitivity
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Function to update individual state values
  const updateStateValue = (stateId: string, field: keyof StateData, value: number) => {
    setHeatmapData(prevData => 
      prevData.map(state => 
        state.id === stateId 
          ? { ...state, [field]: value }
          : state
      )
    );
  };

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

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading heatmap data...</div>
        </div>
      </div>
    );
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
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">US States Choropleth Heatmap</h1>
        <p className="text-black mt-2">
          Interactive visualization of state-level data with customizable parameters
        </p>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Map Controls</CardTitle>
          <CardDescription className="text-black">
            Select the data field to visualize on the map
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0 pb-4">
          <div className="flex justify-center">
            <div className="w-full max-w-sm">
              <Label htmlFor="value-field">Data Field</Label>
              <Select value={valueField} onValueChange={(value: 'avg_score' | 'avg_risk_score' | 'policy_count') => setValueField(value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select data field" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="avg_score">Average Score (%)</SelectItem>
                  <SelectItem value="avg_risk_score">Average Risk Score</SelectItem>
                  <SelectItem value="policy_count">Policy Count</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map */}
      <Card>
        <CardContent className="p-6">
          <ChoroplethMap
            data={heatmapData}
            valueField={valueField}
            title={`US States by ${getFieldDisplayName(valueField)}`}
            colorSensitivity={colorSensitivity}
          />
        </CardContent>
      </Card>

      {/* Data Editor */}
      <Card>
        <CardHeader>
          <CardTitle>Edit State Values</CardTitle>
          <CardDescription className="text-black">
            Click on any value to edit it. Changes will be reflected in the map immediately.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {heatmapData
              .filter(state => state.policy_count > 0 || state.avg_score > 0 || state.avg_risk_score > 0)
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((state) => (
                <div key={state.id} className="border rounded-lg p-3 space-y-2">
                  <h4 className="font-medium">{state.name} ({state.state})</h4>
                  
                  <div className="space-y-1">
                    <Label className="text-xs">Average Score (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={(state.avg_score * 100).toFixed(1)}
                      onChange={(e) => updateStateValue(state.id, 'avg_score', (parseFloat(e.target.value) || 0) / 100)}
                      className="h-8 text-xs"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label className="text-xs">Risk Score</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={state.avg_risk_score}
                      onChange={(e) => updateStateValue(state.id, 'avg_risk_score', parseFloat(e.target.value) || 0)}
                      className="h-8 text-xs"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label className="text-xs">Policy Count</Label>
                    <Input
                      type="number"
                      value={state.policy_count}
                      onChange={(e) => updateStateValue(state.id, 'policy_count', parseInt(e.target.value) || 0)}
                      className="h-8 text-xs"
                    />
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HeatmapPage;

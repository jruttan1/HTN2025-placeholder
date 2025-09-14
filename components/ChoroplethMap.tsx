"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ZoomIn } from 'lucide-react';
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_usaLow from "@amcharts/amcharts4-geodata/usaLow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

interface StateData {
  id: string;
  state: string;
  name: string;
  avg_score: number;
  avg_risk_score: number;
  policy_count: number;
}

interface ChoroplethMapProps {
  data: StateData[];
  valueField?: 'avg_score' | 'avg_risk_score' | 'policy_count';
  title?: string;
  colorSensitivity?: number;
  disableZoom?: boolean;
  onValueFieldChange?: (value: 'avg_score' | 'avg_risk_score' | 'policy_count') => void;
}

const ChoroplethMap: React.FC<ChoroplethMapProps> = ({
  data,
  valueField = 'avg_risk_score',
  title = 'US States Heatmap',
  colorSensitivity = 1.0,
  disableZoom = false,
  onValueFieldChange
}) => {
  // Fixed green scientific colors
  const minColor = '#AFCB86'; // Light green
  const maxColor = '#00441B';  // Dark green
  const chartRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<am5.Root | null>(null);
  const chartInstanceRef = useRef<am5map.MapChart | null>(null);
  const [isZoomEnabled, setIsZoomEnabled] = useState(false);

  useEffect(() => {
    if (!chartRef.current) return;

    // Dispose of existing chart
    if (rootRef.current) {
      rootRef.current.dispose();
    }

    // Create root
    const root = am5.Root.new(chartRef.current);
    rootRef.current = root;

    // Set themes
    root.setThemes([
      am5themes_Animated.new(root)
    ]);

    // Create chart
    const chart = root.container.children.push(am5map.MapChart.new(root, {
      panX: disableZoom ? "none" : "rotateX",
      panY: "none",
      projection: am5map.geoAlbersUsa(),
      layout: root.horizontalLayout,
      wheelX: disableZoom ? "none" : "zoom",
      wheelY: disableZoom ? "none" : "zoom"
    }));

    // Store chart reference
    chartInstanceRef.current = chart;

    // Create polygon series
    const polygonSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
      geoJSON: am5geodata_usaLow as any,
      valueField: "value",
      calculateAggregates: true
    }));

    // Configure polygon template
    polygonSeries.mapPolygons.template.setAll({
      tooltipText: "{name}: {displayValue}",
      stroke: am5.color("#ffffff"),
      strokeWidth: 0.5
    });

    // Set heat rules with green scientific colors
    polygonSeries.set("heatRules", [{
      target: polygonSeries.mapPolygons.template,
      dataField: "value",
      min: am5.color(minColor),
      max: am5.color(maxColor),
      key: "fill"
    }]);

    // Transform data for amCharts format with enhanced color sensitivity
    const rawData = data.map(state => {
      let value = state[valueField];
      
      // Normalize average score to percentage
      if (valueField === 'avg_score') {
        value = value * 100;
      }
      
      return {
        id: state.id,
        name: state.name,
        rawValue: value,
        displayValue: valueField === 'avg_score' ? `${value.toFixed(1)}%` : value.toString()
      };
    });

    // Find min and max values for normalization
    const validValues = rawData.filter(d => d.rawValue > 0).map(d => d.rawValue);
    const minValue = Math.min(...validValues);
    const maxValue = Math.max(...validValues);

    // Apply enhanced color sensitivity transformation
    const chartData = rawData.map(state => {
      let transformedValue = state.rawValue;
      
      if (state.rawValue > 0 && maxValue !== minValue) {
        // Normalize to 0-1 range
        const normalizedValue = (state.rawValue - minValue) / (maxValue - minValue);
        
        // Apply aggressive scaling based on sensitivity
        let enhancedValue;
        
        if (colorSensitivity <= 0.1) {
          // INSANE SENSITIVITY: Make 1-point differences create massive color jumps
          const baseMultiplier = 1 / Math.max(colorSensitivity, 0.001); // Prevent division by zero
          
          // Multi-layered extreme scaling
          if (colorSensitivity <= 0.01) {
            // NUCLEAR OPTION: For 0.01 and below
            const nuclearSteps = Math.ceil(100 / colorSensitivity); // At 0.01 = 10,000 steps!
            const stepValue = Math.floor(normalizedValue * nuclearSteps) / (nuclearSteps - 1);
            
            // Apply sigmoid function for ultra-sharp transitions
            const sigmoidValue = 1 / (1 + Math.exp(-normalizedValue * baseMultiplier * 10));
            
            // Combine step function with exponential amplification
            enhancedValue = Math.max(stepValue, sigmoidValue);
            enhancedValue = Math.pow(enhancedValue, 0.1); // Final power boost
            
          } else if (colorSensitivity <= 0.05) {
            // EXTREME: Create discrete color bands with sharp transitions
            const extremeSteps = Math.ceil(50 / colorSensitivity); // At 0.02 = 2500 steps!
            const stepValue = Math.floor(normalizedValue * extremeSteps) / (extremeSteps - 1);
            
            // Apply hyperbolic tangent with massive amplification
            const tanhValue = Math.tanh(normalizedValue * baseMultiplier * 5);
            
            enhancedValue = Math.max(stepValue, tanhValue);
          } else {
            // ULTRA: Still very aggressive but slightly less insane
            const steps = Math.ceil(20 / colorSensitivity);
            const stepValue = Math.floor(normalizedValue * steps) / (steps - 1);
            enhancedValue = Math.tanh(normalizedValue * baseMultiplier);
            enhancedValue = Math.max(enhancedValue, stepValue);
          }
          
          enhancedValue = Math.min(1, Math.max(0, enhancedValue)); // Clamp to [0,1]
        } else if (colorSensitivity <= 0.3) {
          // Ultra-aggressive: Create discrete buckets that force dramatic color jumps
          const buckets = Math.round(1 / colorSensitivity); // More buckets for lower sensitivity
          const bucketSize = 1 / buckets;
          const bucketIndex = Math.floor(normalizedValue / bucketSize);
          
          // Force each bucket to use the full color range
          enhancedValue = (bucketIndex / (buckets - 1));
          
          // Add some smoothing within buckets for ultra-low values
          if (colorSensitivity <= 0.15) {
            const withinBucket = (normalizedValue % bucketSize) / bucketSize;
            enhancedValue += (withinBucket * 0.8) / buckets; // Small smooth transition within bucket
          }
          
          enhancedValue = Math.min(1, enhancedValue);
        } else if (colorSensitivity <= 0.6) {
          // Aggressive: Exponential scaling
          enhancedValue = 1 - Math.exp(-normalizedValue * (2 / colorSensitivity));
        } else {
          // Standard: Power function for higher sensitivity values
          enhancedValue = Math.pow(normalizedValue, colorSensitivity);
        }
        
        // Scale back to original range for consistent legend display
        transformedValue = minValue + enhancedValue * (maxValue - minValue);
      }
      
      return {
        id: state.id,
        name: state.name,
        value: transformedValue,
        displayValue: state.displayValue
      };
    });

    // Set data
    polygonSeries.data.setAll(chartData);

    // Create heat legend
    const heatLegend = chart.children.push(am5.HeatLegend.new(root, {
      orientation: "vertical",
      startColor: am5.color(minColor),
      endColor: am5.color(maxColor),
      startText: "Lowest",
      endText: "Highest",
      stepCount: 5
    }));

    // Style legend labels
    heatLegend.startLabel.setAll({
      fontSize: 12,
      fill: heatLegend.get("startColor")
    });

    heatLegend.endLabel.setAll({
      fontSize: 12,
      fill: heatLegend.get("endColor")
    });

    // Update legend values when data is validated
    polygonSeries.events.on("datavalidated", function () {
      heatLegend.set("startValue", polygonSeries.getPrivate("valueLow"));
      heatLegend.set("endValue", polygonSeries.getPrivate("valueHigh"));
    });

    // Show value on hover
    polygonSeries.mapPolygons.template.events.on("pointerover", function(ev) {
      const dataItem = ev.target.dataItem;
      if (dataItem) {
        const value = dataItem.get("value" as any);
        if (value !== undefined && value !== null && typeof value === 'number') {
          heatLegend.showValue(value);
        }
      }
    });

    // Clean up function
    return () => {
      if (rootRef.current) {
        rootRef.current.dispose();
        rootRef.current = null;
      }
    };
  }, [data, valueField, colorSensitivity, disableZoom]);

  // Update zoom settings when isZoomEnabled changes
  useEffect(() => {
    if (chartInstanceRef.current && disableZoom) {
      chartInstanceRef.current.set("panX", isZoomEnabled ? "rotateX" : "none");
      chartInstanceRef.current.set("wheelX", isZoomEnabled ? "zoom" : "none");
      chartInstanceRef.current.set("wheelY", isZoomEnabled ? "zoom" : "none");
    }
  }, [isZoomEnabled, disableZoom]);

  // Toggle zoom functionality
  const toggleZoom = () => {
    const newZoomState = !isZoomEnabled;
    setIsZoomEnabled(newZoomState);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (rootRef.current) {
        rootRef.current.dispose();
      }
    };
  }, []);

  return (
    <div className="w-full h-full relative">
      <h2 className="text-2xl font-bold mb-4 text-center text-foreground">{title}</h2>
      <div 
        ref={chartRef} 
        className="w-full h-[600px] border border-border rounded-lg"
        style={{ minHeight: '600px' }}
      />
      
      {/* Bottom Right Controls */}
      <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-3">
        {/* Data Field Selector */}
        {onValueFieldChange && (
          <div className="bg-background/90 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
            <Label htmlFor="value-field" className="text-xs font-medium text-foreground mb-2 block">
              Data Field
            </Label>
            <Select value={valueField} onValueChange={onValueFieldChange}>
              <SelectTrigger className="w-40 h-8 text-xs">
                <SelectValue placeholder="Select data field" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="avg_score">Average Score (%)</SelectItem>
                <SelectItem value="avg_risk_score">Average Risk Score</SelectItem>
                <SelectItem value="policy_count">Policy Count</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        
        {/* Zoom Button - only show if zoom is disabled by default */}
        {disableZoom && (
          <Button
            onClick={toggleZoom}
            variant={isZoomEnabled ? "default" : "outline"}
            size="icon"
            className="shadow-lg"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ChoroplethMap;
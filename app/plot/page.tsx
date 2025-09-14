"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/Header"
import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid,
  BarChart, Bar,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from "recharts"

export default function PlotsPage() {
  const [policies, setPolicies] = useState<any[]>([])

  useEffect(() => {
    fetch("/api/policies")
      .then(res => res.json())
      .then(data => {
        const account = Object.values(data.accounts)[0] as any
        const flat = Object.values(account.policies).map((p: any) => ({
          id: p.id,
          tiv: p.tiv,
          premium: p.total_premium,
          risk_score: p.risk_score,
          winnability: p.winnability,
          loss_ratio: Number(p.loss_value) / p.total_premium,
          year: p.oldest_building,
          construction: p.construction_type,
          state: p.primary_risk_state,
        }))
        setPolicies(flat)
      })
  }, [])

  const appetiteCriteria = [
    {
      subject: "TIV",
      score: policies.length ? policies.reduce((sum, p) => sum + (p.tiv > 10_000_000 ? 1 : 0), 0) / policies.length : 0,
    },
    {
      subject: "Loss Ratio",
      score: policies.length ? policies.reduce((sum, p) => sum + (p.loss_ratio < 0.7 ? 1 : 0), 0) / policies.length : 0,
    },
    {
      subject: "Construction",
      score: policies.length ? policies.reduce((sum, p) => sum + (["Fire Resistive", "Non-Combustible"].includes(p.construction) ? 1 : 0), 0) / policies.length : 0,
    },
    {
      subject: "Year Built",
      score: policies.length ? policies.reduce((sum, p) => sum + (p.year > 1950 ? 1 : 0), 0) / policies.length : 0,
    },
    {
      subject: "State",
      score: policies.length ? policies.reduce((sum, p) => sum + (["CA", "TX"].includes(p.state) ? 1 : 0), 0) / policies.length : 0,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header userData={null} />
      <div className="flex-1 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 p-6">
        
        {/* Back to Dashboard Button */}
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="outline" className="flex items-center gap-2 hover:bg-white/80 dark:hover:bg-gray-800/80">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

      {/* Title Header */}
      <header className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
          📊 Portfolio Risk & Appetite Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Visualizing policy risk, performance, and appetite alignment
        </p>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* 1. TIV vs Loss Ratio */}
        <div className="bg-white/90 rounded-xl shadow-lg p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2 text-center">
            TIV vs Loss Ratio
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <CartesianGrid />
              <XAxis
                dataKey="loss_ratio"
                name="Loss Ratio"
                tickFormatter={(v) => v.toFixed(2)}
                label={{ value: "Loss Ratio", position: "insideBottom", offset: -5 }}
              />
              <YAxis
                dataKey="tiv"
                name="TIV (Million $)"
                tickFormatter={(v) => (v / 1_000_000).toFixed(0) + "M"}
                label={{ value: "TIV (Million $)", angle: -90, position: "insideLeft" }}
              />
              <ZAxis dataKey="premium" range={[60, 400]} />
              <Tooltip
                formatter={(value, name) =>
                  name === "tiv"
                    ? [(value / 1_000_000).toFixed(2) + "M", "TIV"]
                    : value
                }
                cursor={{ strokeDasharray: "3 3" }}
              />
              <Legend verticalAlign="top" align="right" iconType="circle" />
              <Scatter
                name="Policies"
                data={[...policies]
                  .filter((p) => p.loss_ratio >= 0 && p.tiv >= 0)
                  .sort((a, b) => a.loss_ratio - b.loss_ratio)}
                fill="#4f46e5"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* 2. Risk Score Distribution */}
        <div className="bg-white/90 rounded-xl shadow-lg p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2 text-center">
            Risk Score Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[...policies].sort((a, b) => a.id - b.id)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="id"
                label={{ value: "Policy ID", position: "insideBottom", offset: -4 }}
                tickFormatter={(v) => String(v)}
              />
              <YAxis
                label={{ value: "Risk Score", angle: -90, position: "insideLeft" }}
                domain={[0, 100]}
              />
              <Tooltip />
              <Legend verticalAlign="top" align="right" iconType="circle" />
              <Bar dataKey="risk_score" name="Risk Score" fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 3. Winnability vs Risk */}
        <div className="bg-white/90 rounded-xl shadow-lg p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2 text-center">
            Winnability vs Risk
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <CartesianGrid />
              <XAxis
                dataKey="winnability"
                tickFormatter={(v) => v.toFixed(2)}
                label={{ value: "Winnability", position: "insideBottom" }}
              />
              <YAxis
                dataKey="risk_score"
                label={{ value: "Risk Score", angle: -90, position: "insideLeft" }}
                domain={[0, 100]}
              />
              <ZAxis dataKey="premium" range={[60, 400]} />
              <Tooltip
                formatter={(value, name) =>
                  name === "risk_score" ? [value.toFixed(1), "Risk Score"] : value
                }
                cursor={{ strokeDasharray: "3 3" }}
              />
              <Legend verticalAlign="top" align="right" iconType="circle" />
              <Scatter
                name="Policies"
                data={[...policies]
                  .filter((p) => p.winnability >= 0 && p.risk_score >= 0)
                  .sort((a, b) => a.winnability - b.winnability)}
                fill="#f97316"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* 4. Appetite Alignment Radar */}
        <div className="bg-white/90 rounded-xl shadow-lg p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2 text-center">
            Appetite Alignment
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={appetiteCriteria}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 1]} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
              <Radar
                name="Portfolio Alignment"
                dataKey="score"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.6}
              />
              <Legend verticalAlign="top" align="right" iconType="circle" />
            </RadarChart>
          </ResponsiveContainer>
        </div>

      </div>
      </div>
    </div>
  )
}

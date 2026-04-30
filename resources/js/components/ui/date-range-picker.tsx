"use client"

import * as React from "react"
import { addDays, format, parseISO } from "date-fns"
import { Calendar as CalendarIcon, ChevronDown, ChevronLeft, ChevronRight, X } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DatePickerWithRange({
  className,
  onRangeChange,
}: React.HTMLAttributes<HTMLDivElement> & { onRangeChange?: (date: DateRange | undefined) => void }) {
  const [startDate, setStartDate] = React.useState<string>("2026-01-12")
  const [endDate, setEndDate] = React.useState<string>("2026-02-12")
  const [selectingStart, setSelectingStart] = React.useState(true)
  const [currentMonth, setCurrentMonth] = React.useState(new Date(2026, 0, 1))
  const [hoveredDate, setHoveredDate] = React.useState<string | null>(null)

  // Trigger callback when dates change
  React.useEffect(() => {
    onRangeChange?.({
        from: startDate ? parseISO(startDate) : undefined,
        to: endDate ? parseISO(endDate) : undefined
    })
  }, [startDate, endDate, onRangeChange])

  const setPreset = (days: number) => {
    const end = new Date()
    const start = new Date()
    start.setDate(end.getDate() - days)
    setStartDate(start.toISOString().split("T")[0])
    setEndDate(end.toISOString().split("T")[0])
    setSelectingStart(true)
  }

  const clearDates = () => {
    setStartDate("")
    setEndDate("")
    setSelectingStart(true)
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    return { daysInMonth, startingDayOfWeek, year, month }
  }

  const handleDateClick = (day: number) => {
    const { year, month } = getDaysInMonth(currentMonth)
    const selected = new Date(year, month, day)
    const dateStr = selected.toISOString().split("T")[0]

    if (selectingStart) {
      setStartDate(dateStr)
      setEndDate("")
      setSelectingStart(false)
    } else {
      if (new Date(dateStr) < new Date(startDate)) {
        setStartDate(dateStr)
        setEndDate(startDate)
      } else {
        setEndDate(dateStr)
      }
      setSelectingStart(true)
    }
  }

  const isDateInRange = (day: number) => {
    if (!startDate || !endDate) return false
    const { year, month } = getDaysInMonth(currentMonth)
    const date = new Date(year, month, day)
    const dateStr = date.toISOString().split("T")[0]
    return dateStr >= startDate && dateStr <= endDate
  }

  const isDateSelected = (day: number) => {
    const { year, month } = getDaysInMonth(currentMonth)
    const dateStr = new Date(year, month, day).toISOString().split("T")[0]
    return dateStr === startDate || dateStr === endDate
  }

  const isDateHovered = (day: number) => {
    if (!hoveredDate || !startDate || endDate || selectingStart) return false
    const { year, month } = getDaysInMonth(currentMonth)
    const dateStr = new Date(year, month, day).toISOString().split("T")[0]
    
    if (dateStr < startDate) {
      return dateStr >= hoveredDate && dateStr <= startDate
    }
    return dateStr >= startDate && dateStr <= hoveredDate
  }

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return null
    const date = new Date(dateStr + "T00:00:00")
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric", 
      year: "numeric" 
    })
  }

  const getDaysBetween = () => {
    if (!startDate || !endDate) return null
    const start = new Date(startDate)
    const end = new Date(endDate)
    const days = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    return days + 1
  }

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth)
  const monthName = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })

  const presets = [
    { days: 7, label: "Last 7 days", color: "indigo" },
    { days: 14, label: "Last 14 days", color: "purple" },
    { days: 30, label: "Last 30 days", color: "pink" },
    { days: 90, label: "Last 90 days", color: "rose" },
  ]

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-[10px] font-bold border-slate-200 dark:border-slate-800 rounded-lg gap-2 px-3 bg-white dark:bg-slate-900/50 hover:border-indigo-400 transition-all shadow-sm"
          >
            <CalendarIcon className="size-3.5 text-indigo-500" />
            <div className="flex items-center gap-1">
              {startDate && endDate ? (
                <>
                  <span className="text-slate-900 dark:text-slate-100">{formatDateDisplay(startDate)}</span>
                  <span className="text-slate-400 font-normal">-</span>
                  <span className="text-slate-900 dark:text-slate-100">{formatDateDisplay(endDate)}</span>
                </>
              ) : startDate ? (
                <span className="text-slate-400">{formatDateDisplay(startDate)} → ...</span>
              ) : (
                <span>Select Range</span>
              )}
            </div>
            <ChevronDown className="size-3 text-slate-400 ml-auto" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[320px] p-0 border-none bg-transparent shadow-none" align="end">
          <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-0.5 shadow-2xl overflow-hidden border border-white/5">
            <div className="rounded-[15px] bg-white/5 p-4 backdrop-blur-xl border border-white/10">
              {/* Header */}
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-black text-white tracking-tight leading-none">Date Range</h2>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 opacity-70">Custom range & presets</p>
                </div>
                {(startDate || endDate) && (
                  <button onClick={clearDates} className="rounded-full p-1 text-slate-400 transition hover:bg-white/10 hover:text-white border border-white/5">
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>

              {/* Quick Select Presets */}
              <div className="mb-4">
                <div className="grid grid-cols-4 gap-1.5">
                  {presets.map((preset) => (
                    <button
                      key={preset.days}
                      onClick={() => setPreset(preset.days)}
                      className={cn(
                        "rounded-lg border px-1 py-1.5 text-[8px] font-bold transition-all uppercase tracking-tight",
                        preset.color === "indigo" && "bg-indigo-500/10 border-indigo-500/20 text-indigo-300 hover:bg-indigo-500 hover:text-white",
                        preset.color === "purple" && "bg-purple-500/10 border-purple-500/20 text-purple-300 hover:bg-purple-500 hover:text-white",
                        preset.color === "pink" && "bg-pink-500/10 border-pink-500/20 text-pink-300 hover:bg-pink-500 hover:text-white",
                        preset.color === "rose" && "bg-rose-500/10 border-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white"
                      )}
                    >
                      {preset.label.replace("Last ", "")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Calendar Grid Section */}
              <div className="rounded-xl border border-white/10 bg-black/20 p-3 backdrop-blur-sm">
                <div className="mb-3 flex items-center justify-between">
                  <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} className="rounded-lg p-1 text-slate-400 transition hover:bg-white/10 hover:text-white">
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  <h3 className="text-[10px] font-black text-white uppercase tracking-tighter">{monthName}</h3>
                  <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className="rounded-lg p-1 text-slate-400 transition hover:bg-white/10 hover:text-white">
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="mb-1 grid grid-cols-7 gap-1 text-center">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                    <div key={day} className="text-[8px] font-black text-slate-500 uppercase">{day}</div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-0.5">
                  {[...Array(startingDayOfWeek)].map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  {[...Array(daysInMonth)].map((_, i) => {
                    const day = i + 1
                    const { year, month } = getDaysInMonth(currentMonth)
                    const d = new Date(year, month, day)
                    const dateStr = d.toISOString().split("T")[0]
                    const isSelected = isDateSelected(day)
                    const isInRange = isDateInRange(day)
                    const isHovered = isDateHovered(day)
                    const isToday = new Date().toISOString().split("T")[0] === dateStr

                    return (
                      <button
                        key={day}
                        onClick={() => handleDateClick(day)}
                        onMouseEnter={() => setHoveredDate(dateStr)}
                        onMouseLeave={() => setHoveredDate(null)}
                        className={cn(
                          "relative size-7.5 rounded-lg text-[9px] font-black transition-all border border-transparent",
                          isSelected 
                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/40 border-indigo-400 z-10" 
                            : isInRange || isHovered
                            ? "bg-indigo-500/20 text-indigo-200 border-indigo-500/10"
                            : "text-slate-400 hover:bg-white/10 hover:text-white",
                          isToday && !isSelected && "border-white/20 text-indigo-400"
                        )}
                      >
                        {day}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Summary / Active Range Display */}
              {startDate && endDate && (
                <div className="mt-4 rounded-xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[8px] font-bold text-indigo-400 uppercase tracking-widest mb-0.5">Active Range</p>
                      <p className="text-[11px] font-black text-white tracking-tighter leading-none">
                        {formatDateDisplay(startDate)} <span className="text-indigo-400 opacity-50">→</span> {formatDateDisplay(endDate)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Duration</p>
                      <p className="text-sm font-black text-indigo-400 tracking-tighter leading-none">
                        {getDaysBetween()} <span className="text-[8px] font-bold text-slate-500 uppercase">days</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-3 flex items-center justify-center">
                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.15em] opacity-50">
                  {selectingStart ? "Select Start Date" : "Select End Date"}
                </p>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

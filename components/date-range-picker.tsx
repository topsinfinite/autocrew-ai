"use client";

import * as React from "react";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps {
  date: DateRange | undefined;
  onDateChange: (date: DateRange | undefined) => void;
  className?: string;
}

export function DateRangePicker({
  date,
  onDateChange,
  className,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);

  const handleClear = () => {
    onDateChange(undefined);
  };

  const handleApply = () => {
    setOpen(false);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal h-10",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 overflow-hidden border border-border shadow-xl bg-slate-900 dark:bg-slate-900"
          align="start"
        >
          {/* Elegant Header with Gradient */}
          <div className="relative overflow-hidden bg-slate-800 px-4 py-3 border-b border-slate-700">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent" />
            <div className="relative flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 ring-1 ring-primary/30">
                <CalendarIcon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Select Date Range</h4>
                <p className="text-xs text-slate-400">Filter by time period</p>
              </div>
            </div>
          </div>

          {/* Calendar */}
          <div className="p-3 bg-slate-900">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={onDateChange}
              numberOfMonths={2}
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-t border-slate-700">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              disabled={!date}
              className="text-muted-foreground hover:text-foreground gap-1"
            >
              <X className="h-3.5 w-3.5" />
              Clear
            </Button>
            <Button size="sm" onClick={handleApply} className="px-4">
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

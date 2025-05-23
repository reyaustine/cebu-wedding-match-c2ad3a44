import * as React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { DayPicker, DayPickerProps } from "react-day-picker";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

type YearNavigationProps = {
  currentMonth: Date;
  goToMonth: (date: Date) => void;
};

function YearNavigation({ currentMonth, goToMonth }: YearNavigationProps) {
  const handleYearChange = (year: string) => {
    const newDate = new Date(currentMonth);
    newDate.setFullYear(parseInt(year));
    goToMonth(newDate);
  };

  const years = Array.from({ length: 100 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return year.toString();
  });

  return (
    <Select
      value={currentMonth.getFullYear().toString()}
      onValueChange={handleYearChange}
    >
      <SelectTrigger className="w-[100px] h-7">
        <SelectValue placeholder={currentMonth.getFullYear().toString()} />
      </SelectTrigger>
      <SelectContent className="max-h-80 overflow-auto">
        {years.map((year) => (
          <SelectItem key={year} value={year}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

type MonthNavigationProps = {
  currentMonth: Date;
  goToMonth: (date: Date) => void;
};

function MonthNavigation({ currentMonth, goToMonth }: MonthNavigationProps) {
  const months = [
    "January", "February", "March", "April", 
    "May", "June", "July", "August", 
    "September", "October", "November", "December"
  ];

  const handleMonthChange = (month: string) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(months.indexOf(month));
    goToMonth(newDate);
  };

  return (
    <Select
      value={months[currentMonth.getMonth()]}
      onValueChange={handleMonthChange}
    >
      <SelectTrigger className="w-[120px] h-7">
        <SelectValue placeholder={months[currentMonth.getMonth()]} />
      </SelectTrigger>
      <SelectContent>
        {months.map((month) => (
          <SelectItem key={month} value={month}>
            {month}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

interface DirectDateInputProps { 
  value?: Date; 
  onChange: (date: Date) => void;
}

function DirectDateInput({ value, onChange }: DirectDateInputProps) {
  const [inputValue, setInputValue] = React.useState(
    value ? format(value, "yyyy-MM-dd") : ""
  );

  React.useEffect(() => {
    if (value) {
      setInputValue(format(value, "yyyy-MM-dd"));
    } else {
      setInputValue("");
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleBlur = () => {
    const date = new Date(inputValue);
    if (!isNaN(date.getTime())) {
      onChange(date);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const date = new Date(inputValue);
      if (!isNaN(date.getTime())) {
        onChange(date);
      }
    }
  };

  return (
    <div className="px-3 pb-3">
      <Input
        type="date"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="w-full"
      />
    </div>
  );
}

interface CalendarSingleProps extends Omit<CalendarProps, 'mode' | 'onSelect' | 'selected'> {
  mode: 'single';
  selected?: Date | undefined;
  onSelect?: (date: Date | undefined) => void;
}

interface CalendarMultipleProps extends Omit<CalendarProps, 'mode' | 'onSelect' | 'selected'> {
  mode: 'multiple';
  selected?: Date[] | undefined;
  onSelect?: (dates: Date[] | undefined) => void;
}

interface CalendarRangeProps extends Omit<CalendarProps, 'mode' | 'onSelect' | 'selected'> {
  mode: 'range';
  selected?: {
    from: Date;
    to?: Date;
  } | undefined;
  onSelect?: (range: { from: Date; to?: Date } | undefined) => void;
}

type ExtendedCalendarProps = CalendarSingleProps | CalendarMultipleProps | CalendarRangeProps;

function Calendar(props: ExtendedCalendarProps) {
  const {
    className,
    classNames,
    showOutsideDays = true,
    mode = 'single',
    selected,
    onSelect,
    ...restProps
  } = props;

  const getDefaultMonth = () => {
    if (mode === 'single' && selected instanceof Date) {
      return selected;
    } else if (mode === 'multiple' && Array.isArray(selected) && selected.length > 0) {
      return selected[0];
    } else if (mode === 'range' && selected && 'from' in selected && selected.from instanceof Date) {
      return selected.from;
    }
    return new Date();
  };

  const [month, setMonth] = React.useState<Date>(getDefaultMonth());

  React.useEffect(() => {
    const newMonth = getDefaultMonth();
    setMonth(newMonth);
  }, [selected]);

  const goToMonthPrevYear = () => {
    const newDate = new Date(month);
    newDate.setFullYear(newDate.getFullYear() - 1);
    setMonth(newDate);
  };

  const goToMonthNextYear = () => {
    const newDate = new Date(month);
    newDate.setFullYear(newDate.getFullYear() + 1);
    setMonth(newDate);
  };

  const commonDayPickerProps = {
    showOutsideDays,
    className: cn("p-3 pointer-events-auto", className),
    classNames: {
      months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
      month: "space-y-4",
      caption: "flex flex-col pt-1 relative items-center gap-2",
      caption_label: "hidden",
      nav: "flex items-center justify-between w-full px-1",
      nav_button: cn(
        buttonVariants({ variant: "outline" }),
        "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
      ),
      nav_button_previous: "",
      nav_button_next: "",
      table: "w-full border-collapse space-y-1",
      head_row: "flex",
      head_cell:
        "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
      row: "flex w-full mt-2",
      cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
      day: cn(
        buttonVariants({ variant: "ghost" }),
        "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
      ),
      day_range_end: "day-range-end",
      day_selected:
        "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
      day_today: "bg-accent text-accent-foreground",
      day_outside:
        "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
      day_disabled: "text-muted-foreground opacity-50",
      day_range_middle:
        "aria-selected:bg-accent aria-selected:text-accent-foreground",
      day_hidden: "invisible",
      ...classNames,
    },
    components: {
      IconLeft: () => <ChevronLeft className="h-4 w-4" />,
      IconRight: () => <ChevronRight className="h-4 w-4" />,
      Caption: ({ displayMonth }: { displayMonth: Date }) => (
        <div className="flex flex-col gap-2 items-center justify-center w-full">
          <div className="flex justify-between items-center w-full px-2">
            <button
              onClick={goToMonthPrevYear}
              className={buttonVariants({ variant: "outline", size: "icon" })}
              style={{ height: "28px", width: "28px", padding: 0 }}
              type="button"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
            <div className="flex gap-2">
              <MonthNavigation currentMonth={displayMonth} goToMonth={setMonth} />
              <YearNavigation currentMonth={displayMonth} goToMonth={setMonth} />
            </div>
            <button
              onClick={goToMonthNextYear}
              className={buttonVariants({ variant: "outline", size: "icon" })}
              style={{ height: "28px", width: "28px", padding: 0 }}
              type="button"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      ),
    },
    month,
    onMonthChange: setMonth,
    ...restProps
  };

  const renderCalendar = () => {
    switch (mode) {
      case 'single':
        return (
          <>
            {onSelect && (
              <DirectDateInput 
                value={selected as Date | undefined} 
                onChange={(date: Date) => {
                  (onSelect as (date: Date | undefined) => void)(date);
                }} 
              />
            )}
            <DayPicker
              mode="single"
              selected={selected as Date | undefined}
              onSelect={(date) => {
                if (onSelect) {
                  (onSelect as (date: Date | undefined) => void)(date);
                }
              }}
              {...commonDayPickerProps}
            />
          </>
        );
      
      case 'multiple':
        return (
          <DayPicker
            mode="multiple"
            selected={selected as Date[] | undefined}
            onSelect={(dates) => {
              if (onSelect) {
                (onSelect as (dates: Date[] | undefined) => void)(dates);
              }
            }}
            {...commonDayPickerProps}
          />
        );
      
      case 'range':
        return (
          <DayPicker
            mode="range"
            selected={selected as { from: Date; to?: Date } | undefined}
            onSelect={(range) => {
              if (onSelect) {
                (onSelect as (range: { from: Date; to?: Date } | undefined) => void)(range);
              }
            }}
            {...commonDayPickerProps}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      {renderCalendar()}
    </div>
  );
}

Calendar.displayName = "Calendar";

export { Calendar };

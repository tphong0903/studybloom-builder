import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = Array.from({ length: 10 }, (_, i) => `${8 + i}:00`);

const events = [
  { day: 0, start: 1, duration: 2, title: "React Fundamentals", type: "Lecture", color: "gradient-primary" },
  { day: 1, start: 3, duration: 1, title: "Python Quiz", type: "Quiz", color: "gradient-accent" },
  { day: 2, start: 0, duration: 2, title: "Design Workshop", type: "Workshop", color: "bg-info" },
  { day: 3, start: 2, duration: 1, title: "Faculty Meeting", type: "Meeting", color: "bg-success" },
  { day: 4, start: 4, duration: 2, title: "ML Lab Session", type: "Lab", color: "gradient-primary" },
  { day: 0, start: 5, duration: 1, title: "Office Hours", type: "Office", color: "bg-muted-foreground" },
];

const Schedule = () => {
  return (
    <DashboardLayout title="Schedule Management">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
            <ChevronLeft className="h-5 w-5 text-muted-foreground" />
          </button>
          <h2 className="font-display font-bold text-lg">February 2026</h2>
          <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
        <Button className="gradient-primary text-primary-foreground gap-2 hover:opacity-90">
          <Plus className="h-4 w-4" /> Add Event
        </Button>
      </div>

      <Card className="shadow-card overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="min-w-[700px]">
              {/* Header */}
              <div className="grid grid-cols-8 border-b border-border">
                <div className="p-3 text-xs font-medium text-muted-foreground" />
                {days.map((day) => (
                  <div key={day} className="p-3 text-center text-sm font-medium text-foreground border-l border-border">
                    {day}
                  </div>
                ))}
              </div>

              {/* Time slots */}
              <div className="relative">
                {hours.map((hour, hi) => (
                  <div key={hour} className="grid grid-cols-8 border-b border-border last:border-0">
                    <div className="p-3 text-xs text-muted-foreground text-right pr-4">{hour}</div>
                    {days.map((_, di) => (
                      <div key={di} className="border-l border-border h-16 relative hover:bg-secondary/30 transition-colors">
                        {events
                          .filter((e) => e.day === di && e.start === hi)
                          .map((event, ei) => (
                            <div
                              key={ei}
                              className={`absolute inset-x-1 top-1 rounded-md px-2 py-1 text-primary-foreground cursor-pointer ${event.color}`}
                              style={{ height: `${event.duration * 64 - 8}px`, zIndex: 10 }}
                            >
                              <p className="text-xs font-semibold truncate">{event.title}</p>
                              <p className="text-[10px] opacity-80">{event.type}</p>
                            </div>
                          ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Schedule;

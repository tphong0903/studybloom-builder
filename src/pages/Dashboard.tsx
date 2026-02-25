import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Calendar, ClipboardCheck, TrendingUp, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const stats = [
  { label: "Active Courses", value: "12", icon: BookOpen, change: "+2 this week" },
  { label: "Total Students", value: "1,248", icon: Users, change: "+48 this month" },
  { label: "Upcoming Events", value: "8", icon: Calendar, change: "3 today" },
  { label: "Pending Quizzes", value: "5", icon: ClipboardCheck, change: "2 due soon" },
];

const recentCourses = [
  { name: "Introduction to React", progress: 78, students: 156, status: "Active" },
  { name: "Advanced Python", progress: 45, students: 89, status: "Active" },
  { name: "UI/UX Design Fundamentals", progress: 92, students: 234, status: "Active" },
  { name: "Data Structures & Algorithms", progress: 30, students: 112, status: "Draft" },
];

const upcomingSchedule = [
  { time: "09:00 AM", title: "React Fundamentals - Lecture", type: "Lecture" },
  { time: "11:30 AM", title: "Python Quiz Review", type: "Quiz" },
  { time: "02:00 PM", title: "Design Workshop", type: "Workshop" },
  { time: "04:00 PM", title: "Faculty Meeting", type: "Meeting" },
];

const Dashboard = () => {
  return (
    <DashboardLayout title="Dashboard">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label} className="shadow-card hover:shadow-card-hover transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-display font-bold mt-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-success" />
                    {stat.change}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Courses */}
        <div className="lg:col-span-2">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="font-display text-lg">Recent Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCourses.map((course) => (
                  <div key={course.name} className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                    <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center shrink-0">
                      <BookOpen className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{course.name}</p>
                      <p className="text-xs text-muted-foreground">{course.students} students</p>
                    </div>
                    <div className="w-24 hidden sm:block">
                      <Progress value={course.progress} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">{course.progress}%</p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      course.status === "Active"
                        ? "bg-success/10 text-success"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {course.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Schedule */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-lg">Today's Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingSchedule.map((event, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {i < upcomingSchedule.length - 1 && (
                      <div className="w-px flex-1 bg-border mt-1" />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className="text-xs text-muted-foreground">{event.time}</p>
                    <p className="text-sm font-medium mt-0.5">{event.title}</p>
                    <span className="text-xs text-accent font-medium">{event.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

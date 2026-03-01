import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft, CheckCircle2, Circle, Play, Clock, BookOpen, Star, Video, FileText, Image, Lock
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

const courseDetail = {
  id: 1,
  title: "Introduction to React",
  description: "A comprehensive course covering React fundamentals, hooks, state management, and modern best practices.",
  instructor: "Dr. Sarah Chen",
  rating: 4.8,
  progress: 65,
  totalLessons: 10,
  completedLessons: 5,
  modules: [
    {
      id: 1, title: "Getting Started with React",
      lessons: [
        { id: 1, title: "What is React?", type: "video" as const, duration: "15 min", completed: true },
        { id: 2, title: "Setting Up Environment", type: "article" as const, duration: "10 min", completed: true },
        { id: 3, title: "Your First Component", type: "video" as const, duration: "20 min", completed: true },
      ],
    },
    {
      id: 2, title: "Components & Props",
      lessons: [
        { id: 4, title: "Functional Components", type: "video" as const, duration: "25 min", completed: true },
        { id: 5, title: "Props Deep Dive", type: "pdf" as const, duration: "15 min", completed: true },
        { id: 6, title: "Component Patterns Slides", type: "slide" as const, duration: "20 min", completed: false },
      ],
    },
    {
      id: 3, title: "State & Hooks",
      lessons: [
        { id: 7, title: "useState Hook", type: "video" as const, duration: "30 min", completed: false },
        { id: 8, title: "useEffect Hook", type: "article" as const, duration: "20 min", completed: false },
        { id: 9, title: "Custom Hooks", type: "video" as const, duration: "25 min", completed: false },
        { id: 10, title: "Hooks Practice", type: "pdf" as const, duration: "30 min", completed: false },
      ],
    },
  ],
};

const typeIcons: Record<string, React.ReactNode> = {
  video: <Video className="h-4 w-4 text-info" />,
  article: <FileText className="h-4 w-4 text-success" />,
  pdf: <FileText className="h-4 w-4 text-destructive" />,
  slide: <Image className="h-4 w-4 text-accent" />,
};

const StudentCourseDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [expandedModules, setExpandedModules] = useState<number[]>([1, 2, 3]);

  const toggleModule = (moduleId: number) => {
    setExpandedModules(prev =>
      prev.includes(moduleId) ? prev.filter(m => m !== moduleId) : [...prev, moduleId]
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allLessons = (courseDetail.modules as any[]).flatMap((m: any) => m.lessons);
  const nextLesson = allLessons.find((l: any) => !l.completed);

  return (
    <DashboardLayout title="Course Detail">
      <Button variant="ghost" size="sm" className="mb-4 text-muted-foreground" onClick={() => navigate("/my-courses")}>
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to My Courses
      </Button>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main */}
        <div className="flex-1 space-y-5">
          {/* Hero */}
          <Card className="shadow-card overflow-hidden">
            <div className="h-48 bg-gradient-to-br from-primary/10 via-secondary to-accent/10 flex items-center justify-center text-7xl">
              🖥️
            </div>
            <CardContent className="p-5">
              <Badge variant="secondary" className="mb-2">Web Development</Badge>
              <h2 className="font-display font-bold text-2xl text-foreground mb-1">{courseDetail.title}</h2>
              <p className="text-sm text-muted-foreground mb-3">by {courseDetail.instructor} · <Star className="inline h-3.5 w-3.5 fill-accent text-accent" /> {courseDetail.rating}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{courseDetail.description}</p>

              <div className="mt-4 flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{courseDetail.progress}% complete</span>
                    <span className="font-medium">{courseDetail.completedLessons}/{courseDetail.totalLessons} lessons</span>
                  </div>
                  <Progress value={courseDetail.progress} className="h-2.5" />
                </div>
                {nextLesson && (
                  <Button
                    className="gradient-primary text-primary-foreground shrink-0"
                    onClick={() => navigate(`/learn/${id}/lesson/${nextLesson.id}`)}
                  >
                    <Play className="h-4 w-4 mr-1" /> Continue
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Curriculum */}
          <div className="space-y-3">
            <h3 className="font-display font-bold text-lg">Course Curriculum</h3>
            {courseDetail.modules.map((mod, mi) => {
              const done = mod.lessons.filter(l => l.completed).length;
              const expanded = expandedModules.includes(mod.id);
              return (
                <Card key={mod.id} className="shadow-card overflow-hidden">
                  <div
                    className="flex items-center gap-3 p-4 cursor-pointer hover:bg-secondary/30 transition-colors"
                    onClick={() => toggleModule(mod.id)}
                  >
                    <span className="text-xs font-bold text-muted-foreground w-6">M{mi + 1}</span>
                    <span className="font-medium flex-1">{mod.title}</span>
                    <span className="text-xs text-muted-foreground">{done}/{mod.lessons.length} done</span>
                    {done === mod.lessons.length
                      ? <CheckCircle2 className="h-5 w-5 text-success" />
                      : <Progress value={(done / mod.lessons.length) * 100} className="h-1.5 w-16" />
                    }
                  </div>
                  {expanded && (
                    <div className="border-t border-border">
                      {mod.lessons.map(lesson => (
                        <div
                          key={lesson.id}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/20 transition-colors cursor-pointer border-b border-border last:border-0"
                          onClick={() => navigate(`/learn/${id}/lesson/${lesson.id}`)}
                        >
                          {lesson.completed
                            ? <CheckCircle2 className="h-4.5 w-4.5 text-success shrink-0" />
                            : <Circle className="h-4.5 w-4.5 text-muted-foreground shrink-0" />
                          }
                          {typeIcons[lesson.type]}
                          <span className={`flex-1 text-sm ${lesson.completed ? "text-muted-foreground" : "text-foreground"}`}>
                            {lesson.title}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {lesson.duration}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-72 space-y-4">
          <Card className="shadow-card">
            <CardContent className="p-4 space-y-3">
              <h4 className="font-display font-bold text-sm">Your Progress</h4>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">{courseDetail.progress}%</div>
                <Progress value={courseDetail.progress} className="h-2 mt-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {courseDetail.completedLessons} of {courseDetail.totalLessons} lessons completed
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4 space-y-2 text-sm">
              <h4 className="font-display font-bold text-sm mb-3">Course Info</h4>
              <div className="flex justify-between"><span className="text-muted-foreground">Instructor</span><span className="font-medium">{courseDetail.instructor}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Lessons</span><span>{courseDetail.totalLessons}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Modules</span><span>{courseDetail.modules.length}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Rating</span><span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-accent text-accent" />{courseDetail.rating}</span></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentCourseDetail;

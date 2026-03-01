import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft, ArrowRight, CheckCircle2, Circle, Play, Pause, Volume2, VolumeX,
  Maximize, List, X, Video, FileText, Image, Clock, ChevronDown, ChevronUp
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

// Mock data
const courseData = {
  id: 1,
  title: "Introduction to React",
  modules: [
    {
      id: 1, title: "Getting Started with React",
      lessons: [
        { id: 1, title: "What is React?", type: "video" as const, duration: "15 min", completed: true, videoTime: 900, savedTime: 900 },
        { id: 2, title: "Setting Up Environment", type: "article" as const, duration: "10 min", completed: true, content: "# Setting Up Your Development Environment\n\n## Prerequisites\n- Node.js 18+ installed\n- A code editor (VS Code recommended)\n- Basic knowledge of HTML, CSS, and JavaScript\n\n## Step 1: Install Node.js\nDownload and install Node.js from [nodejs.org](https://nodejs.org). Verify installation:\n```bash\nnode --version\nnpm --version\n```\n\n## Step 2: Create a New React Project\n```bash\nnpx create-react-app my-first-app\ncd my-first-app\nnpm start\n```\n\n## Step 3: Project Structure\nYour new project contains:\n- `src/` — Your source code\n- `public/` — Static assets\n- `package.json` — Dependencies and scripts\n\n## Step 4: Start Coding\nOpen `src/App.js` and start editing. The browser will hot-reload your changes automatically!\n\n> **Tip:** Install the React Developer Tools browser extension for better debugging." },
        { id: 3, title: "Your First Component", type: "video" as const, duration: "20 min", completed: true, videoTime: 1200, savedTime: 1200 },
      ],
    },
    {
      id: 2, title: "Components & Props",
      lessons: [
        { id: 4, title: "Functional Components", type: "video" as const, duration: "25 min", completed: true, videoTime: 1500, savedTime: 1500 },
        { id: 5, title: "Props Deep Dive", type: "pdf" as const, duration: "15 min", completed: true, fileName: "props-guide.pdf" },
        { id: 6, title: "Component Patterns Slides", type: "slide" as const, duration: "20 min", completed: false, fileName: "patterns.pptx", totalSlides: 24, currentSlide: 1 },
      ],
    },
    {
      id: 3, title: "State & Hooks",
      lessons: [
        { id: 7, title: "useState Hook", type: "video" as const, duration: "30 min", completed: false, videoTime: 1800, savedTime: 450 },
        { id: 8, title: "useEffect Hook", type: "article" as const, duration: "20 min", completed: false, content: "# Understanding useEffect\n\nuseEffect is one of the most important hooks in React. It lets you perform side effects in function components.\n\n## Basic Usage\n```jsx\nuseEffect(() => {\n  // Side effect code\n  document.title = `Count: ${count}`;\n}, [count]);\n```\n\n## Cleanup\n```jsx\nuseEffect(() => {\n  const timer = setInterval(() => {\n    setCount(c => c + 1);\n  }, 1000);\n  return () => clearInterval(timer);\n}, []);\n```\n\n## Common Patterns\n- Data fetching\n- Event listeners\n- Timers and intervals\n- DOM manipulation" },
        { id: 9, title: "Custom Hooks", type: "video" as const, duration: "25 min", completed: false, videoTime: 1500, savedTime: 0 },
        { id: 10, title: "Hooks Practice", type: "pdf" as const, duration: "30 min", completed: false, fileName: "hooks-exercises.pdf" },
      ],
    },
  ],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const allLessons = (courseData.modules as any[]).flatMap((m: any) => m.lessons);

const typeIcons: Record<string, React.ReactNode> = {
  video: <Video className="h-3.5 w-3.5 text-info" />,
  article: <FileText className="h-3.5 w-3.5 text-success" />,
  pdf: <FileText className="h-3.5 w-3.5 text-destructive" />,
  slide: <Image className="h-3.5 w-3.5 text-accent" />,
};

const LessonPlayer = () => {
  const navigate = useNavigate();
  const { courseId, lessonId } = useParams();
  const currentLessonIndex = allLessons.findIndex(l => l.id === Number(lessonId));
  const lesson = allLessons[currentLessonIndex];
  const prevLesson = allLessons[currentLessonIndex - 1];
  const nextLesson = allLessons[currentLessonIndex + 1];

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [videoProgress, setVideoProgress] = useState(lesson?.type === "video" ? ((lesson as any).savedTime / (lesson as any).videoTime) * 100 : 0);
  const [isCompleted, setIsCompleted] = useState(lesson?.completed ?? false);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [expandedModules, setExpandedModules] = useState<number[]>(courseData.modules.map(m => m.id));

  useEffect(() => {
    if (lesson) {
      setIsCompleted(lesson.completed);
      if (lesson.type === "video") {
        setVideoProgress(((lesson as any).savedTime / (lesson as any).videoTime) * 100);
        setIsPlaying(false);
      }
      if (lesson.type === "slide") {
        setCurrentSlide((lesson as any).currentSlide || 1);
      }
    }
  }, [lessonId]);

  // Simulate video playback
  useEffect(() => {
    if (!isPlaying || lesson?.type !== "video") return;
    const interval = setInterval(() => {
      setVideoProgress(prev => {
        if (prev >= 100) {
          setIsPlaying(false);
          setIsCompleted(true);
          return 100;
        }
        return prev + 0.5;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [isPlaying, lesson?.type]);

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Lesson not found</p>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const completedCount = allLessons.filter(l => l.completed || (l.id === lesson.id && isCompleted)).length;

  return (
    <div className="min-h-screen flex bg-background">
      {/* Main content area */}
      <div className={`flex-1 flex flex-col transition-all ${sidebarOpen ? "lg:mr-80" : ""}`}>
        {/* Top bar */}
        <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate(`/learn/${courseId}`)}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            <span className="text-sm font-medium text-foreground truncate max-w-[300px]">{courseData.title}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{completedCount}/{allLessons.length} completed</span>
            <Progress value={(completedCount / allLessons.length) * 100} className="h-1.5 w-24" />
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X className="h-4 w-4" /> : <List className="h-4 w-4" />}
            </Button>
          </div>
        </header>

        {/* Lesson content */}
        <div className="flex-1 overflow-auto">
          {/* ── Video Player ── */}
          {lesson.type === "video" && (
            <div className="bg-foreground/95">
              <div className="max-w-5xl mx-auto">
                <div className="aspect-video flex items-center justify-center relative group">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Video className="h-16 w-16 text-primary-foreground/30 mx-auto mb-2" />
                      <p className="text-primary-foreground/50 text-sm">Video: {lesson.title}</p>
                    </div>
                  </div>
                  {/* Play overlay */}
                  {!isPlaying && (
                    <button
                      className="absolute inset-0 flex items-center justify-center z-10"
                      onClick={() => setIsPlaying(true)}
                    >
                      <div className="h-16 w-16 rounded-full bg-primary/90 flex items-center justify-center hover:bg-primary transition-colors">
                        <Play className="h-7 w-7 text-primary-foreground ml-1" />
                      </div>
                    </button>
                  )}
                  {/* Controls */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Progress value={videoProgress} className="h-1 mb-3 cursor-pointer" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button onClick={() => setIsPlaying(!isPlaying)}>
                          {isPlaying ? <Pause className="h-5 w-5 text-white" /> : <Play className="h-5 w-5 text-white" />}
                        </button>
                        <button onClick={() => setIsMuted(!isMuted)}>
                          {isMuted ? <VolumeX className="h-5 w-5 text-white" /> : <Volume2 className="h-5 w-5 text-white" />}
                        </button>
                        <span className="text-xs text-white/70">
                          {formatTime(((lesson as any).videoTime * videoProgress) / 100)} / {formatTime((lesson as any).videoTime)}
                        </span>
                      </div>
                      <Maximize className="h-4 w-4 text-white cursor-pointer" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Article Viewer ── */}
          {lesson.type === "article" && (
            <div className="max-w-3xl mx-auto py-8 px-6">
              <div className="prose prose-sm max-w-none">
                {((lesson as any).content || "").split("\n").map((line: string, i: number) => {
                  if (line.startsWith("# ")) return <h1 key={i} className="font-display text-2xl font-bold text-foreground mt-6 mb-3">{line.slice(2)}</h1>;
                  if (line.startsWith("## ")) return <h2 key={i} className="font-display text-lg font-bold text-foreground mt-5 mb-2">{line.slice(3)}</h2>;
                  if (line.startsWith("```")) return <div key={i} className="bg-secondary rounded-lg p-3 my-2 font-mono text-xs text-foreground">{line.replace(/```\w*/, "")}</div>;
                  if (line.startsWith("> ")) return <blockquote key={i} className="border-l-4 border-primary pl-4 my-3 text-muted-foreground italic">{line.slice(2)}</blockquote>;
                  if (line.startsWith("- ")) return <li key={i} className="text-sm text-muted-foreground ml-4">{line.slice(2)}</li>;
                  if (line.trim() === "") return <div key={i} className="h-2" />;
                  return <p key={i} className="text-sm text-muted-foreground leading-relaxed">{line}</p>;
                })}
              </div>
            </div>
          )}

          {/* ── PDF Viewer ── */}
          {lesson.type === "pdf" && (
            <div className="max-w-4xl mx-auto py-8 px-6">
              <Card className="shadow-card">
                <CardContent className="p-8 text-center">
                  <FileText className="h-20 w-20 mx-auto text-destructive/30 mb-4" />
                  <h3 className="font-display font-bold text-lg text-foreground mb-2">{(lesson as any).fileName || "Document.pdf"}</h3>
                  <p className="text-sm text-muted-foreground mb-4">PDF document viewer</p>
                  <div className="bg-secondary rounded-lg p-12 mb-4">
                    <p className="text-muted-foreground text-sm">PDF content would render here</p>
                    <p className="text-xs text-muted-foreground mt-2">Supports zoom, page navigation, and annotations</p>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Button variant="outline" size="sm">Download PDF</Button>
                    <Button variant="outline" size="sm">Open in New Tab</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ── Slide Viewer ── */}
          {lesson.type === "slide" && (
            <div className="max-w-5xl mx-auto py-8 px-6">
              <Card className="shadow-card">
                <CardContent className="p-0">
                  <div className="aspect-[16/9] bg-secondary flex items-center justify-center relative rounded-t-lg">
                    <div className="text-center">
                      <Image className="h-16 w-16 mx-auto text-accent/30 mb-3" />
                      <p className="text-lg font-display font-bold text-foreground">Slide {currentSlide}</p>
                      <p className="text-sm text-muted-foreground">{lesson.title}</p>
                    </div>
                    {/* Slide navigation overlay */}
                    <button
                      className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-card/80 flex items-center justify-center hover:bg-card transition-colors disabled:opacity-30"
                      disabled={currentSlide <= 1}
                      onClick={() => setCurrentSlide(s => s - 1)}
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                    <button
                      className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-card/80 flex items-center justify-center hover:bg-card transition-colors disabled:opacity-30"
                      disabled={currentSlide >= ((lesson as any).totalSlides || 24)}
                      onClick={() => setCurrentSlide(s => s + 1)}
                    >
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Slide {currentSlide} of {(lesson as any).totalSlides || 24}</span>
                    <Progress value={(currentSlide / ((lesson as any).totalSlides || 24)) * 100} className="h-1.5 w-32" />
                    <Button variant="outline" size="sm">Download Slides</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Lesson footer */}
          <div className="max-w-3xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {prevLesson && (
                  <Button variant="outline" size="sm" onClick={() => navigate(`/learn/${courseId}/lesson/${prevLesson.id}`)}>
                    <ArrowLeft className="h-4 w-4 mr-1" /> Previous
                  </Button>
                )}
              </div>
              <Button
                variant={isCompleted ? "secondary" : "default"}
                size="sm"
                onClick={() => setIsCompleted(!isCompleted)}
                className={isCompleted ? "" : "gradient-primary text-primary-foreground"}
              >
                {isCompleted ? <><CheckCircle2 className="h-4 w-4 mr-1 text-success" /> Completed</> : <>Mark as Complete</>}
              </Button>
              <div className="flex items-center gap-3">
                {nextLesson && (
                  <Button className="gradient-primary text-primary-foreground" size="sm" onClick={() => navigate(`/learn/${courseId}/lesson/${nextLesson.id}`)}>
                    Next <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Course Sidebar ── */}
      {sidebarOpen && (
        <aside className="fixed right-0 top-0 bottom-0 w-80 bg-card border-l border-border overflow-y-auto z-30 hidden lg:block">
          <div className="p-4 border-b border-border">
            <h3 className="font-display font-bold text-sm truncate">{courseData.title}</h3>
            <div className="flex items-center gap-2 mt-1.5">
              <Progress value={(completedCount / allLessons.length) * 100} className="h-1.5 flex-1" />
              <span className="text-xs text-muted-foreground">{completedCount}/{allLessons.length}</span>
            </div>
          </div>
          <div>
            {courseData.modules.map(mod => {
              const expanded = expandedModules.includes(mod.id);
              const done = mod.lessons.filter(l => l.completed || (l.id === lesson.id && isCompleted)).length;
              return (
                <div key={mod.id}>
                  <button
                    className="w-full flex items-center gap-2 p-3 text-left hover:bg-secondary/30 transition-colors border-b border-border"
                    onClick={() => setExpandedModules(prev => prev.includes(mod.id) ? prev.filter(x => x !== mod.id) : [...prev, mod.id])}
                  >
                    {expanded ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground shrink-0" /> : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />}
                    <span className="text-sm font-medium flex-1 truncate">{mod.title}</span>
                    <span className="text-xs text-muted-foreground">{done}/{mod.lessons.length}</span>
                  </button>
                  {expanded && mod.lessons.map(l => (
                    <button
                      key={l.id}
                      className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left hover:bg-secondary/20 transition-colors border-b border-border/50 ${l.id === lesson.id ? "bg-primary/5 border-l-2 border-l-primary" : ""}`}
                      onClick={() => navigate(`/learn/${courseId}/lesson/${l.id}`)}
                    >
                      {(l.completed || (l.id === lesson.id && isCompleted))
                        ? <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                        : <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                      }
                      {typeIcons[l.type]}
                      <span className={`text-xs flex-1 truncate ${l.id === lesson.id ? "font-medium text-primary" : l.completed ? "text-muted-foreground" : "text-foreground"}`}>
                        {l.title}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{l.duration}</span>
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        </aside>
      )}
    </div>
  );
};

export default LessonPlayer;

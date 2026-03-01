import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ArrowLeft, Plus, GripVertical, Edit, Trash2, Video, FileText, Image,
  Upload, ChevronDown, ChevronUp, Save, Eye, BookOpen, Settings
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

interface Lesson {
  id: number;
  title: string;
  type: "video" | "article" | "pdf" | "slide";
  duration: string;
  content?: string;
  fileName?: string;
}

interface Module {
  id: number;
  title: string;
  lessons: Lesson[];
  isExpanded: boolean;
}

const initialCourse = {
  title: "Introduction to React",
  description: "A comprehensive course covering React fundamentals, hooks, state management, and modern best practices for building interactive user interfaces.",
  category: "Web Development",
  level: "Beginner",
  thumbnail: "",
  status: "Draft" as const,
  price: "49.99",
  instructor: "Dr. Sarah Chen",
};

const initialModules: Module[] = [
  {
    id: 1, title: "Getting Started with React", isExpanded: true,
    lessons: [
      { id: 1, title: "What is React?", type: "video", duration: "15 min", fileName: "intro-react.mp4" },
      { id: 2, title: "Setting Up Environment", type: "article", duration: "10 min" },
      { id: 3, title: "Your First Component", type: "video", duration: "20 min", fileName: "first-component.mp4" },
    ],
  },
  {
    id: 2, title: "Components & Props", isExpanded: false,
    lessons: [
      { id: 4, title: "Functional Components", type: "video", duration: "25 min" },
      { id: 5, title: "Props Deep Dive", type: "pdf", duration: "15 min", fileName: "props-guide.pdf" },
      { id: 6, title: "Component Patterns Slides", type: "slide", duration: "20 min", fileName: "patterns.pptx" },
    ],
  },
  {
    id: 3, title: "State & Hooks", isExpanded: false,
    lessons: [
      { id: 7, title: "useState Hook", type: "video", duration: "30 min" },
      { id: 8, title: "useEffect Hook", type: "article", duration: "20 min" },
    ],
  },
];

const typeConfig: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  video: { icon: <Video className="h-4 w-4" />, label: "Video", color: "text-info" },
  article: { icon: <FileText className="h-4 w-4" />, label: "Article", color: "text-success" },
  pdf: { icon: <FileText className="h-4 w-4" />, label: "PDF", color: "text-destructive" },
  slide: { icon: <Image className="h-4 w-4" />, label: "Slide", color: "text-accent" },
};

const CourseEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [course, setCourse] = useState(initialCourse);
  const [modules, setModules] = useState<Module[]>(initialModules);
  const [editingModuleId, setEditingModuleId] = useState<number | null>(null);
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [addingLessonToModule, setAddingLessonToModule] = useState<number | null>(null);
  const [newLesson, setNewLesson] = useState({ title: "", type: "video" as Lesson["type"], duration: "" });
  const [editingLesson, setEditingLesson] = useState<{ moduleId: number; lesson: Lesson } | null>(null);

  const toggleModule = (moduleId: number) => {
    setModules(modules.map(m => m.id === moduleId ? { ...m, isExpanded: !m.isExpanded } : m));
  };

  const addModule = () => {
    if (!newModuleTitle.trim()) return;
    setModules([...modules, { id: Date.now(), title: newModuleTitle, lessons: [], isExpanded: true }]);
    setNewModuleTitle("");
  };

  const deleteModule = (moduleId: number) => {
    setModules(modules.filter(m => m.id !== moduleId));
  };

  const addLesson = (moduleId: number) => {
    if (!newLesson.title.trim()) return;
    setModules(modules.map(m => m.id === moduleId
      ? { ...m, lessons: [...m.lessons, { ...newLesson, id: Date.now(), duration: newLesson.duration || "10 min" }] }
      : m
    ));
    setNewLesson({ title: "", type: "video", duration: "" });
    setAddingLessonToModule(null);
  };

  const deleteLesson = (moduleId: number, lessonId: number) => {
    setModules(modules.map(m => m.id === moduleId
      ? { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) }
      : m
    ));
  };

  const updateLesson = (moduleId: number, lessonId: number, updated: Partial<Lesson>) => {
    setModules(modules.map(m => m.id === moduleId
      ? { ...m, lessons: m.lessons.filter(l => l.id === lessonId ? Object.assign(l, updated) || true : true) }
      : m
    ));
  };

  const saveEditingLesson = () => {
    if (!editingLesson) return;
    updateLesson(editingLesson.moduleId, editingLesson.lesson.id, editingLesson.lesson);
    setEditingLesson(null);
  };

  const totalLessons = modules.reduce((a, m) => a + m.lessons.length, 0);

  return (
    <DashboardLayout title="Edit Course">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => navigate("/courses")}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Courses
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate(`/courses/${id}`)}>
            <Eye className="h-4 w-4 mr-1" /> Preview
          </Button>
          <Button size="sm" className="gradient-primary text-primary-foreground">
            <Save className="h-4 w-4 mr-1" /> Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="curriculum" className="space-y-6">
        <TabsList>
          <TabsTrigger value="info"><Settings className="h-4 w-4 mr-1.5" /> Course Info</TabsTrigger>
          <TabsTrigger value="curriculum"><BookOpen className="h-4 w-4 mr-1.5" /> Curriculum</TabsTrigger>
        </TabsList>

        {/* ── Course Info Tab ── */}
        <TabsContent value="info" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader><CardTitle className="text-base">Basic Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">Course Title</label>
                  <Input value={course.title} onChange={e => setCourse({ ...course, title: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">Category</label>
                  <Input value={course.category} onChange={e => setCourse({ ...course, category: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">Level</label>
                  <Select value={course.level} onValueChange={v => setCourse({ ...course, level: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">Price ($)</label>
                  <Input type="number" value={course.price} onChange={e => setCourse({ ...course, price: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Description</label>
                <textarea
                  className="w-full rounded-md border border-input bg-background p-3 text-sm min-h-[120px] focus:outline-none focus:ring-2 focus:ring-ring"
                  value={course.description}
                  onChange={e => setCourse({ ...course, description: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader><CardTitle className="text-base">Thumbnail</CardTitle></CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm font-medium text-foreground mb-1">Click to upload thumbnail</p>
                <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB. Recommended 16:9</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Curriculum Tab ── */}
        <TabsContent value="curriculum" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-lg">Modules & Lessons</h3>
              <p className="text-sm text-muted-foreground">{modules.length} modules · {totalLessons} lessons</p>
            </div>
          </div>

          {modules.map((mod, mi) => (
            <Card key={mod.id} className="shadow-card overflow-hidden">
              <div
                className="flex items-center gap-3 p-4 bg-secondary/30 cursor-pointer hover:bg-secondary/50 transition-colors"
                onClick={() => toggleModule(mod.id)}
              >
                <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab shrink-0" />
                <span className="text-xs font-medium text-muted-foreground w-6">#{mi + 1}</span>
                {editingModuleId === mod.id ? (
                  <Input
                    autoFocus
                    defaultValue={mod.title}
                    onClick={e => e.stopPropagation()}
                    onBlur={e => {
                      setModules(modules.map(m => m.id === mod.id ? { ...m, title: e.target.value } : m));
                      setEditingModuleId(null);
                    }}
                    onKeyDown={e => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
                    className="h-8 text-sm"
                  />
                ) : (
                  <span className="font-medium flex-1">{mod.title}</span>
                )}
                <Badge variant="secondary" className="text-xs">{mod.lessons.length} lessons</Badge>
                <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditingModuleId(mod.id)}>
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteModule(mod.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                {mod.isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
              </div>

              {mod.isExpanded && (
                <CardContent className="pt-2 pb-3">
                  <div className="space-y-1">
                    {mod.lessons.map((lesson, li) => (
                      <div key={lesson.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary/40 transition-colors group">
                        <GripVertical className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 cursor-grab" />
                        <span className="text-xs text-muted-foreground w-4">{li + 1}</span>
                        <span className={typeConfig[lesson.type].color}>{typeConfig[lesson.type].icon}</span>
                        <span className="flex-1 text-sm">{lesson.title}</span>
                        {lesson.fileName && (
                          <Badge variant="outline" className="text-xs font-normal">{lesson.fileName}</Badge>
                        )}
                        <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditingLesson({ moduleId: mod.id, lesson: { ...lesson } })}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteLesson(mod.id, lesson.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {addingLessonToModule === mod.id ? (
                    <div className="mt-3 p-3 rounded-lg border border-border bg-secondary/20 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <Input
                          placeholder="Lesson title"
                          value={newLesson.title}
                          onChange={e => setNewLesson({ ...newLesson, title: e.target.value })}
                        />
                        <Select value={newLesson.type} onValueChange={v => setNewLesson({ ...newLesson, type: v as Lesson["type"] })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="video">Video</SelectItem>
                            <SelectItem value="article">Article</SelectItem>
                            <SelectItem value="pdf">PDF</SelectItem>
                            <SelectItem value="slide">Slide</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input placeholder="Duration (e.g. 15 min)" value={newLesson.duration} onChange={e => setNewLesson({ ...newLesson, duration: e.target.value })} />
                      </div>
                      <div className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors">
                        <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-1" />
                        <p className="text-xs text-muted-foreground">Upload video, PDF, or slide file</p>
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" size="sm" onClick={() => setAddingLessonToModule(null)}>Cancel</Button>
                        <Button size="sm" className="gradient-primary text-primary-foreground" onClick={() => addLesson(mod.id)}>Add Lesson</Button>
                      </div>
                    </div>
                  ) : (
                    <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground mt-2" onClick={() => setAddingLessonToModule(mod.id)}>
                      <Plus className="h-3.5 w-3.5 mr-1" /> Add Lesson
                    </Button>
                  )}
                </CardContent>
              )}
            </Card>
          ))}

          {/* Add new module */}
          <Card className="shadow-card border-dashed">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Input placeholder="New module title..." value={newModuleTitle} onChange={e => setNewModuleTitle(e.target.value)} onKeyDown={e => e.key === "Enter" && addModule()} />
                <Button className="gradient-primary text-primary-foreground shrink-0" onClick={addModule}>
                  <Plus className="h-4 w-4 mr-1" /> Add Module
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Lesson Dialog */}
      <Dialog open={!!editingLesson} onOpenChange={open => !open && setEditingLesson(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Lesson</DialogTitle>
          </DialogHeader>
          {editingLesson && (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Lesson Title</label>
                <Input
                  value={editingLesson.lesson.title}
                  onChange={e => setEditingLesson({ ...editingLesson, lesson: { ...editingLesson.lesson, title: e.target.value } })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">Type</label>
                  <Select
                    value={editingLesson.lesson.type}
                    onValueChange={v => setEditingLesson({ ...editingLesson, lesson: { ...editingLesson.lesson, type: v as Lesson["type"] } })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="article">Article</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="slide">Slide</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">Duration</label>
                  <Input
                    value={editingLesson.lesson.duration}
                    onChange={e => setEditingLesson({ ...editingLesson, lesson: { ...editingLesson.lesson, duration: e.target.value } })}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">File</label>
                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors">
                  <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-1" />
                  <p className="text-xs text-muted-foreground">
                    {editingLesson.lesson.fileName || "Upload video, PDF, or slide file"}
                  </p>
                </div>
              </div>
              {editingLesson.lesson.type === "article" && (
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">Content</label>
                  <textarea
                    className="w-full rounded-md border border-input bg-background p-3 text-sm min-h-[120px] focus:outline-none focus:ring-2 focus:ring-ring"
                    value={editingLesson.lesson.content || ""}
                    onChange={e => setEditingLesson({ ...editingLesson, lesson: { ...editingLesson.lesson, content: e.target.value } })}
                    placeholder="Write article content..."
                  />
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingLesson(null)}>Cancel</Button>
            <Button className="gradient-primary text-primary-foreground" onClick={saveEditingLesson}>
              <Save className="h-4 w-4 mr-1" /> Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default CourseEdit;

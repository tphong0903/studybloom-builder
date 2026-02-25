import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, Clock, BookOpen, Edit, Trash2, Plus, GripVertical, FileText, Video, Link as LinkIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const courseData = {
  id: 1,
  title: "Introduction to React",
  category: "Web Development",
  description: "A comprehensive course covering React fundamentals, hooks, state management, and modern best practices for building interactive user interfaces.",
  instructor: "Dr. Sarah Chen",
  students: 156,
  duration: "8 weeks",
  status: "Active",
  progress: 78,
  startDate: "Jan 15, 2026",
  endDate: "Mar 12, 2026",
  modules: [
    {
      id: 1, title: "Getting Started with React", lessons: [
        { id: 1, title: "What is React?", type: "video", duration: "15 min", completed: true },
        { id: 2, title: "Setting Up Development Environment", type: "article", duration: "10 min", completed: true },
        { id: 3, title: "Your First Component", type: "video", duration: "20 min", completed: true },
      ]
    },
    {
      id: 2, title: "Components & Props", lessons: [
        { id: 4, title: "Functional Components", type: "video", duration: "25 min", completed: true },
        { id: 5, title: "Props and Data Flow", type: "article", duration: "15 min", completed: true },
        { id: 6, title: "Component Composition", type: "video", duration: "20 min", completed: false },
      ]
    },
    {
      id: 3, title: "State & Hooks", lessons: [
        { id: 7, title: "useState Hook", type: "video", duration: "30 min", completed: false },
        { id: 8, title: "useEffect Hook", type: "article", duration: "20 min", completed: false },
        { id: 9, title: "Custom Hooks", type: "video", duration: "25 min", completed: false },
        { id: 10, title: "Hooks Quiz", type: "quiz", duration: "30 min", completed: false },
      ]
    },
  ],
  enrolledStudents: [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", progress: 85, grade: "A" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", progress: 72, grade: "B+" },
    { id: 3, name: "Carol White", email: "carol@example.com", progress: 95, grade: "A+" },
    { id: 4, name: "David Lee", email: "david@example.com", progress: 60, grade: "B" },
    { id: 5, name: "Emma Davis", email: "emma@example.com", progress: 45, grade: "C+" },
  ],
};

const typeIcons: Record<string, React.ReactNode> = {
  video: <Video className="h-4 w-4 text-info" />,
  article: <FileText className="h-4 w-4 text-success" />,
  quiz: <LinkIcon className="h-4 w-4 text-accent" />,
};

const CourseDetail = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout title="Course Detail">
      <Button variant="ghost" size="sm" className="mb-4 text-muted-foreground" onClick={() => navigate("/courses")}>
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Courses
      </Button>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main content */}
        <div className="flex-1 space-y-6">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Badge className="mb-2 bg-success/10 text-success border-0">{courseData.status}</Badge>
                  <h2 className="font-display font-bold text-2xl text-foreground">{courseData.title}</h2>
                  <p className="text-muted-foreground text-sm mt-1">{courseData.category} · {courseData.instructor}</p>
                </div>
                <Button variant="outline" size="sm"><Edit className="h-4 w-4 mr-1" /> Edit</Button>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{courseData.description}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                <div className="text-center p-3 bg-secondary rounded-lg">
                  <Users className="h-5 w-5 mx-auto text-primary mb-1" />
                  <p className="text-lg font-bold">{courseData.students}</p>
                  <p className="text-xs text-muted-foreground">Students</p>
                </div>
                <div className="text-center p-3 bg-secondary rounded-lg">
                  <Clock className="h-5 w-5 mx-auto text-primary mb-1" />
                  <p className="text-lg font-bold">{courseData.duration}</p>
                  <p className="text-xs text-muted-foreground">Duration</p>
                </div>
                <div className="text-center p-3 bg-secondary rounded-lg">
                  <BookOpen className="h-5 w-5 mx-auto text-primary mb-1" />
                  <p className="text-lg font-bold">{courseData.modules.reduce((a, m) => a + m.lessons.length, 0)}</p>
                  <p className="text-xs text-muted-foreground">Lessons</p>
                </div>
                <div className="text-center p-3 bg-secondary rounded-lg">
                  <p className="text-lg font-bold text-primary">{courseData.progress}%</p>
                  <p className="text-xs text-muted-foreground">Progress</p>
                  <Progress value={courseData.progress} className="h-1.5 mt-1" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="curriculum">
            <TabsList>
              <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
              <TabsTrigger value="students">Students ({courseData.enrolledStudents.length})</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="curriculum" className="space-y-4 mt-4">
              <div className="flex justify-between items-center">
                <h3 className="font-display font-bold">Modules & Lessons</h3>
                <Button size="sm" className="gradient-primary text-primary-foreground"><Plus className="h-4 w-4 mr-1" /> Add Module</Button>
              </div>
              {courseData.modules.map((mod) => (
                <Card key={mod.id} className="shadow-card">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                        <CardTitle className="text-base">{mod.title}</CardTitle>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      {mod.lessons.map((lesson) => (
                        <div key={lesson.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary/50 transition-colors group">
                          <GripVertical className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 cursor-grab" />
                          {typeIcons[lesson.type]}
                          <span className={`flex-1 text-sm ${lesson.completed ? "text-muted-foreground line-through" : "text-foreground"}`}>{lesson.title}</span>
                          <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                          <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100"><Edit className="h-3 w-3" /></Button>
                        </div>
                      ))}
                      <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground mt-1"><Plus className="h-3.5 w-3.5 mr-1" /> Add Lesson</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="students" className="mt-4">
              <Card className="shadow-card">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left p-4 text-muted-foreground font-medium">Student</th>
                          <th className="text-left p-4 text-muted-foreground font-medium">Email</th>
                          <th className="text-left p-4 text-muted-foreground font-medium">Progress</th>
                          <th className="text-left p-4 text-muted-foreground font-medium">Grade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {courseData.enrolledStudents.map((s) => (
                          <tr key={s.id} className="border-b border-border last:border-0 hover:bg-secondary/30">
                            <td className="p-4 font-medium">{s.name}</td>
                            <td className="p-4 text-muted-foreground">{s.email}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Progress value={s.progress} className="h-1.5 w-20" />
                                <span className="text-xs">{s.progress}%</span>
                              </div>
                            </td>
                            <td className="p-4"><Badge variant="secondary">{s.grade}</Badge></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="mt-4 space-y-4">
              <Card className="shadow-card">
                <CardHeader><CardTitle className="text-base">Course Information</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="text-sm text-muted-foreground mb-1 block">Course Title</label><Input defaultValue={courseData.title} /></div>
                    <div><label className="text-sm text-muted-foreground mb-1 block">Category</label><Input defaultValue={courseData.category} /></div>
                    <div><label className="text-sm text-muted-foreground mb-1 block">Start Date</label><Input defaultValue={courseData.startDate} /></div>
                    <div><label className="text-sm text-muted-foreground mb-1 block">End Date</label><Input defaultValue={courseData.endDate} /></div>
                  </div>
                  <div><label className="text-sm text-muted-foreground mb-1 block">Description</label><textarea className="w-full rounded-md border border-input bg-background p-3 text-sm min-h-[100px]" defaultValue={courseData.description} /></div>
                  <Button className="gradient-primary text-primary-foreground">Save Changes</Button>
                </CardContent>
              </Card>
              <Card className="shadow-card border-destructive/20">
                <CardHeader><CardTitle className="text-base text-destructive">Danger Zone</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">Once you delete a course, there is no going back.</p>
                  <Button variant="destructive" size="sm"><Trash2 className="h-4 w-4 mr-1" /> Delete Course</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar info */}
        <div className="w-full lg:w-72 space-y-4">
          <Card className="shadow-card">
            <CardHeader className="pb-2"><CardTitle className="text-sm">Quick Info</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Instructor</span><span className="font-medium">{courseData.instructor}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Start</span><span>{courseData.startDate}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">End</span><span>{courseData.endDate}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Status</span><Badge className="bg-success/10 text-success border-0 text-xs">{courseData.status}</Badge></div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardHeader className="pb-2"><CardTitle className="text-sm">Completion Rate</CardTitle></CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary text-center">{courseData.progress}%</div>
              <Progress value={courseData.progress} className="h-2 mt-2" />
              <p className="text-xs text-muted-foreground text-center mt-2">{Math.round(courseData.modules.reduce((a, m) => a + m.lessons.filter(l => l.completed).length, 0))} of {courseData.modules.reduce((a, m) => a + m.lessons.length, 0)} lessons completed</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CourseDetail;

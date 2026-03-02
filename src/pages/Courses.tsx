import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Users, Clock, BookOpen, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const initialCourses = [
  { id: 1, title: "Introduction to React", category: "Web Development", students: 156, duration: "8 weeks", progress: 78, status: "Active", lessons: 24 },
  { id: 2, title: "Advanced Python Programming", category: "Programming", students: 89, duration: "10 weeks", progress: 45, status: "Active", lessons: 32 },
  { id: 3, title: "UI/UX Design Fundamentals", category: "Design", students: 234, duration: "6 weeks", progress: 92, status: "Completed", lessons: 18 },
  { id: 4, title: "Data Structures & Algorithms", category: "Computer Science", students: 112, duration: "12 weeks", progress: 30, status: "Active", lessons: 40 },
  { id: 5, title: "Machine Learning Basics", category: "AI & ML", students: 67, duration: "8 weeks", progress: 15, status: "Draft", lessons: 20 },
  { id: 6, title: "Digital Marketing", category: "Marketing", students: 198, duration: "4 weeks", progress: 60, status: "Active", lessons: 16 },
];

const statusStyles: Record<string, string> = {
  Active: "bg-success/10 text-success",
  Completed: "bg-info/10 text-info",
  Draft: "bg-muted text-muted-foreground",
};

const Courses = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [courses, setCourses] = useState(initialCourses);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: "",
    category: "",
    description: "",
    level: "Beginner",
    duration: "",
  });

  const filteredCourses = courses.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCourse = () => {
    if (!newCourse.title.trim() || !newCourse.category.trim()) {
      toast({ title: "Missing info", description: "Please fill in title and category.", variant: "destructive" });
      return;
    }
    const created = {
      id: Date.now(),
      title: newCourse.title,
      category: newCourse.category,
      students: 0,
      duration: newCourse.duration || "4 weeks",
      progress: 0,
      status: "Draft",
      lessons: 0,
    };
    setCourses([created, ...courses]);
    setNewCourse({ title: "", category: "", description: "", level: "Beginner", duration: "" });
    setShowAddDialog(false);
    toast({ title: "Course created!", description: `"${created.title}" has been added as a draft.` });
  };

  return (
    <DashboardLayout title="Course Management">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search courses..." className="pl-9" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        <Button className="gradient-primary text-primary-foreground gap-2 hover:opacity-90" onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4" /> New Course
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="shadow-card hover:shadow-card-hover transition-all group cursor-pointer" onClick={() => navigate(`/courses/${course.id}`)}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs text-muted-foreground font-medium">{course.category}</span>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusStyles[course.status]}`}>
                  {course.status}
                </span>
              </div>
              <h3 className="font-display font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                {course.title}
              </h3>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {course.students}</span>
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {course.duration}</span>
                <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" /> {course.lessons} lessons</span>
              </div>
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-2" />
                <Button variant="ghost" size="sm" className="w-full mt-3 text-xs" onClick={(e) => { e.stopPropagation(); navigate(`/courses/${course.id}/edit`); }}>
                  <Edit className="h-3.5 w-3.5 mr-1" /> Edit Course
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-16">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <h3 className="font-display font-bold text-lg text-foreground mb-1">No courses found</h3>
          <p className="text-sm text-muted-foreground">Try a different search or create a new course.</p>
        </div>
      )}

      {/* Add Course Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Course</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Course Title *</label>
              <Input
                placeholder="e.g. Introduction to Machine Learning"
                value={newCourse.title}
                onChange={e => setNewCourse({ ...newCourse, title: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Category *</label>
                <Input
                  placeholder="e.g. Web Development"
                  value={newCourse.category}
                  onChange={e => setNewCourse({ ...newCourse, category: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Level</label>
                <Select value={newCourse.level} onValueChange={v => setNewCourse({ ...newCourse, level: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Duration</label>
              <Input
                placeholder="e.g. 8 weeks"
                value={newCourse.duration}
                onChange={e => setNewCourse({ ...newCourse, duration: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Description</label>
              <textarea
                className="w-full rounded-md border border-input bg-background p-3 text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Describe what students will learn..."
                value={newCourse.description}
                onChange={e => setNewCourse({ ...newCourse, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button className="gradient-primary text-primary-foreground" onClick={handleAddCourse}>
              <Plus className="h-4 w-4 mr-1" /> Create Course
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Courses;

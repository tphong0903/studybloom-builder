import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Clock, BookOpen, Play, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const enrolledCourses = [
  { id: 1, title: "Introduction to React", description: "Learn React fundamentals including components, hooks, and state management.", category: "Web Development", instructor: "Dr. Sarah Chen", thumbnail: "🖥️", progress: 65, totalLessons: 24, completedLessons: 16, duration: "8 weeks", rating: 4.8, lastAccessed: "2 hours ago" },
  { id: 2, title: "Advanced Python Programming", description: "Master advanced Python concepts like decorators, generators, and async programming.", category: "Programming", instructor: "Prof. James Miller", thumbnail: "🐍", progress: 30, totalLessons: 32, completedLessons: 10, duration: "10 weeks", rating: 4.6, lastAccessed: "1 day ago" },
  { id: 3, title: "UI/UX Design Fundamentals", description: "Explore design thinking, wireframing, prototyping, and user research methods.", category: "Design", instructor: "Lisa Park", thumbnail: "🎨", progress: 100, totalLessons: 18, completedLessons: 18, duration: "6 weeks", rating: 4.9, lastAccessed: "1 week ago" },
];

const availableCourses = [
  { id: 4, title: "Data Structures & Algorithms", description: "Deep dive into fundamental CS concepts with hands-on coding exercises.", category: "Computer Science", instructor: "Dr. Alan Turing Jr.", thumbnail: "🧮", totalLessons: 40, duration: "12 weeks", rating: 4.7, students: 112, price: "$49.99" },
  { id: 5, title: "Machine Learning Basics", description: "Introduction to ML algorithms, neural networks, and practical applications.", category: "AI & ML", instructor: "Prof. Ada Lovelace", thumbnail: "🤖", totalLessons: 20, duration: "8 weeks", rating: 4.5, students: 67, price: "$59.99" },
  { id: 6, title: "Digital Marketing Mastery", description: "Learn SEO, social media marketing, PPC advertising, and analytics.", category: "Marketing", instructor: "Emily Roberts", thumbnail: "📈", totalLessons: 16, duration: "4 weeks", rating: 4.4, students: 198, price: "$29.99" },
  { id: 7, title: "Cybersecurity Essentials", description: "Understand network security, cryptography, and ethical hacking fundamentals.", category: "Security", instructor: "John McAfee II", thumbnail: "🔒", totalLessons: 28, duration: "10 weeks", rating: 4.8, students: 85, price: "$69.99" },
];

const StudentCourses = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout title="My Courses">
      <Tabs defaultValue="enrolled" className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <TabsList>
            <TabsTrigger value="enrolled">My Courses ({enrolledCourses.length})</TabsTrigger>
            <TabsTrigger value="browse">Browse Catalog</TabsTrigger>
          </TabsList>
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search courses..." className="pl-9" />
          </div>
        </div>

        {/* ── Enrolled Courses ── */}
        <TabsContent value="enrolled">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {enrolledCourses.map(course => (
              <Card
                key={course.id}
                className="shadow-card hover:shadow-card-hover transition-all cursor-pointer group"
                onClick={() => navigate(`/learn/${course.id}`)}
              >
                <CardContent className="p-0">
                  <div className="h-36 bg-secondary flex items-center justify-center text-5xl rounded-t-lg group-hover:scale-[1.02] transition-transform">
                    {course.thumbnail}
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <Badge variant="secondary" className="text-xs">{course.category}</Badge>
                      {course.progress === 100 && <Badge className="bg-success/10 text-success border-0 text-xs">Completed</Badge>}
                    </div>
                    <h3 className="font-display font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                      {course.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{course.description}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" /> {course.completedLessons}/{course.totalLessons}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {course.lastAccessed}</span>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-muted-foreground">{course.progress}% complete</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                    <Button size="sm" className="w-full gradient-primary text-primary-foreground gap-1.5">
                      <Play className="h-3.5 w-3.5" /> {course.progress === 100 ? "Review" : "Continue Learning"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ── Browse Catalog ── */}
        <TabsContent value="browse">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {availableCourses.map(course => (
              <Card
                key={course.id}
                className="shadow-card hover:shadow-card-hover transition-all cursor-pointer group"
                onClick={() => navigate(`/learn/${course.id}`)}
              >
                <CardContent className="p-0">
                  <div className="h-36 bg-secondary flex items-center justify-center text-5xl rounded-t-lg">
                    {course.thumbnail}
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <Badge variant="secondary" className="text-xs">{course.category}</Badge>
                      <span className="font-bold text-primary text-sm">{course.price}</span>
                    </div>
                    <h3 className="font-display font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                      {course.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{course.description}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-accent text-accent" /> {course.rating}</span>
                      <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" /> {course.totalLessons} lessons</span>
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {course.duration}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">by {course.instructor}</p>
                    <Button size="sm" variant="outline" className="w-full">Enroll Now</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default StudentCourses;

import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Clock, FileText, Users, CheckCircle2 } from "lucide-react";

const quizzes = [
  { id: 1, title: "React Hooks Assessment", course: "Introduction to React", questions: 20, duration: "30 min", attempts: 142, avgScore: 78, status: "Published", dueDate: "Feb 28, 2026" },
  { id: 2, title: "Python Midterm Exam", course: "Advanced Python", questions: 40, duration: "90 min", attempts: 67, avgScore: 72, status: "Published", dueDate: "Mar 5, 2026" },
  { id: 3, title: "Design Principles Quiz", course: "UI/UX Design", questions: 15, duration: "20 min", attempts: 210, avgScore: 85, status: "Closed", dueDate: "Feb 20, 2026" },
  { id: 4, title: "Algorithm Complexity Test", course: "Data Structures", questions: 25, duration: "45 min", attempts: 0, avgScore: 0, status: "Draft", dueDate: "Mar 15, 2026" },
  { id: 5, title: "ML Concepts Quiz", course: "Machine Learning", questions: 30, duration: "40 min", attempts: 45, avgScore: 68, status: "Published", dueDate: "Mar 10, 2026" },
];

const statusStyles: Record<string, string> = {
  Published: "bg-success/10 text-success",
  Draft: "bg-muted text-muted-foreground",
  Closed: "bg-destructive/10 text-destructive",
};

const Quizzes = () => {
  return (
    <DashboardLayout title="Quizzes & Tests">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search quizzes..." className="pl-9" />
        </div>
        <Button className="gradient-primary text-primary-foreground gap-2 hover:opacity-90">
          <Plus className="h-4 w-4" /> Create Quiz
        </Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {quizzes.map((quiz) => (
              <Card key={quiz.id} className="shadow-card hover:shadow-card-hover transition-all cursor-pointer group">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs text-muted-foreground">{quiz.course}</span>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusStyles[quiz.status]}`}>
                      {quiz.status}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {quiz.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-4">Due: {quiz.dueDate}</p>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <FileText className="h-3.5 w-3.5" /> {quiz.questions} questions
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" /> {quiz.duration}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Users className="h-3.5 w-3.5" /> {quiz.attempts} attempts
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5" /> {quiz.avgScore}% avg
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 text-xs">View</Button>
                    <Button variant="outline" size="sm" className="flex-1 text-xs">Edit</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="published">
          <p className="text-muted-foreground text-sm">Showing published quizzes...</p>
        </TabsContent>
        <TabsContent value="draft">
          <p className="text-muted-foreground text-sm">Showing draft quizzes...</p>
        </TabsContent>
        <TabsContent value="closed">
          <p className="text-muted-foreground text-sm">Showing closed quizzes...</p>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Quizzes;

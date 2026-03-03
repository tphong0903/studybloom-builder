import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Plus, Trash2, Edit, Search, Download, Users, UserPlus, Eye,
  ChevronDown, ChevronUp, CheckCircle, Circle, Save,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Student {
  id: number;
  name: string;
  email: string;
  enrolledDate: string;
  progress: number;
  completedLessons: string[];
  status: "active" | "inactive" | "completed";
}

interface ClassGroup {
  id: number;
  name: string;
  studentCount: number;
}

const initialStudents: Student[] = [
  {
    id: 1, name: "Nguyễn Văn An", email: "an.nguyen@email.com",
    enrolledDate: "2025-01-15", progress: 75,
    completedLessons: ["What is React?", "Setting Up Environment", "Your First Component", "Functional Components", "Props Deep Dive"],
    status: "active",
  },
  {
    id: 2, name: "Trần Thị Bình", email: "binh.tran@email.com",
    enrolledDate: "2025-02-01", progress: 45,
    completedLessons: ["What is React?", "Setting Up Environment", "Your First Component"],
    status: "active",
  },
  {
    id: 3, name: "Lê Hoàng Cường", email: "cuong.le@email.com",
    enrolledDate: "2024-12-20", progress: 100,
    completedLessons: ["What is React?", "Setting Up Environment", "Your First Component", "Functional Components", "Props Deep Dive", "Component Patterns Slides", "useState Hook", "useEffect Hook"],
    status: "completed",
  },
  {
    id: 4, name: "Phạm Minh Đức", email: "duc.pham@email.com",
    enrolledDate: "2025-02-10", progress: 12,
    completedLessons: ["What is React?"],
    status: "active",
  },
  {
    id: 5, name: "Hoàng Thị Mai", email: "mai.hoang@email.com",
    enrolledDate: "2025-01-28", progress: 0,
    completedLessons: [],
    status: "inactive",
  },
];

const availableClasses: ClassGroup[] = [
  { id: 1, name: "CNTT K20A", studentCount: 35 },
  { id: 2, name: "CNTT K20B", studentCount: 32 },
  { id: 3, name: "KTPM K21", studentCount: 28 },
  { id: 4, name: "HTTT K21", studentCount: 30 },
];

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  active: { label: "Đang học", variant: "default" },
  inactive: { label: "Không hoạt động", variant: "destructive" },
  completed: { label: "Hoàn thành", variant: "secondary" },
};

const StudentManagement = () => {
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showAddClassDialog, setShowAddClassDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [newStudent, setNewStudent] = useState({ name: "", email: "" });
  const [editStudent, setEditStudent] = useState<Student | null>(null);

  const filtered = students.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleAddStudent = () => {
    if (!newStudent.name.trim() || !newStudent.email.trim()) return;
    const student: Student = {
      id: Date.now(),
      name: newStudent.name,
      email: newStudent.email,
      enrolledDate: new Date().toISOString().split("T")[0],
      progress: 0,
      completedLessons: [],
      status: "active",
    };
    setStudents([student, ...students]);
    setNewStudent({ name: "", email: "" });
    setShowAddDialog(false);
    toast({ title: "Thêm học viên thành công", description: `${student.name} đã được thêm vào khóa học.` });
  };

  const handleAddClass = (cls: ClassGroup) => {
    toast({ title: "Thêm lớp thành công", description: `Đã thêm ${cls.studentCount} học viên từ lớp ${cls.name}.` });
    setShowAddClassDialog(false);
  };

  const handleEditStudent = () => {
    if (!editStudent) return;
    setStudents(students.map(s => s.id === editStudent.id ? editStudent : s));
    setShowEditDialog(false);
    toast({ title: "Cập nhật thành công" });
  };

  const handleDeleteStudent = (id: number) => {
    setStudents(students.filter(s => s.id !== id));
    toast({ title: "Đã xóa học viên" });
  };

  const exportCSV = () => {
    const headers = ["Họ tên", "Email", "Ngày tham gia", "Tiến độ (%)", "Trạng thái"];
    const rows = students.map(s => [s.name, s.email, s.enrolledDate, s.progress, statusConfig[s.status].label]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "students_report.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Xuất file thành công", description: "File CSV đã được tải xuống." });
  };

  const activeCount = students.filter(s => s.status === "active").length;
  const completedCount = students.filter(s => s.status === "completed").length;
  const avgProgress = students.length > 0 ? Math.round(students.reduce((a, s) => a + s.progress, 0) / students.length) : 0;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{students.length}</p>
            <p className="text-xs text-muted-foreground">Tổng học viên</p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-success">{activeCount}</p>
            <p className="text-xs text-muted-foreground">Đang học</p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-info">{completedCount}</p>
            <p className="text-xs text-muted-foreground">Hoàn thành</p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-accent">{avgProgress}%</p>
            <p className="text-xs text-muted-foreground">TB tiến độ</p>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
        <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Tìm học viên..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="active">Đang học</SelectItem>
              <SelectItem value="inactive">Không hoạt động</SelectItem>
              <SelectItem value="completed">Hoàn thành</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportCSV}>
            <Download className="h-4 w-4 mr-1" /> Xuất CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowAddClassDialog(true)}>
            <Users className="h-4 w-4 mr-1" /> Thêm lớp
          </Button>
          <Button size="sm" className="gradient-primary text-primary-foreground" onClick={() => setShowAddDialog(true)}>
            <UserPlus className="h-4 w-4 mr-1" /> Thêm học viên
          </Button>
        </div>
      </div>

      {/* Student Table */}
      <Card className="shadow-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Họ tên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Ngày tham gia</TableHead>
                <TableHead>Tiến độ</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Không tìm thấy học viên nào.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map(student => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell className="text-muted-foreground">{student.email}</TableCell>
                    <TableCell className="text-muted-foreground">{student.enrolledDate}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 min-w-[120px]">
                        <Progress value={student.progress} className="h-2 flex-1" />
                        <span className="text-xs font-medium w-9 text-right">{student.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusConfig[student.status].variant}>
                        {statusConfig[student.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedStudent(student); setShowDetailDialog(true); }}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditStudent({ ...student }); setShowEditDialog(true); }}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteStudent(student.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="gradient-primary text-primary-foreground" onClick={() => toast({ title: "Đã lưu danh sách học viên" })}>
          <Save className="h-4 w-4 mr-1" /> Lưu thay đổi
        </Button>
      </div>

      {/* Add Student Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Thêm học viên</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Họ tên</label>
              <Input value={newStudent.name} onChange={e => setNewStudent({ ...newStudent, name: e.target.value })} placeholder="Nhập họ tên..." />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Email</label>
              <Input type="email" value={newStudent.email} onChange={e => setNewStudent({ ...newStudent, email: e.target.value })} placeholder="Nhập email..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Hủy</Button>
            <Button className="gradient-primary text-primary-foreground" onClick={handleAddStudent}>Thêm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Class Dialog */}
      <Dialog open={showAddClassDialog} onOpenChange={setShowAddClassDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Thêm lớp học</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground mb-3">Chọn lớp để thêm tất cả học viên vào khóa học này.</p>
          <div className="space-y-2">
            {availableClasses.map(cls => (
              <div key={cls.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-secondary/40 transition-colors cursor-pointer" onClick={() => handleAddClass(cls)}>
                <div>
                  <p className="font-medium text-sm">{cls.name}</p>
                  <p className="text-xs text-muted-foreground">{cls.studentCount} học viên</p>
                </div>
                <Button variant="outline" size="sm"><Plus className="h-3.5 w-3.5 mr-1" /> Thêm</Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Student Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Chỉnh sửa học viên</DialogTitle></DialogHeader>
          {editStudent && (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Họ tên</label>
                <Input value={editStudent.name} onChange={e => setEditStudent({ ...editStudent, name: e.target.value })} />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Email</label>
                <Input type="email" value={editStudent.email} onChange={e => setEditStudent({ ...editStudent, email: e.target.value })} />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Trạng thái</label>
                <Select value={editStudent.status} onValueChange={v => setEditStudent({ ...editStudent, status: v as Student["status"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Đang học</SelectItem>
                    <SelectItem value="inactive">Không hoạt động</SelectItem>
                    <SelectItem value="completed">Hoàn thành</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>Hủy</Button>
            <Button className="gradient-primary text-primary-foreground" onClick={handleEditStudent}>Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Student Detail / Progress Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Chi tiết tiến độ học viên</DialogTitle></DialogHeader>
          {selectedStudent && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                  {selectedStudent.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold">{selectedStudent.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedStudent.email}</p>
                </div>
                <Badge variant={statusConfig[selectedStudent.status].variant} className="ml-auto">
                  {statusConfig[selectedStudent.status].label}
                </Badge>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium">Tiến độ tổng</span>
                  <span className="text-sm font-bold">{selectedStudent.progress}%</span>
                </div>
                <Progress value={selectedStudent.progress} className="h-3" />
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Bài học đã hoàn thành ({selectedStudent.completedLessons.length})</p>
                <div className="space-y-1 max-h-[200px] overflow-y-auto">
                  {selectedStudent.completedLessons.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic">Chưa hoàn thành bài học nào.</p>
                  ) : (
                    selectedStudent.completedLessons.map((lesson, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 rounded-md bg-secondary/30">
                        <CheckCircle className="h-4 w-4 text-success shrink-0" />
                        <span className="text-sm">{lesson}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                Ngày tham gia: {selectedStudent.enrolledDate}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentManagement;

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Plus, Trash2, Edit, Save, ClipboardCheck, Award, Clock, Hash,
  AlertTriangle, CheckCircle, XCircle, FileText, Target,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type AssessmentType = "multiple_choice" | "essay";
type ScoringMethod = "highest" | "average" | "latest";

interface Assessment {
  id: number;
  title: string;
  type: AssessmentType;
  duration: number; // minutes
  maxAttempts: number;
  totalPoints: number;
  questionCount: number;
  isRequired: boolean;
}

interface PassingCriteria {
  minScore: number;
  maxScore: number;
  scoringMethod: ScoringMethod;
  enableCertificate: boolean;
  blockProgressOnFail: boolean;
}

const initialAssessments: Assessment[] = [
  {
    id: 1, title: "React Fundamentals Quiz", type: "multiple_choice",
    duration: 30, maxAttempts: 3, totalPoints: 100, questionCount: 20, isRequired: true,
  },
  {
    id: 2, title: "Component Architecture Essay", type: "essay",
    duration: 60, maxAttempts: 2, totalPoints: 50, questionCount: 3, isRequired: false,
  },
  {
    id: 3, title: "Final Exam - React Mastery", type: "multiple_choice",
    duration: 45, maxAttempts: 1, totalPoints: 100, questionCount: 30, isRequired: true,
  },
];

const initialCriteria: PassingCriteria = {
  minScore: 70,
  maxScore: 100,
  scoringMethod: "highest",
  enableCertificate: true,
  blockProgressOnFail: false,
};

const typeLabels: Record<AssessmentType, { label: string; icon: React.ReactNode }> = {
  multiple_choice: { label: "Trắc nghiệm", icon: <ClipboardCheck className="h-4 w-4" /> },
  essay: { label: "Tự luận", icon: <FileText className="h-4 w-4" /> },
};

const scoringLabels: Record<ScoringMethod, string> = {
  highest: "Lần cao nhất",
  average: "Trung bình các lần",
  latest: "Lần cuối cùng",
};

const AssessmentManagement = () => {
  const { toast } = useToast();
  const [assessments, setAssessments] = useState<Assessment[]>(initialAssessments);
  const [criteria, setCriteria] = useState<PassingCriteria>(initialCriteria);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState<Assessment | null>(null);
  const [newAssessment, setNewAssessment] = useState<Omit<Assessment, "id">>({
    title: "", type: "multiple_choice", duration: 30, maxAttempts: 3,
    totalPoints: 100, questionCount: 10, isRequired: true,
  });

  const handleAddAssessment = () => {
    if (!newAssessment.title.trim()) return;
    setAssessments([...assessments, { ...newAssessment, id: Date.now() }]);
    setNewAssessment({ title: "", type: "multiple_choice", duration: 30, maxAttempts: 3, totalPoints: 100, questionCount: 10, isRequired: true });
    setShowAddDialog(false);
    toast({ title: "Đã thêm bài kiểm tra" });
  };

  const handleEditAssessment = () => {
    if (!editingAssessment) return;
    setAssessments(assessments.map(a => a.id === editingAssessment.id ? editingAssessment : a));
    setShowEditDialog(false);
    toast({ title: "Đã cập nhật bài kiểm tra" });
  };

  const handleDeleteAssessment = (id: number) => {
    setAssessments(assessments.filter(a => a.id !== id));
    toast({ title: "Đã xóa bài kiểm tra" });
  };

  const saveAll = () => {
    toast({ title: "Đã lưu Assessment & Passing Criteria", description: `${assessments.length} bài kiểm tra · Điểm đạt: ${criteria.minScore}/${criteria.maxScore}` });
  };

  const requiredCount = assessments.filter(a => a.isRequired).length;
  const totalPoints = assessments.reduce((a, b) => a + b.totalPoints, 0);

  const renderAssessmentForm = (data: Omit<Assessment, "id"> | Assessment, onChange: (d: any) => void) => (
    <div className="space-y-4">
      <div>
        <label className="text-sm text-muted-foreground mb-1.5 block">Tên bài kiểm tra</label>
        <Input value={data.title} onChange={e => onChange({ ...data, title: e.target.value })} placeholder="Nhập tên..." />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-muted-foreground mb-1.5 block">Loại</label>
          <Select value={data.type} onValueChange={v => onChange({ ...data, type: v as AssessmentType })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="multiple_choice">Trắc nghiệm</SelectItem>
              <SelectItem value="essay">Tự luận</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1.5 block">Số câu hỏi</label>
          <Input type="number" min={1} value={data.questionCount} onChange={e => onChange({ ...data, questionCount: parseInt(e.target.value) || 0 })} />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-sm text-muted-foreground mb-1.5 block">Thời gian (phút)</label>
          <Input type="number" min={1} value={data.duration} onChange={e => onChange({ ...data, duration: parseInt(e.target.value) || 0 })} />
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1.5 block">Lần làm tối đa</label>
          <Input type="number" min={1} value={data.maxAttempts} onChange={e => onChange({ ...data, maxAttempts: parseInt(e.target.value) || 1 })} />
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1.5 block">Tổng điểm</label>
          <Input type="number" min={1} value={data.totalPoints} onChange={e => onChange({ ...data, totalPoints: parseInt(e.target.value) || 0 })} />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Switch checked={data.isRequired} onCheckedChange={v => onChange({ ...data, isRequired: v })} />
        <label className="text-sm">Bắt buộc hoàn thành để vượt qua khóa học</label>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{assessments.length}</p>
            <p className="text-xs text-muted-foreground">Bài kiểm tra</p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-info">{requiredCount}</p>
            <p className="text-xs text-muted-foreground">Bắt buộc</p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-accent">{totalPoints}</p>
            <p className="text-xs text-muted-foreground">Tổng điểm</p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-success">{criteria.minScore}/{criteria.maxScore}</p>
            <p className="text-xs text-muted-foreground">Điểm đạt</p>
          </CardContent>
        </Card>
      </div>

      {/* Passing Criteria Config */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" /> Điều kiện vượt qua khóa học
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Điểm tối thiểu</label>
              <Input
                type="number" min={0} max={criteria.maxScore}
                value={criteria.minScore}
                onChange={e => setCriteria({ ...criteria, minScore: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Thang điểm</label>
              <Input
                type="number" min={1}
                value={criteria.maxScore}
                onChange={e => setCriteria({ ...criteria, maxScore: parseInt(e.target.value) || 100 })}
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Phương thức tính điểm</label>
              <Select value={criteria.scoringMethod} onValueChange={v => setCriteria({ ...criteria, scoringMethod: v as ScoringMethod })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="highest">Lần cao nhất</SelectItem>
                  <SelectItem value="average">Trung bình các lần</SelectItem>
                  <SelectItem value="latest">Lần cuối cùng</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Passing Logic Info */}
          <div className="rounded-lg border border-border bg-secondary/20 p-4 space-y-3">
            <p className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" /> Logic điều kiện
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-start gap-3 p-3 rounded-md bg-success/10 border border-success/20">
                <CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Passed (Đạt)</p>
                  <p className="text-xs text-muted-foreground">
                    Điểm ≥ {criteria.minScore}/{criteria.maxScore} → Đánh dấu "Passed"
                    {criteria.enableCertificate && " + Cấp chứng chỉ"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-md bg-destructive/10 border border-destructive/20">
                <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Failed (Chưa đạt)</p>
                  <p className="text-xs text-muted-foreground">
                    Điểm {"<"} {criteria.minScore}/{criteria.maxScore} → Yêu cầu làm lại
                    {criteria.blockProgressOnFail && " + Khóa tiến độ"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Cấp chứng chỉ (Certificate)</p>
                <p className="text-xs text-muted-foreground">Tự động cấp chứng chỉ khi học viên đạt điểm</p>
              </div>
              <Switch checked={criteria.enableCertificate} onCheckedChange={v => setCriteria({ ...criteria, enableCertificate: v })} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Khóa tiến độ khi chưa đạt</p>
                <p className="text-xs text-muted-foreground">Không cho phép tiếp tục khóa học cho đến khi đạt bài kiểm tra</p>
              </div>
              <Switch checked={criteria.blockProgressOnFail} onCheckedChange={v => setCriteria({ ...criteria, blockProgressOnFail: v })} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assessment List */}
      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5 text-primary" /> Danh sách bài kiểm tra
          </CardTitle>
          <Button size="sm" className="gradient-primary text-primary-foreground" onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-1" /> Thêm bài kiểm tra
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên bài kiểm tra</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead className="text-center">Số câu</TableHead>
                <TableHead className="text-center">Thời gian</TableHead>
                <TableHead className="text-center">Lần làm</TableHead>
                <TableHead className="text-center">Điểm</TableHead>
                <TableHead className="text-center">Bắt buộc</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assessments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Chưa có bài kiểm tra nào. Bấm "Thêm bài kiểm tra" để bắt đầu.
                  </TableCell>
                </TableRow>
              ) : (
                assessments.map(assessment => (
                  <TableRow key={assessment.id}>
                    <TableCell className="font-medium">{assessment.title}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        {typeLabels[assessment.type].icon}
                        <span className="text-sm">{typeLabels[assessment.type].label}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">{assessment.questionCount}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1 text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" /> {assessment.duration}p
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1 text-muted-foreground">
                        <Hash className="h-3.5 w-3.5" /> {assessment.maxAttempts}
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-medium">{assessment.totalPoints}</TableCell>
                    <TableCell className="text-center">
                      {assessment.isRequired ? (
                        <Badge variant="default" className="text-xs">Bắt buộc</Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">Tùy chọn</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingAssessment({ ...assessment }); setShowEditDialog(true); }}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteAssessment(assessment.id)}>
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

      {/* Save */}
      <div className="flex justify-end">
        <Button className="gradient-primary text-primary-foreground" onClick={saveAll}>
          <Save className="h-4 w-4 mr-1" /> Lưu Assessment & Criteria
        </Button>
      </div>

      {/* Add Assessment Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Thêm bài kiểm tra</DialogTitle></DialogHeader>
          {renderAssessmentForm(newAssessment, setNewAssessment)}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Hủy</Button>
            <Button className="gradient-primary text-primary-foreground" onClick={handleAddAssessment}>Thêm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Assessment Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Chỉnh sửa bài kiểm tra</DialogTitle></DialogHeader>
          {editingAssessment && renderAssessmentForm(editingAssessment, setEditingAssessment)}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>Hủy</Button>
            <Button className="gradient-primary text-primary-foreground" onClick={handleEditAssessment}>Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AssessmentManagement;

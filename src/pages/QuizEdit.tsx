import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, Trash2, GripVertical, Save, Eye, Copy, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Question {
  id: number;
  text: string;
  type: "multiple_choice" | "true_false";
  options: string[];
  correct: number;
  points: number;
}

const initialQuestions: Question[] = [
  { id: 1, text: "What is the purpose of useState in React?", type: "multiple_choice", options: ["To manage side effects", "To manage component state", "To create context", "To define routes"], correct: 1, points: 10 },
  { id: 2, text: "Which hook is used for side effects in React?", type: "multiple_choice", options: ["useState", "useReducer", "useEffect", "useMemo"], correct: 2, points: 10 },
  { id: 3, text: "React is a JavaScript library.", type: "true_false", options: ["True", "False"], correct: 0, points: 5 },
  { id: 4, text: "useMemo is used to cache expensive calculations.", type: "true_false", options: ["True", "False"], correct: 0, points: 5 },
  { id: 5, text: "What does useCallback do?", type: "multiple_choice", options: ["Memoizes a value", "Memoizes a callback function", "Creates a ref", "Manages state"], correct: 1, points: 10 },
];

const QuizEdit = () => {
  const navigate = useNavigate();
  const [quizTitle, setQuizTitle] = useState("React Hooks Assessment");
  const [course, setCourse] = useState("react");
  const [duration, setDuration] = useState("30");
  const [shuffleQuestions, setShuffleQuestions] = useState(true);
  const [showResults, setShowResults] = useState(true);
  const [passingScore, setPassingScore] = useState("70");
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [editingQ, setEditingQ] = useState<number | null>(null);

  const totalPoints = questions.reduce((a, q) => a + q.points, 0);

  const addQuestion = (type: "multiple_choice" | "true_false") => {
    const newQ: Question = {
      id: Date.now(),
      text: "",
      type,
      options: type === "true_false" ? ["True", "False"] : ["", "", "", ""],
      correct: 0,
      points: type === "true_false" ? 5 : 10,
    };
    setQuestions([...questions, newQ]);
    setEditingQ(questions.length);
  };

  const updateQuestion = (index: number, updates: Partial<Question>) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], ...updates };
    setQuestions(updated);
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
    if (editingQ === index) setEditingQ(null);
  };

  return (
    <DashboardLayout title="Edit Quiz">
      <Button variant="ghost" size="sm" className="mb-4 text-muted-foreground" onClick={() => navigate("/quizzes")}>
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Quizzes
      </Button>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-6">
          <Tabs defaultValue="questions">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="questions">Questions ({questions.length})</TabsTrigger>
                <TabsTrigger value="settings"><Settings className="h-3.5 w-3.5 mr-1" /> Settings</TabsTrigger>
              </TabsList>
              <div className="flex gap-2">
                <Button variant="outline" size="sm"><Eye className="h-4 w-4 mr-1" /> Preview</Button>
                <Button size="sm" className="gradient-primary text-primary-foreground"><Save className="h-4 w-4 mr-1" /> Save</Button>
              </div>
            </div>

            <TabsContent value="questions" className="space-y-4">
              {questions.map((q, qi) => (
                <Card key={q.id} className={`shadow-card transition-all ${editingQ === qi ? "ring-2 ring-primary/30" : ""}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <GripVertical className="h-4 w-4 text-muted-foreground mt-2 cursor-grab shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="secondary" className="text-xs">{qi + 1}</Badge>
                          <Badge variant="outline" className="text-xs">{q.type === "multiple_choice" ? "Multiple Choice" : "True/False"}</Badge>
                          <Badge variant="outline" className="text-xs">{q.points} pts</Badge>
                          <div className="flex-1" />
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditingQ(editingQ === qi ? null : qi)}>
                            <Settings className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => {
                            const dup = { ...q, id: Date.now() };
                            setQuestions([...questions.slice(0, qi + 1), dup, ...questions.slice(qi + 1)]);
                          }}>
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeQuestion(qi)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>

                        {editingQ === qi ? (
                          <div className="space-y-4">
                            <div>
                              <Label className="text-xs text-muted-foreground">Question Text</Label>
                              <Input value={q.text} onChange={(e) => updateQuestion(qi, { text: e.target.value })} className="mt-1" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label className="text-xs text-muted-foreground">Points</Label>
                                <Input type="number" value={q.points} onChange={(e) => updateQuestion(qi, { points: parseInt(e.target.value) || 0 })} className="mt-1" />
                              </div>
                              <div>
                                <Label className="text-xs text-muted-foreground">Correct Answer</Label>
                                <Select value={q.correct.toString()} onValueChange={(v) => updateQuestion(qi, { correct: parseInt(v) })}>
                                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                  <SelectContent>
                                    {q.options.map((opt, oi) => (
                                      <SelectItem key={oi} value={oi.toString()}>Option {oi + 1}{opt ? `: ${opt}` : ""}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground">Options</Label>
                              {q.options.map((opt, oi) => (
                                <div key={oi} className="flex items-center gap-2">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 ${oi === q.correct ? "gradient-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                                    {String.fromCharCode(65 + oi)}
                                  </div>
                                  <Input
                                    value={opt}
                                    onChange={(e) => updateOption(qi, oi, e.target.value)}
                                    placeholder={`Option ${oi + 1}`}
                                    className={oi === q.correct ? "border-success/50" : ""}
                                    disabled={q.type === "true_false"}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <p className="text-sm font-medium mb-2">{q.text || <span className="text-muted-foreground italic">No question text</span>}</p>
                            <div className="grid grid-cols-2 gap-1.5">
                              {q.options.map((opt, oi) => (
                                <div key={oi} className={`text-xs px-2.5 py-1.5 rounded ${oi === q.correct ? "bg-success/10 text-success font-medium" : "text-muted-foreground"}`}>
                                  {String.fromCharCode(65 + oi)}. {opt}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => addQuestion("multiple_choice")}>
                  <Plus className="h-4 w-4 mr-1" /> Multiple Choice
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => addQuestion("true_false")}>
                  <Plus className="h-4 w-4 mr-1" /> True / False
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4 mt-4">
              <Card className="shadow-card">
                <CardHeader><CardTitle className="text-base">Quiz Settings</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">Quiz Title</Label>
                      <Input value={quizTitle} onChange={(e) => setQuizTitle(e.target.value)} className="mt-1" />
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Course</Label>
                      <Select value={course} onValueChange={setCourse}>
                        <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="react">Introduction to React</SelectItem>
                          <SelectItem value="python">Advanced Python</SelectItem>
                          <SelectItem value="design">UI/UX Design</SelectItem>
                          <SelectItem value="dsa">Data Structures</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Duration (minutes)</Label>
                      <Input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} className="mt-1" />
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Passing Score (%)</Label>
                      <Input type="number" value={passingScore} onChange={(e) => setPassingScore(e.target.value)} className="mt-1" />
                    </div>
                  </div>
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Shuffle Questions</Label>
                      <Switch checked={shuffleQuestions} onCheckedChange={setShuffleQuestions} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Show Results After Submission</Label>
                      <Switch checked={showResults} onCheckedChange={setShowResults} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-64 space-y-4">
          <Card className="shadow-card">
            <CardHeader className="pb-2"><CardTitle className="text-sm">Quiz Summary</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Questions</span><span className="font-medium">{questions.length}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Total Points</span><span className="font-medium">{totalPoints}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Duration</span><span>{duration} min</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Pass Score</span><span>{passingScore}%</span></div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardHeader className="pb-2"><CardTitle className="text-sm">Question Types</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Multiple Choice</span>
                <Badge variant="secondary">{questions.filter(q => q.type === "multiple_choice").length}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">True / False</span>
                <Badge variant="secondary">{questions.filter(q => q.type === "true_false").length}</Badge>
              </div>
            </CardContent>
          </Card>
          <Button className="w-full gradient-primary text-primary-foreground" onClick={() => navigate("/quiz/take/1")}>
            <Eye className="h-4 w-4 mr-1" /> Preview as Student
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default QuizEdit;

import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, Clock, ArrowLeft, ArrowRight, Flag } from "lucide-react";
import { useNavigate } from "react-router-dom";

const mockQuiz = {
  id: 1,
  title: "React Hooks Assessment",
  course: "Introduction to React",
  duration: "30 min",
  totalQuestions: 10,
  questions: [
    {
      id: 1,
      text: "What is the purpose of useState in React?",
      options: ["To manage side effects", "To manage component state", "To create context", "To define routes"],
      correct: 1,
    },
    {
      id: 2,
      text: "Which hook is used for side effects in React?",
      options: ["useState", "useReducer", "useEffect", "useMemo"],
      correct: 2,
    },
    {
      id: 3,
      text: "What does useCallback do?",
      options: ["Memoizes a value", "Memoizes a callback function", "Creates a ref", "Manages state"],
      correct: 1,
    },
    {
      id: 4,
      text: "useMemo is used to:",
      options: ["Cache expensive calculations", "Handle events", "Fetch data", "Create components"],
      correct: 0,
    },
    {
      id: 5,
      text: "Which hook creates a mutable ref object?",
      options: ["useState", "useEffect", "useRef", "useContext"],
      correct: 2,
    },
    {
      id: 6,
      text: "What is the correct way to update state based on previous state?",
      options: ["setState(newVal)", "setState(prev => prev + 1)", "state = newVal", "this.setState()"],
      correct: 1,
    },
    {
      id: 7,
      text: "useContext is used to:",
      options: ["Create a new context", "Consume context values", "Provide context", "All of the above"],
      correct: 1,
    },
    {
      id: 8,
      text: "Which hook is an alternative to useState for complex state logic?",
      options: ["useEffect", "useReducer", "useMemo", "useCallback"],
      correct: 1,
    },
    {
      id: 9,
      text: "Custom hooks must start with:",
      options: ["hook", "custom", "use", "my"],
      correct: 2,
    },
    {
      id: 10,
      text: "The dependency array in useEffect controls:",
      options: ["Component rendering", "When the effect re-runs", "State updates", "Props validation"],
      correct: 1,
    },
  ],
};

const QuizTake = () => {
  const navigate = useNavigate();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const question = mockQuiz.questions[currentQ];
  const progress = ((currentQ + 1) / mockQuiz.totalQuestions) * 100;

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [currentQ]: parseInt(value) });
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const score = mockQuiz.questions.reduce((acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc), 0);
  const percentage = Math.round((score / mockQuiz.totalQuestions) * 100);

  if (submitted) {
    return (
      <DashboardLayout title="Quiz Results">
        <div className="max-w-3xl mx-auto space-y-6">
          <Card className="shadow-card">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl">{mockQuiz.title}</CardTitle>
              <p className="text-muted-foreground text-sm">{mockQuiz.course}</p>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full text-4xl font-bold ${percentage >= 70 ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                {percentage}%
              </div>
              <div className="flex justify-center gap-8 text-sm">
                <div className="flex items-center gap-2 text-success"><CheckCircle2 className="h-4 w-4" /> {score} Correct</div>
                <div className="flex items-center gap-2 text-destructive"><XCircle className="h-4 w-4" /> {mockQuiz.totalQuestions - score} Wrong</div>
              </div>
              <p className="text-muted-foreground text-sm">
                {percentage >= 70 ? "Great job! You passed the quiz." : "You didn't pass. Review the material and try again."}
              </p>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="font-display font-bold text-lg">Review Answers</h3>
            {mockQuiz.questions.map((q, i) => {
              const isCorrect = answers[i] === q.correct;
              return (
                <Card key={q.id} className={`shadow-card border-l-4 ${isCorrect ? "border-l-success" : "border-l-destructive"}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {isCorrect ? <CheckCircle2 className="h-5 w-5 text-success mt-0.5 shrink-0" /> : <XCircle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />}
                      <div className="flex-1">
                        <p className="font-medium text-sm mb-2">Q{i + 1}. {q.text}</p>
                        <div className="space-y-1 text-xs">
                          {q.options.map((opt, oi) => (
                            <div key={oi} className={`px-3 py-1.5 rounded ${oi === q.correct ? "bg-success/10 text-success font-medium" : oi === answers[i] && oi !== q.correct ? "bg-destructive/10 text-destructive line-through" : "text-muted-foreground"}`}>
                              {opt}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate("/quizzes")} className="flex-1">Back to Quizzes</Button>
            <Button onClick={() => { setSubmitted(false); setAnswers({}); setCurrentQ(0); }} className="flex-1 gradient-primary text-primary-foreground">Retake Quiz</Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Take Quiz">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-lg">{mockQuiz.title}</h2>
            <p className="text-muted-foreground text-sm">{mockQuiz.course}</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" /> {mockQuiz.duration}
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
            <span>Question {currentQ + 1} of {mockQuiz.totalQuestions}</span>
            <span>{Object.keys(answers).length} answered</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <p className="font-display font-bold text-lg mb-6">Q{currentQ + 1}. {question.text}</p>
            <RadioGroup value={answers[currentQ]?.toString()} onValueChange={handleAnswer} className="space-y-3">
              {question.options.map((opt, i) => (
                <div key={i} className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-secondary/50 transition-colors cursor-pointer">
                  <RadioGroupItem value={i.toString()} id={`opt-${i}`} />
                  <Label htmlFor={`opt-${i}`} className="cursor-pointer flex-1 text-sm">{opt}</Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Question navigator */}
        <div className="flex flex-wrap gap-2">
          {mockQuiz.questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentQ(i)}
              className={`w-9 h-9 rounded-lg text-xs font-medium transition-colors ${
                i === currentQ
                  ? "gradient-primary text-primary-foreground"
                  : answers[i] !== undefined
                  ? "bg-success/10 text-success border border-success/30"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setCurrentQ(Math.max(0, currentQ - 1))} disabled={currentQ === 0}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          {currentQ < mockQuiz.totalQuestions - 1 ? (
            <Button onClick={() => setCurrentQ(currentQ + 1)} className="gradient-primary text-primary-foreground">
              Next <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={Object.keys(answers).length < mockQuiz.totalQuestions} className="gradient-primary text-primary-foreground">
              <Flag className="h-4 w-4 mr-1" /> Submit Quiz
            </Button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default QuizTake;

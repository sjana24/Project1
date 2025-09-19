import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Search, Send, CheckCircle, Clock } from "lucide-react";
import axios from "axios";
import { Textarea } from "@/components/ui/textarea";

export interface QuestionA {
  qa_id: number;
  customer_id: number;
  responcer_id: number;
  email: string;
  full_name: string;
  subject: string;
  question: string;
  question_date: string;
  answer: string | null;
  answer_date: string | null;
  created_at: string;
}

const QAProviderPage = () => {
  const { toast } = useToast();

  const [questions, setQuestions] = useState<QuestionA[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [answerText, setAnswerText] = useState<Record<number, string>>({});
  const [isAnswering, setIsAnswering] = useState<number | null>(null);

  useEffect(() => {
    fetchQAs();
  }, []);

  const fetchQAs = () => {
    axios
      .get("http://localhost/Git/Project1/Backend/GetAllQA.php", { withCredentials: true })
      .then((res) => {
        if (res.data.success) {
          setQuestions(res.data.Qas);
        }
      })
      .catch(() => console.log("Failed to fetch QAs"));
  };

const submitAnswer = async (qa_id: number) => {
  if (!answerText[qa_id]?.trim()) return;

  setIsAnswering(qa_id);

  try {
    const response = await axios.post(
      "http://localhost/Git/Project1/Backend/SubmitAnswerQA.php",
      {
        qa_id: qa_id,
        answer: answerText[qa_id],
      },
      { withCredentials: true } // ✅ keeps session/cookies if needed
    );

    const data = response.data;

    if (data.success) {
      // Update UI locally
      setQuestions((prev) =>
        prev.map((q) =>
          q.qa_id === qa_id
            ? {
                ...q,
                answer: answerText[qa_id],
                answer_date: new Date().toISOString().split("T")[0],
              }
            : q
        )
      );

      setAnswerText((prev) => ({ ...prev, [qa_id]: "" }));

      toast({
        title: "Answer submitted",
        description: "Your reply has been saved successfully.",
      });
        fetchQAs();
    } else {
      toast({
        title: "Error",
        description: data.message || "Failed to save your answer.",
        variant: "destructive",
      });
    }
  } catch (error) {
    toast({
      title: "Network Error",
      description: "Unable to reach the server.",
      variant: "destructive",
    });
  } finally {
    setIsAnswering(null);
  }
};



  const filtered = questions.filter(
    (q) =>
      q.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Q&A Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Review and respond to customer questions
            </p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {filtered.map((qa) => (
            <Card
              key={qa.qa_id}
              className="shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl border border-slate-200 bg-white"
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">
                    {qa.subject}
                  </CardTitle>
                  {qa.answer ? (
                    <Badge className="bg-green-100 text-green-700 flex items-center gap-1">
                      <CheckCircle size={14} /> Answered
                    </Badge>
                  ) : (
                    <Badge className="bg-yellow-100 text-yellow-700 flex items-center gap-1">
                      <Clock size={14} /> Pending
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Asked by {qa.full_name} ({qa.email}) on {qa.question_date}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Question */}
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Question</p>
                  <p className="text-base text-foreground mt-1">{qa.question}</p>
                </div>

                {/* Answer */}
                {qa.answer ? (
                  <div className="p-4 rounded-lg bg-green-50 border border-green-100">
                    <p className="text-sm text-green-700 font-medium">Answer</p>
                    <p className="mt-2 text-gray-800">{qa.answer}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Answered on {qa.answer_date}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Textarea
                      value={answerText[qa.qa_id] || ""}
                      onChange={(e) =>
                        setAnswerText((prev) => ({
                          ...prev,
                          [qa.qa_id]: e.target.value,
                        }))
                      }
                      placeholder="Write your answer..."
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                )}
              </CardContent>

              {!qa.answer && (
                <CardFooter className="flex justify-end">
                  <Button
                    onClick={() => submitAnswer(qa.qa_id)}
                    disabled={!answerText[qa.qa_id]?.trim() || isAnswering === qa.qa_id}
                    className="flex items-center gap-2"
                  >
                    <Send size={16} />
                    {isAnswering === qa.qa_id ? "Sending..." : "Send Answer"}
                  </Button>
                </CardFooter>
              )}
            </Card>
          ))}

          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-12">
              No questions found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QAProviderPage;

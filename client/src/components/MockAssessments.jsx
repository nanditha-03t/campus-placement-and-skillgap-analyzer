import React, { useState, useEffect } from 'react';
import { 
  Award, 
  CheckCircle, 
  XCircle, 
  Clock, 
  HelpCircle, 
  ArrowRight, 
  RotateCcw,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { api } from '../services/api';

export default function MockAssessments({ onAssessmentCompleted }) {
  const [assessments, setAssessments] = useState([]);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssessments();
  }, []);

  const loadAssessments = async () => {
    try {
      setLoading(true);
      const data = await api.getAssessments();
      setAssessments(data);
    } catch (err) {
      console.error('Error fetching assessments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = async (testId) => {
    try {
      const details = await api.getAssessmentDetails(testId);
      setSelectedAssessment(details);
      setCurrentQuestions(details.questions || []);
      setUserAnswers({});
      setResults(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectOption = (qIdx, optIdx) => {
    setUserAnswers((prev) => ({
      ...prev,
      [qIdx]: optIdx,
    }));
  };

  const handleSubmitTest = async () => {
    if (!selectedAssessment) return;
    setIsSubmitting(true);
    try {
      const res = await api.submitAssessment(selectedAssessment._id, userAnswers);
      setResults(res);
      if (onAssessmentCompleted) {
        onAssessmentCompleted();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSelectedAssessment(null);
    setCurrentQuestions([]);
    setUserAnswers({});
    setResults(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <Award className="w-4 h-4" />
          <span>Skill Verification & Mock Assessments</span>
        </div>
        <h2 className="text-xl font-bold text-white">
          Simulated Online Technical Screening Tests
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          Taking mock assessments validates your technical competencies and adds verified skill badges to your placement profile, increasing recruiter visibility.
        </p>
      </div>

      {/* Main Assessment List View */}
      {!selectedAssessment && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assessments.map((test) => (
            <div 
              key={test._id} 
              className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 flex flex-col justify-between hover:border-indigo-500/50 transition-all shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/50">
                    {test.category}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{test.timeLimitMinutes || 15} mins</span>
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-2">{test.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {test.description || `Assessment covering key screening concepts for ${test.targetRole || 'engineering roles'}.`}
                </p>

                <div className="flex items-center space-x-2 text-xs text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Unlocks Verified Skill Badge</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-700/60">
                <button
                  onClick={() => handleStartTest(test._id)}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md shadow-indigo-600/30 transition-colors"
                >
                  <span>Start Assessment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Active Assessment Runner */}
      {selectedAssessment && !results && (
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-700/60">
            <div>
              <span className="text-xs font-semibold text-indigo-400 uppercase">{selectedAssessment.category}</span>
              <h3 className="text-lg font-bold text-white mt-0.5">{selectedAssessment.title}</h3>
            </div>
            <button
              onClick={handleReset}
              className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium rounded-lg transition-colors"
            >
              Exit Test
            </button>
          </div>

          {/* Question List */}
          <div className="space-y-6">
            {currentQuestions.map((q, qIdx) => (
              <div key={qIdx} className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-start justify-between">
                  <span className="text-xs font-bold text-indigo-400">Question {qIdx + 1} of {currentQuestions.length}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">{q.skillTag}</span>
                </div>
                <h4 className="text-sm font-semibold text-white leading-relaxed">{q.questionText}</h4>

                {/* Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = userAnswers[qIdx] === oIdx;
                    return (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() => handleSelectOption(qIdx, oIdx)}
                        className={`text-left p-3 rounded-xl border text-xs transition-all ${
                          isSelected
                            ? 'bg-indigo-600/30 border-indigo-500 text-white font-medium shadow-sm'
                            : 'bg-slate-800/50 border-slate-700/60 text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        <span className="inline-block w-5 h-5 rounded-full bg-slate-800 text-center leading-5 text-[11px] font-bold mr-2 text-slate-300">
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-700/60 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Answered {Object.keys(userAnswers).length} of {currentQuestions.length} questions
            </span>
            <button
              onClick={handleSubmitTest}
              disabled={isSubmitting || Object.keys(userAnswers).length === 0}
              className="py-2.5 px-6 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold rounded-xl text-xs transition-colors shadow-lg shadow-emerald-600/20"
            >
              {isSubmitting ? 'Evaluating Test...' : 'Submit & Verify Score'}
            </button>
          </div>
        </div>
      )}

      {/* Assessment Results Modal / View */}
      {results && (
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 space-y-6">
          <div className="text-center py-4 border-b border-slate-700/60">
            <div className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-3 ${
              results.passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
            }`}>
              <Award className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-white">
              {results.passed ? 'Assessment Cleared!' : 'Assessment Completed'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              You scored <strong className="text-white">{results.score} / {results.total}</strong> ({results.percentage}%)
            </p>
            {results.passed && (
              <div className="inline-flex items-center space-x-1.5 mt-3 px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-semibold">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Skill Badge Added to Profile!</span>
              </div>
            )}
          </div>

          {/* Question Review */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Detailed Solution Breakdown:</h4>
            {results.questionReview.map((rev, idx) => (
              <div key={idx} className={`p-4 rounded-xl border text-xs ${
                rev.isCorrect ? 'bg-emerald-950/20 border-emerald-900/40' : 'bg-rose-950/20 border-rose-900/40'
              }`}>
                <div className="flex items-center space-x-2 font-semibold mb-1">
                  {rev.isCorrect ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400" />
                  )}
                  <span className="text-white">{rev.questionText}</span>
                </div>
                <div className="mt-2 text-slate-300">
                  <span>Your Answer: <strong className={rev.isCorrect ? 'text-emerald-300' : 'text-rose-300'}>
                    {rev.userChoice !== undefined ? rev.options[rev.userChoice] : 'Not Answered'}
                  </strong></span>
                </div>
                {!rev.isCorrect && (
                  <div className="text-emerald-300 mt-0.5">
                    Correct Answer: <strong>{rev.options[rev.correctOptionIndex]}</strong>
                  </div>
                )}
                {rev.explanation && (
                  <div className="mt-2 pt-2 border-t border-slate-800 text-slate-400 leading-relaxed text-[11px]">
                    <strong>Explanation:</strong> {rev.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-700/60 flex justify-end">
            <button
              onClick={handleReset}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors shadow-md"
            >
              Back to Assessments
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

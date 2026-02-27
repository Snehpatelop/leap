import { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  CheckCircle2, 
  Clock, 
  Flag,
  Headphones,
  BookOpen,
  PenTool,
  Mic
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { Task } from '@/types';

interface TaskPlayerProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

// Task content data
const taskContent: Record<string, any> = {
  listening: {
    title: 'Academic Lecture: Climate Change',
    image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=600&h=300&fit=crop&q=80',
    audioUrl: null, // Would be real audio in production
    transcript: `Welcome to today's lecture on climate change and its global impact. Over the past century, we've observed a significant increase in global temperatures, primarily driven by human activities such as burning fossil fuels and deforestation.

The evidence is overwhelming. Ice sheets are melting, sea levels are rising, and extreme weather events are becoming more frequent. But what can we do about it?

First, we need to transition to renewable energy sources. Solar, wind, and hydroelectric power offer sustainable alternatives to coal and oil. Second, we must protect our forests, which act as carbon sinks. Third, individuals can make a difference through their daily choices.

The question is: Are we willing to make the necessary changes before it's too late?`,
    questions: [
      {
        id: 1,
        question: 'What are the main causes of climate change mentioned?',
        options: [
          'Natural weather patterns',
          'Burning fossil fuels and deforestation',
          'Solar radiation',
          'Ocean currents'
        ],
        correct: 1
      },
      {
        id: 2,
        question: 'Which renewable energy source is NOT mentioned?',
        options: [
          'Solar',
          'Wind',
          'Nuclear',
          'Hydroelectric'
        ],
        correct: 2
      },
      {
        id: 3,
        question: 'What role do forests play?',
        options: [
          'They produce oxygen',
          'They act as carbon sinks',
          'They regulate temperature',
          'They prevent floods'
        ],
        correct: 1
      }
    ]
  },
  reading: {
    title: 'The Science of Sleep',
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=600&h=300&fit=crop&q=80',
    passage: `Sleep is a fundamental biological process that affects every aspect of our health and well-being. Despite its importance, many people underestimate the power of a good night's sleep.

Recent research has revealed that sleep plays a crucial role in memory consolidation. During deep sleep, the brain processes information from the day, transferring short-term memories to long-term storage. This is why students who get adequate sleep tend to perform better on exams.

Moreover, sleep is essential for physical health. During sleep, the body repairs tissues, synthesizes proteins, and releases growth hormones. Chronic sleep deprivation has been linked to numerous health problems, including obesity, diabetes, cardiovascular disease, and weakened immune function.

The recommended amount of sleep for adults is 7-9 hours per night. However, quality matters as much as quantity. Creating a sleep-friendly environment—dark, quiet, and cool—can significantly improve sleep quality.

In conclusion, prioritizing sleep is one of the most important things you can do for your health and cognitive performance.`,
    questions: [
      {
        id: 1,
        question: 'What happens during deep sleep regarding memory?',
        options: [
          'Memories are erased',
          'Short-term memories transfer to long-term storage',
          'New memories are created',
          'Memory capacity increases'
        ],
        correct: 1
      },
      {
        id: 2,
        question: 'How much sleep is recommended for adults?',
        options: [
          '5-6 hours',
          '7-9 hours',
          '10-12 hours',
          '4-5 hours'
        ],
        correct: 1
      },
      {
        id: 3,
        question: 'Which is NOT mentioned as a result of sleep deprivation?',
        options: [
          'Obesity',
          'Improved focus',
          'Diabetes',
          'Weakened immune function'
        ],
        correct: 1
      }
    ]
  },
  writing: {
    title: 'Vocabulary Builder: Academic Words',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=300&fit=crop&q=80',
    words: [
      { word: 'Significant', meaning: 'Important or noticeable', example: 'There was a significant improvement in test scores.' },
      { word: 'Consequently', meaning: 'As a result', example: 'She studied hard; consequently, she passed the exam.' },
      { word: 'Nevertheless', meaning: 'In spite of that', example: 'It was raining; nevertheless, we went out.' },
      { word: 'Furthermore', meaning: 'In addition', example: 'The plan is risky. Furthermore, it is expensive.' },
      { word: 'Subsequently', meaning: 'After something else', example: 'He graduated and subsequently found a job.' },
      { word: 'Alternatively', meaning: 'As another option', example: 'We could drive; alternatively, we could take the train.' },
      { word: 'Presumably', meaning: 'Probably', example: 'Presumably, he will arrive on time.' },
      { word: 'Inevitably', meaning: 'Unavoidably', example: 'Progress inevitably brings change.' },
      { word: 'Predominantly', meaning: 'Mainly', example: 'The area is predominantly residential.' },
      { word: 'Substantially', meaning: 'Considerably', example: 'Prices have increased substantially.' },
    ],
    exercise: {
      instruction: 'Fill in the blanks with the correct word:',
      sentences: [
        { text: 'The project was _____ delayed due to bad weather.', answer: 'significantly' },
        { text: '_____, the results were better than expected.', answer: 'Nevertheless' },
        { text: 'She failed the test; _____, she had to retake it.', answer: 'consequently' },
      ]
    }
  },
  speaking: {
    title: 'Describe a Photo: City Life',
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&h=400&fit=crop&q=80',
    imageDescription: 'A busy city street with people walking, cars, tall buildings, and a coffee shop',
    prompts: [
      'Where do you think this photo was taken?',
      'What can you see in the photo?',
      'How would you describe the atmosphere?',
      'Would you like to visit this place? Why or why not?'
    ],
    sampleAnswer: `This photo appears to be taken in a bustling metropolitan city, possibly in a downtown area.

In the foreground, I can see several pedestrians walking along the sidewalk. Some appear to be in business attire, suggesting this might be during rush hour. There are also various shops and what looks like a coffee shop with outdoor seating.

The atmosphere seems vibrant and energetic. The tall buildings in the background indicate this is a commercial district. I can see traffic on the street, including cars and possibly a bus.

Personally, I would enjoy visiting this place because I love the energy of big cities. However, I might find it overwhelming if I stayed too long, as I prefer quieter environments for daily living.

The photo captures the essence of urban life—busy, diverse, and full of opportunities.`,
    tips: [
      'Start with a general overview',
      'Describe details from foreground to background',
      'Use descriptive adjectives',
      'Express personal opinions',
      'Speak for 1-2 minutes'
    ]
  }
};

export function TaskPlayer({ task, isOpen, onClose, onComplete }: TaskPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(task.duration * 60);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'questions'>('content');
  const [writingAnswers, setWritingAnswers] = useState<string[]>(['', '', '']);
  const [showWritingAnswers, setShowWritingAnswers] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recordingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const content = taskContent[task.type];

  useEffect(() => {
    if (isOpen && !task.completed) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            return 0;
          }
          return prev - 1;
        });
        setProgress(prev => Math.min(prev + 100 / (task.duration * 60), 100));
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, task.completed, task.duration]);

  useEffect(() => {
    if (isRecording) {
      recordingRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingRef.current) clearInterval(recordingRef.current);
    }
    return () => {
      if (recordingRef.current) clearInterval(recordingRef.current);
    };
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[questionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleSubmitQuiz = () => {
    setShowResults(true);
  };

  const getScore = () => {
    if (!content?.questions) return 0;
    let correct = 0;
    content.questions.forEach((q: any, idx: number) => {
      if (selectedAnswers[idx] === q.correct) correct++;
    });
    return correct;
  };

  const handleComplete = () => {
    onComplete();
    onClose();
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setRecordingTime(0);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col bg-white">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
          <div className="flex items-center gap-3">
            {task.type === 'listening' && <Headphones className="w-5 h-5" />}
            {task.type === 'reading' && <BookOpen className="w-5 h-5" />}
            {task.type === 'writing' && <PenTool className="w-5 h-5" />}
            {task.type === 'speaking' && <Mic className="w-5 h-5" />}
            <div>
              <h3 className="font-semibold">{task.title}</h3>
              <p className="text-xs text-indigo-100 capitalize">{task.type} Practice</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-mono">{formatTime(timeLeft)}</span>
            </div>
            <button onClick={onClose} className="hover:bg-white/20 p-1 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <Progress value={progress} className="h-1 rounded-none" />

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Listening Task */}
          {task.type === 'listening' && content && (
            <div className="space-y-6">
              <img src={content.image} alt={content.title} className="w-full h-40 object-cover rounded-xl" loading="lazy" />
              <div className="bg-gray-100 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">{content.title}</h4>
                  <Button
                    variant={isPlaying ? "secondary" : "default"}
                    size="sm"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={isPlaying ? "" : "gradient-primary"}
                  >
                    {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                    {isPlaying ? 'Pause' : 'Play Audio'}
                  </Button>
                </div>
                {isPlaying && (
                  <div className="flex items-center justify-center py-8">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="w-2 bg-indigo-500 rounded-full animate-pulse"
                          style={{
                            height: `${20 + Math.random() * 40}px`,
                            animationDelay: `${i * 0.1}s`
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2 border-b">
                <button
                  onClick={() => setActiveTab('content')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'content' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500'
                  }`}
                >
                  Transcript
                </button>
                <button
                  onClick={() => setActiveTab('questions')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'questions' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500'
                  }`}
                >
                  Questions ({selectedAnswers.filter(a => a !== undefined).length}/{content.questions.length})
                </button>
              </div>

              {activeTab === 'content' ? (
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">{content.transcript}</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {content.questions.map((q: any, idx: number) => (
                    <div key={q.id} className="p-4 bg-gray-50 rounded-xl">
                      <p className="font-medium mb-3">{idx + 1}. {q.question}</p>
                      <div className="space-y-2">
                        {q.options.map((option: string, optIdx: number) => (
                          <button
                            key={optIdx}
                            onClick={() => handleAnswerSelect(idx, optIdx)}
                            disabled={showResults}
                            className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                              selectedAnswers[idx] === optIdx
                                ? showResults
                                  ? optIdx === q.correct
                                    ? 'border-green-500 bg-green-50'
                                    : 'border-red-500 bg-red-50'
                                  : 'border-indigo-500 bg-indigo-50'
                                : showResults && optIdx === q.correct
                                  ? 'border-green-500 bg-green-50'
                                  : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <span className="font-medium mr-2">{String.fromCharCode(65 + optIdx)}.</span>
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  {!showResults ? (
                    <Button 
                      onClick={handleSubmitQuiz}
                      disabled={selectedAnswers.length < content.questions.length}
                      className="w-full gradient-primary"
                    >
                      Submit Answers
                    </Button>
                  ) : (
                    <div className="p-4 bg-green-50 rounded-xl text-center">
                      <p className="text-lg font-semibold text-green-700">
                        Score: {getScore()}/{content.questions.length}
                      </p>
                      <p className="text-sm text-green-600">
                        {getScore() === content.questions.length ? 'Perfect! 🎉' : 'Good effort! Keep practicing!'}
                      </p>
                      <Button onClick={handleComplete} className="mt-4 gradient-primary">
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Complete Task
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Reading Task */}
          {task.type === 'reading' && content && (
            <div className="space-y-6">
              <img src={content.image} alt={content.title} className="w-full h-40 object-cover rounded-xl" loading="lazy" />
              <h4 className="text-xl font-semibold">{content.title}</h4>
              
              <div className="flex gap-2 border-b">
                <button
                  onClick={() => setActiveTab('content')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'content' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500'
                  }`}
                >
                  Passage
                </button>
                <button
                  onClick={() => setActiveTab('questions')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'questions' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500'
                  }`}
                >
                  Questions
                </button>
              </div>

              {activeTab === 'content' ? (
                <div className="prose max-w-none bg-gray-50 p-6 rounded-xl">
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">{content.passage}</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {content.questions.map((q: any, idx: number) => (
                    <div key={q.id} className="p-4 bg-gray-50 rounded-xl">
                      <p className="font-medium mb-3">{idx + 1}. {q.question}</p>
                      <div className="space-y-2">
                        {q.options.map((option: string, optIdx: number) => (
                          <button
                            key={optIdx}
                            onClick={() => handleAnswerSelect(idx, optIdx)}
                            disabled={showResults}
                            className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                              selectedAnswers[idx] === optIdx
                                ? showResults
                                  ? optIdx === q.correct
                                    ? 'border-green-500 bg-green-50'
                                    : 'border-red-500 bg-red-50'
                                  : 'border-indigo-500 bg-indigo-50'
                                : showResults && optIdx === q.correct
                                  ? 'border-green-500 bg-green-50'
                                  : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <span className="font-medium mr-2">{String.fromCharCode(65 + optIdx)}.</span>
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  {!showResults ? (
                    <Button 
                      onClick={handleSubmitQuiz}
                      disabled={selectedAnswers.length < content.questions.length}
                      className="w-full gradient-primary"
                    >
                      Submit Answers
                    </Button>
                  ) : (
                    <div className="p-4 bg-green-50 rounded-xl text-center">
                      <p className="text-lg font-semibold text-green-700">
                        Score: {getScore()}/{content.questions.length}
                      </p>
                      <Button onClick={handleComplete} className="mt-4 gradient-primary">
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Complete Task
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Writing Task */}
          {task.type === 'writing' && content && (
            <div className="space-y-6">
              <img src={content.image} alt={content.title} className="w-full h-40 object-cover rounded-xl" loading="lazy" />
              <h4 className="text-xl font-semibold">{content.title}</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.words.map((word: any, idx: number) => (
                  <div key={idx} className="p-4 bg-indigo-50 rounded-xl">
                    <p className="font-semibold text-indigo-700">{word.word}</p>
                    <p className="text-sm text-gray-600 mt-1">{word.meaning}</p>
                    <p className="text-xs text-gray-500 mt-2 italic">"{word.example}"</p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-6">
                <h5 className="font-semibold mb-4">{content.exercise.instruction}</h5>
                <div className="space-y-4">
                  {content.exercise.sentences.map((sentence: any, idx: number) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded-xl">
                      <p className="mb-3">
                        {sentence.text.split('_____').map((part: string, i: number, arr: string[]) => (
                          <span key={i}>
                            {part}
                            {i < arr.length - 1 && (
                              <input
                                type="text"
                                value={writingAnswers[idx]}
                                onChange={(e) => {
                                  const newAnswers = [...writingAnswers];
                                  newAnswers[idx] = e.target.value.toLowerCase();
                                  setWritingAnswers(newAnswers);
                                }}
                                disabled={showWritingAnswers}
                                className={`mx-2 px-3 py-1 border-2 rounded text-center w-32 ${
                                  showWritingAnswers
                                    ? writingAnswers[idx] === sentence.answer
                                      ? 'border-green-500 bg-green-50'
                                      : 'border-red-500 bg-red-50'
                                    : 'border-gray-300 focus:border-indigo-500'
                                }`}
                                placeholder="?"
                              />
                            )}
                          </span>
                        ))}
                      </p>
                      {showWritingAnswers && (
                        <p className="text-sm text-green-600">
                          Answer: <span className="font-semibold">{sentence.answer}</span>
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                {!showWritingAnswers ? (
                  <Button 
                    onClick={() => setShowWritingAnswers(true)}
                    className="mt-4 gradient-primary"
                  >
                    Check Answers
                  </Button>
                ) : (
                  <Button 
                    onClick={handleComplete}
                    className="mt-4 gradient-primary"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Complete Task
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Speaking Task */}
          {task.type === 'speaking' && content && (
            <div className="space-y-6">
              <h4 className="text-xl font-semibold">{content.title}</h4>
              
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden">
                <img
                  src={content.image}
                  alt={content.imageDescription}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
                <p className="text-gray-600 text-center p-4">{content.imageDescription}</p>
              </div>

              <div className="space-y-4">
                <h5 className="font-semibold">Speaking Prompts:</h5>
                <div className="space-y-2">
                  {content.prompts.map((prompt: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg">
                      <span className="w-6 h-6 rounded-full bg-indigo-500 text-white text-xs flex items-center justify-center flex-shrink-0">
                        {idx + 1}
                      </span>
                      <p className="text-gray-700">{prompt}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-amber-50 rounded-xl">
                <h5 className="font-semibold text-amber-800 mb-2">Tips:</h5>
                <ul className="space-y-1">
                  {content.tips.map((tip: string, idx: number) => (
                    <li key={idx} className="text-sm text-amber-700 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2 border-b">
                <button
                  onClick={() => setActiveTab('content')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'content' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500'
                  }`}
                >
                  Practice
                </button>
                <button
                  onClick={() => setActiveTab('questions')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'questions' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500'
                  }`}
                >
                  Sample Answer
                </button>
              </div>

              {activeTab === 'content' ? (
                <div className="text-center py-8">
                  <Button
                    size="lg"
                    onClick={toggleRecording}
                    className={isRecording ? 'bg-red-500 hover:bg-red-600' : 'gradient-primary'}
                  >
                    {isRecording ? (
                      <>
                        <span className="w-3 h-3 bg-white rounded-full mr-2 animate-pulse" />
                        Recording... {formatTime(recordingTime)}
                      </>
                    ) : (
                      <>
                        <Mic className="w-5 h-5 mr-2" />
                        Start Recording
                      </>
                    )}
                  </Button>
                  <p className="text-sm text-gray-500 mt-4">
                    Speak for 1-2 minutes describing the photo
                  </p>
                  {recordingTime > 0 && !isRecording && (
                    <Button onClick={handleComplete} className="mt-4 gradient-primary">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Complete Task
                    </Button>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">{content.sampleAnswer}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-between items-center bg-gray-50">
          <div className="flex items-center gap-2">
            <Flag className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">+{task.points} points on completion</span>
          </div>
          {!task.completed && (
            <Button onClick={handleComplete} className="gradient-primary">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Mark Complete
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

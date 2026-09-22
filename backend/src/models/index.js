const mongoose = require("mongoose");
const { Schema } = mongoose;

/* ----------------------------- User ----------------------------- */
const StreakSchema = new Schema(
  { count: { type: Number, default: 0 }, best: { type: Number, default: 0 }, lastActive: { type: Date, default: null } },
  { _id: false }
);

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["student", "teacher", "admin"], default: "student" },
    avatar: { type: String, default: "" },
    bio: { type: String, default: "" },
    careerGoal: { type: String, default: "" },
    careerTrack: { type: String, default: "" },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    streak: { type: StreakSchema, default: () => ({}) },
    studyMinutes: { type: Number, default: 0 },
    dailyGoalMinutes: { type: Number, default: 30 },
    achievements: { type: [String], default: [] },
    preferences: { type: Object, default: { theme: "dark" } },
  },
  { timestamps: true }
);

/* ----------------------------- Course / Topic ----------------------------- */
const CourseSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    category: { type: String, default: "General" },
    track: { type: String, default: "" },
    level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" },
    thumbnail: { type: String, default: "" },
    instructor: { type: Schema.Types.ObjectId, ref: "User" },
    instructorName: { type: String, default: "SmartLearn" },
    tags: { type: [String], default: [] },
    rating: { type: Number, default: 4.6 },
    enrolledCount: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const PracticeLinkSchema = new Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    difficulty: { type: String, default: "Practice" },
  },
  { _id: false }
);

const TopicSchema = new Schema(
  {
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true, index: true },
    title: { type: String, required: true },
    content: { type: String, default: "" },
    type: { type: String, enum: ["reading", "video", "note", "quiz"], default: "reading" },
    resourceUrl: { type: String, default: "" },
    practiceLinks: { type: [PracticeLinkSchema], default: [] },
    durationMin: { type: Number, default: 15 },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const ProgressSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    completedTopics: { type: [Schema.Types.ObjectId], default: [] },
    progressPct: { type: Number, default: 0 },
    lastAccessed: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
ProgressSchema.index({ user: 1, course: 1 }, { unique: true });

/* ----------------------------- Quiz ----------------------------- */
const QuestionSchema = new Schema(
  {
    question: String,
    options: [String],
    answerIndex: Number,
    explanation: { type: String, default: "" },
    difficulty: { type: String, default: "medium" },
  },
  { _id: false }
);

const QuizSchema = new Schema(
  {
    title: { type: String, required: true },
    topic: { type: String, default: "" },
    track: { type: String, default: "" },
    difficulty: { type: String, enum: ["easy", "medium", "hard", "adaptive"], default: "medium" },
    questions: { type: [QuestionSchema], default: [] },
    generatedByAI: { type: Boolean, default: false },
    owner: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const QuizAttemptSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    quiz: { type: Schema.Types.ObjectId, ref: "Quiz" },
    quizTitle: String,
    track: String,
    score: Number,
    total: Number,
    answers: { type: [Number], default: [] },
    durationSec: { type: Number, default: 0 },
  },
  { timestamps: true }
);

/* ----------------------------- Flashcards ----------------------------- */
const FlashcardSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    deck: { type: String, default: "General" },
    front: { type: String, required: true },
    back: { type: String, required: true },
    box: { type: Number, default: 1 },
    nextReview: { type: Date, default: Date.now },
    track: { type: String, default: "" },
  },
  { timestamps: true }
);

/* ----------------------------- Roadmap ----------------------------- */
const RoadmapNodeSchema = new Schema(
  {
    title: String,
    description: String,
    status: { type: String, enum: ["todo", "in-progress", "done"], default: "todo" },
    resources: { type: [String], default: [] },
    durationWeeks: { type: Number, default: 2 },
  },
  { _id: true }
);

const RoadmapSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true },
    track: { type: String, default: "" },
    goal: { type: String, default: "" },
    nodes: { type: [RoadmapNodeSchema], default: [] },
    generatedByAI: { type: Boolean, default: false },
  },
  { timestamps: true }
);

/* ----------------------------- Chat ----------------------------- */
const ChatSessionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    mode: { type: String, enum: ["tutor", "coding", "voice", "doc"], default: "tutor" },
    title: { type: String, default: "New chat" },
    messages: {
      type: [{ role: String, content: String, ts: { type: Date, default: Date.now } }],
      default: [],
    },
  },
  { timestamps: true }
);

/* ----------------------------- Resource Vault ----------------------------- */
const ResourceSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    type: { type: String, enum: ["pdf", "link", "doc", "video"], default: "link" },
    url: { type: String, default: "" },
    text: { type: String, default: "" },
    category: { type: String, default: "General" },
    track: { type: String, default: "" },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User" },
    isPremium: { type: Boolean, default: false },
  },
  { timestamps: true }
);

/* ----------------------------- Premium ----------------------------- */
const PremiumContentSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    type: { type: String, enum: ["ebook", "course", "pdf", "bundle"], default: "ebook" },
    price: { type: Number, default: 499 },
    thumbnail: { type: String, default: "" },
    category: { type: String, default: "Career" },
    previewContent: { type: String, default: "" },
    protectedContent: { type: String, default: "" },
  },
  { timestamps: true }
);

const PurchaseSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    content: { type: Schema.Types.ObjectId, ref: "PremiumContent", required: true },
    amount: Number,
    currency: { type: String, default: "INR" },
    provider: { type: String, default: "razorpay" },
    providerOrderId: { type: String, default: "" },
    providerPaymentId: { type: String, default: "" },
    providerSignature: { type: String, default: "" },
    status: { type: String, enum: ["completed", "pending", "failed"], default: "completed" },
  },
  { timestamps: true }
);
PurchaseSchema.index({ user: 1, content: 1 }, { unique: true });

/* ----------------------------- Activity ----------------------------- */
const ActivitySchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, default: "general" },
    title: { type: String, required: true },
    meta: { type: Object, default: {} },
    xp: { type: Number, default: 0 },
  },
  { timestamps: true }
);

/* ----------------------------- Study Plan ----------------------------- */
const StudyPlanSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true },
    goal: { type: String, default: "" },
    track: { type: String, default: "" },
    days: {
      type: [
        {
          date: String,
          tasks: [{ title: String, done: { type: Boolean, default: false }, durationMin: { type: Number, default: 30 } }],
        },
      ],
      default: [],
    },
    generatedByAI: { type: Boolean, default: false },
  },
  { timestamps: true }
);

/* ----------------------------- Resume ----------------------------- */
const ResumeSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, default: "My Resume" },
    template: { type: String, default: "modern" },
    data: { type: Object, default: {} },
    atsScore: { type: Number, default: 0 },
    atsFeedback: { type: Object, default: {} },
  },
  { timestamps: true }
);

const models = {
  User: mongoose.model("User", UserSchema),
  Course: mongoose.model("Course", CourseSchema),
  Topic: mongoose.model("Topic", TopicSchema),
  Progress: mongoose.model("Progress", ProgressSchema),
  Quiz: mongoose.model("Quiz", QuizSchema),
  QuizAttempt: mongoose.model("QuizAttempt", QuizAttemptSchema),
  Flashcard: mongoose.model("Flashcard", FlashcardSchema),
  Roadmap: mongoose.model("Roadmap", RoadmapSchema),
  ChatSession: mongoose.model("ChatSession", ChatSessionSchema),
  Resource: mongoose.model("Resource", ResourceSchema),
  PremiumContent: mongoose.model("PremiumContent", PremiumContentSchema),
  Purchase: mongoose.model("Purchase", PurchaseSchema),
  Activity: mongoose.model("Activity", ActivitySchema),
  StudyPlan: mongoose.model("StudyPlan", StudyPlanSchema),
  Resume: mongoose.model("Resume", ResumeSchema),
};

module.exports = models;

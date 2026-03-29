import type {
  Lesson,
  Topic,
  TheoryBlock,
  User,
  UserProgress,
  ChatMessage,
} from "@prisma/client";

export type { Lesson, Topic, TheoryBlock, User, UserProgress, ChatMessage };

export type LessonWithTopics = Lesson & {
  topics: Topic[];
};

export type TopicWithBlocks = Topic & {
  theoryBlocks: TheoryBlock[];
};

export type LessonFull = Lesson & {
  topics: TopicWithBlocks[];
};

export type TopicWithProgress = Topic & {
  theoryBlocks: TheoryBlock[];
  progress: UserProgress[];
};

export type SafeUser = Omit<User, "hashedPassword">;

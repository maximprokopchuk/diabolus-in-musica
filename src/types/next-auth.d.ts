import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string;
      preferredInstrument?: string | null;
      preferredLevel?: string | null;
      showAllLevels?: boolean;
      onboardingCompleted?: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    preferredInstrument?: string | null;
    preferredLevel?: string | null;
    showAllLevels?: boolean;
    onboardingCompleted?: boolean;
  }
}

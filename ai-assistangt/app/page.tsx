import type { Metadata } from "next"
import VoiceAssistant from "./voice-assistant"

export const metadata: Metadata = {
  title: "Meeting Assistant",
  description: "AI-powered meeting assistant that transcribes and extracts key information from your meetings",
}

export default function Page() {
  return <VoiceAssistant />
}


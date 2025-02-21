"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mic, MicOff, Loader2, Calendar, CheckSquare, FileText, Share2 } from "lucide-react"
import ActionItems from "./action-items"
import MeetingDetails from "./meeting-details"
import Summary from "./summary"

export default function VoiceAssistant() {
  const [isRecording, setIsRecording] = useState(false)
  const [transcription, setTranscription] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const recognitionRef = useRef<any>(null)
  const [actionItems, setActionItems] = useState<string[]>([])
  const [meetingDetails, setMeetingDetails] = useState({
    date: "",
    time: "",
    participants: [],
  })
  const [summary, setSummary] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      // @ts-ignore
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true

        recognitionRef.current.onresult = (event: any) => {
          let finalTranscript = ""
          for (let i = 0; i < event.results.length; i++) {
            finalTranscript += event.results[i][0].transcript
          }
          setTranscription(finalTranscript)
        }

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error)
          setIsRecording(false)
        }
      }
    }
  }, [])

  const toggleRecording = () => {
    if (!isRecording) {
      startRecording()
    } else {
      stopRecording()
    }
  }

  const startRecording = () => {
    setTranscription("")
    setIsRecording(true)
    recognitionRef.current?.start()
  }

  const stopRecording = () => {
    setIsRecording(false)
    recognitionRef.current?.stop()
    processTranscription()
  }

  const processTranscription = async () => {
    setIsProcessing(true)

    // Extract action items (looking for phrases that indicate tasks)
    const actionItemsRegex =
      /(?:need to|should|must|will|going to|have to|let's|schedule|send|review|follow up|action item:|todo:).*?[.!?]/gi
    const extractedActions = transcription.match(actionItemsRegex) || []

    // Clean up the extracted actions
    const cleanedActions = extractedActions.map(
      (action) =>
        action
          .trim()
          .replace(/^(need to|should|must|will|going to|have to|let's|action item:|todo:)/i, "")
          .trim()
          .charAt(0)
          .toUpperCase() + action.slice(1).trim(),
    )

    setActionItems(cleanedActions)

    // Extract meeting participants (looking for names)
    const participantsRegex = /(?:attendees|participants|present|attending):?(.*?)(?:\.|$)/i
    const participantsMatch = transcription.match(participantsRegex)
    const participants = participantsMatch
      ? participantsMatch[1]
          .split(",")
          .map((p) => p.trim())
          .filter((p) => p)
      : []

    // Set meeting details
    setMeetingDetails({
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      participants: participants.length ? participants : ["Extracted from transcription"],
    })

    // Generate summary
    // Split transcription into sentences
    const sentences = transcription
      .split(/[.!?]+/)
      .filter(
        (sentence) =>
          sentence.trim().length > 10 &&
          !sentence.toLowerCase().includes("um") &&
          !sentence.toLowerCase().includes("uh"),
      )

    // Take the most significant sentences (first, last, and any containing key terms)
    const keyTerms = ["conclude", "summary", "main point", "key point", "important", "decision"]
    const significantSentences = sentences.filter((sentence, index) => {
      const isFirstOrLast = index === 0 || index === sentences.length - 1
      const containsKeyTerm = keyTerms.some((term) => sentence.toLowerCase().includes(term))
      return isFirstOrLast || containsKeyTerm
    })

    const generatedSummary = significantSentences
      .map((s) => s.trim())
      .filter((s) => s)
      .join(". ")

    setSummary(generatedSummary || "No key points detected in the transcription.")

    setIsProcessing(false)
  }

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-4">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Meeting Assistant</h1>
            <Button
              onClick={toggleRecording}
              variant={isRecording ? "destructive" : "default"}
              className="w-32"
              disabled={isProcessing}
            >
              {isRecording ? (
                <>
                  <MicOff className="mr-2 h-4 w-4" /> Stop
                </>
              ) : (
                <>
                  <Mic className="mr-2 h-4 w-4" /> Record
                </>
              )}
            </Button>
          </div>

          <div className="relative min-h-[100px] rounded-lg border bg-muted p-4">
            <ScrollArea className="h-[200px]">{transcription || "Start speaking to see transcription..."}</ScrollArea>
            {isProcessing && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            )}
          </div>
        </div>
      </Card>

      <Tabs defaultValue="actions" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="actions">
            <CheckSquare className="mr-2 h-4 w-4" />
            Action Items
          </TabsTrigger>
          <TabsTrigger value="details">
            <Calendar className="mr-2 h-4 w-4" />
            Meeting Details
          </TabsTrigger>
          <TabsTrigger value="summary">
            <FileText className="mr-2 h-4 w-4" />
            Summary
          </TabsTrigger>
        </TabsList>
        <TabsContent value="actions">
          <ActionItems items={actionItems} />
        </TabsContent>
        <TabsContent value="details">
          <MeetingDetails details={meetingDetails} />
        </TabsContent>
        <TabsContent value="summary">
          <Summary content={summary} />
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button variant="outline" disabled={!transcription}>
          <Share2 className="mr-2 h-4 w-4" />
          Share Results
        </Button>
      </div>
    </div>
  )
}


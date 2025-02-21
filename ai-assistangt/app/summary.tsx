import { Card } from "@/components/ui/card"

interface SummaryProps {
  content: string
}

export default function Summary({ content }: SummaryProps) {
  return (
    <Card className="p-4">
      <h2 className="text-xl font-semibold mb-4">Meeting Summary</h2>
      <div className="prose prose-sm">
        {content || (
          <p className="text-muted-foreground">
            Start speaking to generate a meeting summary. The summary will be extracted from key points in your
            conversation.
          </p>
        )}
      </div>
    </Card>
  )
}


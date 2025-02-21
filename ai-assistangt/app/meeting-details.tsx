import { Card } from "@/components/ui/card"

interface MeetingDetailsProps {
  details: {
    date: string
    time: string
    participants: string[]
  }
}

export default function MeetingDetails({ details }: MeetingDetailsProps) {
  return (
    <Card className="p-4">
      <h2 className="text-xl font-semibold mb-4">Meeting Details</h2>
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Date</h3>
          <p>{details.date || "Not specified"}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Time</h3>
          <p>{details.time || "Not specified"}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Participants</h3>
          {details.participants.length === 0 ? (
            <p>No participants detected</p>
          ) : (
            <ul className="list-disc list-inside">
              {details.participants.map((participant, index) => (
                <li key={index}>{participant}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Card>
  )
}


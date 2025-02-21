import { Checkbox } from "@/components/ui/checkbox"
import { Card } from "@/components/ui/card"

interface ActionItemsProps {
  items: string[]
}

export default function ActionItems({ items }: ActionItemsProps) {
  return (
    <Card className="p-4">
      <h2 className="text-xl font-semibold mb-4">Action Items</h2>
      <div className="space-y-4">
        {items.length === 0 ? (
          <p className="text-muted-foreground">
            No action items detected. Try phrases like "need to", "should", "will", or "let's" in your speech to create
            action items.
          </p>
        ) : (
          items.map((item, index) => (
            <div key={index} className="flex items-start space-x-3">
              <Checkbox id={`action-${index}`} />
              <label
                htmlFor={`action-${index}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {item}
              </label>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}


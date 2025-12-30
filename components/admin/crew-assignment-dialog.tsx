"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { UserPlus } from "lucide-react"

interface CrewAssignmentDialogProps {
  clients: Array<{ id: string; name: string }>
  crews: Array<{ id: string; name: string; type: string }>
}

export function CrewAssignmentDialog({
  clients,
  crews,
}: CrewAssignmentDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    clientId: "",
    crewId: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const client = clients.find((c) => c.id === formData.clientId)
    const crew = crews.find((c) => c.id === formData.crewId)
    console.log("Assigning crew:", formData)
    alert(
      `Crew "${crew?.name}" assigned to "${client?.name}" successfully!`
    )
    setOpen(false)
    setFormData({ clientId: "", crewId: "" })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Assign Crew
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assign Crew to Client</DialogTitle>
          <DialogDescription>
            Assign an AI crew to a client organization for their use.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="client">Client</Label>
              <Select
                value={formData.clientId}
                onValueChange={(value) =>
                  setFormData({ ...formData, clientId: value })
                }
                required
              >
                <SelectTrigger id="client">
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="crew">Crew</Label>
              <Select
                value={formData.crewId}
                onValueChange={(value) =>
                  setFormData({ ...formData, crewId: value })
                }
                required
              >
                <SelectTrigger id="crew">
                  <SelectValue placeholder="Select a crew" />
                </SelectTrigger>
                <SelectContent>
                  {crews.map((crew) => (
                    <SelectItem key={crew.id} value={crew.id}>
                      {crew.name} ({crew.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Assign Crew</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

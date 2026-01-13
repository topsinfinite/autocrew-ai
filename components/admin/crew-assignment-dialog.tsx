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
import { Link2, Building2, Users, Loader2 } from "lucide-react"

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

  const [isSubmitting, setIsSubmitting] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Link2 className="mr-2 h-4 w-4" />
          Assign Crew
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] p-0">
        {/* Elegant Header with Gradient */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent dark:from-primary/20 dark:via-primary/10 px-6 pt-6 pb-4 border-b border-border/50">
          <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,white)]" />
          <DialogHeader className="relative">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                <Link2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold">Assign Crew to Client</DialogTitle>
                <DialogDescription className="text-sm mt-0.5">
                  Link an AI crew to a client organization
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            {/* Client Selection */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <div className="p-1.5 rounded-lg bg-primary/10">
                  <Building2 className="h-4 w-4 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground">Client Organization</h4>
              </div>
              <div className="space-y-2">
                <Label htmlFor="client" className="text-sm font-medium">
                  Select Client <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.clientId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, clientId: value })
                  }
                  required
                >
                  <SelectTrigger id="client" className="h-10">
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
            </div>

            {/* Crew Selection */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <div className="p-1.5 rounded-lg bg-primary/10">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground">AI Crew</h4>
              </div>
              <div className="space-y-2">
                <Label htmlFor="crew" className="text-sm font-medium">
                  Select Crew <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.crewId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, crewId: value })
                  }
                  required
                >
                  <SelectTrigger id="crew" className="h-10">
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
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-muted/30 border-t border-border/50">
            <div className="flex items-center justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="gap-2">
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Assigning...
                  </>
                ) : (
                  <>
                    <Link2 className="h-4 w-4" />
                    Assign Crew
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

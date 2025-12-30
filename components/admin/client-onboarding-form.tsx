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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus } from "lucide-react"
import { createClient } from "@/lib/api/clients"
import type { NewClientInput } from "@/types"

export function ClientOnboardingForm() {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<NewClientInput>({
    companyName: "",
    contactPersonName: "",
    contactEmail: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    plan: "starter",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Remove empty optional fields
      const cleanedData: NewClientInput = {
        companyName: formData.companyName,
        contactPersonName: formData.contactPersonName,
        contactEmail: formData.contactEmail,
        plan: formData.plan,
      }

      // Only include optional fields if they have values
      if (formData.phone?.trim()) cleanedData.phone = formData.phone.trim()
      if (formData.address?.trim()) cleanedData.address = formData.address.trim()
      if (formData.city?.trim()) cleanedData.city = formData.city.trim()
      if (formData.country?.trim()) cleanedData.country = formData.country.trim()

      const newClient = await createClient(cleanedData)

      alert(`Client created successfully!\nClient Code: ${newClient.clientCode}`)
      setOpen(false)

      // Reset form
      setFormData({
        companyName: "",
        contactPersonName: "",
        contactEmail: "",
        phone: "",
        address: "",
        city: "",
        country: "",
        plan: "starter",
      })

      // Reload the page to show the new client
      window.location.reload()
    } catch (err: any) {
      setError(err.message || "Failed to create client")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Onboard Client
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Onboard New Client</DialogTitle>
          <DialogDescription>
            Add a new client organization to the AutoCrew platform.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            {/* Section 1: Company Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Company Information
              </h3>
              <div className="grid gap-2">
                <Label htmlFor="companyName">
                  Company Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="companyName"
                  placeholder="Acme Corporation"
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({ ...formData, companyName: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Section 2: Contact Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Contact Information
              </h3>
              <div className="grid gap-2">
                <Label htmlFor="contactPersonName">
                  Contact Person Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="contactPersonName"
                  placeholder="John Doe"
                  value={formData.contactPersonName}
                  onChange={(e) =>
                    setFormData({ ...formData, contactPersonName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contactEmail">
                  Contact Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="john@acme.com"
                  value={formData.contactEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, contactEmail: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1-555-0123"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Section 3: Address Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Address Information (Optional)
              </h3>
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="123 Business Street"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="San Francisco"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    placeholder="USA"
                    value={formData.country}
                    onChange={(e) =>
                      setFormData({ ...formData, country: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Plan Selection */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Plan Selection
              </h3>
              <div className="grid gap-2">
                <Label htmlFor="plan">
                  Subscription Plan <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.plan}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, plan: value })
                  }
                  required
                >
                  <SelectTrigger id="plan">
                    <SelectValue placeholder="Select a plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="starter">Starter</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Client"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

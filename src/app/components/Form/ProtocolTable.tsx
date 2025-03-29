"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import dayjs from "dayjs"
import "dayjs/locale/en"
import "dayjs/locale/ru"
import { PenLine, UserCheck } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { Protocol } from '../../types/types'
import Icons from '../Icons'

// Define types for our protocol data
type Material = {
  name: string
  technical_characteristics: string
  manufacturer: string
}

type Expert = {
  position: string
  full_name: string
  signature: string
}

type Supplier = {
  company_name: string
  representative: string
  phone_number: string
  email: string | string[]
}

interface ProtocolTableProps {
  protocol: Protocol | null
  onSave?: (protocol: Protocol) => void
}

export default function ProtocolTable({ protocol: initialProtocol, onSave }: ProtocolTableProps) {
  const t = useTranslations("dashboard")
  const locale = useLocale()
  dayjs.locale(locale)

  const [protocol, setProtocol] = useState<Protocol | null>(initialProtocol)
  const [isEditing, setIsEditing] = useState<boolean>(false)

  useEffect(() => {
    if (initialProtocol) {
      setProtocol(initialProtocol)
    } else {
      // Initialize with empty protocol if none provided
      setProtocol({
        id: "",
        auction_chat_id: "",
        is_tech_council: false,
        project_name: "",
        constructive: "",
        meeting_date: new Date().toISOString(),
        meeting_time: new Date().toLocaleTimeString(),
        location: "",
        materials_decisions: [],
        notes: [],
        project_team: [],
        suppliers: []
      })
    }
  }, [initialProtocol])

  // Format date to display in the desired format
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })
  }

  // Format time to display in the desired format
  const formatTime = (timeString: string) => {
    if (!timeString) return ""
    return timeString
  }

  // Handle changes to the project info
  const handleProjectInfoChange = (field: keyof Protocol, value: string) => {
    if (!protocol) return
    setProtocol((prev) => (prev ? { ...prev, [field]: value } : null))
  }

  // Handle changes to materials
  const handleMaterialChange = (index: number, field: keyof Material, value: string) => {
    if (!protocol?.materials_decisions) return
    const updatedMaterials = [...protocol.materials_decisions]
    updatedMaterials[index] = { ...updatedMaterials[index], [field]: value }
    setProtocol((prev) => (prev ? { ...prev, materials_decisions: updatedMaterials } : null))
  }

  // Add a new material
  const handleAddMaterial = () => {
    if (!protocol) return
    const newMaterial = { name: "", technical_characteristics: "", manufacturer: "" }
    setProtocol((prev) =>
      prev
        ? {
            ...prev,
            materials_decisions: [...(prev.materials_decisions || []), newMaterial],
          }
        : null,
    )
  }

  // Handle changes to notes
  const handleNoteChange = (index: number, value: string) => {
    if (!protocol?.notes) return
    const updatedNotes = [...protocol.notes]
    updatedNotes[index] = value
    setProtocol((prev) => (prev ? { ...prev, notes: updatedNotes } : null))
  }

  // Add a new note
  const handleAddNote = () => {
    if (!protocol) return
    setProtocol((prev) =>
      prev
        ? {
            ...prev,
            notes: [...(prev.notes || []), ""],
          }
        : null,
    )
  }

  // Handle changes to suppliers
  const handleSupplierChange = (index: number, field: keyof Supplier, value: string) => {
    if (!protocol?.suppliers) return
    const updatedSuppliers = [...protocol.suppliers]
    updatedSuppliers[index] = { ...updatedSuppliers[index], [field]: value }
    setProtocol((prev) => (prev ? { ...prev, suppliers: updatedSuppliers } : null))
  }

  // Add a new supplier
  const handleAddSupplier = () => {
    if (!protocol) return
    const newSupplier = { company_name: "", representative: "", phone_number: "", email: [] as string[] }
    setProtocol((prev) =>
      prev
        ? {
            ...prev,
            suppliers: [...(prev.suppliers || []), newSupplier],
          }
        : null,
    )
  }

  // Handle save button click
  const handleSave = () => {
    if (protocol && onSave) {
      onSave(protocol)
    }
    setIsEditing(false)
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium text-gray-700">{t("technical_council_protocol")}</h2>
        {isEditing ? (
          <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600 text-white">
            {t("save_and_share")}
          </Button>
        ) : (
          <Button
            variant="outline"
            className="flex items-center gap-2 border-gray-300"
            onClick={() => setIsEditing(true)}
          >
            <PenLine className="h-4 w-4" />
            {t("make_changes")}
          </Button>
        )}
      </div>

      {/* Project Info Table */}
      <div className="mb-6 border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("project")}</TableHead>
                <TableHead>{t("constructive")}</TableHead>
                <TableHead>{t("date")}</TableHead>
                <TableHead>{t("time")}</TableHead>
                <TableHead>{t("place")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  {isEditing ? (
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      value={protocol?.project_name || ""}
                      onChange={(e) => handleProjectInfoChange("project_name", e.target.value)}
                    />
                  ) : (
                    protocol?.project_name
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      value={protocol?.constructive || ""}
                      onChange={(e) => handleProjectInfoChange("constructive", e.target.value)}
                    />
                  ) : (
                    protocol?.constructive
                  )}
                </TableCell>
                <TableCell>{formatDate(protocol?.meeting_date || "")}</TableCell>
                <TableCell>{formatTime(protocol?.meeting_time || "")}</TableCell>
                <TableCell>
                  {isEditing ? (
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      value={protocol?.location || ""}
                      onChange={(e) => handleProjectInfoChange("location", e.target.value)}
                    />
                  ) : (
                    protocol?.location
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Materials and Technical Solutions */}
      <div className="mb-6 border rounded-lg overflow-hidden">
        <div className="bg-gray-50 p-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Icons.Tool />
            <span className="font-medium text-gray-700">{t("materials_and_technical_solutions")}</span>
          </div>
          {isEditing && (
            <Button
              variant="ghost"
              className="text-orange-500 hover:text-orange-600 p-0 h-auto"
              onClick={handleAddMaterial}
            >
              {t("add_material_solution")}
            </Button>
          )}
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("name")}</TableHead>
                <TableHead>{t("technical_characteristics")}</TableHead>
                <TableHead>{t("manufacturer")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {protocol?.materials_decisions && protocol.materials_decisions.length > 0 ? (
                protocol.materials_decisions.map((material, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {isEditing ? (
                        <input
                          type="text"
                          className="w-full p-2 border rounded"
                          value={material.name || ""}
                          onChange={(e) => handleMaterialChange(index, "name", e.target.value)}
                        />
                      ) : (
                        material.name
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <input
                          type="text"
                          className="w-full p-2 border rounded"
                          value={material.technical_characteristics || ""}
                          onChange={(e) => handleMaterialChange(index, "technical_characteristics", e.target.value)}
                        />
                      ) : (
                        material.technical_characteristics
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <input
                          type="text"
                          className="w-full p-2 border rounded"
                          value={material.manufacturer || ""}
                          onChange={(e) => handleMaterialChange(index, "manufacturer", e.target.value)}
                        />
                      ) : (
                        material.manufacturer
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4 text-gray-500">
                    {t("no_data")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Notes */}
      <div className="mb-6 border rounded-lg overflow-hidden">
        <div className="bg-gray-50 p-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Icons.Message_plus />
            <span className="font-medium text-gray-700">{t("notes")}</span>
          </div>
          {isEditing && (
            <Button
              variant="ghost"
              className="text-orange-500 hover:text-orange-600 p-0 h-auto"
              onClick={handleAddNote}
            >
              {t("add_note")}
            </Button>
          )}
        </div>
        <div className="p-3 space-y-2">
          {protocol?.notes && protocol.notes.length > 0 ? (
            protocol.notes.map((note, index) => (
              <div key={index} className="py-1">
                {isEditing ? (
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={note || ""}
                    placeholder="Введите ваш комментарий"
                    onChange={(e) => handleNoteChange(index, e.target.value)}
                  />
                ) : (
                  <p>{note}</p>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">{t("no_notes")}</p>
          )}
        </div>
      </div>

      {/* Technical Experts */}
      <div className="mb-6 border rounded-lg overflow-hidden">
        <div className="bg-gray-50 p-3">
          <div className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-gray-600" />
            <span className="font-medium text-gray-700">{t("technical_experts")}</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("position")}</TableHead>
                <TableHead>{t("full_name_short")}</TableHead>
                <TableHead>{t("signature")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {protocol?.project_team?.map((expert, index) => (
                <TableRow key={index}>
                  <TableCell>{expert.position}</TableCell>
                  <TableCell>{expert.full_name}</TableCell>
                  <TableCell>{expert.signature}</TableCell>
                </TableRow>
              ))}
              {(!protocol?.project_team || protocol.project_team.length === 0) && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4 text-gray-500">
                    {t("no_data")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Suppliers */}
      <div className="mb-6 border rounded-lg overflow-hidden">
        <div className="bg-gray-50 p-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Icons.Users_group />
            <span className="font-medium text-gray-700">{t("suppliers")}</span>
          </div>
          {isEditing && (
            <Button
              variant="ghost"
              className="text-orange-500 hover:text-orange-600 p-0 h-auto"
              onClick={handleAddSupplier}
            >
              {t("add_supplier")}
            </Button>
          )}
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("company")}</TableHead>
                <TableHead>{t("full_name_short")}</TableHead>
                <TableHead>{t("contacts")}</TableHead>
                <TableHead>{t("mail")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {protocol?.suppliers && protocol.suppliers.length > 0 ? (
                protocol.suppliers.map((supplier, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {isEditing ? (
                        <input
                          type="text"
                          className="w-full p-2 border rounded"
                          value={supplier.company_name || ""}
                          onChange={(e) => handleSupplierChange(index, "company_name", e.target.value)}
                        />
                      ) : (
                        supplier.company_name
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <input
                          type="text"
                          className="w-full p-2 border rounded"
                          value={supplier.representative || ""}
                          onChange={(e) => handleSupplierChange(index, "representative", e.target.value)}
                        />
                      ) : (
                        supplier.representative
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <input
                          type="text"
                          className="w-full p-2 border rounded"
                          value={supplier.phone_number || ""}
                          onChange={(e) => handleSupplierChange(index, "phone_number", e.target.value)}
                        />
                      ) : (
                        supplier.phone_number
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <input
                          type="text"
                          className="w-full p-2 border rounded"
                          value={Array.isArray(supplier.email) ? supplier.email.join(", ") : supplier.email || ""}
                          onChange={(e) => handleSupplierChange(index, "email", e.target.value)}
                        />
                      ) : Array.isArray(supplier.email) ? (
                        supplier.email.join(", ")
                      ) : (
                        supplier.email
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                    {t("no_data")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

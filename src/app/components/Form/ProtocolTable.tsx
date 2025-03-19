"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import dayjs from "dayjs"
import "dayjs/locale/en"
import "dayjs/locale/ru"
import { useLocale, useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import type { Protocol } from "../../types/types"
import Icons from "../Icons"

type ProtocolTableProps = {
  protocols: Protocol | null
}

const ProtocolTable = ({ protocols: initialProtocols }: ProtocolTableProps) => {
  const t = useTranslations("dashboard")
  const locale = useLocale()
  dayjs.locale(locale)

  const [protocols, setProtocols] = useState<Protocol | null>(initialProtocols)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  
  useEffect(() => {
    setProtocols(initialProtocols)
  }, [initialProtocols])

  const handleProjectNameChange = (value: string) => {
    if (!protocols) return
    setProtocols((prev) => (prev ? { ...prev, project_name: value } : null))
  }

  const handleConstructiveChange = (value: string) => {
    if (!protocols) return
    setProtocols((prev) => (prev ? { ...prev, constructive: value } : null))
  }

  const handleLocationChange = (value: string) => {
    if (!protocols) return
    setProtocols((prev) => (prev ? { ...prev, location: value } : null))
  }

  const handleMaterialChange = (index: number, field: string, value: string) => {
    if (!protocols) return
    if (!protocols.materials_decisions) return
    const updated = [...protocols.materials_decisions]
    updated[index] = {
      ...updated[index],
      [field]: value,
    }
    setProtocols((prev) => (prev ? { ...prev, materials_decisions: updated } : null))
  }

  const handleAddMaterial = () => {
    if (!protocols) return
    const newMaterial = {
      name: "",
      technical_characteristics: "",
      manufacturer: "",
    }
    const updated = protocols.materials_decisions ? [...protocols.materials_decisions, newMaterial] : [newMaterial]
    setProtocols((prev) => (prev ? { ...prev, materials_decisions: updated } : null))
  }

  const handleNoteChange = (index: number, value: string) => {
    if (!protocols) return
    if (!protocols.notes) return
    const updated = [...protocols.notes]
    updated[index] = value
    setProtocols((prev) => (prev ? { ...prev, notes: updated } : null))
  }

  const handleAddNote = () => {
    if (!protocols) return
    const updated = protocols.notes ? [...protocols.notes, ""] : [""]
    setProtocols((prev) => (prev ? { ...prev, notes: updated } : null))
  }

  const handleSupplierChange = (index: number, field: string, value: string) => {
    if (!protocols) return
    if (!protocols.suppliers) return
    const updated = [...protocols.suppliers]
    updated[index] = {
      ...updated[index],
      [field]: value,
    }
    setProtocols((prev) => (prev ? { ...prev, suppliers: updated } : null))
  }

  const handleAddSupplier = () => {
    if (!protocols) return
    const newSupplier = {
      company_name: "",
      representative: "",
      phone_number: "",
      email: "",
    }
    const updated = protocols.suppliers ? [...protocols.suppliers, newSupplier] : [newSupplier]
    setProtocols((prev) => {
      if (!prev) return null
      return {
        ...prev,
        suppliers: updated.map((supplier) => ({
          ...supplier,
          email: Array.isArray(supplier.email) ? supplier.email : [supplier.email].filter(Boolean),
        })),
      }
    })
  }

  const handleSave = () => {
    console.log("Saving updated protocols: ", protocols)
    setIsEditing(false)
  }

  return (
    <div className="h-[calc(100vh-200px)] min-w-[300px] w-full overflow-y-auto">
      <div className="flex justify-between px-4 py-3 items-center">
        <h2 className="text-sm md:text-lg font-semibold text-brand-gray">{t("technical_council_protocol")}</h2>
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            variant="outline"
            className="gap-2 hover:bg-brand-gray/5"
            size="sm"
          >
            <Icons.Edit_protocol  />
            <span className="font-medium text-xs md:text-sm text-brand-gray">{t("make_changes")}</span>
          </Button>
        ) : (
          <Button onClick={handleSave} variant="default" className="gap-2" size="sm">
            {t("save_and_share")}
          </Button>
        )}
      </div>

      {/* PROJECT INFO */}
      <div className="overflow-hidden rounded-lg border border-gray-300 my-4">
        <div className="grid grid-cols-1 md:hidden">
          <div className="bg-gray-50 border-b border-gray-300 px-4 py-2 font-medium text-sm">{t("project_info")}</div>
          <div className="divide-y divide-gray-300">
            <div className="grid grid-cols-2 px-4 py-2">
              <div className="text-sm font-medium">{t("project")}</div>
              <div className="text-sm">
                {isEditing ? (
                  <input
                    className="border p-1 w-full"
                    value={protocols?.project_name || ""}
                    onChange={(e) => handleProjectNameChange(e.target.value)}
                  />
                ) : (
                  protocols?.project_name || "..."
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 px-4 py-2">
              <div className="text-sm font-medium">{t("constructive")}</div>
              <div className="text-sm">
                {isEditing ? (
                  <input
                    className="border p-1 w-full"
                    value={protocols?.constructive || ""}
                    onChange={(e) => handleConstructiveChange(e.target.value)}
                  />
                ) : (
                  protocols?.constructive
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 px-4 py-2">
              <div className="text-sm font-medium">{t("date")}</div>
              <div className="text-sm">{dayjs(protocols?.meeting_date).format("DD MMMM YYYY")}</div>
            </div>
            <div className="grid grid-cols-2 px-4 py-2">
              <div className="text-sm font-medium">{t("time")}</div>
              <div className="text-sm">
                {protocols?.meeting_time ? dayjs(`1970-01-01 ${protocols?.meeting_time}`).format("HH:mm") : null}
              </div>
            </div>
            <div className="grid grid-cols-2 px-4 py-2">
              <div className="text-sm font-medium">{t("place")}</div>
              <div className="text-sm">
                {isEditing ? (
                  <input
                    className="border p-1 w-full"
                    value={protocols?.location || ""}
                    onChange={(e) => handleLocationChange(e.target.value)}
                  />
                ) : (
                  protocols?.location
                )}
              </div>
            </div>
          </div>
        </div>

        <Table className="w-full hidden md:table">
          <TableHeader>
            <TableRow className="bg-gray-50 border-b border-gray-300">
              <TableHead className="px-4 py-2">{t("project")}</TableHead>
              <TableHead className="px-4 py-2">{t("constructive")}</TableHead>
              <TableHead className="px-4 py-2">{t("date")}</TableHead>
              <TableHead className="px-4 py-2">{t("time")}</TableHead>
              <TableHead className="px-4 py-2">{t("place")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="border-b border-gray-300 last:border-0">
              <TableCell className="py-2">
                {isEditing ? (
                  <input
                    className="border p-1 w-full"
                    value={protocols?.project_name || ""}
                    onChange={(e) => handleProjectNameChange(e.target.value)}
                  />
                ) : (
                  protocols?.project_name || "..."
                )}
              </TableCell>
              <TableCell className="px-4 py-2">
                {isEditing ? (
                  <input
                    className="border p-1 w-full"
                    value={protocols?.constructive || ""}
                    onChange={(e) => handleConstructiveChange(e.target.value)}
                  />
                ) : (
                  protocols?.constructive
                )}
              </TableCell>
              <TableCell className="px-4 py-2">{dayjs(protocols?.meeting_date).format("DD MMMM YYYY")}</TableCell>
              <TableCell className="px-4 py-2">
                {protocols?.meeting_time ? dayjs(`1970-01-01 ${protocols?.meeting_time}`).format("HH:mm") : null}
              </TableCell>
              <TableCell className="px-4 py-2">
                {isEditing ? (
                  <input
                    className="border p-1 w-full"
                    value={protocols?.location || ""}
                    onChange={(e) => handleLocationChange(e.target.value)}
                  />
                ) : (
                  protocols?.location
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* MATERIALS AND TECHNICAL SOLUTIONS */}
      <div className="overflow-hidden rounded-lg border border-gray-300 my-4">
        <div className="md:hidden">
          <div className="bg-neutrals-secondary w-full py-3 px-4">
            <div className="flex justify-between items-center w-full">
              <div className="flex gap-2 text-brand-gray text-sm font-medium items-center">
                <Icons.Tool />
                {t("materials_and_technical_solutions")}
              </div>
              {isEditing && (
                <span className="text-xs cursor-pointer text-brand-darkOrange" onClick={handleAddMaterial}>
                  {t("add_material/solution")}
                </span>
              )}
            </div>
          </div>

          {protocols?.materials_decisions?.map((decision, idx) => (
            <div key={idx} className="border-t border-gray-300 p-4">
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-500 mb-1">{t("name")}</div>
                  <div>
                    {isEditing ? (
                      <input
                        className="border p-1 w-full"
                        value={decision.name}
                        onChange={(e) => handleMaterialChange(idx, "name", e.target.value)}
                      />
                    ) : (
                      <span className="text-sm">{decision.name}</span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">{t("technical_characteristics")}</div>
                  <div>
                    {isEditing ? (
                      <input
                        className="border p-1 w-full"
                        value={decision.technical_characteristics}
                        onChange={(e) => handleMaterialChange(idx, "technical_characteristics", e.target.value)}
                      />
                    ) : (
                      <span className="text-sm">{decision.technical_characteristics}</span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">{t("made_by")}</div>
                  <div>
                    {isEditing ? (
                      <input
                        className="border p-1 w-full"
                        value={decision.manufacturer}
                        onChange={(e) => handleMaterialChange(idx, "manufacturer", e.target.value)}
                      />
                    ) : (
                      <span className="text-sm">{decision.manufacturer}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Table className="w-full hidden md:table">
          <TableHeader>
            <TableRow className="bg-neutrals-secondary w-full">
              <TableCell colSpan={5} className="py-3 px-4">
                <div className="flex justify-between items-center w-full">
                  <div className="flex gap-2 text-brand-gray text-sm font-medium items-center">
                    <Icons.Tool />
                    {t("materials_and_technical_solutions")}
                  </div>
                  {isEditing && (
                    <span className="text-sm cursor-pointer text-brand-darkOrange" onClick={handleAddMaterial}>
                      {t("add_material/solution")}
                    </span>
                  )}
                </div>
              </TableCell>
            </TableRow>
            <TableRow className="bg-gray-50 border-b border-gray-300">
              <TableHead className="px-4 py-2">{t("name")}</TableHead>
              <TableHead className="px-4 py-2">{t("technical_characteristics")}</TableHead>
              <TableHead className="px-4 py-2">{t("made_by")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {protocols?.materials_decisions?.map((decision, idx) => (
              <TableRow key={idx} className="border-b border-gray-300 last:border-0">
                <TableCell className="px-4 py-2">
                  {isEditing ? (
                    <input
                      className="border p-1 w-full"
                      value={decision.name}
                      onChange={(e) => handleMaterialChange(idx, "name", e.target.value)}
                    />
                  ) : (
                    decision.name
                  )}
                </TableCell>
                <TableCell className="px-4 py-2">
                  {isEditing ? (
                    <input
                      className="border p-1 w-full"
                      value={decision.technical_characteristics}
                      onChange={(e) => handleMaterialChange(idx, "technical_characteristics", e.target.value)}
                    />
                  ) : (
                    decision.technical_characteristics
                  )}
                </TableCell>
                <TableCell className="px-4 py-2">
                  {isEditing ? (
                    <input
                      className="border p-1 w-full"
                      value={decision.manufacturer}
                      onChange={(e) => handleMaterialChange(idx, "manufacturer", e.target.value)}
                    />
                  ) : (
                    decision.manufacturer
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* NOTES */}
      <div className="overflow-hidden rounded-lg border border-gray-300 my-4">
        <div className="bg-neutrals-secondary w-full py-3 px-4">
          <div className="flex justify-between items-center w-full">
            <div className="flex gap-2 text-brand-gray text-sm font-medium items-center justify-start">
              <Icons.Message_plus />
              {t("notes")}
            </div>
            {isEditing && (
              <span className="text-sm cursor-pointer text-brand-darkOrange" onClick={handleAddNote}>
                {t("add_note")}
              </span>
            )}
          </div>
        </div>

        <div className="divide-y divide-gray-300">
          {protocols?.notes?.map((note, idx) => (
            <div key={idx} className="px-4 py-3">
              {isEditing ? (
                <input
                  className="border p-1 w-full"
                  placeholder={t("add_note")}
                  value={note}
                  onChange={(e) => handleNoteChange(idx, e.target.value)}
                />
              ) : (
                <p className="text-sm">{note}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* TECHNICAL EXPERTS */}
      <div className="overflow-hidden rounded-lg border border-gray-300 my-4">
        <div className="md:hidden">
          <div className="bg-neutrals-secondary w-full py-3 px-4">
            <div className="flex gap-2 text-brand-gray text-sm font-medium items-center justify-start w-full">
              <Icons.User_check  />
              {t("technical_experts")}
            </div>
          </div>

          {protocols?.project_team?.map((expert, idx) => (
            <div key={idx} className="border-t border-gray-300 p-4">
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-500 mb-1">{t("position")}</div>
                  <div className="text-sm">{expert.position}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">{t("full_name_short")}</div>
                  <div className="text-sm">{expert.full_name}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">{t("signature")}</div>
                  <div className="text-sm">{expert.signature}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Table className="w-full hidden md:table">
          <TableHeader>
            <TableRow className="bg-neutrals-secondary w-full">
              <TableCell colSpan={5} className="py-3 px-4">
                <div className="flex gap-2 text-brand-gray text-sm font-medium items-center justify-start w-full">
                  <Icons.User_check />
                  {t("technical_experts")}
                </div>
              </TableCell>
            </TableRow>
            <TableRow className="bg-gray-50 border-b border-gray-300">
              <TableHead className="px-4 py-2">{t("position")}</TableHead>
              <TableHead className="px-4 py-2">{t("full_name_short")}</TableHead>
              <TableHead className="px-4 py-2">{t("signature")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {protocols?.project_team?.map((expert, idx) => (
              <TableRow key={idx} className="border-b border-gray-300 last:border-0">
                <TableCell className="px-4 py-2">{expert.position}</TableCell>
                <TableCell className="px-4 py-2">{expert.full_name}</TableCell>
                <TableCell className="px-4 py-2">{expert.signature}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* SUPPLIERS */}
      <div className="overflow-hidden rounded-lg border border-gray-300 my-4">
        <div className="md:hidden">
          <div className="bg-neutrals-secondary w-full py-3 px-4">
            <div className="flex justify-between items-center w-full">
              <div className="flex gap-2 text-brand-gray text-sm font-medium items-center justify-start">
                <Icons.Users_group />
                {t("suppliers")}
              </div>
              {isEditing && (
                <span className="text-xs cursor-pointer text-brand-darkOrange" onClick={handleAddSupplier}>
                  {t("add_supplier")}
                </span>
              )}
            </div>
          </div>

          {protocols?.suppliers?.map((supplier, idx) => (
            <div key={idx} className="border-t border-gray-300 p-4">
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-500 mb-1">{t("company")}</div>
                  <div>
                    {isEditing ? (
                      <input
                        className="border p-1 w-full"
                        value={supplier.company_name}
                        onChange={(e) => handleSupplierChange(idx, "company_name", e.target.value)}
                      />
                    ) : (
                      <span className="text-sm">{supplier.company_name}</span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">{t("full_name_short")}</div>
                  <div>
                    {isEditing ? (
                      <input
                        className="border p-1 w-full"
                        value={supplier.representative}
                        onChange={(e) => handleSupplierChange(idx, "representative", e.target.value)}
                      />
                    ) : (
                      <span className="text-sm">{supplier.representative}</span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">{t("contacts")}</div>
                  <div>
                    {isEditing ? (
                      <input
                        className="border p-1 w-full"
                        value={supplier.phone_number}
                        onChange={(e) => handleSupplierChange(idx, "phone_number", e.target.value)}
                      />
                    ) : (
                      <span className="text-sm">{supplier.phone_number}</span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">{t("mail")}</div>
                  <div>
                    {isEditing ? (
                      <input
                        className="border p-1 w-full"
                        value={supplier.email}
                        onChange={(e) => handleSupplierChange(idx, "email", e.target.value)}
                      />
                    ) : (
                      <span className="text-sm">{supplier.email}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Table className="w-full hidden md:table">
          <TableHeader>
            <TableRow className="bg-neutrals-secondary w-full">
              <TableCell colSpan={5} className="py-3 px-4">
                <div className="flex justify-between items-center w-full">
                  <div className="flex gap-2 text-brand-gray text-sm font-medium items-center justify-start">
                    <Icons.Users_group />
                    {t("suppliers")}
                  </div>
                  {isEditing && (
                    <span className="text-sm cursor-pointer text-brand-darkOrange" onClick={handleAddSupplier}>
                      {t("add_supplier")}
                    </span>
                  )}
                </div>
              </TableCell>
            </TableRow>
            <TableRow className="bg-gray-50 border-b border-gray-300">
              <TableHead className="px-4 py-2">{t("company")}</TableHead>
              <TableHead className="px-4 py-2">{t("full_name_short")}</TableHead>
              <TableHead className="px-4 py-2">{t("contacts")}</TableHead>
              <TableHead className="px-4 py-2">{t("mail")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {protocols?.suppliers?.map((supplier, idx) => (
              <TableRow key={idx} className="border-b border-gray-300 last:border-0">
                <TableCell className="px-4 py-2">
                  {isEditing ? (
                    <input
                      className="border p-1 w-full"
                      value={supplier.company_name}
                      onChange={(e) => handleSupplierChange(idx, "company_name", e.target.value)}
                    />
                  ) : (
                    supplier.company_name
                  )}
                </TableCell>
                <TableCell className="px-4 py-2">
                  {isEditing ? (
                    <input
                      className="border p-1 w-full"
                      value={supplier.representative}
                      onChange={(e) => handleSupplierChange(idx, "representative", e.target.value)}
                    />
                  ) : (
                    supplier.representative
                  )}
                </TableCell>
                <TableCell className="px-4 py-2">
                  {isEditing ? (
                    <input
                      className="border p-1 w-full"
                      value={supplier.phone_number}
                      onChange={(e) => handleSupplierChange(idx, "phone_number", e.target.value)}
                    />
                  ) : (
                    supplier.phone_number
                  )}
                </TableCell>
                <TableCell className="px-4 py-2">
                  {isEditing ? (
                    <input
                      className="border p-1 w-full"
                      value={supplier.email}
                      onChange={(e) => handleSupplierChange(idx, "email", e.target.value)}
                    />
                  ) : (
                    supplier.email
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default ProtocolTable


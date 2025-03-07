import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import dayjs from 'dayjs'
import 'dayjs/locale/en'
import 'dayjs/locale/ru'
import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { Protocol } from '../../types/types'
import Icons from '../Icons'

type ProtocolTableProps = {
  protocols: Protocol | null
}

const ProtocolTable = ({ protocols: initialProtocols }: ProtocolTableProps) => {
  const t = useTranslations("dashboard");
  const locale = useLocale();
  dayjs.locale(locale);

  const [protocols, setProtocols] = useState<Protocol | null>(initialProtocols);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    setProtocols(initialProtocols);
  }, [initialProtocols]);

  const handleProjectNameChange = (value: string) => {
    if (!protocols) return;
    setProtocols(prev => prev ? { ...prev, project_name: value } : null);
  };

  const handleConstructiveChange = (value: string) => {
    if (!protocols) return;
    setProtocols(prev => prev ? { ...prev, constructive: value } : null);
  };

  const handleLocationChange = (value: string) => {
    if (!protocols) return;
    setProtocols(prev => prev ? { ...prev, location: value } : null);
  };

  const handleMaterialChange = (index: number, field: string, value: string) => {
    if (!protocols) return;
    if (!protocols.materials_decisions) return;
    const updated = [...protocols.materials_decisions];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    setProtocols(prev => prev ? { ...prev, materials_decisions: updated } : null);
  };

  const handleAddMaterial = () => {
    if (!protocols) return;
    const newMaterial = {
      name: '',
      technical_characteristics: '',
      manufacturer: ''
    };
    const updated = protocols.materials_decisions
      ? [...protocols.materials_decisions, newMaterial]
      : [newMaterial];
    setProtocols(prev => prev ? { ...prev, materials_decisions: updated } : null);
  };

  const handleNoteChange = (index: number, value: string) => {
    if (!protocols) return;
    if (!protocols.notes) return;
    const updated = [...protocols.notes];
    updated[index] = value;
    setProtocols(prev => prev ? { ...prev, notes: updated } : null);
  };

  const handleAddNote = () => {
    if (!protocols) return;
    const updated = protocols.notes
      ? [...protocols.notes, '']
      : [''];
    setProtocols(prev => prev ? { ...prev, notes: updated } : null);
  };

  const handleSupplierChange = (index: number, field: string, value: string) => {
    if (!protocols) return;
    if (!protocols.suppliers) return;
    const updated = [...protocols.suppliers];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    setProtocols(prev => prev ? { ...prev, suppliers: updated } : null);
  };

  const handleAddSupplier = () => {
    if (!protocols) return;
    const newSupplier = {
      company_name: '',
      representative: '',
      phone_number: '',
      email: ''
    };
    const updated = protocols.suppliers
      ? [...protocols.suppliers, newSupplier]
      : [newSupplier];
    setProtocols(prev => {
      if (!prev) return null;
      return {
        ...prev,
        suppliers: updated.map(supplier => ({
          ...supplier,
          email: Array.isArray(supplier.email) ? supplier.email : [supplier.email].filter(Boolean)
        }))
      };
    });
  };

  // You can replicate the same pattern for "project_team" or other arrays

  // Final save action – do whatever you want here,
  // e.g. call an API or pass back up to parent
  const handleSave = () => {
    console.log('Saving updated protocols: ', protocols);
    setIsEditing(false);
  };

  return (
    <div className='h-[calc(100vh-200px)] overflow-y-auto'>
      <div className='flex justify-between px-4 py-3 items-center'>
        <h2 className='text-lg font-semibold text-brand-gray'>{t("technical_council_protocol")}</h2>
        {
          !isEditing ? (
            <Button 
              onClick={() => setIsEditing(true)} 
              variant='outline' 
              className='gap-2 hover:bg-brand-gray/5'
            >
              <Icons.Edit_protocol />
              <span className='font-medium text-sm text-brand-gray'>
                {t("make_changes")}
              </span>
            </Button>
          ) : (
            <Button 
              onClick={handleSave} 
              variant='default' 
              className='gap-2 '
            >
              {t("save_and_share")}
            </Button>
          )
        }
      </div>

      {/* PROJECT INFO */}
      <div className="overflow-hidden rounded-lg border border-gray-300 my-4">
        <Table className="w-full">
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
                    value={protocols?.project_name || ''}
                    onChange={(e) => handleProjectNameChange(e.target.value)}
                  />
                ) : (
                  protocols?.project_name || '...'
                )}
              </TableCell>
              <TableCell className="px-4 py-2">
                {isEditing ? (
                  <input
                    className="border p-1 w-full"
                    value={protocols?.constructive || ''}
                    onChange={(e) => handleConstructiveChange(e.target.value)}
                  />
                ) : (
                  protocols?.constructive
                )}
              </TableCell>
              <TableCell className="px-4 py-2">
                {dayjs(protocols?.meeting_date).format("DD MMMM YYYY")}
              </TableCell>
              <TableCell className="px-4 py-2">
                {protocols?.meeting_time ? dayjs(`1970-01-01 ${protocols?.meeting_time}`).format('HH:mm') : null}
              </TableCell>
              <TableCell className="px-4 py-2">
                {isEditing ? (
                  <input
                    className="border p-1 w-full"
                    value={protocols?.location || ''}
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
      <div className="overflow-hidden rounded-lg border border-gray-300 my-4">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-neutrals-secondary w-full">
              <TableCell colSpan={5} className="py-3 px-4">
                <div className='flex justify-between items-center w-full'>
                  <div className='flex gap-2 text-brand-gray text-sm font-medium items-center'>
                    <Icons.Tool />
                    {t("materials_and_technical_solutions")}
                  </div>
                  {isEditing && (
                    <span
                      className='text-sm cursor-pointer text-brand-darkOrange'
                      onClick={handleAddMaterial}
                    >
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
                      onChange={(e) => handleMaterialChange(idx, 'name', e.target.value)}
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
                      onChange={(e) => handleMaterialChange(idx, 'technical_characteristics', e.target.value)}
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
                      onChange={(e) => handleMaterialChange(idx, 'manufacturer', e.target.value)}
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
      <div className="overflow-hidden rounded-lg border border-gray-300 my-4">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-neutrals-secondary w-full">
              <TableCell colSpan={5} className="py-3 px-4">
                <div className='flex justify-between items-center w-full'>
                  <div className='flex gap-2 text-brand-gray text-sm font-medium items-center justify-start'>
                    <Icons.Message_plus />
                    {t("notes")}
                  </div>
                  {isEditing && (
                    <span
                      className='text-sm cursor-pointer text-brand-darkOrange'
                      onClick={handleAddNote}
                    >
                      {t("add_note")}
                    </span>
                  )}
                </div>
              </TableCell>
            </TableRow>
            <TableRow className="bg-gray-50 border-b border-gray-300">
            </TableRow>
          </TableHeader>
          <TableBody>
            {protocols?.notes?.map((note, idx) => (
              <TableRow key={idx} className="border-b border-gray-300 last:border-0">
                <TableCell className="px-4 py-2">
                  {isEditing ? (
                    <input
                      className="border p-1 w-full"
                      placeholder={t("add_note")}
                      value={note}
                      onChange={(e) => handleNoteChange(idx, e.target.value)}
                    />
                  ) : (
                    note
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* TECHNICAL EXPERTS (example: read-only if you want, or same pattern) */}
      <div className="overflow-hidden rounded-lg border border-gray-300 my-4">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-neutrals-secondary w-full">
              <TableCell colSpan={5} className="py-3 px-4">
                <div className='flex gap-2 text-brand-gray text-sm font-medium items-center justify-start w-full'>
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
                <TableCell className="px-4 py-2">
                  {/* If you also want to edit these, do the same pattern */}
                  {expert.position}
                </TableCell>
                <TableCell className="px-4 py-2">{expert.full_name}</TableCell>
                <TableCell className="px-4 py-2">{expert.signature}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* SUPPLIERS */}
      <div className="overflow-hidden rounded-lg border border-gray-300 my-4">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-neutrals-secondary w-full">
              <TableCell colSpan={5} className="py-3 px-4">
                <div className='flex justify-between items-center w-full'>
                  <div className='flex gap-2 text-brand-gray text-sm font-medium items-center justify-start'>
                    <Icons.Users_group />
                    {t("suppliers")}
                  </div>
                  {isEditing && (
                    <span
                      className='text-sm cursor-pointer text-brand-darkOrange'
                      onClick={handleAddSupplier}
                    >
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
                      onChange={(e) =>
                        handleSupplierChange(idx, 'company_name', e.target.value)
                      }
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
                      onChange={(e) =>
                        handleSupplierChange(idx, 'representative', e.target.value)
                      }
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
                      onChange={(e) =>
                        handleSupplierChange(idx, 'phone_number', e.target.value)
                      }
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
                      onChange={(e) => handleSupplierChange(idx, 'email', e.target.value)}
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
};

export default ProtocolTable;

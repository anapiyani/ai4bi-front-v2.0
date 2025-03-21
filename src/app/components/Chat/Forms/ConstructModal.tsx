"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/Checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { getCookie } from "@/src/app/api/service/cookie"
import type { InterestsResponse } from "@/src/app/types/types"
import { useLocale } from "next-intl"
import { useEffect, useMemo, useState } from "react"
import Icons from "../../Icons"
import { useAddInterests, useInterests } from "../hooks/useInterests"
import Interests from "./interests"

type ConstructModalProps = {
  constructModalOpen: boolean
  setConstructModalOpen: (open: boolean) => void
  t: (key: string) => string
}

const ConstructModal = ({ constructModalOpen, setConstructModalOpen, t }: ConstructModalProps) => {
  const locale = useLocale()
  const { data: interests } = useInterests(constructModalOpen)
  const [cities, setCities] = useState<string[]>([])
  const [step, setStep] = useState(1)

  const [nowOpenCity, setNowOpenCity] = useState<string>("")
  const [chosenCities, setChosenCities] = useState<string[]>([])
  const [chosenConstructs, setChosenConstructs] = useState<InterestsResponse[]>([])
  const addInterests = useAddInterests()
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (interests && interests.length > 0) {
      const unique = Array.from(new Set(interests.map((i) => i.city)))
      setCities(unique)
    }
  }, [interests])

  const sortedCities = useMemo(() => [...cities].sort(), [cities])
  const groupedCities = useMemo(() => {
    return sortedCities.reduce(
      (acc, city) => {
        const firstLetter = city.charAt(0).toUpperCase()
        if (!acc[firstLetter]) {
          acc[firstLetter] = []
        }
        acc[firstLetter].push(city)
        return acc
      },
      {} as Record<string, string[]>,
    )
  }, [sortedCities])

  const handleCityClick = (city: string) => {
    if (nowOpenCity === city) {
      if (chosenCities.includes(city)) {
        setChosenCities(chosenCities.filter((c) => c !== city))
        setChosenConstructs(chosenConstructs.filter((c) => c.city !== city))
      }
    } else {
      setNowOpenCity(city)
    }
  }

  const constructsInOpenCity: InterestsResponse[] = useMemo(() => {
    if (!nowOpenCity) return []
    return interests?.filter((item) => item.city === nowOpenCity) || []
  }, [interests, nowOpenCity])

  const chosenConstructsForCity = useMemo(() => {
    return chosenConstructs.filter((c) => c.city === nowOpenCity)
  }, [chosenConstructs, nowOpenCity])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    await addInterests.mutateAsync({
      interests_id: chosenConstructs.map((c) => c.interest_id),
      user_id: getCookie("user_id") || "",
    })
    setConstructModalOpen(false)
  }

  const renderMobileContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="flex flex-col gap-2 h-[calc(100vh-18rem)]">
            <h2 className="text-base font-semibold text-brand-gray">{t("choose_city")}</h2>
            <div className="h-full overflow-y-auto">
              {Object.entries(groupedCities).map(([letter, cityList]) => (
                <div key={letter} className="flex flex-col gap-2">
                  <h2 className="text-xs font-medium px-2 text-neutrals-muted">{letter}</h2>
                  <div className="flex flex-col gap-2 py-3">
                    {cityList.map((city) => (
                      <div
                        key={city}
                        onClick={() => {
                          handleCityClick(city)
                          setStep(2)
                        }}
                        className="py-[3px] px-7 flex cursor-pointer items-center gap-2 relative rounded"
                      >
                        <p className="font-semibold text-sm">{city}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      case 2:
        return (
          <div className="flex flex-col gap-2 w-full">
            <h2 className="text-base font-semibold text-brand-gray">
              {locale === "kz"
                ? `${t("constructs")} ${nowOpenCity} ${t("in_city")}:`
                : `${t("constructs_in")} ${nowOpenCity}:`}
            </h2>
            <Input
              placeholder={t("search")}
              icon={<Icons.SearchInput />}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="flex items-center gap-2 ml-2">
              <Checkbox
                onCheckedChange={() => {
                  if (chosenConstructsForCity.length === constructsInOpenCity.length) {
                    setChosenConstructs(chosenConstructs.filter((c) => c.city !== nowOpenCity))
                    setChosenCities(chosenCities.filter((c) => c !== nowOpenCity))
                  } else {
                    const newChosen = [
                      ...chosenConstructs.filter((c) => c.city !== nowOpenCity),
                      ...constructsInOpenCity,
                    ]
                    setChosenConstructs(newChosen)
                    if (!chosenCities.includes(nowOpenCity)) {
                      setChosenCities([...chosenCities, nowOpenCity])
                    }
                  }
                }}
                checked={
                  chosenConstructsForCity.length === constructsInOpenCity.length && constructsInOpenCity.length > 0
                }
              />
              <p className="text-sm">{t("choose_all")}</p>
            </div>
            <div className="flex flex-col gap-2 h-[calc(100vh-25rem)] overflow-y-auto">
              {constructsInOpenCity
                .filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((construct) => (
                  <Interests
                    key={construct.interest_id}
                    construct={construct}
                    chosenConstructs={chosenConstructs}
                    setChosenConstructs={setChosenConstructs}
                    setChosenCities={setChosenCities}
                    chosenCities={chosenCities}
                  />
                ))}
            </div>
          </div>
        )
      case 3:
        return (
          <div className="flex flex-col gap-2 w-full">
            {chosenCities.length === 0 && <p className="text-sm px-2 flex self-center">{t("no_constructs_chosen")}</p>}
            {chosenCities.length > 0 && (
              <h2 className="text-base font-semibold text-brand-gray">{t("your_choice")}:</h2>
            )}
            {chosenCities.map((city) => (
              <div key={city} className="flex flex-col gap-2 my-4 h-[calc(100vh-25rem)] overflow-y-auto">
                <p className="text-sm font-semibold text-brand-gray">{city}</p>
                <hr className="border-border" />
                {chosenConstructs
                  .filter((c) => c.city === city)
                  .map((construct) => (
                    <Interests
                      key={construct.interest_id}
                      construct={construct}
                      chosenConstructs={chosenConstructs}
                      setChosenConstructs={setChosenConstructs}
                      setChosenCities={setChosenCities}
                      chosenCities={chosenCities}
                      no_border={true}
                    />
                  ))}
              </div>
            ))}
          </div>
        )
    }
  }

  return (
    <Dialog open={constructModalOpen} onOpenChange={setConstructModalOpen}>
      <DialogContent className="bg-neutrals-secondary w-[320px] md:w-[90%] lg:w-full lg:max-w-[1200px] mx-auto my-4">
        <DialogHeader>
          <DialogTitle className="text-lg">{t("choose_construct")}</DialogTitle>
        </DialogHeader>

        <div className="hidden md:block">
          <DialogDescription className="w-full grid grid-cols-[20%_40%_40%] gap-2 flex-1 h-[calc(100vh-18rem)]">
            <div className="flex flex-col gap-2 justify-start overflow-y-auto">
              {Object.entries(groupedCities).map(([letter, cityList]) => (
                <div key={letter}>
                  <h2 className="text-xs font-medium px-2 text-neutrals-muted">{letter}</h2>
                  <div className="flex flex-col gap-2 py-3">
                    {cityList.map((city) => {
                      const isChosen = chosenCities.includes(city)
                      const isOpen = nowOpenCity === city

                      return (
                        <div
                          key={city}
                          onClick={() => handleCityClick(city)}
                          className={`py-[3px] px-7 flex cursor-pointer items-center gap-2 relative rounded
                            ${isOpen ? "bg-neutrals-border/20 text-primary" : ""}
                          `}
                        >
                          {isChosen && (
                            <div className="bg-brand-primary rounded-full absolute left-0">
                              <Icons.Check fill="#f97316" />
                            </div>
                          )}
                          <p className="font-semibold text-sm">{city}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2 justify-start overflow-y-auto">
              {nowOpenCity ? (
                <div className="flex flex-col gap-2">
                  {nowOpenCity &&
                    (locale === "kz" ? (
                      <h2 className="text-base font-semibold text-brand-gray">
                        {t("constructs")} {nowOpenCity} {t("in_city")}:
                      </h2>
                    ) : (
                      <h2 className="text-base font-semibold text-brand-gray">
                        {t("constructs_in")} {nowOpenCity}:
                      </h2>
                    ))}
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder={t("search")}
                      icon={<Icons.SearchInput />}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <Checkbox
                      onCheckedChange={() => {
                        if (chosenConstructsForCity.length === constructsInOpenCity.length) {
                          setChosenConstructs(chosenConstructs.filter((c) => c.city !== nowOpenCity))
                          setChosenCities(chosenCities.filter((c) => c !== nowOpenCity))
                        } else {
                          const newChosen = [
                            ...chosenConstructs.filter((c) => c.city !== nowOpenCity),
                            ...constructsInOpenCity,
                          ]
                          setChosenConstructs(newChosen)
                          if (!chosenCities.includes(nowOpenCity)) {
                            setChosenCities([...chosenCities, nowOpenCity])
                          }
                        }
                      }}
                      checked={
                        chosenConstructsForCity.length === constructsInOpenCity.length &&
                        constructsInOpenCity.length > 0
                      }
                    />
                    <p className="text-sm">{t("choose_all")}</p>
                  </div>
                  {constructsInOpenCity
                    .filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((construct) => (
                      <Interests
                        key={construct.interest_id}
                        construct={construct}
                        chosenConstructs={chosenConstructs}
                        setChosenConstructs={setChosenConstructs}
                        setChosenCities={setChosenCities}
                        chosenCities={chosenCities}
                      />
                    ))}
                </div>
              ) : (
                <div>
                  <h2 className="text-base font-semibold text-brand-gray">{t("constructs")}:</h2>
                  <p className="text-sm my-4">{t("no_city_chosen")}</p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 justify-start overflow-y-auto mr-4">
              <h2 className="text-base font-semibold text-brand-gray">{t("your_choice")}:</h2>
              <div className="flex flex-col gap-2">
                {chosenCities.length > 0 ? (
                  chosenCities.map((city) => (
                    <div key={city} className="flex flex-col gap-2 my-4 mx-2">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-brand-gray">{city}</p>
                        <hr className="w-full border-border ml-2" />
                      </div>
                      <div className="flex flex-col gap-1">
                        {chosenConstructs.length > 0 ? (
                          chosenConstructs
                            .filter((construct) => construct.city === city)
                            .map((construct) => (
                              <Interests
                                key={construct.interest_id}
                                construct={construct}
                                chosenConstructs={chosenConstructs}
                                setChosenConstructs={setChosenConstructs}
                                no_border={true}
                                setChosenCities={setChosenCities}
                                chosenCities={chosenCities}
                              />
                            ))
                        ) : (
                          <p className="text-sm px-2">{t("no_constructs_chosen")}</p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm my-2">{t("no_city_chosen")}</p>
                )}
              </div>
            </div>
          </DialogDescription>
        </div>

        <div className="md:hidden">
          <DialogDescription className="w-full flex-1">{renderMobileContent()}</DialogDescription>
        </div>

        {
          <div className="flex justify-between items-center gap-2 h-full mt-2">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)} className="md:hidden">
                {t("back")}
              </Button>
            )}
            {step == 2 && <Button onClick={() => setStep(3)}>{t("continue")}</Button>}
            {step == 3 && <Button onClick={handleSave}>{t("save_chosen")}</Button>}
          </div>
        }

        <DialogFooter>
          <Button className="hidden md:block lg:block" variant="outline" onClick={() => setConstructModalOpen(false)}>
            {t("cancel")}
          </Button>
          <Button className="hidden md:block lg:block" onClick={handleSave}>
            {t("save_chosen")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ConstructModal


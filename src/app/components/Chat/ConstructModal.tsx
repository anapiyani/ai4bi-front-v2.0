import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { useLocale } from "next-intl"
import { useEffect, useMemo, useState } from "react"
import Icons from "../Icons"
import { useInterests } from "./hooks/useInterests"
type ConstructModalProps = {
  constructModalOpen: boolean;
  setConstructModalOpen: (open: boolean) => void;
  t: (key: string) => string;
};

export type InterestsResponse = {
  interests_id: string;
  name: string;
  city: string;
};

const ConstructModal = ({
  constructModalOpen,
  setConstructModalOpen,
  t,
}: ConstructModalProps) => {
	const locale = useLocale()
  const { data: interests } = useInterests(constructModalOpen);
  const [cities, setCities] = useState<string[]>([]);
  const [nowOpenCity, setNowOpenCity] = useState<string>("");
  const [chosenCities, setChosenCities] = useState<string[]>([]);

  useEffect(() => {
    if (interests && interests.length > 0) {
      const unique = Array.from(new Set(interests.map((i) => i.city)));
      setCities(unique);
    }
  }, [interests]);

  const sortedCities = useMemo(() => [...cities].sort(), [cities]);
  const groupedCities = useMemo(() => {
    return sortedCities.reduce((acc, city) => {
      const firstLetter = city.charAt(0).toUpperCase();
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push(city);
      return acc;
    }, {} as Record<string, string[]>);
  }, [sortedCities]);

  const handleCityClick = (city: string) => {
    if (chosenCities.includes(city)) {
      setChosenCities(chosenCities.filter((c) => c !== city));
    } else {
      setChosenCities([...chosenCities, city]);
    }
    setNowOpenCity(city);
  };

  const constructsInOpenCity = useMemo(() => {
    if (!nowOpenCity) return [];
    return interests?.filter((item) => item.city === nowOpenCity) || [];
  }, [interests, nowOpenCity]);
	console.log(constructsInOpenCity)

  return (
    <Dialog open={constructModalOpen} onOpenChange={setConstructModalOpen}>
      <DialogContent className="bg-neutrals-secondary max-w-[1200px] mx-4 my-4">
        <DialogHeader>
          <DialogTitle className="text-lg">{t("choose_construct")}</DialogTitle>
        </DialogHeader>
        <DialogDescription className="w-full grid grid-cols-[20%_40%_40%] gap-2 flex-1 h-[calc(100vh-18rem)]">
          <div className=" flex flex-col gap-2 justify-start overflow-y-auto">
            {Object.entries(groupedCities).map(([letter, cityList]) => (
              <div key={letter}>
                <h2 className="text-xs font-medium px-2 text-neutrals-muted">
                  {letter}
                </h2>
                <div className="flex flex-col gap-2 py-3">
                  {cityList.map((city) => {
                    const isChosen = chosenCities.includes(city);
                    const isOpen = nowOpenCity === city;

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
                        <p className="font-semibold text-sm">
                          {city}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="h-full flex flex-col overflow-y-auto px-6">
            {nowOpenCity ? (
              <div className="flex flex-col gap-2">
								{
									nowOpenCity && (
										locale === "kz" ? (
											<p className="text-base font-semibold text-brand-gray">{t("constructs")} {nowOpenCity} {t("in_city")}:</p>
										) : (
											<p className="text-base font-semibold text-brand-gray">{t("constructs_in")} {nowOpenCity}:</p>
										)
									)
								}
                {constructsInOpenCity.map((construct) => (
                  <div key={construct.interests_id}>{construct.name}</div>
                ))}
              </div>
            ) : (
              <p className="text-sm px-2">{t("no_city_chosen")}</p>
            )}
          </div>

          <div className="h-full">
            <p className="px-2">{t("already_chosen_constructs_placeholder")}</p>
          </div>
        </DialogDescription>

        <DialogFooter>
          <Button variant="outline" onClick={() => setConstructModalOpen(false)}>
            {t("cancel")}
          </Button>
          <Button
            onClick={() => {
              setConstructModalOpen(false);
            }}
          >
            {t("save_chosen")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConstructModal;

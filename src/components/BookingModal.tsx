// components/BookingModal.tsx
import React, { useState, useEffect } from "react";
import {
  X,
  Calendar,
  Clock,
  Users,
  CreditCard,
  CheckCircle,
} from "lucide-react";
import { Listing } from "@/lib/mockData";
import { createBooking } from "@/lib/api";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: Listing | null;
  currentLanguage: "en" | "fr";
}

/* ------------------------------------------------------------- */
/*  Formulaires internes                                         */
/* ------------------------------------------------------------- */
interface BookingForm {
  date: string;
  slotId: number | null;
  time: string;             // juste pour l’affichage
  participants: number;
}

interface CardForm {
  number: string;
  expiry: string;
  cvc: string;
}

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  listing,
  currentLanguage,
}) => {
  /* ----------------------------------------------------------- */
  /*  États                                                      */
  /* ----------------------------------------------------------- */
  const [step, setStep] =
    useState<"form" | "payment" | "success">("form");

  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState<BookingForm>({
    date: "",
    slotId: null,
    time: "",
    participants: 1,
  });

  const [card, setCard] = useState<CardForm>({
    number: "",
    expiry: "",
    cvc: "",
  });

  /* ----------------------------------------------------------- */
  /*  Helpers                                                    */
  /* ----------------------------------------------------------- */
  const t = (en: string, fr: string) =>
    currentLanguage === "en" ? en : fr;

  if (!listing) return null;

  const availableDates = listing.availability.map((a) => a.date);
  const slotsForDate =
    listing.availability.find((a) => a.date === form.date)?.slots ?? [];

  const totalPrice = listing.price * form.participants;

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString(
      currentLanguage === "fr" ? "fr-FR" : "en-US",
      { weekday: "long", year: "numeric", month: "long", day: "numeric" }
    );

  /* Ré-init à chaque ouverture */
  useEffect(() => {
    if (isOpen) {
      setStep("form");
      setForm({ date: "", slotId: null, time: "", participants: 1 });
      setCard({ number: "", expiry: "", cvc: "" });
    }
  }, [isOpen]);

  /* ----------------------------------------------------------- */
  /*  Étape 1 : formulaire réservation                            */
  /* ----------------------------------------------------------- */
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.date && form.slotId !== null) {
      setStep("payment");
    }
  };

  /* ----------------------------------------------------------- */
  /*  Étape 2 : “paiement” factice + createBooking                */
  /* ----------------------------------------------------------- */
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      /* ▶︎ simulation CB : 2 s */
      await new Promise((r) => setTimeout(r, 2000));

      /* ▶︎ appel API réel */
      await createBooking({
        listingId: listing.id,
        slotId: form.slotId!,      // nullable → validé plus haut
        date: form.date,
        time: form.time,
        participants: form.participants,
        paymentToken: "demo-token",
      });

      setStep("success");
    } catch (err) {
      console.error("Booking failed:", err);
      alert(t("Payment failed", "Le paiement a échoué"));
    } finally {
      setIsLoading(false);
    }
  };

  /* Champs CB valides ? (validation très simple) */
  const cardReady =
    card.number.replace(/\s+/g, "").length === 16 &&
    /^\d{2}\/\d{2}$/.test(card.expiry) &&
    card.cvc.length >= 3;

  /* ----------------------------------------------------------- */
  /*  RENDER                                                     */
  /* ----------------------------------------------------------- */
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[10000]"
          onClick={onClose}
        />
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-[10001] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ─── Header */}
            <header className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold">
                {step === "form" && t("Book Experience", "Réserver l'Expérience")}
                {step === "payment" && t("Payment", "Paiement")}
                {step === "success" && t("Booking Confirmed", "Réservation Confirmée")}
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </header>

            {/* ─── Rappel listing */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex space-x-4">
                <img
                  src={listing.images[0]}
                  className="w-16 h-16 rounded-lg object-cover"
                  alt={listing.title}
                />
                <div className="flex-1">
                  <h3 className="font-semibold line-clamp-1">
                    {t(listing.title, listing.titleFr)}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-1">
                    {t(listing.location.address, listing.location.addressFr)}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-lg font-bold text-accent">
                      {listing.price} MAD
                    </span>
                    <span className="text-sm text-gray-500">
                      {t("per person", "par personne")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ─── Contenu dépendant de l’étape */}
            <div className="p-6">
              {/* ===== Étape 1 : choix date / heure / participants ===== */}
              {step === "form" && (
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  {/* Date */}
                  <label className="block space-y-1">
                    <span className="flex items-center space-x-2 font-medium">
                      <Calendar className="w-4 h-4" />
                      <span>Date</span>
                    </span>
                    <select
                      required
                      value={form.date}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          date: e.target.value,
                          slotId: null,
                          time: "",
                        }))
                      }
                      className="w-full mt-1 border rounded-lg p-2 bg-white dark:bg-gray-700"
                    >
                      <option value="" disabled>
                        {t("Choose a date", "Choisissez une date")}
                      </option>
                      {availableDates.map((d) => (
                        <option key={d} value={d}>
                          {formatDate(d)}
                        </option>
                      ))}
                    </select>
                  </label>

                  {/* Time → stocke slotId & time */}
                  <label className="block space-y-1">
                    <span className="flex items-center space-x-2 font-medium">
                      <Clock className="w-4 h-4" />
                      <span>{t("Time", "Horaire")}</span>
                    </span>
                    <select
                      required
                      value={form.slotId ?? ""}
                      onChange={(e) => {
                        const slot = slotsForDate.find(
                          (s) => s.id === Number(e.target.value)
                        );
                        if (slot) {
                          setForm((f) => ({
                            ...f,
                            slotId: slot.id,
                            time: slot.time,
                          }));
                        }
                      }}
                      disabled={!form.date}
                      className="w-full mt-1 border rounded-lg p-2 bg-white dark:bg-gray-700 disabled:opacity-50"
                    >
                      <option value="" disabled>
                        {t("Choose a time", "Choisissez un horaire")}
                      </option>
                      {slotsForDate.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.time}
                        </option>
                      ))}
                    </select>
                  </label>

                  {/* Participants */}
                  <label className="block space-y-1">
                    <span className="flex items-center space-x-2 font-medium">
                      <Users className="w-4 h-4" />
                      <span>{t("Participants", "Participants")}</span>
                    </span>
                    <div className="flex items-center mt-1">
                      <button
                        type="button"
                        onClick={() =>
                          setForm((f) => ({
                            ...f,
                            participants: Math.max(1, f.participants - 1),
                          }))
                        }
                        className="px-3 py-1 border rounded-l-lg"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min={1}
                        value={form.participants}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            participants: Math.max(
                              1,
                              Number(e.target.value)
                            ),
                          }))
                        }
                        className="w-14 text-center border-t border-b"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setForm((f) => ({
                            ...f,
                            participants: f.participants + 1,
                          }))
                        }
                        className="px-3 py-1 border rounded-r-lg"
                      >
                        +
                      </button>
                    </div>
                  </label>

                  {/* Continuer */}
                  <button
                    type="submit"
                    className="w-full bg-accent text-white py-3 rounded-lg disabled:opacity-50"
                    disabled={!form.date || form.slotId === null}
                  >
                    {t("Continue", "Continuer")}
                  </button>
                </form>
              )}

              {/* ===== Étape 2 : paiement factice ===== */}
              {step === "payment" && (
                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  {/* Récap */}
                  <div className="space-y-2 text-sm">
                    <p>
                      <Calendar className="inline w-4 h-4 mr-1" />
                      {formatDate(form.date)}
                    </p>
                    <p>
                      <Clock className="inline w-4 h-4 mr-1" />
                      {form.time}
                    </p>
                    <p>
                      <Users className="inline w-4 h-4 mr-1" />
                      {form.participants} {t("participant(s)", "participant(s)")}
                    </p>
                  </div>

                  {/* Champs carte bancaire (fictifs) */}
                  <label className="block space-y-1">
                    <span className="flex items-center space-x-2 font-medium">
                      <CreditCard className="w-4 h-4" />
                      <span>{t("Card number", "Numéro de carte")}</span>
                    </span>
                    <input
                      required
                      placeholder="4242 4242 4242 4242"
                      maxLength={19}
                      value={card.number}
                      onChange={(e) =>
                        setCard((c) => ({ ...c, number: e.target.value }))
                      }
                      className="w-full mt-1 border rounded-lg p-2 bg-white dark:bg-gray-700"
                    />
                  </label>

                  <div className="flex space-x-4">
                    <label className="flex-1 space-y-1">
                      <span className="font-medium">
                        {t("Expiry", "Expiration")}
                      </span>
                      <input
                        required
                        placeholder="MM/YY"
                        maxLength={5}
                        value={card.expiry}
                        onChange={(e) =>
                          setCard((c) => ({ ...c, expiry: e.target.value }))
                        }
                        className="w-full mt-1 border rounded-lg p-2 bg-white dark:bg-gray-700"
                      />
                    </label>
                    <label className="flex-1 space-y-1">
                      <span className="font-medium">CVC</span>
                      <input
                        required
                        placeholder="123"
                        maxLength={4}
                        value={card.cvc}
                        onChange={(e) =>
                          setCard((c) => ({ ...c, cvc: e.target.value }))
                        }
                        className="w-full mt-1 border rounded-lg p-2 bg-white dark:bg-gray-700"
                      />
                    </label>
                  </div>

                  {/* Total + bouton pay */}
                  <div className="flex items-center justify-between font-medium">
                    <span>{t("Total", "Total")}</span>
                    <span>{totalPrice} MAD</span>
                  </div>

                  <button
                    type="submit"
                    disabled={!cardReady || isLoading}
                    className="w-full bg-accent text-white py-3 rounded-lg disabled:opacity-50"
                  >
                    {isLoading ? t("Processing…", "Paiement…") : t("Pay", "Payer")}
                  </button>
                </form>
              )}

              {/* ===== Étape 3 : succès ===== */}
              {step === "success" && (
                <div className="text-center space-y-6">
                  <CheckCircle className="w-16 h-16 text-accent mx-auto" />
                  <h3 className="text-xl font-semibold">
                    {t("Thank you!", "Merci !")}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t(
                      "Your booking is confirmed. A confirmation email has been sent.",
                      "Votre réservation est confirmée. Un e-mail vient de vous être envoyé."
                    )}
                  </p>
                  <button
                    onClick={onClose}
                    className="bg-accent text-white px-6 py-3 rounded-lg"
                  >
                    OK
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingModal;

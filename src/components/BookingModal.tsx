// components/BookingModal.tsx
import React, { useState, useEffect } from "react";
import {
  X,
  Calendar,
  Clock,
  Users,
  CreditCard,
  CheckCircle,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { Listing } from "@/lib/types";
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
  slotId: number | null;
  participants: number;
  specialRequests: string;
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
  const [step, setStep] = useState<"form" | "payment" | "success">("form");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const [form, setForm] = useState<BookingForm>({
    slotId: null,
    participants: 1,
    specialRequests: "",
  });

  const [card, setCard] = useState<CardForm>({
    number: "",
    expiry: "",
    cvc: "",
  });

  /* ----------------------------------------------------------- */
  /*  Helpers                                                    */
  /* ----------------------------------------------------------- */
  const t = (en: string, fr: string) => (currentLanguage === "en" ? en : fr);

  if (!listing) return null;

  // Group slots by date for display
  const availabilityByDate = listing.availability.reduce(
    (acc: Record<string, Array<{ id: number; time: string }>>, item: any) => {
      if (!acc[item.date]) {
        acc[item.date] = [];
      }
      acc[item.date].push(...item.slots);
      return acc;
    },
    {} as Record<string, Array<{ id: number; time: string }>>
  );

  const selectedSlot = listing.availability
    .flatMap((a: any) => a.slots)
    .find((slot: any) => slot.id === form.slotId);

  const selectedDate = listing.availability.find((a: any) =>
    a.slots.some((slot: any) => slot.id === form.slotId)
  )?.date;

  const totalPrice = listing.price * form.participants;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(
      currentLanguage === "fr" ? "fr-FR" : "en-US",
      { weekday: "long", year: "numeric", month: "long", day: "numeric" }
    );
  };

  /* Ré-init à chaque ouverture */
  useEffect(() => {
    if (isOpen) {
      setStep("form");
      setForm({ slotId: null, participants: 1, specialRequests: "" });
      setCard({ number: "", expiry: "", cvc: "" });
      setError("");
    }
  }, [isOpen]);

  /* ----------------------------------------------------------- */
  /*  Étape 1 : formulaire réservation                            */
  /* ----------------------------------------------------------- */
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.slotId !== null) {
      setStep("payment");
    }
  };

  /* ----------------------------------------------------------- */
  /*  Étape 2 : “paiement” factice + createBooking                */
  /* ----------------------------------------------------------- */
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Validate form
      if (!selectedSlot || !selectedDate) {
        throw new Error(
          t("Please select a time slot", "Veuillez sélectionner un créneau")
        );
      }

      if (form.participants < 1) {
        throw new Error(
          t(
            "At least one participant is required",
            "Au moins un participant est requis"
          )
        );
      }

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create the booking with the correct API format
      await createBooking({
        listingId: listing.id,
        slotId: form.slotId!,
        date: selectedDate,
        time: selectedSlot.time,
        participants: form.participants,
        specialRequests: form.specialRequests,
        paymentToken: `demo-${Date.now()}`,
      });

      setStep("success");
    } catch (err: any) {
      console.error("Booking failed:", err);
      setError(
        err.message ||
          t(
            "Payment failed. Please try again.",
            "Le paiement a échoué. Veuillez réessayer."
          )
      );
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
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {step === "form" &&
                  t("Book Experience", "Réserver l'Expérience")}
                {step === "payment" && t("Payment", "Paiement")}
                {step === "success" &&
                  t("Booking Confirmed", "Réservation Confirmée")}
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
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
                  <h3 className="font-semibold line-clamp-1 text-gray-900 dark:text-white">
                    {t(listing.title, listing.titleFr)}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                    {t(listing.location.address, listing.location.addressFr)}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-lg font-bold text-accent">
                      {listing.price} MAD
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
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
                  {/* Available Slots */}
                  <div className="space-y-4">
                    <label className="block">
                      <span className="flex items-center space-x-2 font-medium text-gray-900 dark:text-white mb-3">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {t("Choose Date & Time", "Choisir Date et Heure")}
                        </span>
                      </span>

                      <div className="space-y-4">
                        {Object.keys(availabilityByDate).length === 0 ? (
                          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p className="font-medium mb-2">
                              {t(
                                "No availability slots",
                                "Aucun créneau disponible"
                              )}
                            </p>
                            <p className="text-sm">
                              {t(
                                "Please check back later or contact the host",
                                "Veuillez revenir plus tard ou contacter l'hôte"
                              )}
                            </p>
                          </div>
                        ) : (
                          Object.entries(availabilityByDate).map(
                            ([date, slots]) => (
                              <div
                                key={date}
                                className="border rounded-lg p-4 dark:border-gray-600"
                              >
                                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                                  {formatDate(date)}
                                </h4>
                                <div className="grid grid-cols-2 gap-2">
                                  {slots.map((slot: any) => (
                                    <button
                                      key={slot.id}
                                      type="button"
                                      onClick={() =>
                                        setForm((f) => ({
                                          ...f,
                                          slotId: slot.id,
                                        }))
                                      }
                                      className={`p-2 rounded-lg border text-sm font-medium transition-colors ${
                                        form.slotId === slot.id
                                          ? "bg-accent text-white border-accent"
                                          : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-accent hover:text-accent dark:hover:text-accent"
                                      }`}
                                    >
                                      <Clock className="w-3 h-3 inline mr-1" />
                                      {slot.time}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )
                          )
                        )}
                      </div>
                    </label>
                  </div>

                  {/* Participants */}
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 font-medium text-gray-900 dark:text-white">
                      <Users className="w-4 h-4" />
                      <span>
                        {t("Number of Participants", "Nombre de Participants")}
                      </span>
                    </label>
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={() =>
                          setForm((f) => ({
                            ...f,
                            participants: Math.max(1, f.participants - 1),
                          }))
                        }
                        className="w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                      >
                        -
                      </button>
                      <span className="text-lg font-medium min-w-[3rem] text-center text-gray-900 dark:text-white">
                        {form.participants}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setForm((f) => ({
                            ...f,
                            participants: f.participants + 1,
                          }))
                        }
                        className="w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 font-medium text-gray-900 dark:text-white">
                      <MessageSquare className="w-4 h-4" />
                      <span>
                        {t(
                          "Special Requests (Optional)",
                          "Demandes Spéciales (Optionnel)"
                        )}
                      </span>
                    </label>
                    <textarea
                      value={form.specialRequests}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          specialRequests: e.target.value,
                        }))
                      }
                      placeholder={t(
                        "Any special requests or notes...",
                        "Demandes spéciales ou notes..."
                      )}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      rows={3}
                    />
                  </div>

                  {/* Continuer */}
                  <button
                    type="submit"
                    disabled={form.slotId === null}
                    className="w-full bg-accent hover:bg-accent/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors"
                  >
                    {t("Continue", "Continuer")}
                  </button>
                </form>
              )}

              {/* ===== Étape 2 : paiement factice ===== */}
              {step === "payment" && (
                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  {/* Récap */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                      {t("Booking Summary", "Résumé de la Réservation")}
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-700 dark:text-gray-300">
                        <Calendar className="w-4 h-4 mr-2" />
                        {selectedDate && formatDate(selectedDate)}
                      </div>
                      <div className="flex items-center text-gray-700 dark:text-gray-300">
                        <Clock className="w-4 h-4 mr-2" />
                        {selectedSlot?.time}
                      </div>
                      <div className="flex items-center text-gray-700 dark:text-gray-300">
                        <Users className="w-4 h-4 mr-2" />
                        {form.participants}{" "}
                        {t("participant(s)", "participant(s)")}
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-600 font-medium text-gray-900 dark:text-white">
                        <span>{t("Total", "Total")}</span>
                        <span>{totalPrice} MAD</span>
                      </div>
                    </div>
                  </div>

                  {/* Champs carte bancaire (fictifs) */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {t("Payment Information", "Informations de Paiement")}
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="flex items-center space-x-2 font-medium text-gray-700 dark:text-gray-300 mb-2">
                          <CreditCard className="w-4 h-4" />
                          <span>{t("Card Number", "Numéro de Carte")}</span>
                        </label>
                        <input
                          required
                          type="text"
                          placeholder="4242 4242 4242 4242"
                          maxLength={19}
                          value={card.number}
                          onChange={(e) =>
                            setCard((c) => ({ ...c, number: e.target.value }))
                          }
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t("Expiry", "Expiration")}
                          </label>
                          <input
                            required
                            type="text"
                            placeholder="MM/YY"
                            maxLength={5}
                            value={card.expiry}
                            onChange={(e) =>
                              setCard((c) => ({ ...c, expiry: e.target.value }))
                            }
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                          />
                        </div>
                        <div>
                          <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">
                            CVC
                          </label>
                          <input
                            required
                            type="text"
                            placeholder="123"
                            maxLength={4}
                            value={card.cvc}
                            onChange={(e) =>
                              setCard((c) => ({ ...c, cvc: e.target.value }))
                            }
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <p className="text-red-600 dark:text-red-400 text-sm">
                        {error}
                      </p>
                    </div>
                  )}

                  {/* Total + bouton pay */}
                  <button
                    type="submit"
                    disabled={!cardReady || isLoading}
                    className="w-full bg-accent hover:bg-accent/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {t("Processing...", "Traitement...")}
                      </>
                    ) : (
                      t(`Pay ${totalPrice} MAD`, `Payer ${totalPrice} MAD`)
                    )}
                  </button>
                </form>
              )}

              {/* ===== Étape 3 : succès ===== */}
              {step === "success" && (
                <div className="text-center space-y-6">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {t("Booking Confirmed!", "Réservation Confirmée !")}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t(
                        "Your booking has been confirmed. You will receive a confirmation email shortly.",
                        "Votre réservation a été confirmée. Vous recevrez un e-mail de confirmation sous peu."
                      )}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    {t("Done", "Terminé")}
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

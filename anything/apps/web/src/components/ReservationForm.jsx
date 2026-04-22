import React, { useState, useCallback, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Calendar,
  Clock,
  Users,
  User,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  PartyPopper,
} from "lucide-react";

export default function ReservationForm({ t, isRtl }) {
  const [step, setStep] = useState(1); // 1=form, 2=success
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    party_size: 2,
    reservation_date: "",
    reservation_time: "",
    special_requests: "",
  });
  const [formError, setFormError] = useState("");
  const [confirmedReservation, setConfirmedReservation] = useState(null);

  // Generate next 14 days for date picker
  const availableDates = useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      if (d.getDay() !== 6) {
        // Skip Saturday
        dates.push({
          value: d.toISOString().split("T")[0],
          label: d.toLocaleDateString(isRtl ? "he-IL" : "en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          }),
          dayName: d.toLocaleDateString(isRtl ? "he-IL" : "en-US", {
            weekday: "short",
          }),
          dayNum: d.getDate(),
          isToday: i === 0,
        });
      }
    }
    return dates;
  }, [isRtl]);

  // Fetch available slots when date is selected
  const {
    data: slotsData,
    isLoading: slotsLoading,
    error: slotsError,
  } = useQuery({
    queryKey: ["available-slots", formData.reservation_date],
    queryFn: async () => {
      const res = await fetch(
        `/api/reservations/available-slots?date=${formData.reservation_date}`,
      );
      if (!res.ok) throw new Error("Failed to fetch slots");
      return res.json();
    },
    enabled: !!formData.reservation_date,
  });

  // Submit reservation
  const submitMutation = useMutation({
    mutationFn: async (data) => {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to book");
      return json;
    },
    onSuccess: (data) => {
      setConfirmedReservation(data.reservation);
      setStep(2);
      setFormError("");
    },
    onError: (error) => {
      setFormError(error.message || t.reservation.errors.failed);
    },
  });

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setFormError("");

      if (
        !formData.full_name ||
        !formData.phone ||
        !formData.reservation_date ||
        !formData.reservation_time
      ) {
        setFormError(t.reservation.errors.required);
        return;
      }

      submitMutation.mutate(formData);
    },
    [formData, submitMutation, t],
  );

  const handleReset = useCallback(() => {
    setStep(1);
    setFormData({
      full_name: "",
      email: "",
      phone: "",
      party_size: 2,
      reservation_date: "",
      reservation_time: "",
      special_requests: "",
    });
    setConfirmedReservation(null);
    setFormError("");
  }, []);

  const updateField = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === "reservation_date") {
      setFormData((prev) => ({
        ...prev,
        reservation_date: value,
        reservation_time: "",
      }));
    }
  }, []);

  const availableSlots = slotsData?.slots?.filter((s) => s.available) || [];
  const groupedSlots = useMemo(() => {
    const lunch = availableSlots.filter((s) => {
      const h = parseInt(s.time.split(":")[0]);
      return h < 15;
    });
    const dinner = availableSlots.filter((s) => {
      const h = parseInt(s.time.split(":")[0]);
      return h >= 15;
    });
    return { lunch, dinner };
  }, [availableSlots]);

  // Success view
  if (step === 2 && confirmedReservation) {
    const resDate = new Date(
      confirmedReservation.reservation_date,
    ).toLocaleDateString(isRtl ? "he-IL" : "en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return (
      <div className="text-center py-12 px-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="text-green-600" size={40} />
        </div>
        <h3 className="text-3xl font-crimson-text font-bold text-[#1a1a1a] mb-3">
          {t.reservation.success.title}
        </h3>
        <p className="text-gray-500 mb-10 max-w-md mx-auto">
          {t.reservation.success.message}
        </p>

        <div className="bg-[#F8FAFC] rounded-2xl p-8 max-w-sm mx-auto mb-10 border border-blue-100">
          <p className="text-xs font-bold text-[#1D4ED8] tracking-widest uppercase mb-6">
            {t.reservation.success.details}
          </p>
          <div className="space-y-4 text-left" dir={t.dir}>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">
                {t.reservation.success.name}
              </span>
              <span className="font-semibold">
                {confirmedReservation.full_name}
              </span>
            </div>
            <div className="w-full h-px bg-gray-100"></div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">
                {t.reservation.success.date}
              </span>
              <span className="font-semibold">{resDate}</span>
            </div>
            <div className="w-full h-px bg-gray-100"></div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">
                {t.reservation.success.time}
              </span>
              <span className="font-semibold">
                {confirmedReservation.reservation_time}
              </span>
            </div>
            <div className="w-full h-px bg-gray-100"></div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">
                {t.reservation.success.guests}
              </span>
              <span className="font-semibold">
                {confirmedReservation.party_size}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="text-[#1D4ED8] font-semibold hover:underline text-sm"
        >
          {t.reservation.success.book_another}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Error */}
      {formError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl flex items-center gap-3 text-sm">
          <AlertCircle size={18} />
          {formError}
        </div>
      )}

      {/* Name & Phone row */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t.reservation.form.name} *
          </label>
          <div className="relative">
            <User
              size={18}
              className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${isRtl ? "right-4" : "left-4"}`}
            />
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => updateField("full_name", e.target.value)}
              placeholder={t.reservation.form.name_placeholder}
              className={`w-full border border-gray-200 rounded-xl py-3.5 ${isRtl ? "pr-12 pl-4" : "pl-12 pr-4"} text-sm focus:ring-2 focus:ring-[#1D4ED8] focus:border-transparent outline-none transition-all bg-white hover:border-gray-300`}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t.reservation.form.phone} *
          </label>
          <div className="relative">
            <Phone
              size={18}
              className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${isRtl ? "right-4" : "left-4"}`}
            />
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              placeholder={t.reservation.form.phone_placeholder}
              className={`w-full border border-gray-200 rounded-xl py-3.5 ${isRtl ? "pr-12 pl-4" : "pl-12 pr-4"} text-sm focus:ring-2 focus:ring-[#1D4ED8] focus:border-transparent outline-none transition-all bg-white hover:border-gray-300`}
              dir="ltr"
            />
          </div>
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {t.reservation.form.email}
        </label>
        <div className="relative">
          <Mail
            size={18}
            className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${isRtl ? "right-4" : "left-4"}`}
          />
          <input
            type="email"
            value={formData.email}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder={t.reservation.form.email_placeholder}
            className={`w-full border border-gray-200 rounded-xl py-3.5 ${isRtl ? "pr-12 pl-4" : "pl-12 pr-4"} text-sm focus:ring-2 focus:ring-[#1D4ED8] focus:border-transparent outline-none transition-all bg-white hover:border-gray-300`}
            dir="ltr"
          />
        </div>
      </div>

      {/* Party size */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          {t.reservation.form.party_size}
        </label>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => updateField("party_size", n)}
              className={`w-12 h-12 rounded-xl border-2 text-sm font-bold transition-all ${
                formData.party_size === n
                  ? "bg-[#1D4ED8] text-white border-[#1D4ED8] shadow-lg shadow-blue-200"
                  : "border-gray-200 text-gray-600 hover:border-[#1D4ED8] hover:text-[#1D4ED8] bg-white"
              }`}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            onClick={() => updateField("party_size", 10)}
            className={`px-5 h-12 rounded-xl border-2 text-sm font-bold transition-all ${
              formData.party_size > 8
                ? "bg-[#1D4ED8] text-white border-[#1D4ED8] shadow-lg shadow-blue-200"
                : "border-gray-200 text-gray-600 hover:border-[#1D4ED8] hover:text-[#1D4ED8] bg-white"
            }`}
          >
            9+
          </button>
        </div>
      </div>

      {/* Date picker */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          {t.reservation.form.date} *
        </label>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {availableDates.map((d) => (
            <button
              key={d.value}
              type="button"
              onClick={() => updateField("reservation_date", d.value)}
              className={`flex flex-col items-center min-w-[72px] px-3 py-3 rounded-xl border-2 transition-all shrink-0 ${
                formData.reservation_date === d.value
                  ? "bg-[#1D4ED8] text-white border-[#1D4ED8] shadow-lg shadow-blue-200"
                  : "border-gray-200 text-gray-600 hover:border-[#1D4ED8] bg-white"
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                {d.dayName}
              </span>
              <span className="text-xl font-bold mt-0.5">{d.dayNum}</span>
              {d.isToday && (
                <span
                  className={`text-[9px] mt-0.5 font-bold ${formData.reservation_date === d.value ? "text-blue-200" : "text-[#1D4ED8]"}`}
                >
                  {isRtl ? "היום" : "Today"}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Time slots */}
      {formData.reservation_date && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            {t.reservation.form.time} *
          </label>

          {slotsLoading && (
            <div className="flex items-center justify-center py-8 text-gray-400">
              <Loader2 className="animate-spin mr-2" size={20} />
              <span className="text-sm">Loading...</span>
            </div>
          )}

          {slotsData?.closed && (
            <div className="bg-gray-50 rounded-xl p-6 text-center text-gray-500">
              {t.reservation.form.closed}
            </div>
          )}

          {!slotsLoading && !slotsData?.closed && (
            <div className="space-y-4">
              {groupedSlots.lunch.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    {isRtl ? "צהריים" : "Lunch"}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {groupedSlots.lunch.map((slot) => (
                      <button
                        key={slot.time}
                        type="button"
                        onClick={() =>
                          updateField("reservation_time", slot.time)
                        }
                        className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                          formData.reservation_time === slot.time
                            ? "bg-[#1D4ED8] text-white border-[#1D4ED8] shadow-md"
                            : "border-gray-200 text-gray-700 hover:border-[#1D4ED8] hover:text-[#1D4ED8] bg-white"
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {groupedSlots.dinner.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    {isRtl ? "ערב" : "Dinner"}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {groupedSlots.dinner.map((slot) => (
                      <button
                        key={slot.time}
                        type="button"
                        onClick={() =>
                          updateField("reservation_time", slot.time)
                        }
                        className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                          formData.reservation_time === slot.time
                            ? "bg-[#1D4ED8] text-white border-[#1D4ED8] shadow-md"
                            : "border-gray-200 text-gray-700 hover:border-[#1D4ED8] hover:text-[#1D4ED8] bg-white"
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {availableSlots.length === 0 && !slotsLoading && (
                <div className="bg-amber-50 rounded-xl p-6 text-center text-amber-700 text-sm">
                  {t.reservation.form.no_slots}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Special requests */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {t.reservation.form.special_requests}
        </label>
        <div className="relative">
          <MessageSquare
            size={18}
            className={`absolute top-4 text-gray-400 ${isRtl ? "right-4" : "left-4"}`}
          />
          <textarea
            value={formData.special_requests}
            onChange={(e) => updateField("special_requests", e.target.value)}
            placeholder={t.reservation.form.special_placeholder}
            rows={3}
            className={`w-full border border-gray-200 rounded-xl py-3.5 ${isRtl ? "pr-12 pl-4" : "pl-12 pr-4"} text-sm focus:ring-2 focus:ring-[#1D4ED8] focus:border-transparent outline-none transition-all resize-none bg-white hover:border-gray-300`}
          />
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitMutation.isPending}
        className="w-full bg-[#1D4ED8] text-white py-4 rounded-xl font-bold text-base hover:bg-[#1E40AF] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 flex items-center justify-center gap-2"
      >
        {submitMutation.isPending ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            {t.reservation.form.submitting}
          </>
        ) : (
          <>
            <CheckCircle2 size={20} />
            {t.reservation.form.submit}
          </>
        )}
      </button>
    </form>
  );
}

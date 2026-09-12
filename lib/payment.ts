// Payment receiving details shown to customers in the Telegram bot.
// The same Uzcard/Humo card usually works for both Payme and Click transfers;
// list two cards if you use separate ones.
export const paymentCards = [
  {
    label: "Payme / Click",
    number: "5614 6831 0095 0336",
    holder: "CAFFE VERGNANO UZ",
  },
] as const;

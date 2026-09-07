// Payment receiving details shown to customers in the Telegram bot.
// TODO: replace with the real business card number(s) before launch.
// The same Uzcard/Humo card usually works for both Payme and Click transfers;
// list two cards if you use separate ones.
export const paymentCards = [
  {
    label: "Payme / Click",
    number: "8600 0000 0000 0000",
    holder: "CAFFE VERGNANO UZ",
  },
] as const;

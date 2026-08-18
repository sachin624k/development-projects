import type { Transaction } from "../types/transaction";

export const transactions: Transaction[] = [
  {
    id: 1,
    title: "Salary",
    amount: 50000,
    type: "income",
    category: "Salary",
    date: "2026-08-17",
  },
  {
    id: 2,
    title: "Rent",
    amount: 12000,
    type: "expense",
    category: "Housing",
    date: "2026-08-05",
  },
  {
    id: 3,
    title: "Groceries",
    amount: 2500,
    type: "expense",
    category: "Food",
    date: "2026-08-10",
  },
  {
    id: 4,
    title: "Freelance",
    amount: 10000,
    type: "income",
    category: "Freelance",
    date: "2026-08-12",
  },
];

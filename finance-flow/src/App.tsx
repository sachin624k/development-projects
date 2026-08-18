import { useEffect, useState } from "react";
import { transactions } from "./data/transactions";
import TransactionCard from "./components/TransactionCard";
import TransactionForm from "./components/TransactionForm";
import type { Transaction } from "./types/transaction";

function App() {
  const [transactionList, setTransactionList] = useState<Transaction[]>(() => {
    const savedTransactions = localStorage.getItem("transactions");

    if (savedTransactions) {
      return JSON.parse(savedTransactions);
    }

    return transactions;
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">(
    "all",
  );
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  const totalIncome = transactionList
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const totalExpenses = transactionList
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const balance = totalIncome - totalExpenses;

  const handleDeleteTransaction = (id: number) => {
    setTransactionList((currentTransactions) =>
      currentTransactions.filter((transaction) => transaction.id !== id),
    );
  };

  const filteredTransactions = transactionList
    .filter((transaction) =>
      transaction.title.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter((transaction) =>
      filterType === "all" ? true : transaction.type === filterType,
    );

  const handleEditTransaction = (transaction: Transaction) => {
    console.log("Editing:", transaction);
    setEditingTransaction(transaction);
  };

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactionList));
  }, [transactionList]);

  return (
    <div className="min-h-screen">
      <header className="border-b p-4">
        <h1 className="text-2xl font-bold">FinanceFlow</h1>
      </header>

      <main className="mx-auto max-w-5xl p-4">
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Dashboard</h2>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border p-5">
              <p className="text-gray-500">Balance</p>
              <p className="text-2xl font-bold">₹{balance}</p>
            </div>

            <div className="rounded-lg border p-5">
              <p className="text-gray-500">Income</p>
              <p className="text-2xl font-bold">₹{totalIncome}</p>
            </div>

            <div className="rounded-lg border p-5">
              <p className="text-gray-500">Expenses</p>
              <p className="text-2xl font-bold">₹{totalExpenses}</p>
            </div>
          </div>
        </section>
        <TransactionForm
          key={editingTransaction?.id ?? "new"}
          setTransactionList={setTransactionList}
          editingTransaction={editingTransaction}
          setEditingTransaction={setEditingTransaction}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border rounded-lg p-3"
          />

          <button
            onClick={() => setFilterType("all")}
            className="w-full rounded-lg border p-3 hover:bg-gray-100"
          >
            All
          </button>

          <button
            onClick={() => setFilterType("income")}
            className="w-full rounded-lg border p-3 hover:bg-gray-100"
          >
            Income
          </button>

          <button
            onClick={() => setFilterType("expense")}
            className="w-full rounded-lg border p-3 hover:bg-gray-100"
          >
            Expense
          </button>
        </div>
        <section>
          <h2 className="pt-10">Transactions</h2>

          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                onDelete={handleDeleteTransaction}
                onEdit={handleEditTransaction}
              />
            ))
          ) : (
            <p className="py-8 text-center text-gray-500">
              No transactions found.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;

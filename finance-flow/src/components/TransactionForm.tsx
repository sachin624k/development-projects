import type { FormEvent, Dispatch, SetStateAction } from "react";
import type { Transaction } from "../types/transaction";

type TransactionFormProps = {
  setTransactionList: Dispatch<SetStateAction<Transaction[]>>;
  editingTransaction?: Transaction | null;
  setEditingTransaction: Dispatch<SetStateAction<Transaction | null>>;
};

function TransactionForm({
  setTransactionList,
  editingTransaction,
  setEditingTransaction,
}: TransactionFormProps) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const title = formData.get("title") as string;
    const amount = Number(formData.get("amount"));
    const type = formData.get("type") as "income" | "expense";
    const category = formData.get("category") as string;
    const date = formData.get("date") as string;

    if (!title || !category || !date) {
      alert("Please fill all fields");
      return;
    }

    if (amount <= 0) {
      alert("Amount must be greater than 0");
      return;
    }

    const newTransaction: Transaction = {
      id: editingTransaction ? editingTransaction.id : Date.now(),
      title,
      amount,
      type,
      category,
      date,
    };

    if (editingTransaction) {
      setTransactionList((currentTransactions) =>
        currentTransactions.map((transaction) =>
          transaction.id === editingTransaction.id
            ? newTransaction
            : transaction,
        ),
      );

      setEditingTransaction(null);
      e.currentTarget.reset();

      return;
    }

    setTransactionList((currentTransactions) => [
      ...currentTransactions,
      newTransaction,
    ]);
    e.currentTarget.reset();
  };

  return (
    <form onSubmit={handleSubmit} className="border rounded-lg p-4 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <input
          name="title"
          placeholder="Title"
          defaultValue={editingTransaction?.title ?? ""}
          className="w-full border p-3 rounded"
        />

        <input
          name="amount"
          type="number"
          placeholder="Amount"
          defaultValue={editingTransaction?.amount ?? ""}
          className="w-full border p-3 rounded"
        />

        <select
          name="type"
          defaultValue={editingTransaction?.type ?? "income"}
          className="w-full border p-3 rounded"
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <input
          name="category"
          placeholder="Category"
          defaultValue={editingTransaction?.category ?? ""}
          className="w-full border p-3 rounded"
        />

        <input
          name="date"
          type="date"
          defaultValue={editingTransaction?.date ?? ""}
          className="w-full border p-3 rounded"
        />
      </div>

      <button
        type="submit"
        className="block mx-auto mt-4 bg-black text-white px-4 py-2 rounded"
      >
        {editingTransaction ? "Update Transaction" : "Add Transaction"}
      </button>
    </form>
  );
}

export default TransactionForm;

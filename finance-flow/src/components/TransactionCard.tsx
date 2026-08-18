import type { Transaction } from "../types/transaction";

// Props + Destructuring

// type TransactionCardProps = {
//   transaction: Transaction;
// };
// function TransactionCard({ transaction }: TransactionCardProps) {
// → TransactionCard component ke andar `{ transaction }` ek destructured prop hai.
// → `{ transaction }` `TransactionCardProps` ko follow karega.
// → `TransactionCardProps` ek TypeScript `type` hai jo props ka structure define karta hai.
// → Ye keh raha hai ki `TransactionCard` component me `transaction` naam ka prop pass hoga.
// → Aur `transaction` ka type `Transaction` hoga, yani woh `Transaction` ke structure ko follow karega.

// TransactionCardProps is a TypeScript type that defines the structure of the props that TransactionCard can receive.
type TransactionCardProps = {
  transaction: Transaction;
  // onDelete must be a function that receives one number (the transaction ID) and returns void
  onDelete: (id: number) => void;
  onEdit: (transaction: Transaction) => void;
};

function TransactionCard({
  transaction,
  onDelete,
  onEdit,
}: TransactionCardProps) {
  return (
    <div className="border rounded-2xl p-4 mb-4">
      <div className="border rounded-2xl p-4">
        <div>
          <h3 className="font-semibold text-lg">{transaction.title}</h3>
        </div>

        <div>
          <p className="font-bold">
            {transaction.type === "income" ? "+" : "-"} ₹{transaction.amount}
          </p>
        </div>

        <div>
          <p>{transaction.category}</p>
        </div>

        <div>
          <p>{transaction.date}</p>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={() => onEdit(transaction)}
          className="rounded bg-blue-500 px-3 py-1 text-white"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(transaction.id)}
          className="rounded bg-red-500 px-3 py-1 text-white"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default TransactionCard;

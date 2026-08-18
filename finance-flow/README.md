# FinanceFlow (React + TypeScript + Tailwind CSS)

A practical **React + TypeScript + Tailwind CSS** expense and income tracker built to strengthen frontend fundamentals through real implementation — not a tutorial-only project.

---

## Features

- Add income and expense transactions
- Edit existing transactions
- Delete transactions
- Dashboard with:
  - Total income
  - Total expenses
  - Balance
- Search transactions by title
- Filter by:
  - All
  - Income
  - Expense
- Form validation
- Automatic form reset after submit
- Data persistence using `localStorage`
- Responsive transaction form
- Responsive transaction cards
- Reusable React components
- Type-safe transaction data with TypeScript

---

## Tech Stack

| Technology           | Purpose                                    |
| -------------------- | ------------------------------------------ |
| React                | UI and component-based development         |
| TypeScript           | Type safety and data structure definitions |
| Vite                 | Development server and project tooling     |
| Tailwind CSS         | Styling and responsive UI                  |
| JavaScript           | Array operations and application logic     |
| Browser LocalStorage | Persistent client-side data                |

---

## Project Setup

**1. Create a Vite React + TypeScript project**

```bash
npm create vite@latest finance-flow -- --template react-ts
```

Or create a project and choose the options manually:

```bash
npm create vite@latest finance-flow
```

To create the project inside the current folder:

```bash
npm create vite@latest .
```

**2. Install dependencies**

```bash
npm install
npm install tailwindcss @tailwindcss/vite
```

**3. Tailwind + Vite configuration**

`@tailwindcss/vite` is the Vite plugin that connects Tailwind CSS with Vite.

In `vite.config.ts`:

```ts
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

In `src/index.css`:

```css
@import "tailwindcss";
```

**4. Run the project**

```bash
npm run dev
```

---

## Project Structure

```
finance-flow/
├── src/
│   ├── components/
│   │   ├── TransactionCard.tsx
│   │   └── TransactionForm.tsx
│   │
│   ├── data/
│   │   └── transactions.ts
│   │
│   ├── types/
│   │   └── transaction.ts
│   │
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
│
├── public/
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## What I Learned

### 1. React Page Structure

Started with a simple `App.tsx` layout:

```
App
├── Header
├── Dashboard
├── Transaction Form
├── Search + Filters
└── Transactions
```

Tailwind CSS was used directly through `className`.

### 2. TypeScript Transaction Type

Created `src/types/transaction.ts`:

```ts
export type Transaction = {
  id: number;
  title: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
};
```

This acts as a blueprint/structure for every transaction. The `type` field is a **union type** (`"income" | "expense"`), so only those two values are allowed.

### 3. Static Transaction Data

Created `src/data/transactions.ts`:

```ts
import type { Transaction } from "../types/transaction";

export const transactions: Transaction[] = [
  // transaction objects
];
```

`Transaction[]` means: an array containing `Transaction` objects.

---

## React Components

### TransactionCard

Created `src/components/TransactionCard.tsx`. It displays one transaction and receives the transaction through props.

```ts
type TransactionCardProps = {
  transaction: Transaction;
  onDelete: (id: number) => void;
  onEdit: (transaction: Transaction) => void;
};
```

**Props + Destructuring**

```ts
function TransactionCard({
  transaction,
  onDelete,
  onEdit,
}: TransactionCardProps);
```

- `{ transaction, onDelete, onEdit }` are destructured props.
- `TransactionCardProps` defines the structure and types of those props.

**Rendering Multiple Transactions**

```tsx
filteredTransactions.map((transaction) => (
  <TransactionCard
    key={transaction.id}
    transaction={transaction}
    onDelete={handleDeleteTransaction}
    onEdit={handleEditTransaction}
  />
));
```

- `map()` goes through every transaction.
- `<TransactionCard />` creates a component for each transaction.
- `transaction={transaction}` passes transaction data.
- `key={transaction.id}` gives React a unique key.
- `onDelete` and `onEdit` pass functions from the parent to the child.

---

## Transaction Form

Created `src/components/TransactionForm.tsx`. The form collects:

- Title
- Amount
- Type
- Category
- Date

**Form Event**

```ts
FormEvent<HTMLFormElement>;
```

TypeScript type for a form submit event.

**FormData**

```ts
const formData = new FormData(e.currentTarget);
```

Collects the form's input values. The input's `name` is used to retrieve its value:

```ts
formData.get("title");
formData.get("amount");
formData.get("category");
```

---

## React State

Changed static transactions into React state:

```ts
const [transactionList, setTransactionList] =
  useState<Transaction[]>(transactions);
```

- `transactionList` → current transaction list.
- `setTransactionList` → updates the list.
- `transactions` → initial data.

Instead of changing the original static array, React state stores the changing data.

**Passing State Setter to Child**

```tsx
<TransactionForm setTransactionList={setTransactionList} />
```

The parent passes its state setter to the child:

```
TransactionForm
      ↓
setTransactionList()
      ↓
App's transactionList changes
      ↓
React re-renders
```

**Setter Prop Type**

```ts
type TransactionFormProps = {
  setTransactionList: Dispatch<SetStateAction<Transaction[]>>;
};
```

This tells TypeScript that `setTransactionList` is a React setter for `Transaction[]` state.

---

## ➕ Adding Transactions

A new transaction is created from form data:

```ts
const newTransaction: Transaction = {
  id: editingTransaction ? editingTransaction.id : Date.now(),
  title,
  amount,
  type,
  category,
  date,
};
```

For adding, `Date.now()` creates a new numeric ID. Then:

```ts
setTransactionList((currentTransactions) => [
  ...currentTransactions,
  newTransaction,
]);
```

- `currentTransactions` → current state.
- `...currentTransactions` → keeps existing transactions.
- `newTransaction` → adds the new transaction.

A **new array** is created instead of mutating the old array.

---

## Delete Transaction

```ts
const handleDeleteTransaction = (id: number) => {
  setTransactionList((currentTransactions) =>
    currentTransactions.filter((transaction) => transaction.id !== id),
  );
};
```

- `filter()` creates a new array containing everything except the selected transaction.
- `transaction.id !== id` means: keep the transaction if its ID is different from the ID we want to delete.

The function is passed to `TransactionCard`:

```tsx
onDelete = { handleDeleteTransaction };
```

and called by the button:

```tsx
onClick={() => onDelete(transaction.id)}
```

---

## Edit Transaction

Editing uses a separate state:

```ts
const [editingTransaction, setEditingTransaction] =
  useState<Transaction | null>(null);
```

- `null` → nothing is being edited.
- `Transaction` → a transaction is currently being edited.

**Edit Handler**

```ts
const handleEditTransaction = (transaction: Transaction) => {
  setEditingTransaction(transaction);
};
```

The selected transaction is stored in state. The function is passed to the card:

```tsx
onEdit = { handleEditTransaction };
```

The card calls it:

```tsx
onClick={() => onEdit(transaction)}
```

**Updating the Transaction**

When submitting while editing:

```ts
setTransactionList((currentTransactions) =>
  currentTransactions.map((transaction) =>
    transaction.id === editingTransaction.id ? newTransaction : transaction,
  ),
);
```

`map()` checks every transaction:

- Matching ID → replace with `newTransaction`
- Different ID → keep the original transaction

**Add vs Edit**

```
ADD
→ [...currentTransactions, newTransaction]

EDIT
→ map()
→ find matching ID
→ replace transaction
```

After editing:

```ts
setEditingTransaction(null);
```

clears edit mode.

---

## Search

Created search state:

```ts
const [searchTerm, setSearchTerm] = useState("");
```

Search input is connected to state:

```tsx
value={searchTerm}
onChange={(e) => setSearchTerm(e.target.value)}
```

Filtering:

```ts
transaction.title.toLowerCase().includes(searchTerm.toLowerCase());
```

This:

1. Converts the transaction title to lowercase.
2. Converts the search term to lowercase.
3. Checks whether the search term exists inside the title.

This makes the search case-insensitive.

---

## Filter by Type

```ts
const [filterType, setFilterType] = useState<"all" | "income" | "expense">(
  "all",
);
```

This uses a TypeScript union type to restrict the filter to three values.

**Filter logic**

```ts
filterType === "all" ? true : transaction.type === filterType;
```

Meaning:

- `all` → keep everything
- `income` → keep income only
- `expense` → keep expenses only

Search and type filtering are chained:

```ts
transactionList
  .filter(...)
  .filter(...)
```

---

## Dashboard Calculations

**Total Income**

```ts
const totalIncome = transactionList
  .filter((transaction) => transaction.type === "income")
  .reduce((total, transaction) => total + transaction.amount, 0);
```

**Total Expenses**

Same logic, but selecting expenses.

- `filter()` decides **what** should be calculated.
- `reduce()` calculates the **total**.

```ts
.reduce(
  (total, transaction) => total + transaction.amount,
  0
);
```

- `total` → running total
- `transaction` → current transaction
- `transaction.amount` → amount being added
- `0` → starting value

Finally:

```ts
const balance = totalIncome - totalExpenses;
```

---

## LocalStorage Persistence

**Without LocalStorage:**

```
Refresh browser
      ↓
State resets
      ↓
Added transactions disappear
```

**With LocalStorage:**

```
React State
    ↕
LocalStorage
```

LocalStorage keeps data in the browser even after refresh.

**Important methods**

```ts
localStorage.setItem(key, value); // Save data
localStorage.getItem(key); // Read data
JSON.stringify(data); // JS data → JSON string
JSON.parse(data); // JSON string → JS data
```

**READ — Load Saved Transactions**

A lazy `useState` initializer is used:

```ts
const [transactionList, setTransactionList] = useState<Transaction[]>(() => {
  const savedTransactions = localStorage.getItem("transactions");

  if (savedTransactions) {
    return JSON.parse(savedTransactions);
  }

  return transactions;
});
```

**Why?** The application needs saved data while creating the initial state, so it can be loaded directly instead of first rendering with one state and then updating it through another effect.

**WRITE — Save Transactions**

```ts
useEffect(() => {
  localStorage.setItem("transactions", JSON.stringify(transactionList));
}, [transactionList]);
```

The effect runs whenever `transactionList` changes:

```
transactionList changes
        ↓
useEffect runs
        ↓
JSON.stringify()
        ↓
localStorage.setItem()
```

So:

```
READ:  LocalStorage → React State
WRITE: React State  → LocalStorage
```

---

## Form Validation

Before creating a transaction, the form extracts values:

```ts
const title = formData.get("title") as string;
const amount = Number(formData.get("amount"));
const type = formData.get("type") as "income" | "expense";
const category = formData.get("category") as string;
const date = formData.get("date") as string;
```

**Required fields**

```ts
if (!title || !category || !date) {
  alert("Please fill all fields");
  return;
}
```

**Amount validation**

```ts
if (amount <= 0) {
  alert("Amount must be greater than 0");
  return;
}
```

The amount is checked separately because JavaScript treats `0` as a falsy value.

---

## Responsive UI

Tailwind responsive utilities were used instead of separate CSS media queries.

For example:

```
grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5
```

Means:

```
Mobile  → 1 column
Small   → 2 columns
Large   → 5 columns
```

Transaction cards use a parent grid so large screens can display two cards per row:

```
grid grid-cols-1 lg:grid-cols-2 gap-4
```

The parent controls how many cards appear in each row, while each `TransactionCard` controls its own internal layout.

---

## React Patterns Practiced

**Componentization**

```
App
├── TransactionForm
└── TransactionCard
```

**Props**

Passing data:

```tsx
transaction = { transaction };
```

Passing functions:

```tsx
onDelete = { handleDeleteTransaction };
onEdit = { handleEditTransaction };
```

**Parent → Child**

```
App
 ↓
props
 ↓
TransactionForm / TransactionCard
```

**Child → Parent State Update**

```
Child
 ↓
calls function prop
 ↓
Parent state setter
 ↓
state changes
 ↓
React re-renders
```

**Conditional Rendering**

```tsx
{
  editingTransaction ? "Update Transaction" : "Add Transaction";
}
```

**Array Methods**

```
map()     → render / transform
filter()  → select / remove
reduce()  → calculate total
```

---

## JavaScript Concepts Practiced

FinanceFlow also gave practical experience with:

- `map()`
- `filter()`
- `reduce()`
- Spread operator `...`
- Ternary operator `condition ? a : b`
- Arrow functions
- Destructuring
- Optional chaining `?.`
- Nullish coalescing `??`
- Truthy / falsy values
- Array immutability
- JSON serialization

**Examples:**

```ts
editingTransaction?.title ?? ""

condition ? newValue : oldValue

[...currentTransactions, newTransaction]
```

---

## 📚 Build Progression

1. Create Vite + React + TypeScript project
2. Configure Tailwind CSS
3. Create basic page layout
4. Define `Transaction` type
5. Create sample transaction data
6. Build `TransactionCard`
7. Calculate dashboard totals
8. Build `TransactionForm`
9. Introduce React state
10. Add new transactions
11. Delete transactions
12. Search transactions
13. Filter by type
14. Persist data with LocalStorage
15. Add edit functionality
16. Add form validation
17. Improve responsive UI

The exact internal order evolved while building, since features were implemented and understood incrementally.

---

## 🎯 Purpose of the Project

FinanceFlow is not intended to be a large financial SaaS.

It was built as a practical React + TypeScript learning project to understand how multiple frontend concepts work together in a real application:

```
React
  +
TypeScript
  +
Tailwind CSS
  +
Forms
  +
State
  +
Props
  +
CRUD operations
  +
Search & Filters
  +
Validation
  +
LocalStorage
  +
Responsive UI
```

The main goal was: **Build → face problems → understand the concept → solve it → move to the next feature.**

---

## Author

**Sachin Kushwaha**

Built as part of a practical full-stack development learning journey.

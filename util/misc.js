const tags = [
    // General Tags
    "Personal",
    "Work/Business",
    "Shared Expense",
    "Reimbursement",
    "Recurring",
    "One-Time",

    // Expense Categories
    "Groceries",
    "Utilities",
    "Rent",
    "Travel",
    "Dining",
    "Entertainment",
    "Healthcare",
    "Education",
    "Shopping",
    "Insurance",
    "Fuel",
    "Maintenance",

    // Payment Method Tags
    "Credit Card",
    "Debit Card",
    "Cash",
    "UPI/Bank Transfer",
    "Wallet/PayPal",
    "EMI/Loan Payment",

    // Type of Bill
    "Invoice",
    "Receipt",
    "Bill",
    "Subscription",
    "Service",
    "Product Purchase",

    // Frequency Tags
    "Monthly",
    "Quarterly",
    "Yearly",
    "Daily",
    "Weekly",

    // Vendor/Service Provider Tags
    "Electricity",
    "Water",
    "Internet",
    "Mobile",
    "Gas",
    "Streaming Service",
    "Gym Membership",

    // Customizable Tags for Users
    "Project",
    "Event",
    "Vacation",
];

const categories = {
    outgoing: [
        {
            name: 'Essentials',
            categories: ['Groceries', 'Rent/Mortgage', 'Utilities', 'Transportation', 'Insurance']
        },
        {
            name: 'Health',
            categories: ['Medical Bills', 'Medications', 'Health Insurance', 'Gym/Wellness Subscriptions']
        },
        {
            name: 'Lifestyle',
            categories: ['Clothing', 'Dining Out', 'Personal Care', 'Subscriptions']
        },
        {
            name: 'Leisure',
            categories: ['Entertainment', 'Hobbies', 'Vacations/Travel', 'Sports/Outdoor Activities']
        },
        {
            name: 'Education',
            categories: ['Tuition Fees', 'Courses/Certifications', 'Books/Study Materials', 'Online Learning Subscriptions']
        },
        {
            name: 'Investments',
            categories: ['Mutual Funds', 'Stocks', 'Retirement Accounts', 'Property Investments']
        }
    ],
    incoming: [
        {
            name: 'Salary/Income',
            categories: ['Primary Job', 'Freelance/Consulting', 'Side Hustles', 'Bonuses']
        },
        {
            name: 'Passive Income',
            categories: ['Rental Income', 'Dividends', 'Royalties', 'Interest']
        },
        {
            name: 'Gifts/One-Time Income',
            categories: ['Monetary Gifts', 'Refunds/Reimbursements', 'Lottery/Windfall']
        },
        {
            name: 'Selling Assets',
            categories: ['Selling Old Items', 'Second-hand Marketplace Income']
        }
    ]
};

module.exports.tags = tags
module.exports.categories = categories

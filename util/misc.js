const tags = {
    rec: [
        "Electronics", "Groceries", "Clothing", "Dining", "Travel", "Utilities",
        "Credit Card", "Debit Card", "Cash", "UPI", "Net Banking", "Personal",
        "Business", "Reimbursement", "Gift", "Amazon", "Walmart", "Best Buy",
        "Local Store", "Paid", "Pending Payment", "Refunded", "GST Applied",
        "VAT Applied", "Sales Tax", "One-Time", "Recurring"
    ],
    war: [
        "Electronics", "Appliances", "Furniture", "Vehicles", "Gadgets",
        "Active Warranty", "Expired Warranty", "Pending Claim", "Under Warranty",
        "Samsung", "LG", "Apple", "Sony", "6 Months", "1 Year", "2 Years",
        "5 Years", "Online Purchase", "In-Store Purchase", "Gifted",
        "High Priority", "Medium Priority", "Low Priority", "Home", "Office",
        "Warehouse", "Insured", "Not Insured", "Physical Document", "Digital Document"
    ],
    doc: [
        "Legal", "Medical", "Financial", "Educational", "Personal", "Invoice",
        "Contract", "Report", "Certificate", "Notes", "Draft", "Final", "Archived",
        "Self", "Family", "Business", "Client", "Confidential", "Public", "Internal",
        "High Priority", "Medium Priority", "Low Priority"
    ]
};

const trackTags = ["Food", "Groceries", "Rent", "Utilities", "Entertainment", "Dining", "Transportation", "Fuel", "Travel", "Shopping", "Health", "Insurance", "Education", "Subscriptions", "Loans", "Savings", "Investment", "Tax", "Salary", "Freelance", "Bonus", "Gift", "Charity", "EMI", "Interest", "Credit Card Payment", "Debit Card Payment", "Cash", "UPI", "Net Banking", "Online Purchase", "Refund", "Reimbursement", "Personal Expense", "Business Expense", "Recurring", "One-Time", "Pending", "Completed", "Failed", "Scheduled", "Partially Paid", "Overdue"];

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
module.exports.trackTags = trackTags

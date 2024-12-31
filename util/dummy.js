const dummyData = [
    {
        createdOn: "Tue, 26 Dec 2023 12:45:32 GMT",
        category: ["outgoing", "Essentials", "Groceries"],
        transactionAmount: 350,
        transactionType: "outgoing",
        transactionName: "Grocery Shopping",
        from: "Bank Account",
        to: "Supermarket",
        dateTime: "Tue, 26 Dec 2023 12:45:32 GMT",
        transactionId: "73568290"
    },
    {
        createdOn: "Mon, 23 Jan 2023 10:15:22 GMT",
        category: ["incoming", "Salary/Income", "Primary Job"],
        transactionAmount: 3200,
        transactionType: "incoming",
        transactionName: "Monthly Salary",
        from: "Company",
        to: "Bank Account",
        dateTime: "Mon, 23 Jan 2023 10:15:22 GMT",
        transactionId: "89237654"
    },
    {
        createdOn: "Fri, 12 Feb 2021 14:30:45 GMT",
        category: ["outgoing", "Health", "Medical Bills"],
        transactionAmount: 120,
        transactionType: "outgoing",
        transactionName: "Clinic Visit",
        from: "Bank Account",
        to: "Health Center",
        dateTime: "Fri, 12 Feb 2021 14:30:45 GMT",
        transactionId: "56378214"
    },
    {
        createdOn: "Wed, 17 Mar 2022 09:00:00 GMT",
        category: ["incoming", "Passive Income", "Dividends"],
        transactionAmount: 450,
        transactionType: "incoming",
        transactionName: "Quarterly Dividends",
        from: "Investment Account",
        to: "Bank Account",
        dateTime: "Wed, 17 Mar 2022 09:00:00 GMT",
        transactionId: "23847563"
    },
    {
        createdOn: "Sat, 20 Jun 2020 18:20:15 GMT",
        category: ["outgoing", "Lifestyle", "Dining Out"],
        transactionAmount: 75,
        transactionType: "outgoing",
        transactionName: "Dinner with Friends",
        from: "Bank Account",
        to: "Restaurant",
        dateTime: "Sat, 20 Jun 2020 18:20:15 GMT",
        transactionId: "90482637"
    },
    {
        createdOn: "Mon, 03 Jul 2023 15:00:30 GMT",
        category: ["outgoing", "Education", "Courses/Certifications"],
        transactionAmount: 950,
        transactionType: "outgoing",
        transactionName: "Online Course Fee",
        from: "Bank Account",
        to: "Online Platform",
        dateTime: "Mon, 03 Jul 2023 15:00:30 GMT",
        transactionId: "74628903"
    },
    {
        createdOn: "Thu, 05 May 2022 13:40:50 GMT",
        category: ["incoming", "Gifts/One-Time Income", "Monetary Gifts"],
        transactionAmount: 200,
        transactionType: "incoming",
        transactionName: "Birthday Gift",
        from: "Friend",
        to: "Bank Account",
        dateTime: "Thu, 05 May 2022 13:40:50 GMT",
        transactionId: "38475926"
    },
    {
        createdOn: "Sun, 16 Oct 2022 08:00:00 GMT",
        category: ["outgoing", "Investments", "Stocks"],
        transactionAmount: 2000,
        transactionType: "outgoing",
        transactionName: "Stock Purchase",
        from: "Bank Account",
        to: "Stock Broker",
        dateTime: "Sun, 16 Oct 2022 08:00:00 GMT",
        transactionId: "56372908"
    },
    {
        createdOn: "Wed, 11 Nov 2020 11:30:00 GMT",
        category: ["outgoing", "Essentials", "Rent/Mortgage"],
        transactionAmount: 1500,
        transactionType: "outgoing",
        transactionName: "Monthly Rent",
        from: "Bank Account",
        to: "Landlord",
        dateTime: "Wed, 11 Nov 2020 11:30:00 GMT",
        transactionId: "48276091"
    },
    {
        createdOn: "Mon, 15 Apr 2024 10:10:00 GMT",
        category: ["incoming", "Selling Assets", "Selling Old Items"],
        transactionAmount: 450,
        transactionType: "incoming",
        transactionName: "Sold Old Bike",
        from: "Buyer",
        to: "Bank Account",
        dateTime: "Mon, 15 Apr 2024 10:10:00 GMT",
        transactionId: "47620398"
    },
    {
        createdOn: "Thu, 02 Mar 2023 19:30:22 GMT",
        category: ["outgoing", "Leisure", "Entertainment"],
        transactionAmount: 90,
        transactionType: "outgoing",
        transactionName: "Movie Tickets",
        from: "Bank Account",
        to: "Cinema",
        dateTime: "Thu, 02 Mar 2023 19:30:22 GMT",
        transactionId: "38572910"
    },
    {
        createdOn: "Sat, 07 Jan 2022 14:45:00 GMT",
        category: ["outgoing", "Essentials", "Transportation"],
        transactionAmount: 60,
        transactionType: "outgoing",
        transactionName: "Gas Refill",
        from: "Bank Account",
        to: "Gas Station",
        dateTime: "Sat, 07 Jan 2022 14:45:00 GMT",
        transactionId: "92637480"
    },
    {
        createdOn: "Mon, 23 Nov 2020 09:30:00 GMT",
        category: ["incoming", "Passive Income", "Rental Income"],
        transactionAmount: 1200,
        transactionType: "incoming",
        transactionName: "Monthly Rental Income",
        from: "Tenant",
        to: "Bank Account",
        dateTime: "Mon, 23 Nov 2020 09:30:00 GMT",
        transactionId: "58293047"
    },
    {
        createdOn: "Fri, 19 Aug 2023 20:20:00 GMT",
        category: ["outgoing", "Health", "Gym/Wellness Subscriptions"],
        transactionAmount: 40,
        transactionType: "outgoing",
        transactionName: "Monthly Gym Membership",
        from: "Bank Account",
        to: "Gym",
        dateTime: "Fri, 19 Aug 2023 20:20:00 GMT",
        transactionId: "84752096"
    },
    {
        createdOn: "Tue, 12 Dec 2023 10:15:00 GMT",
        category: ["outgoing", "Lifestyle", "Clothing"],
        transactionAmount: 120,
        transactionType: "outgoing",
        transactionName: "New Jacket",
        from: "Bank Account",
        to: "Clothing Store",
        dateTime: "Tue, 12 Dec 2023 10:15:00 GMT",
        transactionId: "48573920"
    },
    {
        createdOn: "Sun, 30 Jun 2024 09:00:00 GMT",
        category: ["incoming", "Salary/Income", "Bonuses"],
        transactionAmount: 600,
        transactionType: "incoming",
        transactionName: "Performance Bonus",
        from: "Company",
        to: "Bank Account",
        dateTime: "Sun, 30 Jun 2024 09:00:00 GMT",
        transactionId: "57389021"
    },
    {
        createdOn: "Wed, 08 Sep 2021 16:30:00 GMT",
        category: ["outgoing", "Essentials", "Utilities"],
        transactionAmount: 250,
        transactionType: "outgoing",
        transactionName: "Electricity Bill",
        from: "Bank Account",
        to: "Utility Company",
        dateTime: "Wed, 08 Sep 2021 16:30:00 GMT",
        transactionId: "73820149"
    },
    {
        createdOn: "Thu, 11 Feb 2021 15:45:00 GMT",
        category: ["incoming", "Gifts/One-Time Income", "Refunds/Reimbursements"],
        transactionAmount: 75,
        transactionType: "incoming",
        transactionName: "Travel Refund",
        from: "Travel Agency",
        to: "Bank Account",
        dateTime: "Thu, 11 Feb 2021 15:45:00 GMT",
        transactionId: "19284750"
    },
    {
        createdOn: "Mon, 04 Jul 2022 11:20:00 GMT",
        category: ["outgoing", "Investments", "Mutual Funds"],
        transactionAmount: 3000,
        transactionType: "outgoing",
        transactionName: "Mutual Fund Investment",
        from: "Bank Account",
        to: "Investment Broker",
        dateTime: "Mon, 04 Jul 2022 11:20:00 GMT",
        transactionId: "49582031"
    }
    // Add the rest up to 100 entries following the structure above
];

exports.dummyData = dummyData
document.addEventListener("DOMContentLoaded", () => {
    const typeSelector = document.getElementById("type");
    const salaryFields = document.getElementById("salary-fields");
    const expenseFields = document.getElementById("expense-fields");
    const form = document.getElementById("transactionForm");

    // Data Storage
    const data = {
        salary: 0,
        expenses: [],
        balance: 0,
    };

    let barChart, pieChart;

    // Toggle conditional fields based on type
    typeSelector.addEventListener("change", () => {
        if (typeSelector.value === "salary") {
            salaryFields.classList.remove("hidden");
            expenseFields.classList.add("hidden");
        } else if (typeSelector.value === "expense") {
            expenseFields.classList.remove("hidden");
            salaryFields.classList.add("hidden");
        }
    });

    // Handle form submission
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const type = typeSelector.value;
        const amount = parseFloat(document.getElementById("amount").value);

        if (!type || isNaN(amount) || amount <= 0) {
            alert("Please select a valid type and enter a positive amount.");
            return;
        }

        if (type === "salary") {
            data.salary += amount;
        } else if (type === "expense") {
            const category = document.getElementById("expense-category").value;
            data.expenses.push({ category, amount });
        }

        // Update balance
        const totalExpenses = data.expenses.reduce((sum, e) => sum + e.amount, 0);
        data.balance = data.salary - totalExpenses;

        updateCharts();
        form.reset();
        salaryFields.classList.add("hidden");
        expenseFields.classList.add("hidden");
        alert("Transaction added successfully!");
    });

    // Update bar and pie charts
    const updateCharts = () => {
        const totalExpenses = data.expenses.reduce((sum, e) => sum + e.amount, 0);

        // Update Bar Chart
        const barChartCtx = document.getElementById("barChart").getContext("2d");
        if (barChart) {
            barChart.data.datasets[0].data = [data.salary, totalExpenses, data.balance];
            barChart.update();
        } else {
            barChart = new Chart(barChartCtx, {
                type: "bar",
                data: {
                    labels: ["Salary", "Expenses", "Balance"],
                    datasets: [
                        {
                            label: "Amount",
                            data: [data.salary, totalExpenses, data.balance],
                            backgroundColor: ["#4CAF50", "#FF5733", "#36A2EB"],
                        },
                    ],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false,
                        },
                    },
                },
            });
        }

        // Update Pie Chart
        const pieChartCtx = document.getElementById("pieChart").getContext("2d");
        if (pieChart) {
            pieChart.data.labels = data.expenses.map((e) => e.category);
            pieChart.data.datasets[0].data = data.expenses.map((e) => e.amount);
            pieChart.update();
        } else {
            pieChart = new Chart(pieChartCtx, {
                type: "pie",
                data: {
                    labels: data.expenses.map((e) => e.category),
                    datasets: [
                        {
                            data: data.expenses.map((e) => e.amount),
                            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#FF5733", "#4CAF50"],
                        },
                    ],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: "bottom",
                        },
                    },
                },
            });
        }
    };
});

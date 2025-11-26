import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get budget for a specific month and year
export const getBudget = async (req, res) => {
    try {
        const { month, year } = req.query;
        const userId = req.user.id;

        if (!month || !year) {
            return res.status(400).json({ status: 'error', message: 'Month and year are required' });
        }

        const budget = await prisma.budget.findFirst({
            where: {
                userId,
                month: parseInt(month),
                year: parseInt(year),
            },
        });

        res.status(200).json({
            status: 'success',
            data: budget || { amount: 0, month: parseInt(month), year: parseInt(year) },
        });
    } catch (error) {
        console.error('Get budget error:', error);
        res.status(500).json({ status: 'error', message: 'Failed to fetch budget', error: error.message });
    }
};

// Set or update budget for a specific month and year
export const setBudget = async (req, res) => {
    try {
        const { amount, month, year } = req.body;
        const userId = req.user.id;

        if (amount === undefined || !month || !year) {
            return res.status(400).json({ status: 'error', message: 'Amount, month, and year are required' });
        }

        // Parse values to ensure correct types
        const parsedMonth = parseInt(month);
        const parsedYear = parseInt(year);
        const parsedAmount = parseFloat(amount); // Ensure amount is a valid number

        if (isNaN(parsedAmount)) {
            return res.status(400).json({ status: 'error', message: 'Invalid amount format' });
        }

        // Check if budget exists
        const existingBudget = await prisma.budget.findFirst({
            where: {
                userId,
                month: parsedMonth,
                year: parsedYear,
            },
        });

        let budget;

        if (existingBudget) {
            // Update existing budget
            budget = await prisma.budget.update({
                where: {
                    id: existingBudget.id,
                },
                data: {
                    amount: parsedAmount,
                },
            });
        } else {
            // Create new budget
            budget = await prisma.budget.create({
                data: {
                    userId,
                    month: parsedMonth,
                    year: parsedYear,
                    amount: parsedAmount,
                },
            });
        }

        res.status(200).json({
            status: 'success',
            data: budget,
        });
    } catch (error) {
        console.error('Set budget error:', error);
        res.status(500).json({ status: 'error', message: 'Failed to set budget', error: error.message });
    }
};

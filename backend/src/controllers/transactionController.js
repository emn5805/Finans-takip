import * as transactionService from '../services/transactionService.js';

export const getTransactions = async (req, res, next) => {
  try {
    const transactions = await transactionService.listTransactions(req.user.id, req.query);
    res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    next(error);
  }
};

export const createTransaction = async (req, res, next) => {
  try {
    const transaction = await transactionService.createTransaction(req.user.id, req.body);
    res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
};

export const deleteTransaction = async (req, res, next) => {
  try {
    await transactionService.removeTransaction(req.user.id, req.params.id);
    res.status(200).json({ success: true, message: 'Transaction deleted' });
  } catch (error) {
    next(error);
  }
};

export const deleteTransactions = async (req, res, next) => {
  try {
    const { ids } = req.body;
    const count = await transactionService.removeTransactions(req.user.id, ids);
    res.status(200).json({ success: true, message: `${count} transactions deleted`, count });
  } catch (error) {
    next(error);
  }
};

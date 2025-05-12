'use client';

import { useCallback, useEffect, useState } from 'react';

type HistoryItem = {
  expression: string;
  result: string;
  timestamp: number;
};

const isOperator = (value: string) => {
  return value === '+' || value === '-' || value === 'x' || value === '/';
};

export const useCalculator = () => {
  const [display, setDisplay] = useState('0');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('calculatorHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Failed to parse history from localStorage', error);
      }
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('calculatorHistory', JSON.stringify(history));
  }, [history]);

  const handleInput = (value: string) => {
    const lastChar = display[display.length - 1];
    if (isOperator(value) && lastChar && isOperator(lastChar)) {
      setDisplay(display.slice(0, -1) + value);
    } else {
      setDisplay((prev) => (prev === '0' ? value : prev + value));
    }
  };

  const clearDisplay = () => {
    setDisplay('0');
  };

  const handleBackspace = () => {
    if (display.length === 1) {
      setDisplay('0');
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const handleCalculate = () => {
    try {
      if (
        display.endsWith('+') ||
        display.endsWith('-') ||
        display.endsWith('x') ||
        display.endsWith('/')
      ) {
        return;
      }
      if (display === 'Error' || display.includes('Error')) return;
      const expression = display;
      const calculationString = expression.replace(/x/g, '*');
      const result = eval(calculationString);

      // Add to history
      const newHistoryItem: HistoryItem = {
        expression: expression,
        result: result.toString(),
        timestamp: Date.now(),
      };

      // Limit history to 20 items
      const updatedHistory = [newHistoryItem, ...history].slice(0, 20);
      setHistory(updatedHistory);

      setDisplay(result.toString());
    } catch (error) {
      console.error('Failed to calculate', error);
      setDisplay('Error');
    }
  };

  const useHistoryItem = useCallback(
    (item: HistoryItem) => {
      setDisplay(item.result);
      setShowHistory(false);
    },
    [setDisplay, setShowHistory],
  );

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('calculatorHistory');
  };

  return {
    display,
    history,
    showHistory,
    setShowHistory,
    handleInput,
    clearDisplay,
    handleCalculate,
    useHistoryItem,
    handleBackspace,
    clearHistory,
  };
};

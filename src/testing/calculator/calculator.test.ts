import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useCalculator } from '@/features/calculator/components/calculator.logic';

beforeEach(() => {
  let store: Record<string, string> = {};
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  });
});

describe('Logic of the calculator', () => {
  it('init display to 0', () => {
    const { result } = renderHook(() => useCalculator());
    expect(result.current.display).toBe('0');
  });

  it('add correctly', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => {
      result.current.handleInput('1');
    });
    act(() => {
      result.current.handleInput('+');
    });
    act(() => {
      result.current.handleInput('2');
    });
    expect(result.current.display).toBe('1+2');
    act(() => {
      result.current.handleCalculate();
    });
    expect(result.current.display).toBe('3');
  });

  it('multiply correctly', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => {
      result.current.handleInput('7');
    });
    act(() => {
      result.current.handleInput('x');
    });
    act(() => {
      result.current.handleInput('8');
    });
    expect(result.current.display).toBe('7x8');
    act(() => {
      result.current.handleCalculate();
    });
    expect(result.current.display).toBe('56');
  });

  it('divide correctly', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => {
      result.current.handleInput('8');
    });
    act(() => {
      result.current.handleInput('/');
    });
    act(() => {
      result.current.handleInput('2');
    });
    expect(result.current.display).toBe('8/2');
    act(() => {
      result.current.handleCalculate();
    });
    expect(result.current.display).toBe('4');
  });

  it('subtract correctly', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => {
      result.current.handleInput('9');
    });
    act(() => {
      result.current.handleInput('-');
    });
    act(() => {
      result.current.handleInput('5');
    });
    expect(result.current.display).toBe('9-5');
    act(() => {
      result.current.handleCalculate();
    });
    expect(result.current.display).toBe('4');
  });

  it('reset with clearDisplay', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => {
      result.current.handleInput('7');
    });
    act(() => {
      result.current.clearDisplay();
    });
    expect(result.current.display).toBe('0');
  });

  it('backspace works', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => {
      result.current.handleInput('1');
    });
    act(() => {
      result.current.handleInput('2');
    });
    act(() => {
      result.current.handleBackspace();
    });
    expect(result.current.display).toBe('1');
  });

  it('display Error if the last character is an operator', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => {
      result.current.handleInput('8');
    });
    act(() => {
      result.current.handleInput('x');
    });
    expect(result.current.display).toBe('8x');
    act(() => {
      result.current.handleCalculate();
    });
    expect(result.current.display).toBe('8x');
  });

  it('do nothing if you press = after an error', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => {
      result.current.handleInput('8');
    });
    act(() => {
      result.current.handleInput('x');
    });
    act(() => {
      result.current.handleCalculate();
    });
    act(() => {
      result.current.handleCalculate();
    });
    expect(result.current.display).toBe('8x');
  });

  it('add to the history after calculation', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => {
      result.current.handleInput('2');
    });
    act(() => {
      result.current.handleInput('+');
    });
    act(() => {
      result.current.handleInput('2');
    });
    act(() => {
      result.current.handleCalculate();
    });
    expect(result.current.history[0].expression).toBe('2+2');
    expect(result.current.history[0].result).toBe('4');
  });

  it('clearHistory empty the history', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => {
      result.current.handleInput('2');
    });
    act(() => {
      result.current.handleInput('+');
    });
    act(() => {
      result.current.handleInput('2');
    });
    act(() => {
      result.current.handleCalculate();
      result.current.clearHistory();
    });
    expect(result.current.history.length).toBe(0);
  });

  it('use an item of the history', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => {
      result.current.handleInput('2');
    });
    act(() => {
      result.current.handleInput('+');
    });
    act(() => {
      result.current.handleInput('2');
    });
    act(() => {
      result.current.handleCalculate();
    });
    act(() => {
      result.current.useHistoryItem(result.current.history[0]);
    });
    expect(result.current.display).toBe('4');
    expect(result.current.showHistory).toBe(false);
  });

  it('save/restore the history via localStorage', () => {
    const fakeHistory = [
      { expression: '1+1', result: '2', timestamp: Date.now() },
    ];
    localStorage.setItem('calculatorHistory', JSON.stringify(fakeHistory));
    const { result } = renderHook(() => useCalculator());
    expect(result.current.history[0].expression).toBe('1+1');
    expect(result.current.history[0].result).toBe('2');
  });

  it('division by zero returns Infinity', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => {
      result.current.handleInput('8');
    });
    act(() => {
      result.current.handleInput('/');
    });
    act(() => {
      result.current.handleInput('0');
    });
    act(() => {
      result.current.handleCalculate();
    });
    expect(result.current.display).toBe('Infinity');
  });

  it('multiple operators in a row are handled', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => {
      result.current.handleInput('1');
    });
    act(() => {
      result.current.handleInput('+');
    });
    act(() => {
      result.current.handleInput('+');
    });
    act(() => {
      result.current.handleInput('2');
    });
    act(() => {
      result.current.handleCalculate();
    });
    expect(result.current.display).toBe('3');
  });

  it('decimal operations', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => {
      result.current.handleInput('1');
    });
    act(() => {
      result.current.handleInput('.');
    });
    act(() => {
      result.current.handleInput('5');
    });
    act(() => {
      result.current.handleInput('+');
    });
    act(() => {
      result.current.handleInput('2');
    });
    act(() => {
      result.current.handleInput('.');
    });
    act(() => {
      result.current.handleInput('3');
    });
    act(() => {
      result.current.handleCalculate();
    });
    expect(result.current.display).toBe('3.8');
  });
});

/*
Tests covered in this file :
- Initial display to 0
- Addition, subtraction, multiplication, division (pure logic)
- Reset the display (clearDisplay)
- Backspace (deletion of a digit)
- Error handling if the last character is an operator
- No recalculation if the display is already in error
- Add an operation to the history after a calculation
- Clear the history (clearHistory)
- Use an item of the history (put the result in the display)
- Persistence of the history via localStorage (save/restore)

This file does not test :
- The visual rendering (DOM, buttons, etc)
- Keyboard/mouse interactions (this is for e2e tests)
- Very advanced cases (parentheses, decimals, etc)
*/

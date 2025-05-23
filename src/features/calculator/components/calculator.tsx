'use client';

import { HistoryIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { useCalculator } from './calculator.logic';

export const Calculator = () => {
  const logic = useCalculator();

  return (
    <Card className='w-full max-w-sm mx-auto bg-gray-100 rounded-3xl shadow-xl relative gap-0'>
      <CardHeader className='pb-0'>
        <div className='flex justify-between items-center'>
          <CardTitle className='text-center flex-grow'>Calculator</CardTitle>
          <Button
            variant='outline'
            size='icon'
            onClick={() => logic.setShowHistory(!logic.showHistory)}
            data-testid='calculator-history-button'
          >
            <HistoryIcon className='h-5 w-5' />
          </Button>
        </div>
      </CardHeader>
      <CardContent className='p-6 flex flex-col h-[400px] pb-0'>
        {logic.showHistory ? (
          <CalculatorHistory logic={logic} />
        ) : (
          <div className='flex flex-col gap-4 grow'>
            <CalculatorDisplay logic={logic} />
            <CalculatorButtons logic={logic} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const CalculatorHistory = ({
  logic,
}: {
  logic: ReturnType<typeof useCalculator>;
}) => {
  return (
    <div className='bg-white rounded-lg p-4 overflow-y-auto h-full'>
      <div className='flex justify-between items-center mb-2'>
        <h3 className='font-medium'>History</h3>
        <Button
          variant='ghost'
          size='sm'
          onClick={logic.clearHistory}
          data-testid='calculator-history-clear-button'
        >
          Clear All
        </Button>
      </div>
      {logic.history.length === 0 ? (
        <p className='text-gray-500 text-center py-4'>No history yet</p>
      ) : (
        <ul className='space-y-2'>
          {logic.history.map((item, index) => (
            <li
              key={index}
              className='p-2 hover:bg-gray-100 rounded cursor-pointer'
              onClick={() => logic.useHistoryItem(item)}
            >
              <div className='text-sm text-gray-600'>{item.expression}</div>
              <div className='text-lg font-medium'>{item.result}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const CalculatorDisplay = ({
  logic,
}: {
  logic: ReturnType<typeof useCalculator>;
}) => {
  return (
    <div className='bg-white p-4 pb-0 rounded-lg shadow-inner flex flex-col h-36 relative'>
      <div className='w-full flex-grow overflow-y-auto scrollbar-hide mb-2'>
        <div className='flex flex-col-reverse'>
          {logic.history.slice(0, 10).map((item, idx) => (
            <div key={idx} className='flex justify-end w-full mb-1'>
              <div className='flex overflow-x-auto scrollbar-hide whitespace-nowrap'>
                <span className='text-xs text-muted-foreground'>
                  {item.expression}
                </span>
                <span className='text-xs font-light mx-1'>=</span>
                <span className='text-xs font-light'>{item.result}</span>
              </div>
            </div>
          ))}
        </div>

        <span
          className='text-right text-3xl font-light overflow-x-auto whitespace-nowrap w-full scrollbar-hide shrink-0 flex items-center justify-end'
          data-testid='calculator-display'
        >
          {logic.display}
        </span>
      </div>
    </div>
  );
};

const CalculatorButtons = ({
  logic,
}: {
  logic: ReturnType<typeof useCalculator>;
}) => {
  return (
    <div className='grid grid-cols-4 gap-2'>
      <Button
        variant='calculator'
        onClick={logic.clearDisplay}
        data-testid='calculator-clear-button'
      >
        C
      </Button>
      <Button
        variant='calculator'
        onClick={logic.handleBackspace}
        className='col-span-2'
        data-testid='calculator-backspace-button'
      >
        ⌫
      </Button>
      <Button
        variant='operation'
        onClick={() => logic.handleInput('/')}
        data-testid='calculator-division-button'
      >
        ÷
      </Button>

      <Button
        variant='outline'
        onClick={() => logic.handleInput('7')}
        data-testid='calculator-7-button'
      >
        7
      </Button>
      <Button
        variant='outline'
        onClick={() => logic.handleInput('8')}
        data-testid='calculator-8-button'
      >
        8
      </Button>
      <Button
        variant='outline'
        onClick={() => logic.handleInput('9')}
        data-testid='calculator-9-button'
      >
        9
      </Button>
      <Button
        variant='operation'
        onClick={() => logic.handleInput('x')}
        data-testid='calculator-multiplication-button'
      >
        x
      </Button>

      <Button
        variant='outline'
        onClick={() => logic.handleInput('4')}
        data-testid='calculator-4-button'
      >
        4
      </Button>
      <Button
        variant='outline'
        onClick={() => logic.handleInput('5')}
        data-testid='calculator-5-button'
      >
        5
      </Button>
      <Button
        variant='outline'
        onClick={() => logic.handleInput('6')}
        data-testid='calculator-6-button'
      >
        6
      </Button>
      <Button
        variant='operation'
        onClick={() => logic.handleInput('-')}
        data-testid='calculator-subtraction-button'
      >
        -
      </Button>

      <Button
        variant='outline'
        onClick={() => logic.handleInput('1')}
        data-testid='calculator-1-button'
      >
        1
      </Button>
      <Button
        variant='outline'
        onClick={() => logic.handleInput('2')}
        data-testid='calculator-2-button'
      >
        2
      </Button>
      <Button
        variant='outline'
        onClick={() => logic.handleInput('3')}
        data-testid='calculator-3-button'
      >
        3
      </Button>
      <Button
        variant='operation'
        onClick={() => logic.handleInput('+')}
        data-testid='calculator-addition-button'
      >
        +
      </Button>

      <Button
        variant='outline'
        onClick={() => logic.handleInput('0')}
        className='col-span-2'
        data-testid='calculator-0-button'
      >
        0
      </Button>
      <Button
        variant='outline'
        onClick={() => logic.handleInput('.')}
        data-testid='calculator-dot-button'
      >
        .
      </Button>
      <Button
        variant='operation'
        onClick={logic.handleCalculate}
        data-testid='calculator-equal-button'
      >
        =
      </Button>
    </div>
  );
};

/**
 * Mock responses for Gemini API endpoints.
 * Used in tests and local development to avoid hitting live API.
 */

export const mockGeneratedPath = {
  courseTitle: 'Introduction to React Hooks',
  modules: [
    {
      title: 'Understanding useState',
      description: 'Learn how to manage component state with the useState hook.',
      content:
        '## useState\n\nThe `useState` hook lets you add state to functional components.\n\n```tsx\nconst [count, setCount] = useState(0);\n```',
      quiz: [
        {
          question: 'What does useState return?',
          options: [
            'A single value',
            'An array with a value and setter function',
            'An object with get and set methods',
            'A Promise',
          ],
          correctAnswer: 'An array with a value and setter function',
        },
        {
          question: 'Where can you call useState?',
          options: [
            'Inside loops',
            'Inside conditions',
            'At the top level of a component',
            'Inside nested functions',
          ],
          correctAnswer: 'At the top level of a component',
        },
      ],
    },
    {
      title: 'Working with useEffect',
      description: 'Manage side effects in your React components.',
      content:
        '## useEffect\n\nThe `useEffect` hook lets you perform side effects in function components.\n\n```tsx\nuseEffect(() => {\n  document.title = `Count: ${count}`;\n}, [count]);\n```',
      quiz: [
        {
          question: 'When does useEffect run by default?',
          options: [
            'Only on mount',
            'After every render',
            'Only on unmount',
            'Before render',
          ],
          correctAnswer: 'After every render',
        },
      ],
    },
  ],
};

export const mockScenarioCheck = {
  success: true,
  feedback:
    'Great job! Your solution correctly identifies the root cause of the memory leak by cleaning up the event listener in the useEffect return function.',
};

export const mockScenarioCheckFail = {
  success: false,
  feedback:
    'Not quite. While your approach would prevent the error, it does not address the underlying memory leak. Consider returning a cleanup function from useEffect.',
};

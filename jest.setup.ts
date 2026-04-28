process.env.EXPO_PUBLIC_API_BASE_URL = 'http://localhost:3002';

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');

  return {
    MaterialIcons: ({ name }: { name: string }) => React.createElement(Text, null, name),
  };
});

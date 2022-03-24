import preventAttacks from './prevent-attacks';

describe('preventAttacks', () => {
  test('preventAttacks', async () => {
    const value = 'create a a a ';
    const trigger = preventAttacks(String(value));
    expect(trigger).toEqual(true);
  });
});

import preventAttacks from './prevent-attacks';

describe('preventAttacks', () => {
  test('preventAttacks', async () => {
    const value = 'create a new tag';
    const trigger = preventAttacks(String(value));
    expect(trigger).toEqual(true);
  });
});

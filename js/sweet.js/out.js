class IdMonad {
  constructor(value_5) {
    this.value = value_5;
  }
  chain(f_6) {
    return f_6(this.value);
  }
}
function Id(value_7) {
  return new IdMonad(value_7);
}
let result_4 = Id(1).chain(v_8 => Id(v_8 + 1).chain(v_9 => Id(v_9 * 10)));

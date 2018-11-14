const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const rms = RMS.calc_rms(numbers);
const el = document.getElementById('value');
RMS.display_value(el, rms);
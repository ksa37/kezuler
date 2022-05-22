const TimeOptions: string[] = [];

for (let i = 0; i < 24; i++) {
  TimeOptions.push((i + ':00').padStart(5, '0'));
  TimeOptions.push((i + ':30').padStart(5, '0'));
}

export default TimeOptions;

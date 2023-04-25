function mean(data) {
    const sum = data.reduce((a, b) => a + b, 0);
    return sum / data.length;
  }
  function median(data) {
    const sortedData = [...data].sort((a, b) => a - b);
    const mid = Math.floor(sortedData.length / 2);
    return sortedData.length % 2 === 0 ? (sortedData[mid] + sortedData[mid - 1]) / 2 : sortedData[mid];
  }
  function mode(data) {
    const frequencies = {};
    data.forEach(value => {
      if (typeof value === 'number') {
        frequencies[value] = (frequencies[value] || 0) + 1;
      }
    });
    const maxFreq = Math.max(...Object.values(frequencies));
    return Object.keys(frequencies).filter(value => frequencies[value] === maxFreq).map(parseFloat);
  }
  function range(data) {
    return Math.max(...data) - Math.min(...data);
  }
  function standardDeviation(data) {
    const avg = mean(data);
    const variance = mean(data.map(value => (value - avg) ** 2));
    return Math.sqrt(variance);
  }
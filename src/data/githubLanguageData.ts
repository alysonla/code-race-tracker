
export const githubLanguageData = [
  {
    name: 'Python',
    color: '#3EAFA8',
    values: [4, 3, 3, 3, 3, 2, 2, 2, 2, 2, 1]
  },
  {
    name: 'JavaScript',
    color: '#DD78E8',
    values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2]
  },
  {
    name: 'TypeScript',
    color: '#E882B5',
    values: [null, null, null, null, null, 4, 4, 4, 4, 3, 3]
  },
  {
    name: 'Java',
    color: '#6F8FF7',
    values: [2, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4]
  },
  {
    name: 'C#',
    color: '#B896EF',
    values: [8, 7, 6, 6, 7, 7, 5, 5, 5, 5, 5]
  },
  {
    name: 'C++',
    color: '#F68570',
    values: [6, 6, 5, 5, 5, 6, 7, 7, 6, 6, 6]
  },
  {
    name: 'PHP',
    color: '#5DAAF8',
    values: [3, 4, 4, 4, 4, 5, 6, 6, 7, 7, 7]
  },
  {
    name: 'Shell',
    color: '#7CA2F7',
    values: [9, 9, 9, 9, 9, 9, 9, 8, 8, 9, 8]
  },
  {
    name: 'C',
    color: '#E88DCA',
    values: [7, 8, 8, 7, 8, 8, 8, 9, 9, 8, 9]
  },
  {
    name: 'Go',
    color: '#F58560',
    values: [null, null, null, null, null, null, null, null, 10, 10, 10]
  },
  {
    name: 'Ruby',
    color: '#D4A675',
    values: [5, 5, 7, 10, 10, 10, 10, 10, null, null, null]
  },
  {
    name: 'Obj-C',
    color: '#90D698',
    values: [10, 10, 10, null, null, null, null, null, null, null, null]
  }
];

// Years for x-axis
export const yearLabels = ['2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'];

// Data structure suitable for race animation
export const getRaceData = (year: number) => {
  const yearIndex = Math.min(year, yearLabels.length - 1);
  
  // Get data up to the specified year
  return githubLanguageData.map(language => {
    return {
      name: language.name,
      color: language.color,
      data: language.values.slice(0, yearIndex + 1),
      // Current rank for sorting
      currentRank: language.values[yearIndex]
    };
  }).sort((a, b) => a.currentRank - b.currentRank);
};

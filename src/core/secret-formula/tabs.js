export const tabs = [
  {
    key: "statistics",
    name: "数据",
    id: 0,
    hidable: false,
    hideAt: 1e100,
    subtabs: [
      {
        key: "statistics",
        name: "数据",
        symbol: "<i class='fas fa-clipboard-list'></i>",
        component: "StatisticsTab",
        id: 0,
        hidable: false,
      }
    ]
  }
];

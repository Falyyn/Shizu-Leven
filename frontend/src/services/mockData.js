export const mockInventory = [
  { id: 'MCU-0921', name: 'ESP32-WROOM-32U', category: 'Microcontrollers', location: 'Drawer A-1', condition: 'Good', quantity: 142, price: 5.25 },
  { id: 'PWR-1104', name: 'Li-Po 3.7V 2000mAh', category: 'Batteries', location: 'Box 03', condition: 'Low Stock', quantity: 12, price: 8.50 },
  { id: 'SNR-8820', name: 'DHT22 Temp & Humid', category: 'Sensors', location: 'Drawer B-2', condition: 'Broken', quantity: 0, price: 4.10 },
  { id: 'MCU-0922', name: 'Raspberry Pi Pico W', category: 'Microcontrollers', location: 'Drawer A-2', condition: 'Good', quantity: 45, price: 6.00 },
  { id: 'SNR-8821', name: 'Ultrasonic Sensor HC-SR04', category: 'Sensors', location: 'Box 03', condition: 'Low Stock', quantity: 328, price: 2.10 },
];

export const mockDashboardStats = {
  totalComponents: 1226,
  totalComponentsGrowth: '+7.9%',
  totalAssetsValue: 12000,
  activeLoans: 15210,
  conditionStats: { good: 75, repair: 15, broken: 10 },
  recentActivity: [
    { id: '#513 003', user: 'Alia Bonner', action: 'UPDATED SENSOR', type: 'update' },
    { id: '#152 004', user: 'Kobi Potts', action: 'REPORTED BROKEN', type: 'report' },
    { id: '#486 005', user: 'Austin Camacho', action: 'ADDED MODULE', type: 'add' },
  ]
};

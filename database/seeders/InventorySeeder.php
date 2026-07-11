<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Location;
use App\Models\InventoryItem;

class InventorySeeder extends Seeder
{
    public function run(): void
    {
        $cats = ['Microcontrollers', 'Sensors', 'Batteries', 'Actuators'];
        $categories = [];
        foreach ($cats as $cat) {
            $categories[$cat] = Category::create(['name' => $cat])->id;
        }

        $locs = ['Drawer A-1', 'Drawer A-2', 'Box 03', 'Drawer B-2'];
        $locations = [];
        foreach ($locs as $loc) {
            $locations[$loc] = Location::create(['name' => $loc])->id;
        }

        $items = [
            ['component_id' => 'MCU-0921', 'name' => 'ESP32-WROOM-32U', 'category_id' => $categories['Microcontrollers'], 'location_id' => $locations['Drawer A-1'], 'condition' => 'Good', 'quantity' => 142, 'price' => 5.25],
            ['component_id' => 'PWR-1104', 'name' => 'Li-Po 3.7V 2000mAh', 'category_id' => $categories['Batteries'], 'location_id' => $locations['Box 03'], 'condition' => 'Low Stock', 'quantity' => 12, 'price' => 8.50],
            ['component_id' => 'SNR-8820', 'name' => 'DHT22 Temp & Humid', 'category_id' => $categories['Sensors'], 'location_id' => $locations['Drawer B-2'], 'condition' => 'Broken', 'quantity' => 0, 'price' => 4.10],
            ['component_id' => 'MCU-0922', 'name' => 'Raspberry Pi Pico W', 'category_id' => $categories['Microcontrollers'], 'location_id' => $locations['Drawer A-2'], 'condition' => 'Good', 'quantity' => 45, 'price' => 6.00],
            ['component_id' => 'SNR-8821', 'name' => 'Ultrasonic Sensor HC-SR04', 'category_id' => $categories['Sensors'], 'location_id' => $locations['Box 03'], 'condition' => 'Low Stock', 'quantity' => 328, 'price' => 2.10],
        ];

        foreach ($items as $item) {
            InventoryItem::create($item);
        }
    }
}

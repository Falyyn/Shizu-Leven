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
        $csvFile = base_path('Database_Final_Elektronik_IoT - Inventaris.csv');
        if (!file_exists($csvFile)) {
            $this->command->error("CSV file not found: $csvFile");
            return;
        }

        $file = fopen($csvFile, 'r');
        $header = fgetcsv($file); // Read the header row

        while (($row = fgetcsv($file)) !== false) {
            // ID_Barang,Nama_Spesifikasi,Kategori,Jumlah,Satuan,Kondisi,Lokasi,Terakhir_Update,Catatan
            if (count($row) < 7) continue;

            $componentId = $row[0];
            $name = $row[1];
            $categoryName = trim($row[2]);
            $quantity = (int)$row[3];
            $condition = trim($row[5]);
            $locationName = trim($row[6]);

            // Create or get Category
            $category = Category::firstOrCreate(['name' => $categoryName]);

            // Create or get Location
            $location = Location::firstOrCreate(['name' => $locationName]);

            // Create or get Inventory Item
            InventoryItem::updateOrCreate(
                ['component_id' => $componentId],
                [
                    'name' => $name,
                    'category_id' => $category->id,
                    'location_id' => $location->id,
                    'quantity' => $quantity,
                    'condition' => $condition,
                    'price' => 0, // Not available in CSV
                ]
            );
        }

        fclose($file);
    }
}

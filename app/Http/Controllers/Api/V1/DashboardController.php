<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\InventoryItem;
use App\Services\GoogleSheetsService;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    protected $sheetsService;

    public function __construct(GoogleSheetsService $sheetsService)
    {
        $this->sheetsService = $sheetsService;
    }

    public function index()
    {
        $response = $this->sheetsService->syncAction('read');
        $items = collect([]);

        if ($response && isset($response['status']) && $response['status'] === 'success') {
            $items = collect($response['data']);
        } else {
            // fallback
            $items = InventoryItem::all();
            return response()->json([
                'totalComponents' => $items->sum('quantity'),
                'conditionStats' => [
                    'good' => $items->where('condition', 'Good')->sum('quantity'),
                    'repair' => $items->whereIn('condition', ['Repair', 'Low Stock'])->sum('quantity'),
                    'broken' => $items->where('condition', 'Broken')->sum('quantity'),
                ],
                'recentActivity' => []
            ]);
        }

        $totalComponents = $items->sum(function($item) {
            return (int)($item['Jumlah'] ?? 0);
        });

        $conditionStats = [
            'good' => $items->filter(function($item) {
                return in_array(strtolower($item['Kondisi'] ?? ''), ['good', 'normal']);
            })->sum(function($item) { return (int)($item['Jumlah'] ?? 0); }),
            'repair' => $items->filter(function($item) {
                return in_array(strtolower($item['Kondisi'] ?? ''), ['repair', 'low stock', 'rusak/normal']);
            })->sum(function($item) { return (int)($item['Jumlah'] ?? 0); }),
            'broken' => $items->filter(function($item) {
                return in_array(strtolower($item['Kondisi'] ?? ''), ['broken', 'rusak']);
            })->sum(function($item) { return (int)($item['Jumlah'] ?? 0); }),
        ];

        $categoryStatsMap = [];
        foreach ($items as $item) {
            $cat = $item['Kategori'] ?? 'Uncategorized';
            if (!isset($categoryStatsMap[$cat])) {
                $categoryStatsMap[$cat] = 0;
            }
            $categoryStatsMap[$cat] += (int)($item['Jumlah'] ?? 0);
        }
        $categoryData = [];
        foreach ($categoryStatsMap as $name => $val) {
            $categoryData[] = ['name' => $name, 'val' => $val];
        }

        $recentItems = $items->reverse()->take(5)->map(function($item) {
            return [
                'id' => $item['ID_Barang'] ?? '',
                'name' => $item['Nama_Spesifikasi'] ?? '',
                'quantity' => (int)($item['Jumlah'] ?? 0),
                'location' => $item['Lokasi'] ?? '',
                'condition' => $item['Kondisi'] ?? '',
            ];
        })->values();

        return response()->json([
            'totalComponents' => $totalComponents,
            'conditionStats' => $conditionStats,
            'categoryStats' => $categoryData,
            'recentActivity' => [],
            'recentItems' => $recentItems
        ]);
    }
}

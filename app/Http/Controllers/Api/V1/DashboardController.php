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
        $items = InventoryItem::with(['category', 'location'])->get();

        $totalComponents = $items->sum('quantity');

        $conditionStats = [
            'good' => $items->filter(function($item) {
                return in_array(strtolower($item->condition ?? ''), ['good', 'normal', 'baik']);
            })->sum('quantity'),
            'repair' => $items->filter(function($item) {
                return in_array(strtolower($item->condition ?? ''), ['repair', 'low stock', 'perbaikan', 'rusak/normal']);
            })->sum('quantity'),
            'broken' => $items->filter(function($item) {
                return in_array(strtolower($item->condition ?? ''), ['broken', 'rusak', 'kembung / rusak']);
            })->sum('quantity'),
        ];

        $categoryStatsMap = [];
        foreach ($items as $item) {
            $cat = $item->category ? $item->category->name : 'Uncategorized';
            if (!isset($categoryStatsMap[$cat])) {
                $categoryStatsMap[$cat] = 0;
            }
            $categoryStatsMap[$cat] += (int)($item->quantity ?? 0);
        }
        
        $categoryData = [];
        foreach ($categoryStatsMap as $name => $val) {
            $categoryData[] = ['name' => $name, 'val' => $val];
        }

        $recentItems = $items->reverse()->take(5)->map(function($item) {
            return [
                'id' => $item->component_id ?? '',
                'name' => $item->name ?? '',
                'quantity' => (int)($item->quantity ?? 0),
                'location' => $item->location ? $item->location->name : '',
                'condition' => $item->condition ?? '',
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

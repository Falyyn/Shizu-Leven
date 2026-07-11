<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\InventoryItem;
use App\Services\GoogleSheetsService;
use Illuminate\Http\Request;

class InventoryController extends Controller
{
    protected $sheetsService;

    public function __construct(GoogleSheetsService $sheetsService)
    {
        $this->sheetsService = $sheetsService;
    }

    public function index()
    {
        // Ambil data langsung dari Google Sheets (sebagai Master DB)
        $response = $this->sheetsService->syncAction('read');
        
        if ($response && isset($response['status']) && $response['status'] === 'success') {
            $categories = \App\Models\Category::pluck('id', 'name')->toArray();
            $locations = \App\Models\Location::pluck('id', 'name')->toArray();

            $items = collect($response['data'])->map(function($item, $index) use ($categories, $locations) {
                return [
                    'id' => $item['ID_Barang'] ?? ($index + 1), // Frontend uses this to call PUT/DELETE
                    'component_id' => $item['ID_Barang'] ?? '',
                    'name' => $item['Nama_Spesifikasi'] ?? '',
                    'category' => $item['Kategori'] ?? '',
                    'category_id' => $categories[$item['Kategori'] ?? ''] ?? null,
                    'location' => $item['Lokasi'] ?? '',
                    'location_id' => $locations[$item['Lokasi'] ?? ''] ?? null,
                    'condition' => $item['Kondisi'] ?? '',
                    'quantity' => (int)($item['Jumlah'] ?? 0),
                    'price' => 0
                ];
            });
            return response()->json($items);
        }

        // Fallback jika Google Sheets gagal (meskipun ini tidak diharapkan)
        $items = InventoryItem::with(['category', 'location'])->get()->map(function($item) {
            return [
                'id' => $item->component_id,
                'component_id' => $item->component_id,
                'name' => $item->name,
                'category' => $item->category->name,
                'category_id' => $item->category_id,
                'location' => $item->location->name,
                'location_id' => $item->location_id,
                'condition' => $item->condition,
                'quantity' => $item->quantity,
                'price' => (float)$item->price
            ];
        });
        
        return response()->json($items);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'location_id' => 'required|exists:locations,id',
            'condition' => 'required|string',
            'quantity' => 'required|integer|min:0'
        ]);

        $validated['price'] = 0; // default since we removed it

        // Auto-generate component_id based on highest existing
        $response = $this->sheetsService->syncAction('read');
        $maxNum = 0;
        if ($response && isset($response['status']) && $response['status'] === 'success') {
            foreach ($response['data'] as $row) {
                if (isset($row['ID_Barang']) && preg_match('/COMP-(\d+)/', $row['ID_Barang'], $matches)) {
                    $num = (int)$matches[1];
                    if ($num > $maxNum) {
                        $maxNum = $num;
                    }
                }
            }
        }
        $validated['component_id'] = 'COMP-' . str_pad($maxNum + 1, 3, '0', STR_PAD_LEFT);

        $item = InventoryItem::create($validated);
        $item->load(['category', 'location']);

        // Sync ke Google Sheets
        $this->sheetsService->syncAction('create', [
            'ID_Barang' => $item->component_id,
            'Nama_Spesifikasi' => $item->name,
            'Kategori' => $item->category->name,
            'Jumlah' => $item->quantity,
            'Satuan' => 'pcs',
            'Kondisi' => $item->condition,
            'Lokasi' => $item->location->name,
            'Terakhir_Update' => now()->format('Y-m-d'),
            'Catatan' => '-'
        ]);

        $itemData = $item->toArray();
        $itemData['id'] = $item->component_id;
        return response()->json($itemData, 201);
    }

    public function update(Request $request, $id)
    {
        // $id is the component_id from the frontend
        $validated = $request->validate([
            'name' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'location_id' => 'required|exists:locations,id',
            'condition' => 'required|string',
            'quantity' => 'required|integer|min:0'
        ]);
        $validated['price'] = 0;

        $category = \App\Models\Category::find($validated['category_id']);
        $location = \App\Models\Location::find($validated['location_id']);

        // Sync Update ke Master Data (Google Sheets)
        $this->sheetsService->syncAction('update', [
            'ID_Barang' => $id,
            'Nama_Spesifikasi' => $validated['name'],
            'Kategori' => $category->name,
            'Jumlah' => $validated['quantity'],
            'Satuan' => 'pcs',
            'Kondisi' => $validated['condition'],
            'Lokasi' => $location->name,
            'Terakhir_Update' => now()->format('Y-m-d'),
            'Catatan' => '-'
        ]);

        // Sync to SQLite as cache/fallback — always set component_id = $id
        $validated['component_id'] = $id;

        $item = InventoryItem::where('component_id', $id)->first();
        if ($item) {
            $item->update($validated);
        } else {
            // Item only existed in Google Sheets — create a local cache copy
            $item = InventoryItem::create($validated);
        }
        $item->load(['category', 'location']);
        $itemData = $item->toArray();
        $itemData['id'] = $item->component_id;
        return response()->json($itemData);
    }

    public function destroy($id)
    {
        // $id is the component_id from the frontend
        $this->sheetsService->syncAction('delete', [
            'ID_Barang' => $id
        ]);

        $item = InventoryItem::where('component_id', $id)->first();
        if ($item) {
            $item->delete();
        }
        
        return response()->json(['message' => 'Deleted successfully']);
    }
}

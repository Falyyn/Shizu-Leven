<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Services\GoogleSheetsService;

class AIChatController extends Controller
{
    protected $sheetsService;

    public function __construct(GoogleSheetsService $sheetsService)
    {
        $this->sheetsService = $sheetsService;
    }

    public function chat(Request $request)
    {
        $request->validate([
            'prompt' => 'required|string'
        ]);

        $userPrompt = $request->input('prompt');
        $apiKey = env('GEMINI_API_KEY');

        if (!$apiKey) {
            return response()->json(['message' => 'Gemini API key is not configured.'], 500);
        }

        // Ambil data inventory dari MySQL
        $items = \App\Models\InventoryItem::with(['category', 'location'])->get()->map(function($item) {
            return [
                'ID_Barang' => $item->component_id,
                'Nama' => $item->name,
                'Kategori' => $item->category ? $item->category->name : '-',
                'Lokasi' => $item->location ? $item->location->name : '-',
                'Jumlah' => $item->quantity,
                'Kondisi' => $item->condition
            ];
        });

        $inventoryContext = $items->isEmpty() ? '(Data kosong)' : json_encode($items->toArray());

        $systemInstruction = "Kamu adalah asisten teknis Shizu Leven. Ini database komponen elektronik/IoT pengguna:\n\n{$inventoryContext}\n\nJawab pertanyaan berikut HANYA berdasarkan stok yang ada, sebutkan lokasinya jika relevan, dan bantu dia merencanakan proyek dengan komponen tersebut. Jawab dengan ramah dan informatif menggunakan bahasa Indonesia.";

        $payload = [
            'systemInstruction' => [
                'parts' => [
                    ['text' => $systemInstruction]
                ]
            ],
            'contents' => [
                [
                    'role' => 'user',
                    'parts' => [
                        ['text' => $userPrompt]
                    ]
                ]
            ],
            'generationConfig' => [
                'temperature' => 0.5,
                'maxOutputTokens' => 2048,
            ]
        ];

        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json'
            ])->timeout(60)->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key={$apiKey}", $payload);

            if ($response->successful()) {
                $data = $response->json();
                $reply = $data['candidates'][0]['content']['parts'][0]['text'] ?? 'Maaf, saya tidak bisa menghasilkan jawaban saat ini.';
                
                return response()->json([
                    'reply' => $reply
                ]);
            }

            Log::error("Gemini API Error", ['status' => $response->status(), 'body' => $response->body()]);
            return response()->json([
                'message' => 'Gagal menghubungi Gemini API.',
                'error' => $response->body()
            ], 500);

        } catch (\Exception $e) {
            Log::error("AI Chat Exception", ['error' => $e->getMessage()]);
            return response()->json([
                'message' => 'Terjadi kesalahan sistem.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

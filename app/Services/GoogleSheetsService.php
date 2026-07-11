<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GoogleSheetsService
{
    protected $url;
    protected $token;

    public function __construct()
    {
        $this->url = env('GOOGLE_SCRIPT_URL');
        $this->token = env('GOOGLE_SCRIPT_TOKEN');
    }

    public function syncAction($action, $data = [])
    {
        if (!$this->url || !$this->token) {
            return false;
        }

        try {
            $payload = array_merge([
                'token' => $this->token,
                'action' => $action
            ], $data);

            // Kita gunakan POST agar data aman dan mendukung payload besar
            $response = Http::asForm()->post($this->url, $payload);
            
            if (!$response->successful()) {
                Log::error("Google Sheets Sync Failed", ['response' => $response->body()]);
                return false;
            }

            return $response->json();
        } catch (\Exception $e) {
            Log::error("Google Sheets Sync Exception", ['error' => $e->getMessage()]);
            return false;
        }
    }
}
